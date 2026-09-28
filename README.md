# UDYOG MITRA (उद्योग मित्र)
> **"Approvals Find You."** — Unified Industrial Approval Orchestration Platform for Maharashtra

[![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=flat&logo=next.js)](https://nextjs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-10.0-E0234E?style=flat&logo=nestjs)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16.0-336791?style=flat&logo=postgresql)](https://www.postgresql.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![Aceternity UI](https://img.shields.io/badge/Aceternity_UI-Framer_Motion-6366F1?style=flat)](https://ui.aceternity.com/)
[![Compliance](https://img.shields.io/badge/RTS_Act-2015_Compliant-00875A?style=flat)](#)

---

## 🏛️ Executive Summary

**UDYOG MITRA** is the official next-generation single-window clearance and industrial facilitation platform for the **Government of Maharashtra**. Designed under the statutory mandate of the **Maharashtra Right to Public Services Act (RTS 2015)**, it replaces disjointed physical departmental visits with a unified digital dossier, parallel multi-departmental scrutiny, and deemed approval enforcement.

---

## ⚡ The 5 Core Innovations

1. **Deterministic Inverse Rule Engine ("Approvals Find You")**  
   Evaluates investor input through an 8-question Smart Wizard to compute required statutory clearances across MPCB, DISH, Fire, and MIDC automatically.
2. **Parallel Multi-Departmental Scrutiny**  
   Compresses legacy sequential approval timelines from **180 working days down to 65 days** through concurrent document dispatch.
3. **Consolidated "3-in-1" Joint Site Inspection**  
   Synchronizes environmental engineers, factory safety inspectors, and fire officers into a single scheduled visit slot with one joint inspection report.
4. **Statutory SLA Engine & Hierarchical Escalation**  
   30-day statutory countdown clocks trigger automated escalations (**L1 Field Officer → L2 HOD → L3 DIC GM → L4 State Admin**) with deemed approval guarantees.
5. **Digitally Signed Certificates with Real-Time QR Verification**  
   Generates tamper-proof SHA-256 clearance certificates with instant QR verification at `/verify/[certNo]`.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | **Next.js (App Router)**, **React 19**, **Tailwind CSS v4**, **Framer Motion**, **Aceternity UI**, **Lucide Icons** |
| **Backend** | **NestJS**, **Node.js**, **Socket.io** (real-time countdowns & alerts) |
| **Database & ORM** | **PostgreSQL**, **Prisma ORM** |
| **Accessibility & Standards** | **WCAG 2.2 AA**, **UX4G**, **Gov.uk** institutional design tokens |

---

## 👥 Role Perspectives

- **🚀 Entrepreneur**: Smart Profile Setup, Unified CAF filing, real-time SLA tracker, joint inspection scheduling, and scheme eligibility.
- **🏢 Department Officer**: Risk-sorted priority queues, split-view PDF dossier scrutiny, 1-click approvals, and query issuance.
- **🏛️ DIC General Manager**: District-level performance metrics, stuck application resolutions, and departmental leaderboards.
- **⚡ State Administrator**: 36-district choropleth health monitoring, rule engine configuration, and L4 escalation oversight.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or later)
- PostgreSQL
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/SDRRAUT/Udyog-Mitra.git
cd Udyog-Mitra

# Install dependencies
npm install

# Setup Database
npm run db:migrate --workspace=apps/api
npm run db:seed --workspace=apps/api

# Run Development Servers (Frontend on :3000, Backend on :3001)
npm run dev
```

---

## 📄 License & Governance
Government of Maharashtra · Industry, Energy & Labour Department  
RTS Act 2015 Compliant · Problem ID: 26130
