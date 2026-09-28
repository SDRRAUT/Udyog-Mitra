# 🌉 UDYOG MITRA (उद्योग मित्र)
> **"Where Approvals Find You."** — AI-Orchestrated Single Window Industrial Clearance Platform for the Government of Maharashtra.

[![Live Demo](https://img.shields.io/badge/Live_Demo-Vercel_Production-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://udyog-mitra-peach.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github)](https://github.com/SDRRAUT/Udyog-Mitra)
[![RTS Act](https://img.shields.io/badge/Statutory_Act-RTS_2015_Compliant-15803D?style=for-the-badge)](#-the-statutory-guarantee-rts-act-2015)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](./LICENSE)

---

## 📌 Quick Links

* 🌐 **Live Website**: [https://udyog-mitra-peach.vercel.app](https://udyog-mitra-peach.vercel.app)
* 📜 **Master Architecture Blueprint**: [MAHA_SETU_MASTER_BLUEPRINT.md](./MAHA_SETU_MASTER_BLUEPRINT.md)
* 🚀 **Interactive Demo Personas**: [Jump to Role Guide](#-explore-the-4-roles-live-demo-guide)
* 💻 **Local Installation**: [Run Locally in 5 Minutes](#-quickstart-guide-run-locally-in-5-minutes)

---

## 🧐 The Real-World Problem (Explained Simply)

Starting a factory or manufacturing plant in India should be exciting, but for decades it has been slowed down by bureaucratic friction.

```
       LEGACY SYSTEM (180+ Working Days)
       ═════════════════════════════════
[Entrepreneur] ──> Visit Dept 1 (MPCB) ──> Wait 45 days ⏳
                         │
                         ▼ (Waits for previous approval)
                   Visit Dept 2 (DISH) ──> Wait 45 days ⏳
                         │
                         ▼ (Waits for previous approval)
                   Visit Dept 3 (Fire) ──> Wait 40 days ⏳
                         │
                         ▼ (Waits for previous approval)
                   Visit Dept 4 (MIDC) ──> Wait 50 days ⏳
                         │
                         ▼
                   Total Time: 180+ Days 🛑
```

### What went wrong in the legacy process?
1. **The 14-Door Maze**: An investor had to physically visit up to 14 different offices (Pollution Control Board, Fire Services, Factory Safety, Power Grid, Local Revenue, Water Authority).
2. **Sequential Delays (180+ Days)**: Department B refused to touch a file until Department A cleared it. If one clerk took a vacation, the entire project stopped.
3. **Repetitive Paperwork**: Basic enterprise details (Company Name, PAN, Land Survey Number, Director Details) had to be re-entered 12+ separate times on disjointed departmental portals.
4. **Disjointed Site Inspections**: Officers from different departments visited the factory on separate, random dates, forcing the entrepreneur to pause work repeatedly.
5. **Zero Accountability**: When files got stuck, investors had no visibility into whose desk held their application.

---

## 💡 The Solution: Udyog Mitra

**Udyog Mitra (उद्योग मित्र)** flips the entire model upside down: **Approvals Find You**, not the other way around.

```
       UDYOG MITRA PARALLEL ENGINE (65 Working Days)
       ═════════════════════════════════════════════
                         [Entrepreneur]
                                │ (Fills ONE Master Profile)
                                ▼
                   ┌─────────────────────────┐
                   │  UDYOG MITRA RULE ENGINE │
                   └────────────┬────────────┘
                                │
        ┌───────────────────────┼───────────────────────┐
        ▼                       ▼                       ▼
 🟢 MPCB Pollution        🟢 DISH Safety          🟢 MAHAFIRE NOC
   (Parallel Track)        (Parallel Track)        (Parallel Track)
        │                       │                       │
        └───────────────────────┼───────────────────────┘
                                ▼
             🤝 ONE Synchronized Joint Inspection
                                ▼
           📜 Digitally Signed QR Clearance Certificate
                                ▼
                   Total Time: 65 Days ⚡ (-64% Reduction)
```

---

## ⚡ 5 Breakthrough Innovations

### 1. 🎯 "Approvals Find You" (Deterministic Rule Engine)
* **How it works**: Instead of asking the user *"Which permits do you want to apply for?"*, the platform asks 8 simple questions about their business (e.g., *Industry category, plot location, power load, worker count*).
* **The result**: An automated rule engine (`json-logic-js`) evaluates state laws and generates a customized statutory clearance checklist. Zero guesswork. Zero hallucinations.

### 2. ⚡ Parallel Multi-Departmental Scrutiny
* **How it works**: Once the Common Application Form (CAF) is submitted, the dossier is instantly dispatched to all relevant departments **at the same time**.
* **The result**: Timeline compressed from **180 working days down to 65 days** (a 64% reduction in approval lead time).

### 3. 🤝 "3-in-1" Single-Visit Joint Inspection
* **How it works**: Replaces chaotic, uncoordinated site visits with an intelligent calendar synchronizer.
* **The result**: Pollution officers, factory inspectors, and fire officers visit the facility **together on one scheduled date** and file a single combined inspection report.

### 4. ⏱️ 30-Day Statutory SLA & Multi-Tier Escalation
* **How it works**: Backed by the **Maharashtra Right to Public Services Act (RTS 2015)**, every clearance has a strict statutory countdown timer.
* **The result**: If an officer delays without legal justification, the application auto-escalates up the ladder:
  $$\text{L1 Field Officer} \longrightarrow \text{L2 Head of Dept} \longrightarrow \text{L3 District GM (DIC)} \longrightarrow \text{L4 State Admin}$$
  If the timer expires, **Deemed Approval** is granted under the law.

### 5. 🛡️ Cryptographically Signed QR Certificates
* **How it works**: Approved certificates feature a unique SHA-256 cryptographic hash and dynamic QR code.
* **The result**: Banks, municipal inspectors, or partners can scan the QR code or visit `/verify/[certNo]` to verify authenticity in under 1 second.

---

## 👥 Explore the 4 Roles (Live Demo Guide)

You can experience every role directly on the **[Live Production Website](https://udyog-mitra-peach.vercel.app)** without creating an account:

| Role | Persona Name | Key Actions & Pages to Test | Direct Link |
| :--- | :--- | :--- | :--- |
| **🚀 Entrepreneur** | **Rahul Sharma** | Complete 8-step Smart Wizard, view CAF, track real-time SLA progress, check eligible subsidies. | [Open Dashboard](https://udyog-mitra-peach.vercel.app/entrepreneur/dashboard) |
| **🏢 Scrutiny Officer** | **Suresh Kulkarni (MPCB)** | Review incoming dossiers, inspect risk scores, raise queries, schedule joint inspections, issue 1-click approvals. | [Open Queue](https://udyog-mitra-peach.vercel.app/department/queue) |
| **🏛️ DIC District GM** | **Priya Deshmukh** | Monitor district-wide industrial velocity, resolve L3 escalated bottlenecks, track department performance. | [Open DIC Dashboard](https://udyog-mitra-peach.vercel.app/dic/dashboard) |
| **⚡ State Administrator** | **Dr. Sanjay Patil, IAS** | 36-district health overview, system cluster metrics, L4 state escalations, and statutory rule management. | [Open State Command](https://udyog-mitra-peach.vercel.app/admin/dashboard) |
| **🔍 Public Citizen / RTI** | *Public Access* | Track application status live and view state-wide RTS Act compliance benchmarks. | [Open Transparency](https://udyog-mitra-peach.vercel.app/public/transparency) |

---

## 🛠️ Technology Stack Breakdown

We chose a modern, type-safe stack designed for government-grade performance, accessibility, and high developer velocity:

```mermaid
graph LR
    subgraph Client ["Frontend (Next.js 16)"]
        UI["React 19 + TypeScript"]
        Motion["Aceternity UI + Framer Motion"]
        CSS["Tailwind CSS v4 (Anti-Vibe Design)"]
    end

    subgraph Server ["Backend (NestJS API)"]
        API["NestJS Core Service"]
        Socket["Socket.io WebSocket Gateway"]
        Engine["JSONLogic Statutory Engine"]
    end

    subgraph Data ["Persistence Layer"]
        Prisma["Prisma ORM"]
        DB[("PostgreSQL Database")]
    end

    Client <-->|REST API + WebSockets| Server
    Server <-->|Type-Safe Queries| Prisma
    Prisma <--> DB
```

### Why these technologies?
* **Next.js 16 (App Router + Turbopack)**: Server-side rendering for instant page loads and SEO, coupled with client-side interactive dashboards.
* **Aceternity UI & Framer Motion**: Delivers intuitive feedback—cursor spotlights on statutory cards, sliding tab switchers, and tracing timelines for approval stages.
* **NestJS (Node.js)**: Enterprise-grade architecture with dependency injection, strict modular separation, and scalable REST endpoints.
* **PostgreSQL & Prisma ORM**: Ensures ACID compliance for critical legal documents, license numbers, and audit logs.
* **Socket.io**: Powers real-time SLA countdown clocks, officer query notifications, and multi-tab state sync.
* **Accessibility (WCAG 2.2 AA)**: Designed for high contrast, readable typography, and complete keyboard navigation.

---

## 📂 Project Architecture

```
udyog-mitra/
├── apps/
│   ├── web/                          # Next.js 16 Frontend Application
│   │   ├── app/                      # Next.js App Router Pages & Routes
│   │   │   ├── (auth)/login/         # SSO 1-Click Role Login
│   │   │   ├── entrepreneur/         # Entrepreneur Portal & Smart Wizard
│   │   │   │   ├── checklist/        # Approval Roadmap & DAG Dependency Graph
│   │   │   │   ├── onboarding/       # 8-Question Smart Profile Wizard
│   │   │   │   └── schemes/          # PSI 2019 Incentives & Subsidies
│   │   │   ├── department/           # Scrutiny Officer Workflows
│   │   │   │   ├── queue/            # Priority Scrutiny Queue
│   │   │   │   └── inspections/      # Joint Inspection Calendar
│   │   │   ├── admin/                # State Admin Command Center
│   │   │   ├── public/transparency/  # RTS Act Open Transparency Portal
│   │   │   └── verify/[certNo]/      # Public QR Certificate Verification
│   │   ├── components/               # UI Primitives & Domain Components
│   │   │   ├── ui/aceternity/        # Aceternity UI Components (Spotlights, Tabs)
│   │   │   ├── Navbar.tsx            # Floating Navigation with Language Switcher
│   │   │   └── Footer.tsx            # Institutional Footer & Legal Info
│   │   └── lib/                      # API clients, motion tokens, and utilities
│   │
│   └── api/                          # NestJS Backend API
│       ├── src/
│       │   ├── modules/              # Domain modules (Approvals, SLA, Inspections)
│       │   │   ├── checklist/        # Rule engine & DAG Kahn's algorithm
│       │   │   ├── sla/              # 30-day statutory escalation service
│       │   │   └── websocket/        # Real-time event gateway
│       │   └── prisma/               # Database connection & schema definitions
│       └── prisma/
│           ├── schema.prisma         # Relational database models
│           └── seed.ts               # Realistic demo seed data
│
├── MAHA_SETU_MASTER_BLUEPRINT.md     # 1,100+ line master architecture blueprint
├── package.json                      # Workspace configuration
└── README.md                         # Project documentation
```

---

## 🚀 Quickstart Guide (Run Locally in 5 Minutes)

### Prerequisites
Make sure you have installed:
* [Node.js](https://nodejs.org/) (version 18 or higher)
* [PostgreSQL](https://www.postgresql.org/) (running locally or a cloud database URL)
* [Git](https://git-scm.com/)

### Step 1: Clone the Repository
```bash
git clone https://github.com/SDRRAUT/Udyog-Mitra.git
cd Udyog-Mitra
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Configure Environment Variables
Copy the example environment files:
```bash
# In apps/api
cp apps/api/.env.example apps/api/.env
```
Ensure your `DATABASE_URL` in `apps/api/.env` points to your PostgreSQL instance (e.g., `postgresql://postgres:postgres@localhost:5432/udyog_mitra`).

### Step 4: Run Database Migrations & Seed Data
```bash
npm run db:migrate --workspace=apps/api
npm run db:seed --workspace=apps/api
```

### Step 5: Start the Platform
```bash
# Starts both Frontend (:3000) and Backend API (:3001) simultaneously
npm run dev
```

Open your browser at **[http://localhost:3000](http://localhost:3000)** to view the platform!

---

## 🏛️ The Statutory Guarantee: RTS Act 2015

All clearances issued on Udyog Mitra are backed by the **Maharashtra Right to Public Services Act, 2015**:
* **Article 4(1)**: Mandatory notification of all industrial approval timelines.
* **Article 7(2)**: Right of citizen/investor to seek compensation for unjustified delays.
* **Section 10**: Deemed approval clause where permissions are legally granted upon unexcused statutory expiration.

---

## 🤝 Contributing

We welcome contributions from students, engineers, and civic tech enthusiasts!  
Please review our [Contributing Guidelines](./CONTRIBUTING.md) and [Security Policy](./SECURITY.md) before opening a pull request.

---

## 📄 License

This project is licensed under the [MIT License](./LICENSE).

---

<div align="center">
  <sub>Built with ❤️ for Maharashtra's Industrial Growth · Government of Maharashtra Single Window Initiative</sub>
</div>
