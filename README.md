# Minerva University Web App Template 🌍🎓

**A high-fidelity, ethical-first template for building learning-oriented web applications.**

This repository is designed specifically for **Minerva University students, applicants, and staff**. It provides a professional, brand-aligned starting point for building web software that prioritizes human agency, data privacy, and deep learning—all powered by **Gemini CLI**.

---

## 🧭 The Minerva Approach

This isn't just a code template; it's a **guided development environment**. Every project built here follows the **Minerva AI Guardrails**:

1.  **Human-Centered Learning**: AI is your "thinking partner," not a substitute. You remain the author and the decision-maker.
2.  **Accountability**: You are responsible for every line of code and every user experience.
3.  **Data Privacy (Zero-Trust)**: This template is configured to strictly avoid the processing of sensitive student data (PII).
4.  **Radical Transparency**: All AI contributions are documented in a mandatory session log, and the app itself includes a visible "AI-Assisted" disclosure.
5.  **Official Branding**: Includes the official Minerva University Fall 2025 colors (Obsidian, Bone, Clay) and typography standards out of the box.

---

## 🚀 Getting Started (Step-by-Step)

You don't need to be an expert in Markdown or CLI to start. Follow these steps:

### 1. Create your Repository
Click the **"Use this template"** button on GitHub to create a copy in your own account.

### 2. Enable Hosting
Go to your repository **Settings** → **Pages**.
- Set **Source** to "Deploy from a branch".
- Select the `main` branch and `/ (root)` folder.
- Click **Save**. Your app will be live at `https://[your-username].github.io/[repo-name]`.

### 3. Clone to your Computer
To work on your project and use Gemini CLI, you need to "clone" the repository to your local machine.

#### 🍎 macOS & 🐧 Linux
1.  Open **Terminal**.
2.  Navigate to where you want to save your project (e.g., `cd Documents`).
3.  Run the clone command:  
    `git clone https://github.com/your-username/your-repo-name.git`
4.  Enter the folder:  
    `cd your-repo-name`

#### 🪟 Windows
1.  Open **PowerShell** or **Git Bash**.
2.  Navigate to your folder (e.g., `cd ~\Documents`).
3.  Run the clone command:  
    `git clone https://github.com/your-username/your-repo-name.git`
4.  Enter the folder:  
    `cd your-repo-name`

*Note: Ensure you have [Git](https://git-scm.com/downloads) and [Gemini CLI](https://github.com/google-gemini/gemini-cli) installed before starting.*

### 4. Start the Interactive Setup
Once you are inside your project folder in the terminal, start a Gemini session by typing `gemini`. Simply say:
> *"I have a new project idea."*

**Gemini will then walk you through a stepwise conversation to:**
- Name your app and define its purpose.
- Identify your target audience and the "human impact."
- Plan your first three milestones (M1, M2, M3).
- **Automatically update** `GEMINI.md` and `SCRATCHPAD.md` for you.

---

## 🛠 Key Files & Workflow

This repository uses three "living documents" to manage your project:

-   **`GEMINI.md`**: Your project's identity and standing instructions. Gemini reads this first to understand your goals and constraints.
-   **`SCRATCHPAD.md`**: Your active workspace. It tracks what you're working on right now, your next actions, and your session logs (including AI disclosures).
-   **`DECISIONS.md`**: Your Architecture Decision Record (ADR). Every time you make a big choice, Gemini logs it here with a "Guardrails Alignment" check.

---

## ⌨️ Useful Commands

While working with Gemini CLI, you can use these shortcuts:

| Command | Purpose |
| :--- | :--- |
| `/status` | Get a quick summary of where your project stands. |
| `/milestone` | Mark a stage as complete and run a "Values Check" (Learning, Agency, Privacy). |
| `/decision` | Log a technical choice to `DECISIONS.md` with an ethical audit. |

---

## 🎨 Tech Stack (The "Minerva Simple" Stack)

-   **Frontend**: Vanilla HTML5, CSS3, and JavaScript (No frameworks, no build steps).
-   **Styling**: Official Minerva Brand Standards (Fall 2025).
-   **Hosting**: GitHub Pages (Static, $0 cost).
-   **Philosophy**: Clarity over cleverness. Accessible (WCAG AA) and Responsive by default.

---

**Ready to build something that matters?** Open your terminal and tell Gemini: *"Start a new project."*
