'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import AIChatWidget from '@/components/AIChatWidget';
import {
  BookOpen,
  UploadCloud,
  FileText,
  Search,
  CheckCircle2,
  Cpu,
  Database,
  ExternalLink,
  RefreshCw,
  Layers,
  Sparkles
} from 'lucide-react';

export default function AdminKnowledgePage() {
  const [isIngesting, setIsIngesting] = useState(false);
  const [ingestSuccess, setIngestSuccess] = useState(false);

  const [documents, setDocuments] = useState([
    {
      id: 'DOC-RTS-2015',
      title: 'Maharashtra Right to Public Services Act, 2015 (Act No. XXXI of 2015)',
      category: 'Statutory Act',
      department: 'General Administration Dept (GAD)',
      chunksCount: 184,
      vectorCount: 184,
      embeddingModel: 'text-embedding-3-small (1536-dim)',
      lastIndexed: '2 hours ago',
      status: 'INDEXED'
    },
    {
      id: 'DOC-WATER-1974',
      title: 'Water (Prevention and Control of Pollution) Act, 1974 & MPCB Consent Guidelines',
      category: 'Environmental Statute',
      department: 'MPCB / Environment Dept',
      chunksCount: 420,
      vectorCount: 420,
      embeddingModel: 'text-embedding-3-small (1536-dim)',
      lastIndexed: '1 day ago',
      status: 'INDEXED'
    },
    {
      id: 'DOC-FACTORIES-1948',
      title: 'The Factories Act, 1948 & Maharashtra Factories Rules, 1963',
      category: 'Industrial Safety',
      department: 'DISH Maharashtra',
      chunksCount: 650,
      vectorCount: 650,
      embeddingModel: 'text-embedding-3-small (1536-dim)',
      lastIndexed: '3 days ago',
      status: 'INDEXED'
    },
    {
      id: 'DOC-FIRE-2006',
      title: 'Maharashtra Fire Prevention & Life Safety Measures Act, 2006',
      category: 'Life Safety Regulation',
      department: 'Maharashtra Fire Services',
      chunksCount: 310,
      vectorCount: 310,
      embeddingModel: 'text-embedding-3-small (1536-dim)',
      lastIndexed: '5 days ago',
      status: 'INDEXED'
    },
    {
      id: 'DOC-PSI-2019-GR',
      title: 'Government Resolution No. PSI-2019/CR-46/IND-8: Package Scheme of Incentives',
      category: 'Government Resolution (GR)',
      department: 'Industries Department',
      chunksCount: 220,
      vectorCount: 220,
      embeddingModel: 'text-embedding-3-small (1536-dim)',
      lastIndexed: '1 week ago',
      status: 'INDEXED'
    }
  ]);

  const handleSimulateIngestion = () => {
    setIsIngesting(true);
    setTimeout(() => {
      setIsIngesting(false);
      setIngestSuccess(true);
      setTimeout(() => setIngestSuccess(false), 4000);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-orange-500/10 border border-orange-500/30 rounded-xl text-orange-400">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                  MAHA-MITRA Statutory Knowledge Base
                  <span className="px-2 py-0.5 text-xs font-semibold bg-orange-500/20 text-orange-400 border border-orange-500/30 rounded-full flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    RAG Vector Engine
                  </span>
                </h1>
                <p className="text-sm text-slate-400">
                  Grounding corpus for AI Copilot: Upload Acts, Rules, Government Resolutions (GRs), and Circulars
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSimulateIngestion}
              disabled={isIngesting}
              className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white rounded-lg text-sm font-semibold transition shadow-sm shadow-orange-500/20"
            >
              {isIngesting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Chunking & Vectorizing...
                </>
              ) : (
                <>
                  <UploadCloud className="w-4 h-4" />
                  Ingest New Act / GR PDF
                </>
              )}
            </button>
          </div>
        </div>

        {ingestSuccess && (
          <div className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            PDF parsed into 142 semantic chunks, vectorized via text-embedding-3-small and committed to ChromaDB vector store.
          </div>
        )}

        {/* Vector DB Telemetry */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Total Indexed Documents</span>
              <FileText className="w-4 h-4 text-orange-400" />
            </div>
            <div className="text-2xl font-bold text-white font-mono mt-1">28 Acts & GRs</div>
            <span className="text-[11px] text-slate-400">100% Official Maharashtra Gazette</span>
          </div>

          <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Semantic Chunk Count</span>
              <Layers className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-2xl font-bold text-blue-400 font-mono mt-1">1,784 Chunks</div>
            <span className="text-[11px] text-slate-400">Average 512 tokens with overlap</span>
          </div>

          <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Vector Database</span>
              <Database className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold text-emerald-400 font-mono mt-1">ChromaDB</div>
            <span className="text-[11px] text-emerald-400">Local Persistent Embedded</span>
          </div>

          <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Hallucination Guardrail</span>
              <Cpu className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-2xl font-bold text-purple-400 font-mono mt-1">Strict RAG</div>
            <span className="text-[11px] text-slate-400">Mandatory § and GR citation</span>
          </div>
        </div>

        {/* Ingested Documents List */}
        <div className="mt-8 space-y-3">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-orange-400" />
            Active Grounding Documents (Gazette Corpus)
          </h2>

          {documents.map(doc => (
            <div
              key={doc.id}
              className="p-5 bg-slate-900/60 border border-slate-800 hover:border-slate-700 rounded-2xl transition"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs font-bold text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded border border-orange-500/30">
                      {doc.id}
                    </span>
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-slate-800 text-slate-300 rounded">
                      {doc.category}
                    </span>
                    <span className="text-xs text-slate-500">|</span>
                    <span className="text-xs text-slate-400">{doc.department}</span>
                  </div>

                  <h3 className="text-sm font-bold text-white mt-1.5">{doc.title}</h3>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="px-2.5 py-1 text-xs font-mono font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 rounded-lg flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Indexed ({doc.chunksCount} chunks)
                  </span>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
                <span>Embedding Model: {doc.embeddingModel}</span>
                <span>Last Synced: {doc.lastIndexed}</span>
              </div>
            </div>
          ))}
        </div>
      </main>

      <AIChatWidget />
    </div>
  );
}
