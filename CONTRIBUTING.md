# 🤝 Contributing to Udyog Mitra

Thank you for your interest in contributing to **Udyog Mitra**! Whether you are a student exploring full-stack engineering or an experienced developer, we welcome your contributions.

---

## 🛠️ Development Workflow

### 1. Fork and Clone
```bash
git clone https://github.com/SDRRAUT/Udyog-Mitra.git
cd Udyog-Mitra
```

### 2. Branching Strategy
Create a descriptive branch for your feature or bug fix:
```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/issue-description
```

### 3. Install & Run
Follow the setup instructions in the [README.md](./README.md):
```bash
npm install
npm run dev
```

### 4. Code Standards
* **TypeScript First**: Ensure strict typing without unnecessary `any` types.
* **Component Styling**: Use Tailwind CSS utility classes and design tokens defined in `globals.css`.
* **Testing & Linting**: Run `npx tsc --noEmit` in `apps/web` before submitting a pull request to ensure 0 compile errors.

### 5. Submitting a Pull Request
1. Push your branch to GitHub:
   ```bash
   git push origin feature/your-feature-name
   ```
2. Open a Pull Request on the `main` branch.
3. Clearly state the purpose of your PR, changes made, and include a screenshot if UI was modified.

---

## 💡 Code of Conduct
Please maintain a respectful, collaborative, and inclusive environment for everyone.
