# 🙏 ImageWord Ministries - Church Website

A modern, full-stack church website built with Next.js 14, featuring a complete content management system for sermons, events, ministries, and more.

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-06B6D4?style=flat-square&logo=tailwindcss)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=flat-square&logo=supabase)

## ✨ Features

### Public Website
- **Home Page** - Hero carousel, featured sermons, upcoming events
- **About Page** - Church history, mission, leadership team
- **Sermons Page** - Searchable sermon archive with video/audio playback
- **Events Page** - Upcoming events with registration
- **Ministries Page** - Ministry programs and volunteer opportunities
- **Contact Page** - Contact form with prayer request submission
- **Responsive Design** - Mobile-first, works on all devices

### Admin Dashboard
- **Content Management** - Full CRUD for all content types
- **Media Library** - Upload and manage images, videos, audio
- **Settings Panel** - Site-wide configuration
- **Authentication** - Secure admin access with Supabase Auth

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| Frontend | Next.js 14, React 18, TypeScript |
| Styling | TailwindCSS, Framer Motion |
| Backend | Supabase (PostgreSQL, Storage, Auth) |
| Icons | Lucide React |
| Deployment | Vercel |

## 📸 Screenshots

<!-- Add your screenshots here -->
```
/screenshots
  ├── home.png
  ├── sermons.png
  ├── events.png
  ├── admin-dashboard.png
  └── mobile-view.png
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account

### Installation

1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/imageword-ministries.git
cd imageword-ministries
```

2. Install dependencies
```bash
npm install
cd admin && npm install && cd ..
```

3. Set up environment variables
```bash
cp .env.example .env.local
cp admin/.env.example admin/.env.local
# Edit both files with your Supabase credentials
```

4. Run development server
```bash
# Frontend (port 3000)
npm run dev

# Admin Panel (port 3001)
cd admin && npm run dev
```

## 📁 Project Structure

```
imageword-ministries/
├── src/
│   ├── app/              # Next.js App Router pages
│   ├── components/       # Reusable React components
│   ├── lib/              # Utilities & Supabase client
│   └── hooks/            # Custom React hooks
├── admin/
│   └── src/
│       ├── app/          # Admin dashboard pages
│       ├── components/   # Admin components
│       └── lib/          # Admin utilities
├── public/               # Static assets
└── docs/                 # Documentation
```

## 🎨 Design System

- **Primary Color**: #A70000 (Brand Red)
- **Display Font**: CityDBol / Montserrat Bold
- **Body Font**: Montserrat
- **Animations**: Framer Motion

## 📝 License

This project is for portfolio demonstration purposes.

## 👤 Author

**Your Name**
- Portfolio: [your-portfolio.com](https://your-portfolio.com)
- LinkedIn: [linkedin.com/in/yourprofile](https://linkedin.com/in/yourprofile)
- GitHub: [@yourusername](https://github.com/yourusername)

---

⭐ If you found this project interesting, please consider giving it a star!
