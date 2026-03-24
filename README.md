# 🐣 PetFit — Gamified Fitness Tracker

> Turn your fitness journey into a game.
> Build habits, track progress, and level up your virtual pet.

**Live Demo**: https://virtual-pet-fitness.vercel.app/

---

## 🚀 Overview

**PetFit** is a modern fitness tracking web app that combines **habit building, gamification, and a virtual pet system** to make consistency engaging and rewarding.

Instead of traditional tracking apps that feel repetitive, PetFit creates an emotional loop:

> **Your actions → Your pet evolves → You stay consistent**

---

## ✨ Key Highlights

* 🎮 **Gamified Experience** — XP system, streaks, achievements
* 🐣 **Virtual Pet System** — Progress directly affects your pet
* ⚡ **Real-time Feedback** — Instant updates across all views
* 🧠 **Smart UX** — Minimal friction logging (presets, quick actions)
* 📊 **Insightful Tracking** — Progress, trends, and predictions
* 🔐 **Authentication Ready** — Supabase-powered login system

---

## 🧩 Core Features

### 🏋️ Workout System

* Structured workout sessions + quick logging
* XP rewards tied to activity
* Streak tracking with milestone notifications

### 🍽️ Diet System

* Fast meal logging (presets + recent meals)
* Protein & calorie tracking
* Habit system (water, veggies, balance, etc.)

### 📊 Progress & Insights

* Activity feed (toast → history system)
* Monthly predictions
* XP and behavior trends

### 🐣 Pet System (Core Differentiator)

* Pet mood reflects user behavior
* XP-based progression
* Designed for future evolution & customization

### 👤 Profile System

* Centralized user identity + stats
* Activity history + progress summary
* Pet + performance in one view

---

## 🧠 System Design Insight

PetFit is built around a **single source of truth architecture**:

* `state.workouts` → drives progress, streaks, predictions
* Notifications → unified feedback system
* Derived views → reactive, no duplicated state

This ensures:

* consistency across features
* scalability for backend sync
* minimal bugs from state divergence

---

## 🛠️ Tech Stack

| Layer                 | Technology              |
| --------------------- | ----------------------- |
| Frontend              | Vue 3 (Composition API) |
| Styling               | Tailwind CSS            |
| State                 | Reactive local state    |
| Backend (in progress) | Supabase                |
| Auth                  | Supabase Auth           |

---

## 📸 Screens (optional)

> Add screenshots or GIFs here for better impact

---

## ⚡ Getting Started

```bash
# install dependencies
npm install

# run dev server
npm run dev
```

---

## 🔐 Environment Setup

Create a `.env` file:

```env
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

---

## 🧭 Roadmap

### Phase 1 — Core (✅ mostly complete)

* Workout tracking
* Diet system
* Profile + pet system
* Notification system

### Phase 2 — Backend Integration

* Supabase data sync
* User persistence across devices

### Phase 3 — Expansion

* 🧬 Pet evolution system
* 🎽 Wardrobe / customization
* 🏆 Advanced achievements
* 📱 Mobile app (Capacitor)

---

## 💡 Product Vision

Most fitness apps track data.
PetFit builds **behavior**.

By introducing a virtual companion, the app creates:

* emotional engagement
* habit reinforcement
* long-term consistency

---

## 🧪 What I Focused On

* Clean, scalable state architecture
* UX-first design (low friction input)
* Real-time reactivity across features
* Gamification without complexity

---

## 📌 Status

🚧 Actively developing
🔥 Core experience is stable and usable

---

## 🤝 Contributions

Open to feedback, ideas, and collaboration.

---

## 📄 License

MIT
## 👤 Author

Created by [Ben Ringia](https://github.com/benringia)
