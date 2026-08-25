# 💻 Aryan Prasad — Interactive Linux Terminal Portfolio

[![Live Demo](https://img.shields.io/badge/Live_Demo-aryan--terminal--portfolio.vercel.app-00ff88?style=for-the-badge&logo=vercel&logoColor=white)](https://aryan-terminal-portfolio.vercel.app/)
[![React](https://img.shields.io/badge/React-18.3-61dafb?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178c6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38bdf8?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-6.4-646cff?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)

An authentic, ultra-responsive, and deeply interactive Linux Terminal styled personal portfolio website built for **Aryan Prasad** (Aspiring AI/ML Engineer & Full-Stack Developer).

🌐 **Live Deployment**: [https://aryan-terminal-portfolio.vercel.app/](https://aryan-terminal-portfolio.vercel.app/)

---

## ✨ Key Features & Highlights

### 🖥️ Shell & Terminal Core
- 🐧 **Full POSIX Virtual Filesystem**: In-memory Unix filesystem with path normalization (`cd`, `ls`, `cat`, `pwd`, `tree`, `mkdir`, `touch`, `rm`, `~`, `..`).
- ⌨️ **Tab Autocompletion & Command History**: Intelligent Tab completion for shell commands and file paths + `↑`/`↓` history cycling + `Ctrl+L` clear and `Ctrl+C` cancel shortcuts.
- 📱 **Quick-Action Touch Bar**: Clickable command pills for mobile touchscreens or visitors who prefer fast point-and-click navigation.
- 📺 **CRT Monitor Simulation**: Toggleable phosphor glow, scanline raster effect, and screen curvature vignette.
- 🔊 **Procedural Web Audio Synthesizer**: Authentic mechanical keyboard click noises, enter clacks, and terminal beeps synthesized purely via Web Audio API with zero external audio assets.
- 🛡️ **Kernel Panic Error Boundary**: Automatic React Error Boundary with one-click terminal cache reboot.

---

### 🚀 Interactive Portfolio Commands
- 🐙 **`github`**: Live telemetry querying the GitHub REST API (`api.github.com/users/aryan-111106`) with real repository metrics, public statistics, and an aesthetic dark contribution heatmap.
- 📝 **`vim [filename]` / `nano`**: Full interactive in-terminal text editor with authentic TUI buffer, line numbering with `~` tildes, mode switching (`NORMAL`, `INSERT`, `COMMAND`), and filesystem saving (`:w`, `:wq`, `:q!`).
- 🛠️ **`skills`**: Matrix of 28 technical competencies across Programming Languages, AI/LLMs & Computer Vision, Web & Backend Engineering, DevOps/Tools, and Spoken Languages.
- 📜 **`certifications`**: Rich card views with verification badges for Oracle Cloud (OCI AI), Google Analytics, IIT NPTEL, Deloitte, and academic honors (*Prabhat Khabar Pratibha Samman*).
- 📄 **`resume`**: Formatted interactive terminal CV with in-place inspection and one-click PDF download options.
- 💼 **`projects`**: Dynamic filterable catalog with live GitHub repository links and demo preview tags.

---

### 🎨 Themes & Customization
Includes 7 switchable color schemes with matching procedural canvas backgrounds:
- 🟢 `matrix-green` — Classic CRT phosphor green with digital falling code rain
- 🟣 `dracula` — Vibrant cyberpunk purple, pink, and cyan with cosmic starfield
- 🍦 `catppuccin` — Catppuccin Mocha pastel aesthetic
- ❄️ `nord` — Arctic frost blue and winter ambient particles
- 🍂 `gruvbox` — Warm retro groove colorway
- ⚡ `cyberpunk` — High-voltage neon synthwave horizon
- 🟠 `ubuntu` — Canonical deep aubergine & bash white *(Default)*

---

### 🕹️ Easter Eggs & Minigames
- 🎮 **`snake`**: Playable retro arcade Snake game with score tracking and on-screen touch D-Pad.
- 🌧️ **`matrix`**: Fullscreen digital green rain falling canvas animation (press `q` or `Esc` to exit).
- 🚂 **`sl`**: Animated steam locomotive train traversing the screen.
- 🐮 **`cowsay [message]`**: ASCII cow speech bubble generator.
- 🖥️ **`neofetch`**: ASCII terminal logo with hardware and system statistics.
- 🌤️ **`weather`**: Dynamic meteorological weather forecast.
- 🔐 **`sudo [cmd]`**: Witty permission denial responses.

---

## 📖 Command Reference

| Command | Category | Description |
| :--- | :--- | :--- |
| **`help`** | System | List all available shell commands and features |
| **`about`** | Portfolio | Display biographical background, education, and passions |
| **`projects`** | Portfolio | View featured projects with GitHub and Live demo links |
| **`github`** | Portfolio | View live GitHub stats, public telemetry, and commit heatmap |
| **`skills`** | Portfolio | View technical skill competencies with progress bars |
| **`experience`** | Portfolio | View career history, roles, and project leadership |
| **`education`** | Portfolio | View academic history (B.Tech CSE AI & ML) |
| **`certifications`** | Portfolio | View verified certifications and academic honors |
| **`resume`** | Portfolio | View interactive curriculum vitae (PDF options) |
| **`contact`** | Portfolio | View social handles, email, and profiles |
| **`vim <file>`** | Tools | Open in-terminal interactive text editor (`:w`, `:q`, `:wq`) |
| **`ls [-a] [-l]`** | Navigation | List directory contents |
| **`cd <dir>`** | Navigation | Change directory (`..`, `~`, `/`, relative) |
| **`cat <file>`** | Navigation | Read file content |
| **`pwd`** | Navigation | Print current working directory |
| **`tree`** | Navigation | View visual ASCII directory tree |
| **`theme [name]`** | Customization | Switch theme (`ubuntu`, `matrix`, `dracula`, `nord`, etc.) |
| **`sound [on\|off]`** | Customization | Toggle mechanical typing sound FX |
| **`crt [on\|off]`** | Customization | Toggle retro CRT scanlines |
| **`matrix`** | Easter Eggs | Launch fullscreen digital Matrix green rain |
| **`snake`** | Easter Eggs | Play retro Snake arcade game |
| **`sl`** | Easter Eggs | Steam locomotive train animation |
| **`neofetch`** | Easter Eggs | Display ASCII system specs |
| **`cowsay <text>`** | Easter Eggs | Generate ASCII cow with speech bubble |
| **`weather`** | Easter Eggs | View live meteorological weather report |
| **`quote`** | Easter Eggs | Print inspirational developer quote |
| **`clear`** (`Ctrl+L`) | System | Clear terminal output stream |
| **`shutdown`** | System | Trigger terminal power-off sequence |

---

## 🚀 Local Development Setup

### 1. Clone the repository:
```bash
git clone https://github.com/aryan-111106/Terminal-Portfolio.git
cd Terminal-Portfolio
```

### 2. Install dependencies:
```bash
npm install
```

### 3. Start development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for production:
```bash
npm run build
```

---

## ⚙️ Configuration & Personalization

All personal data, projects, skills, certifications, and settings are centralized in a single configuration file:
👉 **[`src/config/portfolio.config.ts`](file:///d:/Programs/Vibe%20Coding/Terminal/src/config/portfolio.config.ts)**

---

## 👨‍💻 Author

**Aryan Prasad**
- **GitHub**: [@aryan-111106](https://github.com/aryan-111106)
- **Portfolio**: [aryan-terminal-portfolio.vercel.app](https://aryan-terminal-portfolio.vercel.app/)
- **Specialization**: B.Tech CSE (AI & ML) @ Haldia Institute of Technology

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
