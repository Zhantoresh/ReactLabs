# 🎬 CineVerse SPA

A modern, responsive, and feature-rich movie catalog Single Page Application (SPA) built with React. CineVerse provides an intuitive interface for browsing, searching, filtering, and managing a curated movie collection with persistent client-side storage.

🔗 **Live Demo:** [https://zhantoresh.github.io/ReactLabs/](https://zhantoresh.github.io/ReactLabs/)

---

## ✨ Key Features

- **Dynamic Movie Catalog & Pagination:** Smooth pagination system that dynamically recalculates total pages upon adding or deleting records.
- **Advanced Search & Filtering:** 
  - Real-time live search by movie title and director.
  - Category filtering by genres (Action, Drama, Sci-Fi, Comedy, Crime, Animation).
  - Multi-criteria sorting (by title alphabetically, release year, and rating).
- **Interactive Details Modal:** Click on any movie card to view comprehensive plot summaries, ratings, and release details.
- **Robust CRUD Operations:**
  - **Create:** Clean, validated form for adding new custom movies with automated high-quality poster assignment.
  - **Delete:** Universal deletion support for both default and custom records with instant UI synchronization.
- **Strict Input Validation:** Client-side safety checks preventing invalid entries (e.g., restricted release years between 1895–2030, ratings from 0 to 10, and text validation for director names).
- **Persistent State Management:** Uses browser `localStorage` as a Single Source of Truth (`cineverse_movies`) combined with a robust initialization and synchronization lifecycle (`refreshKey` state strategy).

---

## 🛠️ Tech Stack

- **Core:** React (Vite)
- **Language:** JavaScript (ES6+)
- **Styling:** CSS3 (Custom Responsive Layouts, Flexbox/Grid)
- **Data Persistence:** Browser LocalStorage API
- **Deployment:** GitHub Pages
- **Version Control:** Git & GitHub

---

## 🚀 Getting Started

To run this project locally on your machine, follow these steps:

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your system.

### Installation & Running

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Zhantoresh/ReactLabs.git
   cd ReactLabs
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to the local URL provided by Vite (typically `http://localhost:5173`).

---

## 🏗️ Architecture & Design Decisions

- **Single Source of Truth (`localStorage`):** The app initializes baseline movie data on the first launch and seamlessly merges user-generated records, ensuring data persists across browser sessions.
- **UX-Focused Form Design:** Minimized cognitive load for users by stripping away unnecessary manual image URL inputs and complex fields, replacing them with reliable default fallbacks and automated validations.
- **Optimized Re-renders:** Utilizes a custom `refreshKey` tracking mechanism to trigger precise component updates and recalculate pagination limits immediately after state mutations.

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).