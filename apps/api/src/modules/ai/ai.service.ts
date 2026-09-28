// AI Service - MAHA-MITRA Regulatory Chatbot (RAG + LLM hybrid)
import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import axios from 'axios';

@Injectable()
export class AIService {
  private readonly logger = new Logger(AIService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * MAHA-MITRA Chat - Hybrid: Knowledge Base first, LLM fallback
   */
  async chat(query: string, userId?: string, applicationId?: string, language: string = 'auto'): Promise<{
    answer: string;
    sources: any[];
    confidence: number;
    isRAGAnswer: boolean;
    language: string;
  }> {
    const detectedLang = language === 'auto' ? this.detectLanguage(query) : language;

    // Step 1: Search knowledge chunks (RAG)
    const relevantChunks = await this.searchKnowledgeBase(query, detectedLang);

    // Step 2: Try LLM if API key available
    const geminiKey = process.env.GEMINI_API_KEY;
    const groqKey = process.env.GROQ_API_KEY;

    let answer: string;
    let isRAGAnswer = false;

    if (relevantChunks.length > 0) {
      const context = relevantChunks.map(c => c.content).join('\n\n---\n\n');
      
      if (geminiKey) {
        answer = await this.callGemini(query, context, detectedLang, geminiKey);
      } else if (groqKey) {
        answer = await this.callGroq(query, context, detectedLang, groqKey);
      } else {
        // RAG-only fallback: use best matching chunk
        answer = this.generateRAGOnlyAnswer(query, relevantChunks, detectedLang);
        isRAGAnswer = true;
      }
    } else {
      if (geminiKey) {
        answer = await this.callGemini(query, '', detectedLang, geminiKey);
      } else {
        answer = this.getFallbackAnswer(detectedLang);
        isRAGAnswer = true;
      }
    }

    const sources = relevantChunks.slice(0, 3).map(c => ({
      title: c.title,
      source: c.source,
      category: c.category,
    }));

    return {
      answer,
      sources,
      confidence: relevantChunks.length > 0 ? 85 : 60,
      isRAGAnswer,
      language: detectedLang,
    };
  }

  private async searchKnowledgeBase(query: string, language: string): Promise<any[]> {
    const queryLower = query.toLowerCase();
    
    // Keyword-based search for demo (production: vector embeddings)
    const keywords = queryLower.split(/\s+/).filter(w => w.length > 3);
    
    // Try exact language match first, then fall back to English
    const chunks = await this.prisma.knowledgeChunk.findMany({
      where: {
        isActive: true,
        OR: [
          { language: language },
          { language: 'en' },
        ],
      },
      orderBy: { createdAt: 'asc' },
    });

    // Score chunks by keyword relevance
    const scored = chunks.map(chunk => {
      const contentLower = (chunk.content + ' ' + (chunk.title || '')).toLowerCase();
      let score = 0;
      for (const kw of keywords) {
        const matches = (contentLower.match(new RegExp(kw, 'g')) || []).length;
        score += matches;
      }
      return { ...chunk, score };
    });

    // Return top 5 relevant chunks
    return scored
      .filter(c => c.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
  }

  private async callGemini(query: string, context: string, language: string, apiKey: string): Promise<string> {
    try {
      const systemPrompt = `You are MAHA-MITRA, an AI regulatory assistant for Maharashtra industrial clearances. 
You help entrepreneurs understand government approvals, compliance requirements, and schemes.
Answer in ${language === 'hi' ? 'Hindi (Devanagari script)' : 'English'}.
${context ? 'Use the following context from Maharashtra regulatory guidelines:' : ''}
${context}

Rules:
- Be accurate and cite regulations when possible
- Mention source acts/rules
- Don't hallucinate - if unsure, say so
- Keep answers concise but complete`;

      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          contents: [
            { role: 'user', parts: [{ text: `${systemPrompt}\n\nQuestion: ${query}` }] },
          ],
          generationConfig: { maxOutputTokens: 1024, temperature: 0.3 },
        },
        { timeout: 15000 }
      );

      return response.data.candidates?.[0]?.content?.parts?.[0]?.text || this.getFallbackAnswer(language);
    } catch (err) {
      this.logger.warn(`Gemini API error: ${err.message}. Falling back to RAG.`);
      return '';
    }
  }

  private async callGroq(query: string, context: string, language: string, apiKey: string): Promise<string> {
    try {
      const response = await axios.post(
        'https://api.groq.com/openai/v1/chat/completions',
        {
          model: 'llama3-70b-8192',
          messages: [
            {
              role: 'system',
              content: `You are MAHA-MITRA, an AI regulatory assistant for Maharashtra industrial clearances. Answer in ${language === 'hi' ? 'Hindi' : 'English'}. Context: ${context}`,
            },
            { role: 'user', content: query },
          ],
          max_tokens: 800,
          temperature: 0.3,
        },
        {
          headers: { Authorization: `Bearer ${apiKey}` },
          timeout: 15000,
        }
      );

      return response.data.choices?.[0]?.message?.content || this.getFallbackAnswer(language);
    } catch (err) {
      this.logger.warn(`Groq API error: ${err.message}`);
      return '';
    }
  }

  private generateRAGOnlyAnswer(query: string, chunks: any[], language: string): string {
    if (chunks.length === 0) return this.getFallbackAnswer(language);
    
    const best = chunks[0];
    
    if (language === 'hi') {
      return `📋 **${best.title || 'जानकारी'}**\n\n${best.content.slice(0, 800)}\n\n*स्रोत: ${best.source || 'UDYOG MARG ज्ञान आधार'}*`;
    }
    
    return `📋 **${best.title || 'Information'}**\n\n${best.content.slice(0, 800)}\n\n*Source: ${best.source || 'UDYOG MARG Knowledge Base'}*`;
  }

  private getFallbackAnswer(language: string): string {
    if (language === 'hi') {
      return 'मुझे खेद है, मैं अभी इस प्रश्न का उत्तर देने में असमर्थ हूं। कृपया अपने प्रश्न को पुनः प्रयास करें या सीधे संबंधित विभाग से संपर्क करें।';
    }
    return 'I apologize, I cannot answer this question right now. Please try rephrasing or contact the relevant department directly. For urgent queries, raise a grievance through the platform.';
  }

  private detectLanguage(text: string): string {
    // Simple detection: if contains Devanagari, it's Hindi
    const devanagariPattern = /[\u0900-\u097F]/;
    if (devanagariPattern.test(text)) return 'hi';
    
    // Check for common Hindi/Marathi romanized words
    const hindiWords = ['kya', 'hai', 'mein', 'aur', 'ke', 'liye', 'kaise', 'kaun', 'kab'];
    const lowerText = text.toLowerCase();
    const hindiWordCount = hindiWords.filter(w => lowerText.includes(w)).length;
    if (hindiWordCount >= 2) return 'hi';
    
    return 'en';
  }

  async ingestKnowledge(data: { title: string; content: string; source: string; category: string; language?: string }) {
    return this.prisma.knowledgeChunk.create({
      data: {
        title: data.title,
        content: data.content,
        source: data.source,
        category: data.category,
        language: data.language || 'en',
        isActive: true,
      },
    });
  }

  async getHealth() {
    const chunkCount = await this.prisma.knowledgeChunk.count({ where: { isActive: true } });
    return {
      status: 'operational',
      knowledgeChunks: chunkCount,
      geminiAvailable: !!process.env.GEMINI_API_KEY,
      groqAvailable: !!process.env.GROQ_API_KEY,
      mode: process.env.GEMINI_API_KEY ? 'LLM+RAG' : 'RAG_ONLY',
    };
  }
}
