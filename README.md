# Futuristic Screensaver & Interactive Dashboard (`Protetor de Tela Futurista`)

<img width="1318" height="773" alt="image" src="https://github.com/user-attachments/assets/8f654fe8-0fa2-466e-9d20-22c00e95b9ca" />


An ultra-polished, highly interactive, fullscreen sci-fi dashboard and screensaver UI. It blends bio-digital designs, cyber telemetry coordinates, and sleek floating windows. The user interface features modular, elegant hud displays including real-time weather tracking, financial indicators, interactive alarms, standard countdown reminders, a customizable ambient MP3 player, and a streamlined YouTube backing widget.

---

## Design Theme Modes

Users can seamlessly swap styles on the fly using the **Floating Theme Selector** button in the bottom right:

1. **Glassmorphic Flow (Premium)**  
   *Translucent frosted glass panels floating atop high depth-of-field, glowing fluid cyan and moody-blue gradients. Perfect for a premium, clean, high-tech aesthetic, complete with line graph visualizer modules and custom drop shadows.*
2. **Neon Grid (Cyberpunk)**  
   *A glowing cyber grid with a scrolling grid line perspective and floating coordinates in neon magenta and cyan.*
3. **Disruptive Dash**  
   *An industrial look featuring warning stripes, high-contrast hazard yellow borders, target crosshair mouse locators, and real-time telemetry analytics labels.*
4. **Monochrome Stealth**  
   *A dark minimalist theme with clean chalky off-white typography, zero glowing accents, and high-visibility digital layout parameters.*

---

##  Features

- **Full-Screen Ambient Screensaver / HUD Layout**: Clean space division and negative margins styled for desktop and mobile fidelity.
- **Dynamic Clock & Alarm Widget**: Track local time, current state, active timers, and configure customizable audio alarms.
- **Glassmorphic Interactive Showroom**: Experience pre-rendered concept designs of the premium **Glassmorphic Flow Design System** directly in the setup modal.
- **Real-time Weather Forecast Widget**: Simulated high-fidelity data matching localized criteria with wind speed, temperature fluctuations, and humidity.
- **Web3 & Financial Index Tracker**: Custom-drawn canvas graphs monitoring tickers with dynamic fluctuating curves.
- **Mp3 Audio & Synthesizer Station**: Integrated ambient music controls supporting interactive playbacks.
- **YouTube Media Background Control**: Connect customizable audio loops to set the ideal workspace mood.
- **Cathode-Ray Tube (CRT) Filter Toggle**: Switch on scan lines and phosphor bloom directly from the menu.

---

##  Security & Safe Pushing
This application is **100% clean and safe** for pushing directly to public hosting providers like GitHub:
- **No Hardcoded API Keys**: All state arrays or map element identification properties key values are strictly local programming properties. No real passwords, secret tokens, or sensitive values are committed in plain text.
- **Strict `.gitignore` Boundaries**: Built-in instructions fully ignore local `.env` variations, ensuring your unique local API credentials or keys are never exposed.

---

##  Local Installation Guide

Follow these simple steps to run the interactive dashboard in your local terminal:

### 1. Prerequisites
Ensure you have **Node.js** installed on your workstation (recommend Node.js `v18.x` or higher) alongside **npm**.

- Download Node.js from [nodejs.org](https://nodejs.org/)

### 2. Clone and Clean
Clone this repository to your computer and navigate to the directory:

```bash
git clone <your-repository-url>
cd react-example
```

### 3. Setup Environment Variables
Clone the provided environment blueprint. Create your own local `.env` file to customize parameters without leaking private credentials:

```bash
cp .env.example .env
```

Open the new `.env` file in your preferred text editor:
```env
# Define your secure Gemini developer credential.
# (This file is ignored by git for safety)
GEMINI_API_KEY="your_api_key_goes_here"
```

### 4. Install Dependencies
Initialize and sync the node modules folder:

```bash
npm install
```

### 5. Run the Local Development Server
Boot up the high-speed Vite server locally:

```bash
npm run dev
```

The output terminal will expose the local staging target link (defaults to `http://localhost:3000`). Grab the link and view the interactive panels in your browser!

### 6. Build for Production
To package the app into fully optimized static production HTML/JS bundles:

```bash
npm run build
```
The compilation results will output cleanly into the `/dist` directory, ready to deploy to Netlify, Vercel, Firebase Hosting, Cloud Run, or GitHub Pages.

---

## 🛠️ Tech Stack & Architecture

- **Core Engine**: [Vite](https://vite.dev/) & [React 19](https://react.dev/) using **TypeScript** for absolute compiling safety.
- **Interactions**: Functional state control with custom React Hooks and localized browser database indices to remember custom user goals across reloads.
- **Visuals & Layout**: Fully styled via utility-first [Tailwind CSS v4](https://tailwindcss.com/) alongside custom interactive canvas animations.
- **Animations**: Driven via [Motion (formerly Framer Motion)](https://motion.dev/) for smooth UI entry states and modal triggers.
- **Icons Elements**: Sourced from [Lucide React](https://lucide.dev/).
