# Sinchana M — Personal Portfolio

A modern, high-performance personal portfolio and engineering showcase designed for **Sinchana M** (Computer Science & Engineering undergraduate at Maharaja Institute of Technology Mysore, specializing in AI & Machine Learning).

Built with **React 19**, **TypeScript**, **Vite**, and **Tailwind CSS**.

---

## 🛠️ Tech Stack

- **Frontend Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations**: [Motion](https://motion.dev/)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18 or higher recommended)
- `npm` (standard Node package manager)

### Installation

1. Clone or extract the repository:
   ```bash
   git clone <repository-url>
   cd sinchana-portfolio
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the local development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

### Production Build

To build the static production bundle:

```bash
npm run build
```

To preview the built production assets locally:

```bash
npm run preview
```

---

## 📁 Project Structure

```
├── public/                 # Public static assets
├── src/
│   ├── components/         # Modular React UI components
│   │   ├── About.tsx       # Bio & Formal Academic Registry
│   │   ├── Certifications.tsx
│   │   ├── Contact.tsx
│   │   ├── Footer.tsx
│   │   ├── Hero.tsx        # Profile introduction & quick facts
│   │   ├── Navbar.tsx      # Sticky navigation & owner trigger
│   │   ├── NotificationToast.tsx
│   │   ├── OwnerAuthModal.tsx
│   │   ├── OwnerEditModal.tsx
│   │   ├── OwnerMessagesDrawer.tsx
│   │   ├── Projects.tsx    # Showcase of AI/ML & web projects
│   │   ├── ResumeModal.tsx # Formatted resume modal & printable view
│   │   └── Skills.tsx      # Categorized skill chips & proficiency
│   ├── context/
│   │   └── PortfolioContext.tsx # Central state management & storage
│   ├── data/
│   │   └── initialPortfolio.ts  # Default profile, education & project data
│   ├── App.tsx             # Root application component
│   ├── index.css           # Global Tailwind styling rules
│   ├── main.tsx            # DOM entry point
│   └── types.ts            # TypeScript interfaces and contracts
├── index.html              # HTML5 entry template
├── metadata.json           # Application metadata
├── package.json            # Project dependencies & scripts
├── tsconfig.json           # TypeScript configuration
└── vite.config.ts          # Vite build configuration
```

---

## ⚡ Deploying to Vercel

This project is pre-configured with `vercel.json` and serverless API handlers for 1-click deployment on **[Vercel](https://vercel.com/)**.

### Method 1: Deploy via GitHub (Recommended)
1. Export or push your repository to your GitHub account (e.g. `sinchanam-21/sinchana-portfolio`).
2. Log into [vercel.com](https://vercel.com) and click **"Add New Project"**.
3. Select your GitHub repository.
4. Vercel will automatically detect **Vite**:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Click **"Deploy"**. Your portfolio will be live with a free `*.vercel.app` URL in under a minute!

### Method 2: Deploy via Vercel CLI
From the root directory:
```bash
npx vercel
```
Follow the prompts and accept the default settings.

---

## 🔒 Owner Access

The portfolio contains a private management modal accessible by clicking the subtle lock / owner link in the footer or navigation. Access is strictly authenticated with a private owner PIN to protect against unauthorized edits. In owner mode, the owner can update profile information, manage projects, and review inquiries.

