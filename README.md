<div align="center">

# 🎬 CineVerse

### Premium Movies & Streaming Showcase Platform · React & Vite

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-CineVerse-6366f1?style=for-the-badge)](https://cine-verse-parthag23.vercel.app/)
[![React](https://img.shields.io/badge/React-18-61dafb?style=flat-square&logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-6-646cff?style=flat-square&logo=vite)](https://vite.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38bdf8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-Animated-f43f5e?style=flat-square&logo=framermotion)](https://framer.com/motion)

**CineVerse** is a modern, high-end movie database and preview catalog web application. Integrating live TMDB API streams, glassmorphic layout panels, robust search parameters, and a custom Auth Context, it delivers a smooth cinematic discovery interface.

*Framer Motion Transitions · TMDB Streaming API · Custom Context Hooks · Elegant Loader States*

</div>

---

## ✨ Key Features

| Feature | Description |
|---------|-------------|
| 🎠 **Banner Carousel** | Interactive, auto-advancing banner slider featuring trending movies and visual backdrops. |
| 🔍 **Live Query Filter** | Instant client-side filters using category pills (Action, Sci-Fi, Horror, etc.). |
| 💅 **Premium Skeleton Loaders** | Content shimmer templates ensuring a polished visual state while loading data. |
| 🛡️ **Firebase Integration** | Unified sign-in framework supporting credential logins and Google Single Sign-On. |
| 📱 **Adaptive Sidebar** | Floating glass navbar for desktops that collapses to a touch-optimized bottom bar on mobile. |

---

## 🧱 Tech Stack

| Layer | Technology |
|-------|-----------|
| ⚛️ **UI Framework** | React 18 |
| ⚡ **Build System** | Vite |
| 🎨 **Styling** | Tailwind CSS v4 |
| ✨ **Animations** | Framer Motion |
| 📡 **API Client** | Axios |
| 🧭 **Routing** | React Router v6 |

---

## ⚙️ Getting Started

### Prerequisites
* **Node.js** 18+

### Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/ParthaG23/CineVerse.git
cd CineVerse/Client

# 2. Add Environment Variables
# Create a .env file with your TMDB and Firebase settings
# VITE_API_URL=your_api_url

# 3. Install packages
npm install

# 4. Start local server
npm run dev
```
App runs at → **http://localhost:5173**

---

## 🏗️ Architecture

```mermaid
graph TD
  A[React View] -->|useFetch Hook| B[Axios Handler]
  B -->|GET Request| C[TMDB REST API]
  C -->|JSON response| D[ContentContext Provider]
  D -->|State Broadcast| A
  E[Firebase Auth] -->|Google Credentials| F[AuthContext Provider]
  F -->|Sign-In State| A
```

---

## 🧑‍💻 Author

**Partha Gayen**

[![GitHub](https://img.shields.io/badge/GitHub-ParthaG23-181717?style=flat-square&logo=github)](https://github.com/ParthaG23)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Partha_Gayen-0A66C2?style=flat-square&logo=linkedin)](https://www.linkedin.com/in/partha-gayen)

---

## 📜 License

This project is licensed under the **MIT License**.
