# 🎬 CineVerse SPA

A modern, responsive, and feature-rich movie catalog Single Page Application (SPA) built with React. CineVerse provides an intuitive interface for browsing, searching, filtering, and managing a curated movie collection with persistent client-side storage.

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
- **Version Control:** Git & GitHub

---

## 🚀 Getting Started

To run this project locally on your machine, follow these steps:

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your system.

### Installation & Running

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/your-username/cineverse.git](https://github.com/your-username/cineverse.git)
   cd cineverse