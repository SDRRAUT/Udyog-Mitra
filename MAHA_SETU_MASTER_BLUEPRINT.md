# 🌉 UDYOG MITRA — Complete App Flow (End-to-End, Har Screen, Har Event)

Ye document app ka **poora blueprint** hai: kaun user kya karta hai, kaun si screen khulti hai, backend me kya hota hai, kaunsa real-time event fire hota hai aur kiske screen pe kya update hota hai.

Ise **developers (build ke liye)**, **presenter (demo ke liye)** aur **judges ke Q&A** teeno ke liye use kar sakte ho.

---

## 📑 Index

| Part | Topic |
|---|---|
| **0** | Big Picture: Actors, Layers, Master Flow |
| **1** | Auth & Role-Based Entry Flow |
| **2** | Entrepreneur Journey: Smart Profile → Checklist |
| **3** | Rule Engine Internal Flow ("Approvals Find You") |
| **4** | CAF + Auto-Save + Readiness Score |
| **5** | Document Upload + Pre-Validation |
| **6** | Submission → Risk Score → Parallel Routing |
| **7** | Department Officer Flow |
| **8** | Query Thread Flow |
| **9** | Joint Inspection Flow |
| **10** | SLA Engine + Auto-Escalation |
| **11** | Delay Risk Prediction |
| **12** | Approval → Certificate → Schemes → Compliance Calendar |
| **13** | Renewal & Post-Establishment Flow |
| **14** | Grievance Flow |
| **15** | MAHA-MITRA AI Chatbot Flow |
| **16** | DIC (District) Flow |
| **17** | State Admin (MSIS) Flow + Rule Management |
| **18** | Notification Flow |
| **19** | State Machines (All Entities) |
| **20** | Real-Time Event Map |
| **21** | Screen & Navigation Map |
| **22** | Exception / Edge Case Flows |
| **23** | Final Demo Script |

---

# PART 0 — BIG PICTURE

## 0.1 Actors (Kaun-Kaun Use Karega)

| Actor | Role Code | Kya Karta Hai |
|---|---|---|
| 👨💼 Entrepreneur / Industrial Unit | `ENTREPRENEUR` | Profile, checklist, apply, track, queries ka reply, schemes, renewals, grievance |
| 🧑💻 Department Officer | `DEPT_OFFICER` | Scrutiny, query, inspection, recommend/approve/reject |
| 👔 Department HOD / Nodal | `DEPT_HOD` | L2 escalation, final approval authority, officer workload |
| 🏢 DIC Officer (District Industries Centre) | `DIC_OFFICER` | District monitoring, handholding, L3 escalation |
| 🔍 Inspection Officer | `INSPECTOR` | Inspection report upload (single/joint) |
| 🎧 Grievance Officer | `GRIEVANCE_OFFICER` | Grievance resolve & escalate |
| 🏛️ State Admin (MSIS / Industries Dept) | `STATE_ADMIN` | Analytics, rules, departments, schemes, knowledge base, audit, L4 escalation |
| 🤖 System (Cron / Workers) | `SYSTEM` | SLA check, escalation, reminders, delay prediction |

## 0.2 System Layers

```
┌──────────────────────── PRESENTATION ────────────────────────┐
│ Entrepreneur App │ Dept Console │ DIC Console │ MSIS Command  │
└───────────────────────────┬──────────────────────────────────┘
              REST /api/v1  +  Socket.IO (Rooms)
┌──────────────────────── INTELLIGENCE ────────────────────────┐
│ Rule Engine │ Dependency Graph │ Risk Scorer │ Workflow Engine │
│ SLA Engine │ Escalation Engine │ Delay Predictor │ Scheme Matcher│
│ Pre-Validator │ Inspection Planner │ MAHA-MITRA (RAG)          │
└───────────────────────────┬──────────────────────────────────┘
┌─────────────────────────── DATA ─────────────────────────────┐
│ PostgreSQL │ Redis (cache/pubsub/BullMQ) │ ChromaDB │ Cloudinary│
│ Immutable Audit Log │ Rule Versions                           │
└──────────────────────────────────────────────────────────────┘
```

## 0.3 MASTER FLOW (Bird's Eye View — Ye Ek Diagram Poora App Samjha Deta Hai)

```
 ENTREPRENEUR                     SYSTEM (Intelligence)                 GOVERNMENT
 ────────────                     ─────────────────────                 ──────────
 [Login OTP]
     │
 [Smart Profile: 8-15 Qs] ──────► Rule Engine evaluates rules
     │                            Dependency Graph + Stage split
     ▼                                   │
 [Dynamic Checklist] ◄──────────── "Why Required?" + SLA + Docs
     │
 [CAF — Fill Once] ─────────────► Auto-save + Readiness %
     │
 [Upload Docs] ─────────────────► Pre-Validation (canSubmit?)
     │
 [SUBMIT] ──────────────────────► Risk Score (0-100)
                                  Parallel Routing ───────────────► [Dept Queues LIVE]
                                  SLA clocks start                        │
                                                                   [Scrutiny]
 [Query Reply] ◄──────── query_raised ◄──────────────────────────── [Raise Query]
     │ ───────────────── query_replied ───────────────────────────► │
                                  Inspection Planner ◄───────────── [Need Inspection]
 [Joint Visit Slot] ◄──── ONE visit for MPCB+DISH+Fire ───────────► [Joint Inspection]
                                                                   [Recommend/Approve]
                                  SLA Cron (60s) ─ breach? ───────► Escalate L1→L2→L3→L4
 [Certificate] ◄──────────────── APPROVED
 [Eligible Schemes] ◄─────────── Scheme Matcher
 [Compliance Calendar] ◄──────── Renewal reminders (30/15/7/3/1 days)
                                                                   [MSIS Live Heatmap]
```

**Core idea yaad rakho:** Entrepreneur ko sirf **apne business ke baare mein batana** hai. Baaki sab — kaunse approval, kis order me, kis department ko, kab inspection — **system orchestrate karta hai.**

---

# PART 1 — AUTH & ROLE-BASED ENTRY

## 1.1 Login Flow

```
[Landing Page /]
   │ "Get Started" / "Officer Login"
   ▼
[/auth/login]  → Mobile ya Email daalo
   │ POST /auth/send-otp   (rate limit 5/min)
   ▼
[/auth/verify-otp] → 6-digit OTP (demo: 123456)
   │ POST /auth/verify-otp
   ▼
Backend:
  1. OTP verify (Redis TTL 5 min)
  2. User exists? NO → create ENTREPRENEUR user (officers pre-created by admin)
  3. Access Token (15 min) + Refresh Token (7 days) → HttpOnly cookies
  4. AuditLog: LOGIN (ip, userAgent)
   ▼
Frontend:
  1. GET /auth/me → role, deptId, districtId
  2. Socket.IO connect (JWT in handshake)
  3. Auto-join rooms (role ke hisaab se)
  4. Role redirect
```

## 1.2 Role → Redirect → Auto-Joined Rooms

| Role | Redirect | Auto-Joined Socket Rooms |
|---|---|---|
| ENTREPRENEUR | Profile incomplete → `/entrepreneur/onboarding`, else `/entrepreneur/dashboard` | `user:{id}`, `entrepreneur:{id}` |
| DEPT_OFFICER | `/department/queue` | `user:{id}`, `dept:{deptId}` |
| DEPT_HOD | `/department/dashboard` | `user:{id}`, `dept:{deptId}` |
| DIC_OFFICER | `/dic/dashboard` | `user:{id}`, `district:{districtId}` |
| INSPECTOR | `/department/inspections` | `user:{id}`, `dept:{deptId}` |
| GRIEVANCE_OFFICER | `/grievance/queue` | `user:{id}` |
| STATE_ADMIN | `/admin/dashboard` | `user:{id}`, `state:admin` |

Application detail page khulte hi extra room join: `application:{appId}` (page chhodte hi leave).

## 1.3 Session Rules
- Access token expire → silent refresh (interceptor) → fail → logout.
- Role change by admin → token revoke → force logout (socket `force_logout`).
- Socket disconnect → auto-reconnect with backoff → rooms rejoin → missed notifications `GET /notifications?since=` se sync.

---

# PART 2 — ENTREPRENEUR JOURNEY: SMART PROFILE → CHECKLIST

## 2.1 First-Time Dashboard (Empty State)

```
┌──────────────────────────────────────────────────┐
│ Namaste, Rahul 🙏                                  │
│ Aapka udyog shuru karne ka safar yahan se.         │
│                                                    │
│  [ 🚀 Start Smart Profile (3 min) ]                │
│                                                    │
│  Ya pehle poochein → 💬 MAHA-MITRA                 │
└──────────────────────────────────────────────────┘
```

## 2.2 Smart Profile Stepper (`/entrepreneur/onboarding`)

**Screen layout:** Left = Stepper form | Right = **"Live Checklist Preview"** panel (har answer ke saath approvals appear/disappear hote hain — **demo ka WOW moment**)

| Step | Questions | Smart Behaviour |
|---|---|---|
| **1. Entity** | Entity type (Proprietorship / Partnership / LLP / Pvt Ltd / Co-op), Udyam no. (optional), PAN, GST (optional) | PAN format validate; Udyam hai to MSME category auto-fill |
| **2. Business Stage** | Pre-establishment / Establishment / Expansion / Diversification | Stage decide karta hai CTE vs CTO jaisa logic |
| **3. Activity** | Sector (Manufacturing/Service/Trading), Sub-sector (Food Processing, Textile, Chemical, Pharma, Engineering...), Product | **Pollution category auto-suggest** (sub-sector → CPCB category map) |
| **4. Location** | District, Taluka, Location type (MIDC / Non-MIDC Industrial / Industrial Park / Rural / Urban / SEZ), Ecologically sensitive? | MIDC select → "MIDC Plot/Building Plan" approvals add; Eco-sensitive → risk flag |
| **5. Land** | Owned / Leased / Rented / MIDC Allotted, Plot area | Non-MIDC + agricultural land → "NA Conversion" approval add |
| **6. Investment & Manpower** | Plant & Machinery (₹), Building (₹), Employees, Contract labour count | MSME class auto (Micro/Small/Medium); Contract labour ≥20 → CLRA registration |
| **7. Infra** | Power (KW), Water (KL/day), Building height (m), Hazardous chemicals (Y/N + list) | Height >15m → Fire NOC mandatory; Hazardous → DISH extra + risk ↑ |
| **8. Social Profile** (optional) | Woman entrepreneur? SC/ST? First-generation? | Sirf **scheme eligibility** ke liye (compliance pe asar nahi — clearly likha hoga) |

**Pollution override:** User manually category change kare to warning: *"Auto-suggested ORANGE. Galat category se application reject ho sakti hai."* + audit log.

**Backend per step:**
```
PATCH /entrepreneur/profile (debounced 800ms)
   → Redis cached rule evaluation (preview mode)
   → Response: previewApprovals[] (lightweight)
```

## 2.3 Output: Dynamic Checklist Screen (`/entrepreneur/checklist`)

**Demo profile:** Food Processing | MIDC Pune | ORANGE | ₹2 Cr | 50 employees | 12m height | No hazardous

```
┌──────────────────────────────────────────────────────────────────┐
│ ✅ Aapke udyog ke liye 9 approvals applicable hain                  │
│ 6 Mandatory • 2 Conditional • 1 External (Central)                 │
│ Estimated timeline: Sequential 180 days → UDYOG MITRA Parallel 65 days │
├──────────────────────────────────────────────────────────────────┤
│ 🟠 STAGE 1 — PRE-ESTABLISHMENT (Construction se pehle)              │
│  ① MIDC Building Plan Approval        MIDC     MANDATORY  30d  ⚡   │
│  ② MPCB Consent to Establish (CTE)    MPCB     MANDATORY  30d  ⚡   │
│  ③ Factory Plan Approval              DISH     MANDATORY  30d  ⚡   │
│  ④ Fire NOC (Provisional)             Fire     CONDITIONAL 15d     │
│       └ depends on ① Building Plan                                  │
│ 🟢 STAGE 2 — PRE-OPERATION (Production se pehle)                    │
│  ⑤ MPCB Consent to Operate (CTO)      MPCB     MANDATORY  30d      │
│       └ depends on ② CTE                                            │
│  ⑥ Factory License                    DISH     MANDATORY  30d      │
│       └ depends on ③ Factory Plan                                   │
│  ⑦ Fire NOC (Final)                   Fire     CONDITIONAL 15d     │
│  ⑧ Labour Registrations               Labour   MANDATORY  7d   ⚡   │
│ 🔵 EXTERNAL / CENTRAL                                                │
│  ⑨ FSSAI License (Food Safety)        Central  INFO + Link          │
├──────────────────────────────────────────────────────────────────┤
│ ⚡ = Parallel eligible   [View Dependency Graph]  [Start Application]│
└──────────────────────────────────────────────────────────────────┘
```

**Har row expand karne par:**
- **"Why Required?"** → *"Aapka unit ORANGE category (Food Processing) me hai aur Pre-establishment stage me hai. Water (Prevention & Control of Pollution) Act, 1974 aur Air Act, 1981 ke tahat CTE mandatory hai."*
- **Source:** Rule ID + GR/Act reference
- **Required documents** list + sample format download
- **SLA days** + fees (if configured)
- **"Ask MAHA-MITRA about this"** button (context pre-filled)

**Dependency Graph view:** Node-edge diagram (React Flow). Green = parallel ready, Grey = locked (dependency pending).

---

# PART 3 — RULE ENGINE INTERNAL FLOW ("Approvals Find You")

Ye system ka **dil** hai. Judges poochenge — "AI galat approval bata de to?" Answer: **Compliance decision 100% deterministic rules se hota hai.**

```
POST /checklist/generate  { profileId }
        │
        ▼
[1] Load Profile → normalize into facts object
    { stage:'PRE_EST', sector:'MFG', subSector:'FOOD', pollution:'ORANGE',
      locationType:'MIDC', investment:2e7, employees:50, heightM:12,
      hazardous:false, contractLabour:0, landType:'MIDC_ALLOTTED' }
        │
        ▼
[2] Cache check (Redis key = hash(facts) + ruleVersion) → HIT? return (<50ms)
        │ MISS
        ▼
[3] Load active ChecklistRules (current RuleVersion)
        │
        ▼
[4] Evaluate each rule (JSONLogic) against facts
        │   → matched rules list with priority
        ▼
[5] Merge & Deduplicate
    - Same approval from multiple rules → highest applicability wins
      (MANDATORY > CONDITIONAL > INFO)
    - Explanations merged
        │
        ▼
[6] Conflict Detection
    - Rule A says NOT_APPLICABLE, Rule B says MANDATORY → higher priority wins
    - Log conflict for admin review
        │
        ▼
[7] Dependency Resolution (Topological Sort)
    - Build graph from ApprovalMaster.dependencies[]
    - Cycle? → error log (admin config bug), never shown to user
    - Assign stage + order + parallel groups
        │
        ▼
[8] Timeline Estimation
    - Sequential = sum(slaDays)
    - Parallel  = critical path length (longest dependency chain)
        │
        ▼
[9] Save ChecklistSnapshot (ruleVersion stored → audit: "is version ke rules se bana")
        │
        ▼
Response: grouped checklist (<500ms)
```

**Important governance point:** Checklist ek **snapshot** hai. Baad me rules change hon to purani applications purane version pe chalti hain; system entrepreneur ko notify karta hai *"Rules updated — Re-check your checklist"* (optional re-evaluation).

---

# PART 4 — CAF (COMMON APPLICATION FORM) + AUTO-SAVE + READINESS

## 4.1 Start Application

```
[Start Application] click
   │ POST /applications { checklistSnapshotId }
   ▼
Backend:
  - Application (status DRAFT) create
  - Har applicable approval ke liye ApplicationApproval (status DRAFT) create
  - Profile data CAF me pre-fill (Smart Profile ka data dobara nahi bharna)
   ▼
Redirect → /entrepreneur/applications/{id}/caf
```

## 4.2 CAF Screen Layout

```
┌───────────── LEFT: Sections ─────────────┬──── RIGHT: Readiness Panel ────┐
│ ✅ A. Promoter Details (pre-filled)       │   READINESS  72%  ▓▓▓▓▓▓▓░░░    │
│ ✅ B. Entity Details (pre-filled)         │   Profile   25/25 ✅             │
│ 🟡 C. Project Details (2 fields left)     │   Project   30/40 🟡             │
│ 🟡 D. Location & Land                     │   Documents 17/35 🟡             │
│ ⬜ E. Financials                          │                                  │
│ ⬜ F. Approval-Specific Fields            │   Next best action:              │
│     ├ MPCB: effluent qty, stack details   │   → Upload Site Plan (MPCB)      │
│     ├ DISH: machinery list, process flow  │   → Fill Stack Height            │
│     └ Fire: building layout, floors       │                                  │
│                                           │   💾 Saved 4s ago                │
└───────────────────────────────────────────┴─────────────────────────────────┘
```

**Section F ka magic:** Har department ka form sirf **extra specific fields** maangta hai. Common data (naam, address, PAN, investment, employees) **ek hi source of truth** se auto-fill hota hai — MPCB, DISH, Fire, Labour sab jagah same.

## 4.3 Auto-Save Flow

```
User types → Zustand local state update (instant UI)
   │ debounce 1.5s / hard save every 30s
   ▼
PATCH /applications/:id  { section, fields }
   ▼
Backend:
  - Zod validate (partial allowed in DRAFT)
  - Save + recompute readinessScore
  - Emit readiness_score_updated → application:{id}
   ▼
UI: "Saved ✓" + readiness bar animate
```
Offline/network fail → local draft (IndexedDB) → reconnect par sync.

## 4.4 Readiness Score Formula

```
readiness = Profile(25%) + Project(40%) + Documents(35%)

Profile   = filled mandatory profile fields / total × 25
Project   = filled mandatory CAF fields (common + approval-specific) / total × 40
Documents = (validated mandatory docs / required mandatory docs) × 35
            (doc with warning = 50% credit, error = 0)
```

## 4.5 Verified Reusable Data
Jab koi department (e.g., MPCB) PAN/Address/Entity verify kar deta hai → field `VERIFIED_REUSABLE` 🔒 badge. Dusra department (DISH) ko wo field **"Already verified by MPCB on 12 Mar"** dikhta hai — dobara scrutiny nahi. Entrepreneur verified field edit kare to warning + re-verification trigger.

---

# PART 5 — DOCUMENT UPLOAD + PRE-VALIDATION

## 5.1 Upload Flow

```
[Documents Tab] → har approval ke requiredDocs[] list
   │ Drag & drop file
   ▼
Client checks (instant): extension, size ≤10MB
   │
   ▼
POST /documents/upload (multipart)  → rate limit 30/min
   ▼
Backend:
  1. MIME sniff (magic bytes) — extension vs actual type match?
  2. Corrupt check (PDF parse page count, image decode)
  3. Upload → Cloudinary (signed) → thumbnail
  4. Document save (status: UPLOADED)
  5. Doc-level prevalidation flags:
     - wrong type expected (Site Plan PDF preferred)
     - too small / blank page (<5KB or 0 text + tiny image)
     - duplicate file hash (same file uploaded for 2 different doc types)
  6. Recompute readiness → emit readiness_score_updated
   ▼
UI: ✅ Valid | ⚠️ Warning (can submit) | ❌ Error (blocks submit)
```

**Smart reuse:** Ek doc (e.g., "Site Plan") agar MPCB aur Fire dono ko chahiye → **ek baar upload, dono jagah linked.**

## 5.2 Pre-Submission Validation (Go/No-Go Screen)

```
[Review & Submit] click
   │ POST /documents/prevalidate-application/:appId
   ▼
Checks:
  ✓ All mandatory CAF fields filled
  ✓ All mandatory docs uploaded & no ERROR flags
  ✓ Dependency check — koi approval submit ho raha hai jiski hard dependency
    pending hai? (e.g., CTO while CTE not approved) → wo approval "Locked"
  ✓ Declarations accepted
   ▼
Result Screen:
┌────────────────────────────────────────────────┐
│ 🟢 READY TO SUBMIT                               │
│ Mandatory Fields  48/48 ✅                       │
│ Mandatory Docs    11/11 ✅                       │
│ Warnings           1 ⚠️ (Site plan scale unclear)│
│ Submitting now: 4 approvals (Stage 1, parallel)  │
│ Locked until dependency: 4 approvals (Stage 2)   │
│ Query Probability: LOW                           │
│ [ ✍️ e-Sign Declaration ]  [ SUBMIT ]            │
└────────────────────────────────────────────────┘
```
`canSubmit=false` → Submit button disabled + missing items clickable (seedha us field/doc pe le jaata hai).

---

# PART 6 — SUBMISSION → RISK SCORE → PARALLEL ROUTING

## 6.1 Submission Pipeline (Backend — Ek Transaction)

```
POST /applications/:id/submit
   │
   ▼
[1] Re-run prevalidation server-side (client pe trust nahi)
[2] Lock CAF snapshot (submitted version immutable)
[3] RISK SCORE compute
[4] Determine routable approvals:
      - dependencies satisfied AND stage = current → route now
      - others → status LOCKED (auto-unlock later)
[5] For each routable ApplicationApproval:
      - status SUBMITTED → ASSIGNED
      - auto-assign officer (least workload in dept+district, round-robin tie)
      - slaDueAt = now + slaDays
      - slaStatus = ON_TRACK
[6] Application.overallStatus = IN_PROGRESS
[7] Timeline entries + AuditLog
[8] Commit → then emit events (after commit — no ghost events)
   │
   ▼
Socket Events:
  application_submitted   → entrepreneur:{id}, district:{districtId}, state:admin
  application_assigned    → dept:{MPCB}, dept:{DISH}, dept:{MIDC}, dept:{Labour}
  dept_queue_update       → each dept room (new counts)
  analytics_refresh       → state:admin, district:{id}
  notification_new        → assigned officers' user:{id}
```

## 6.2 Risk Score (Demo Example)

| Factor | Value | Points |
|---|---|---|
| Pollution | ORANGE | 40 |
| Hazardous | No | 0 |
| Eco-sensitive | No | 0 |
| Investment | ₹2 Cr (1–5 Cr) | 10 |
| Height >15m | No (12m) | 0 |
| High water/power | No | 0 |
| Manpower >500 | No | 0 |
| **Total** | | **50 → 🟡 MEDIUM** |

**Flags:**
- `fastTrackEligible` = LOW risk + all docs valid + no hazardous → queue me top + ⚡ badge + optional self-certification/reduced inspection (dept policy based)
- `requiresDetailedScrutiny` = HIGH → mandatory inspection + HOD visibility

## 6.3 Entrepreneur Screen After Submit

```
🎉 Application MS-2026-PUN-000123 submitted!
4 departments are working on it IN PARALLEL.

MIDC Building Plan   ASSIGNED   ⏱ 29d 23h left  🟢
MPCB CTE             ASSIGNED   ⏱ 29d 23h left  🟢
DISH Factory Plan    ASSIGNED   ⏱ 29d 23h left  🟢
Labour Registration  ASSIGNED   ⏱ 6d 23h left   🟢
🔒 CTO, Factory License, Fire NOC — unlock automatically on dependency approval
```

---

# PART 7 — DEPARTMENT OFFICER FLOW

## 7.1 Live Queue (`/department/queue`)

```
┌─ MPCB Pune │ Pending 23 │ At Risk 4 │ Breached 2 │ Fast-Track 3 ─┐   (live counters)
├──────────────────────────────────────────────────────────────────┤
│ App ID      Unit              Risk     SLA Left   Stage     Delay │
│ 🆕 ...0123  Rahul Foods       🟡 50    29d 23h   ASSIGNED   🟢 12 │ ← appears LIVE
│ ...0098     Shree Chem        🔴 78    🔴 -6h     SCRUTINY   🔴 88 │
│ ...0110     Om Textiles       🟢 20 ⚡  2d 4h     SCRUTINY   🟡 45 │
└──────────────────────────────────────────────────────────────────┘
Sort default: slaStatus (BREACHED first) → riskLevel DESC → slaDueAt ASC
Filters: risk, SLA status, stage, district, fast-track
```
Naya application aata hai → row **highlight animation + toast** — **refresh nahi karna padta**.

## 7.2 Application Scrutiny Screen (`/department/applications/:id`)

**Tabs:** Overview | CAF (read-only) | Documents | Queries | Inspections | Timeline | AI Assist

```
Header: Rahul Foods │ Risk 🟡50 │ SLA ⏱ 29d 22h 14m (live ticking) │ Delay Risk 12%

Overview:
  - Approval: MPCB CTE
  - Why routed here: Rule MPCB_CTE_ORANGE_PRE_EST
  - 🔒 Verified by other depts: PAN, Address (by MIDC)
  - Other parallel approvals status (visibility across depts):
      MIDC ✅ Under Scrutiny | DISH 🟡 Query Raised | Labour ✅ Approved

Documents: each doc → [Preview] [✅ Verify] [❌ Reject + remark]

AI Assist panel:
  "Suggested queries:"
   • Site plan scale not mentioned — ask for scaled drawing
   • Effluent quantity (5 KLD) vs water requirement (20 KLD) mismatch
  [Use as query]  (officer edit karke bhej sakta hai — AI sirf suggest karta hai)

Action Bar:
  [Start Scrutiny] [Raise Query] [Schedule Inspection] [Recommend] [Approve] [Reject] [Return]
```

## 7.3 Officer Action → State Transition

| Action | From → To | Validation | Events |
|---|---|---|---|
| Open app first time | ASSIGNED → UNDER_SCRUTINY | auto | `application_status_updated` |
| Raise Query | UNDER_SCRUTINY → QUERY_RAISED | query text required | `query_raised` |
| Schedule Inspection | → INSPECTION_SCHEDULED | slot + officers | `inspection_scheduled` |
| Upload Inspection Report | → INSPECTION_COMPLETED | report file | `inspection_completed` |
| Recommend | → RECOMMENDED (goes to HOD) | all mandatory docs verified | `application_status_updated` |
| Approve (HOD / delegated officer) | RECOMMENDED/SCRUTINY → APPROVED | docs verified; if inspection required → completed | `application_status_updated` + certificate |
| Reject | → REJECTED | **reason mandatory + rule/act reference** | notify + grievance/appeal option |
| Return | → RETURNED | reason; entrepreneur resubmits | SLA **paused**, restarts on resubmit |

**Statutory safeguard:** Approve button tab tak disabled jab tak mandatory docs verified na ho aur (HIGH risk me) inspection complete na ho. Reject bina reason ke possible nahi.

## 7.4 SLA Pause Rules (Fairness)
- QUERY_RAISED / RETURNED → SLA clock **paused** (ball entrepreneur ke court me)
- Reply/Resubmit → clock **resume** (remaining time)
- Ye clearly dono side dikhta hai: *"⏸ SLA paused — awaiting applicant response (2d)"*

---

# PART 8 — QUERY THREAD FLOW

```
OFFICER                                   ENTREPRENEUR
[Raise Query]
 text + optional doc request
 (AI suggestion edit karke)
   │ POST /application-approvals/:id/queries
   ▼
Backend: Query(OPEN), approval → QUERY_RAISED, SLA pause
   │ emit query_raised → entrepreneur:{id}, application:{appId}
   │ notification_new → user:{entrepreneurUserId}
   │                                        ▼
   │                          🔔 Toast: "MPCB raised a query on CTE"
   │                          Dashboard card turns 🟠 "Action Required"
   │                          [Reply] → text + upload doc
   │                          POST .../queries/:qid/reply
   ▼                                        │
Backend: Query(RESPONDED), approval → UNDER_SCRUTINY, SLA resume
   │ emit query_replied → dept:{MPCB}, application:{appId}
   ▼
🔔 Officer toast + queue row badge "Replied"
[Mark Resolved] → Query(RESOLVED)  or  [Follow-up] → new message in same thread
```

**Rules:**
- Thread immutable (edit/delete nahi) → audit trail.
- Max query rounds configurable (e.g., 2) — uske baad HOD visibility (repeated queries = harassment check).
- Entrepreneur 7 din tak reply na kare → reminder (day 3, 5, 7) → day 15 pe auto "RETURNED (No Response)".

---

# PART 9 — JOINT INSPECTION FLOW (Core Differentiator)

## 9.1 Trigger

```
Officer (MPCB) → [Schedule Inspection]
   │
   ▼
System check: "Is application ke liye aur kaunse dept ko inspection chahiye
               aur abhi pending hai?"  → DISH (Factory Plan), MIDC/Fire
   ▼
Modal:
┌──────────────────────────────────────────────────────┐
│ 💡 2 other departments also need inspection for this   │
│    unit. Combine into ONE Joint Inspection?             │
│    ☑ MPCB (you)  ☑ DISH  ☑ Fire                          │
│                                                          │
│ Suggested slots (conflict-free):                         │
│   ○ Tue 14 Apr, 11:00 AM  ✅ all 3 officers free         │
│   ○ Wed 15 Apr, 03:00 PM  ✅ all free                    │
│   ○ Thu 16 Apr, 10:00 AM  ⚠️ DISH officer has 1 overlap  │
│ [Propose Joint Inspection]   [Single Inspection instead] │
└──────────────────────────────────────────────────────┘
```

## 9.2 Consent & Confirmation

```
POST /inspections/joint { appId, deptIds[], proposedSlot }
   ▼
Backend:
  - JointInspection (status PROPOSED), linked ApplicationApprovals
  - Conflict check: officer calendars, same-location travel buffer (±2h)
  - emit inspection_scheduled {isJoint:true} → dept:{DISH}, dept:{Fire}, entrepreneur:{id}
   ▼
DISH & Fire officers: [Accept] / [Suggest another slot]
   - All accept → status SCHEDULED (entrepreneur ko final confirmation)
   - Koi dept 24h me respond na kare → auto-accept (configurable) OR fallback single
Entrepreneur: [Confirm availability] / [Request reschedule (1 time free)]
```

## 9.3 Inspection Day → Report

```
Day of inspection: status IN_PROGRESS (inspector marks, geo-tag optional)
   ▼
Each dept inspector uploads own section of report (dept-specific checklist)
OR lead inspector uploads combined report
   ▼
POST /inspections/:id/report
   ▼
Backend:
  - Report linked to ALL linked approvals automatically
  - Each approval → INSPECTION_COMPLETED
  - Timeline synced across all 3
  - emit inspection_completed → all dept rooms + entrepreneur
```

**Impact line (demo me bolo):** *"Pehle 3 alag visits, 3 alag din. Ab 1 visit, 1 din, 1 shared report."*

---

# PART 10 — SLA ENGINE + AUTO-ESCALATION

## 10.1 SLA Clock Status

| Status | Condition | Color |
|---|---|---|
| ON_TRACK | remaining > 24h (or >20% of SLA) | 🟢 |
| AT_RISK | remaining ≤ 24h | 🟡 |
| BREACHED | now > slaDueAt | 🔴 |
| PAUSED | Query/Return pending on applicant | ⏸ grey |

## 10.2 SLA Cron (Every 60 Seconds — BullMQ Repeatable Job)

```
Every 60s:
  ① AT_RISK scan:
     approvals where status active AND slaStatus=ON_TRACK
       AND slaDueAt - now ≤ 24h
     → slaStatus=AT_RISK
     → emit sla_at_risk → dept:{id}, entrepreneur:{id}, application:{appId}
     → notify assigned officer

  ② BREACH scan:
     approvals where status active AND not paused AND slaDueAt < now AND !slaBreached
     → slaBreached=true, slaStatus=BREACHED
     → SLABreachLog create
     → escalate L1 → L2 (immediate)
     → escalationDueAt = now + 24h
     → emit sla_breach → dept:{id}, state:admin, district:{id}, entrepreneur:{id}
     → emit escalation_triggered
     → analytics_refresh

  ③ ESCALATION scan:
     approvals where slaBreached AND escalationDueAt < now AND status still active
     → next level (L2→L3 DIC, L3→L4 State Admin)
     → escalationDueAt += 24h
     → emit escalation_triggered → new level's room
```
**Idempotency:** Redis lock per job run (do workers same row double-process na karein).

## 10.3 Escalation Matrix

```
T+0h  (SLA due passed)  → L1 Officer ➜ L2 Dept HOD      🔔 HOD dashboard "Breached"
T+24h (still pending)   → L2 HOD     ➜ L3 DIC Officer   🔔 District dashboard red
T+48h (still pending)   → L3 DIC     ➜ L4 State Admin   🔔 MSIS live ticker + heatmap red
```
Har level ko dikhta hai: kitna delay, kaun stage, kaun officer, pichla escalation history. L2/L4 **reassign** kar sakte hain ya **deadline extension (reason + audit)** de sakte hain.

Entrepreneur ko transparency: *"Your MPCB CTE has crossed SLA. Escalated to HOD, MPCB Pune on 12 Apr 10:02 AM."*

---

# PART 11 — DELAY RISK PREDICTION (Proactive)

**Goal:** SLA breach hone se **pehle** batana.

```
Every 5 min + on every transition:
  features = {
    slaRemainingPct,           // kitna % time bacha
    currentStageAgeHours,      // is stage me kitni der se atka
    queryCount,
    riskLevel,
    deptAvgTAT_last30d,
    deptBreachRate_last30d,
    officerPendingLoad,
    inspectionPending (bool)
  }
  delayRisk (0–100) = weighted score (prototype: explainable weighted formula;
                      future: ML model trained on historical data)
  reasons[] = top 2-3 contributing factors
   ▼
  If delayRisk ≥ 70 → emit delay_risk_updated → dept:{id}, state:admin
                    → HOD ko "Likely to breach" list me show
```

**UI:** Queue me "Delay" column + tooltip: *"88% risk — Officer has 31 pending files, stage stuck for 9 days, dept breach rate 22%."*

**Honesty point (judges ke liye):** Prototype me explainable weighted scoring; production me historical data se ML model — **same interface**.

---

# PART 12 — APPROVAL → CERTIFICATE → SCHEMES → COMPLIANCE

## 12.1 On Approval

```
HOD [Approve] → POST /application-approvals/:id/approve
   ▼
Backend:
  1. ApplicationApproval → APPROVED, completedAt
  2. Certificate PDF generate (approval no., validity, conditions, QR verify link)
  3. DEPENDENCY UNLOCK:
       find LOCKED approvals whose dependencies are now all APPROVED
       → status READY_TO_SUBMIT
       → emit + notify: "🔓 Consent to Operate unlocked — pre-filled, just add 2 docs"
  4. ComplianceItem create (if approval has validity/renewal)
  5. Overall status recompute:
       all approved → FULLY_APPROVED
       some → PARTIALLY_APPROVED
  6. Scheme eligibility re-run (stage change se naye schemes eligible ho sakte)
   ▼
Events: application_status_updated, notification_new, analytics_refresh,
        scheme_eligibility_updated
```

**Stage 2 flow:** Unlocked approvals ka CAF already filled hota hai → entrepreneur sirf naye docs (e.g., commissioning proof) add karta hai → submit → same pipeline (Part 6).

## 12.2 Scheme Discovery (`/entrepreneur/schemes`)

```
GET /schemes/eligibility/:applicationId
   → evaluate SchemeMaster.eligibilityRules (JSONLogic) vs profile+CAF
   ▼
┌───────────────────────────────────────────────────────────────┐
│ 💰 You are eligible for 4 schemes  (Est. benefit ₹38–52 Lakh)   │
├───────────────────────────────────────────────────────────────┤
│ ✅ Package Scheme of Incentives – Capital/Industrial Promotion   │
│    Subsidy (Zone-based)   Match 100%   [Why?] [How to apply]     │
│ ✅ Electricity Duty Exemption          Match 100%                │
│ ✅ Stamp Duty Exemption                Match 100%                │
│ ✅ PMFME (Food Processing, Central)    Match 90%  ⚠ needs Udyam  │
│ ❌ Women Entrepreneur Scheme — Not eligible (reason shown)       │
└───────────────────────────────────────────────────────────────┘
```
"Why?" → matched conditions list (sector ✓, district zone ✓, investment range ✓). **Apply** → prefilled application (CAF reuse) ya official portal deep-link. Status: ELIGIBLE → APPLIED → SANCTIONED → DISBURSED (tracking).

*(Note: Scheme names/amounts prototype me seed data hain; production me official GR se configure honge.)*

## 12.3 Certificate Verification
Certificate QR → public page `/verify/{certNo}` → valid/expired/revoked (bank, investor, inspector verify kar sakte hain).

---

# PART 13 — RENEWAL & POST-ESTABLISHMENT (Compliance Calendar)

```
/entrepreneur/compliance
┌────────────────────────────────────────────────────────┐
│ 📅 Compliance Calendar                                   │
│ 🔴 Factory License Renewal     due in 3 days   [Renew]    │
│ 🟡 MPCB CTO Renewal            due in 28 days  [Renew]    │
│ 🟢 Annual Return (Factories)   due in 90 days             │
└────────────────────────────────────────────────────────┘
```

**Cron (every 30 min):**
```
ComplianceItems where dueDate - today ∈ reminderDays [30,15,7,3,1]
   AND reminder not already sent for that day
   → notification_new + toast (+ SMS/email hook)
dueDate < today AND not renewed → status OVERDUE → dept + DIC visibility
```

**Renewal flow:** [Renew] → pre-filled from last approved CAF → sirf "changes since last approval?" (Yes/No) → No changes + LOW risk → **fast-track renewal** (auto-routing, reduced scrutiny) → same workflow.

Isse "Establishment → Operation → Renewal" poora lifecycle cover hota hai (PS me "renewals" explicitly likha hai).

---

# PART 14 — GRIEVANCE FLOW

```
Entrepreneur → /entrepreneur/grievances → [Raise Grievance]
  - Category: Delay / Unfair Query / Inspection issue / Technical / Other
  - Linked application (optional), description, attachment
   ▼
POST /grievances
  - Ticket GRV-20260412-0042
  - Priority auto: linked approval BREACHED → HIGH; else MEDIUM (user can't set CRITICAL)
  - SLA by priority: CRITICAL 24h, HIGH 48h, MEDIUM 5d, LOW 7d
  - Assign Grievance Officer (L1)
   ▼
Grievance Officer: view → forward to dept HOD for comment → resolve with remark
   ▼
Entrepreneur: [Satisfied ✅] → CLOSED   |  [Not Satisfied ❌] → REOPENED → escalate next level
Escalation cron same as SLA (L1→L2→L3→L4 on escalationDueAt)
```
Analytics: grievance category trends → MSIS ko pata chalta hai kaun dept "unfair queries" me top hai.

---

# PART 15 — MAHA-MITRA AI CHATBOT FLOW

## 15.1 Entry Points
- Floating widget (har page)
- `/entrepreneur/chat` full page
- Checklist row → "Ask about this approval" (context pre-filled)

## 15.2 Answer Pipeline (Hybrid)

```
User: "CTE aur CTO mein kya difference hai?"  (Hindi/English/Hinglish)
   │ POST /ai/chat { message, appId?, lang? }   rate limit 20/min
   ▼
[1] Language detect → hi / en / mr
[2] Intent routing:
     a) PERSONAL STATUS ("meri application kahan hai?")
        → DB query (user's own apps only, RBAC) → templated answer. NO LLM needed.
     b) FAQ exact/near match (seeded FAQ, similarity > 0.9)
        → direct answer + source
     c) REGULATORY question → RAG
[3] RAG:
     - Embed query → ChromaDB top-k 6
     - Filter by metadata (dept, act) + context (user's sector/pollution)
     - Prompt: "Answer ONLY from context. Cite source. If not in context say
       'Ye jaankari mere paas nahi hai, kripya DIC se sampark karein.'"
     - LLM (Gemini → Groq fallback → if both down: return top chunks as
       'Relevant excerpts' — still works offline)
[4] Guardrails:
     - Answer must contain ≥1 citation else downgrade to "unsure"
     - Never say "you don't need approval X" contradicting rule engine →
       cross-check with user's checklist snapshot; conflict → show rule engine result
[5] Response: answer + sources + confidence + suggested actions
   ▼
UI:
  "CTE (Consent to Establish) construction/setup se PEHLE lena hota hai,
   CTO (Consent to Operate) production shuru karne se pehle...
   📚 Sources: MPCB Consent Guidelines §2.1, Water Act 1974 §25
   [View your CTE status] [Ask follow-up]"
```

**Key rule:** Chatbot **guide** karta hai, **decide** nahi karta. Applicability hamesha Rule Engine ki.

---

# PART 16 — DIC (DISTRICT) FLOW

```
/dic/dashboard (district: Pune)
┌────────────────────────────────────────────────────────────┐
│ Applications: 312 │ In Progress 140 │ Breached 9 │ L3 Escalations 3│
│                                                                │
│ 🔴 Escalated to you (L3):                                       │
│   ...0098 Shree Chem — DISH — 52h overdue  [Reassign][Call HOD] │
│                                                                │
│ 🧭 Handholding Queue: entrepreneurs stuck in DRAFT > 7 days     │
│   Rahul Foods — readiness 45% — missing: site plan [Contact]    │
│                                                                │
│ Dept-wise pendency (district)  │  Upcoming joint inspections    │
└────────────────────────────────────────────────────────────┘
```
**Unique DIC feature — "Assisted Mode":** DIC officer entrepreneur ki consent se unki taraf se CAF fill kar sakta hai (low digital literacy users ke liye) — audit me "Filled by DIC officer X on behalf of" record.

---

# PART 17 — STATE ADMIN (MSIS) FLOW

## 17.1 Command Centre (`/admin/dashboard`) — Fully Live

```
┌──────────── LIVE KPIs (socket updated) ─────────────┐
│ Total 4,812 │ Today +37 │ Pending 1,204 │ 🔴 Breached 61 │
│ Avg TAT 38d │ SLA Compliance 91.2% │ Fast-track 18% │ Joint Insp 142│
├────────────────────────────────────────────────────┤
│ 🗺️ Bottleneck Heatmap (District × Department)         │
│            MPCB  DISH  Fire  Labour  MIDC               │
│  Pune       🟡    🟢    🔴    🟢     🟢                 │
│  Nagpur     🔴    🟡    🟢    🟢     🟡                 │
│  Nashik     🟢    🟢    🟡    🟢     🟢                 │
├────────────────────────────────────────────────────┤
│ Funnel: Draft→Submitted→Scrutiny→Inspection→Approved   │
│ Dept Avg TAT (bar) │ Risk Distribution (pie)           │
│ Scheme Utilisation: Eligible 1,920 vs Applied 740       │
├────────────────────────────────────────────────────┤
│ 📢 Live Ticker: "Fire Dept Pune breached SLA on 3 apps  │
│    in last 60 min" │ "L4 escalation: ...0098"           │
└────────────────────────────────────────────────────┘
Click any heatmap cell → drill-down list → app detail → action (reassign/extend/notice)
```

## 17.2 Rule Management (No-Code Governance)

```
/admin/checklist-rules → [New Rule] / [Edit]
   ▼
Visual rule builder:
   IF  pollutionCategory IN [ORANGE, RED]
   AND businessStage = PRE_ESTABLISHMENT
   THEN MPCB_CTE = MANDATORY
   Explanation: "..."   Source: "Water Act 1974 §25"
   ▼
[Test Rule] → run against 5 sample profiles → preview output
   ▼
[Publish] → new RuleVersion (v14 → v15), old version preserved
   - Redis rule cache invalidated
   - AuditLog: who, what changed (diff)
   - Existing in-flight applications stay on v14 (snapshot)
   - Draft applications → notification "Rules updated, re-check checklist"
```
Isse **"rules frequently change"** wala risk solve hota hai — code deploy ki zarurat nahi.

## 17.3 Other Admin Screens
| Screen | Purpose |
|---|---|
| `/admin/approvals-master` | Approvals, SLA days, required docs, dependencies, parallel flag |
| `/admin/departments` | Departments, officers, HODs, district mapping |
| `/admin/schemes` | Schemes + eligibility rules builder |
| `/admin/knowledge` | Upload Acts/GRs PDF → chunk + embed → MAHA-MITRA me live |
| `/admin/audit-logs` | Immutable log, filters (user, action, resource, date), export |
| `/admin/users` | Create officers, roles, deactivate |
| `/admin/system-health` | API, DB, Redis, Socket connections, queue lag, AI provider status |

---

# PART 18 — NOTIFICATION FLOW

```
Any business event
   ▼
NotificationService.create({ userId(s), type, title, body, link, priority })
   ├─► DB persist (unread)
   ├─► Socket: notification_new → user:{id}  → 🔔 badge +1, Sonner toast
   └─► (Hook) SMS/Email/WhatsApp adapter — production (prototype: log/console)
User clicks → mark read (PATCH) → badge -1 across all open tabs (socket sync)
```

| Type | Receiver | Priority |
|---|---|---|
| APPLICATION_SUBMITTED | Entrepreneur, assigned officers | Normal |
| QUERY_RAISED / REPLIED | Entrepreneur / Officer | High |
| INSPECTION_SCHEDULED | All involved depts + entrepreneur | High |
| SLA_AT_RISK | Officer | High |
| SLA_BREACHED / ESCALATED | Officer, HOD, DIC, Admin (by level), entrepreneur (info) | Critical |
| APPROVED / REJECTED | Entrepreneur | High |
| APPROVAL_UNLOCKED | Entrepreneur | Normal |
| COMPLIANCE_DUE | Entrepreneur | By days left |
| SCHEME_ELIGIBLE | Entrepreneur | Normal |

---

# PART 19 — STATE MACHINES (Sab Entities)

## 19.1 Application (Overall)
```
DRAFT ──submit──► IN_PROGRESS ──some approved──► PARTIALLY_APPROVED
                     │                                 │
                     │                        all approved
                     ▼                                 ▼
                 WITHDRAWN                      FULLY_APPROVED ──► OPERATIONAL (renewal tracking)
         (any mandatory rejected & no appeal → CLOSED_REJECTED)
```

## 19.2 ApplicationApproval (Per Department)
```
LOCKED ──deps met──► READY_TO_SUBMIT
DRAFT/READY ──submit──► SUBMITTED ──auto──► ASSIGNED ──open──► UNDER_SCRUTINY
UNDER_SCRUTINY ──query──► QUERY_RAISED ──reply──► UNDER_SCRUTINY
UNDER_SCRUTINY ──schedule──► INSPECTION_SCHEDULED ──report──► INSPECTION_COMPLETED
INSPECTION_COMPLETED / UNDER_SCRUTINY ──► RECOMMENDED ──HOD──► APPROVED | REJECTED
Any active ──return──► RETURNED ──resubmit──► SUBMITTED
APPROVED ──validity end──► EXPIRED ──renew──► (new renewal approval)
```

## 19.3 Others
| Entity | States |
|---|---|
| Query | OPEN → RESPONDED → RESOLVED → CLOSED (or RESPONDED → OPEN follow-up) |
| Inspection | PROPOSED → SCHEDULED → IN_PROGRESS → COMPLETED \| RESCHEDULED \| CANCELLED |
| Grievance | OPEN → IN_PROGRESS → RESOLVED → CLOSED \| REOPENED → ESCALATED |
| ComplianceItem | TRACKING → DUE → RENEWED \| OVERDUE |
| Document | UPLOADED → VALIDATED/WARNING/ERROR → VERIFIED \| REJECTED (→ re-upload) |
| SchemeApplication | ELIGIBLE → APPLIED → SANCTIONED → DISBURSED \| REJECTED |

Invalid transition (e.g., DRAFT → APPROVED) → backend **reject** (state machine guard), UI button hidden.

---

# PART 20 — REAL-TIME EVENT MAP (Action → Event → Kiski Screen Pe Kya)

| User Action | Event | Rooms | UI Effect |
|---|---|---|---|
| Entrepreneur edits CAF | `readiness_score_updated` | `application:{id}` | Readiness bar animate (other tabs bhi) |
| Entrepreneur submits | `application_submitted`, `application_assigned`, `dept_queue_update` | entrepreneur, dept×N, district, state:admin | Dept queue new row flash, KPI +1, toast |
| Officer opens app | `application_status_updated` | application, entrepreneur | Timeline: "Under Scrutiny by MPCB" |
| Officer raises query | `query_raised`, `notification_new` | entrepreneur, application, user | Toast + card 🟠 "Action Required" |
| Entrepreneur replies | `query_replied` | dept, application | Queue badge "Replied", SLA resume |
| Joint inspection proposed | `inspection_scheduled {isJoint}` | dept×N, entrepreneur | Calendar entry + accept prompt |
| Report uploaded | `inspection_completed` | dept×N, application | All linked approvals timeline update |
| Cron: 24h left | `sla_at_risk` | dept, application, entrepreneur | Clock turns 🟡 |
| Cron: breach | `sla_breach`, `escalation_triggered`, `analytics_refresh` | dept, district, state:admin, entrepreneur | Row 🔴, heatmap cell red, ticker message |
| Cron: delay risk | `delay_risk_updated` | dept, state:admin | Delay column update |
| HOD approves | `application_status_updated`, `scheme_eligibility_updated` | entrepreneur, application, state:admin | ✅ + certificate + unlock toast + scheme badge |
| Admin publishes rule | `rules_updated` | all entrepreneurs with drafts | Banner "Re-check checklist" |
| Any notification | `notification_new` | user:{id} | Bell badge +1 |

**Rule:** Events **DB commit ke baad** emit hote hain. Client event aane par **TanStack Query cache invalidate** karta hai (source of truth hamesha API) — isse inconsistent UI nahi hota.

---

# PART 21 — SCREEN & NAVIGATION MAP

```
PUBLIC
 ├─ /                     Landing (problem, how it works, stats, login CTA)
 ├─ /auth/login, /auth/verify-otp
 └─ /verify/:certNo       Public certificate verification

ENTREPRENEUR
 ├─ /entrepreneur/dashboard        Cards: apps, actions required, SLA clocks, schemes, renewals
 ├─ /entrepreneur/onboarding       Smart Profile stepper + live preview
 ├─ /entrepreneur/checklist        Dynamic checklist + dependency graph
 ├─ /entrepreneur/applications     List
 ├─ /entrepreneur/applications/:id Tabs: Overview | CAF | Docs | Queries | Inspections | Timeline
 ├─ /entrepreneur/schemes
 ├─ /entrepreneur/compliance       Calendar
 ├─ /entrepreneur/grievances
 └─ /entrepreneur/chat             MAHA-MITRA

DEPARTMENT
 ├─ /department/dashboard   (HOD: breached, escalated, officer workload)
 ├─ /department/queue       Live queue
 ├─ /department/applications/:id  Scrutiny workspace
 ├─ /department/inspections Calendar + joint proposals
 └─ /department/reports

DIC:        /dic/dashboard, /dic/applications, /dic/handholding
GRIEVANCE:  /grievance/queue, /grievance/:id
ADMIN:      /admin/dashboard, /admin/analytics, /admin/checklist-rules, /admin/approvals-master,
            /admin/departments, /admin/schemes, /admin/knowledge, /admin/audit-logs,
            /admin/users, /admin/system-health
COMMON:     /notifications, /profile, /help
Global UI:  Top bar (lang toggle EN/हिं/मराठी, 🔔 bell, profile) + MAHA-MITRA floating widget
```

---

# PART 22 — EXCEPTION / EDGE CASE FLOWS (Judges Yahin Pakadte Hain)

| Scenario | System Behaviour |
|---|---|
| **Mandatory approval REJECTED** | Reason + rule reference shown; options: **Appeal** (grievance type APPEAL → HOD/Appellate) or **Fix & Reapply** (CAF copy, only changed fields); dependent approvals stay LOCKED |
| **Entrepreneur changes profile after submission** (e.g., employees 50→600) | Warning: "Ye change checklist affect karega" → re-evaluate → new approvals added as DRAFT; in-flight approvals flagged for officer ("Material change") ; audit |
| **Dependency violated** (CTO submit before CTE approved) | Submit blocked; clear message + link to CTE status |
| **Officer on leave / inactive** | HOD reassign; auto-reassign if officer inactive >48h with pending items; SLA continues (not paused — govt side issue) |
| **Joint inspection: one dept declines** | Remaining depts proceed as joint; declined dept gets separate single inspection; entrepreneur notified |
| **Entrepreneur no-show at inspection** | Inspector marks "Applicant absent" → reschedule once; second time → RETURNED |
| **Invalid / corrupt / fake-extension file** | Rejected at upload with exact reason (MIME mismatch), readiness unaffected |
| **Duplicate application** (same PAN + same location + same approval active) | Blocked: "Active application exists: MS-...0123" |
| **AI provider down / no API key** | MAHA-MITRA falls back to FAQ + raw RAG excerpts; banner "Limited mode"; rest of app unaffected (rules engine independent of LLM) |
| **Socket disconnected** | Auto-reconnect; banner "Reconnecting..."; on reconnect → refetch queries + missed notifications |
| **Redis down** | Rule engine computes without cache (slower but works); cron pauses → on recovery catch-up scan (breach check uses DB timestamps, so no breach missed) |
| **Rule conflict / cycle in dependencies** | Publish blocked in rule builder with error; never reaches users |
| **Officer tries to access other dept's app** | 403 + audit log "Unauthorized access attempt" |
| **SLA extension request** | Officer requests with reason → HOD approves → new slaDueAt; visible to entrepreneur ("Extended by 5d: reason") — no silent extension |
| **Entrepreneur withdraws** | Allowed before APPROVED; all active approvals → WITHDRAWN; officers notified |

---

# PART 23 — FINAL DEMO SCRIPT (Multi-Tab, 6–7 Minutes)

**Setup:** 4 browser windows side-by-side — **Tab A** Entrepreneur | **Tab B** MPCB Officer | **Tab C** DISH Officer | **Tab D** MSIS Admin

| # | Tab | Action | Judge Ko Kya Dikhega | Bolna Kya Hai |
|---|---|---|---|---|
| 1 | A | Smart Profile bharo (Food, MIDC Pune, Orange, ₹2Cr, 50) | Right panel me approvals **live appear** | *"Approvals find you — user ko kuch search nahi karna."* |
| 2 | A | Generate Checklist | 9 approvals, stages, "Why required?", 180d → 65d | *"Har decision rule-based aur explainable hai."* |
| 3 | A | CAF → docs upload (1 galat file daalo) | Readiness % badhta, galat file ❌ turant | *"Incomplete application submit hi nahi ho sakti."* |
| 4 | A | Submit | Toast "4 departments working in parallel" | — |
| 5 | B + D | (No refresh!) | MPCB queue me **row flash**, Admin KPI +1 | *"Zero refresh — real-time orchestration."* |
| 6 | B | Open app → Risk 50 MEDIUM → AI suggested query → Raise | Tab A me **toast + orange card** | *"Query ab email/WhatsApp pe nahi, tracked thread me."* |
| 7 | A | Reply | Tab B badge "Replied", SLA resume | — |
| 8 | B | Schedule Inspection → "Combine with DISH & Fire?" → Joint | Tab C + Tab A me joint inspection notification | *"3 visits → 1 visit."* |
| 9 | D | Admin panel (seeded breached app) → heatmap red cell → drill down → L4 escalation | Live ticker, escalation history | *"Bottleneck visible before investor complains."* |
| 10 | B | Approve CTE | Tab A: ✅ certificate + "🔓 CTO unlocked" + schemes badge | *"Approval ke saath hi next step aur subsidies."* |
| 11 | A | Schemes page → 4 eligible, ₹ estimate | — | *"Access to government support — automatic."* |
| 12 | A | MAHA-MITRA: "CTE aur CTO mein kya difference hai?" | Hindi answer + sources | *"AI guide karta hai, decide nahi — rules decide karte hain."* |

**Closing (ratt lo):**
> *"Existing systems digitize the file. UDYOG MITRA orchestrates the journey — from the first question to the last renewal."*
