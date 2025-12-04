# ImageWord Ministries Website

A modern, responsive church website built with Next.js 14, featuring a complete admin panel for content management.

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-18-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-38B2AC?style=flat-square&logo=tailwind-css)
![Supabase](https://img.shields.io/badge/Supabase-Database-green?style=flat-square&logo=supabase)

## 🌟 Features

### Frontend
- **7 Dynamic Pages**: Home, About, Events, Sermons, Ministries, Contact, Donate
- **Hero Carousel**: Auto-rotating image slider with smooth transitions
- **Responsive Design**: Mobile-first approach, works on all devices
- **Smooth Animations**: Framer Motion powered transitions and effects
- **Contact Form**: Integrated form with database storage
- **SEO Optimized**: Meta tags and semantic HTML structure

### Admin Panel
- **Dashboard**: Overview of all content
- **Content Management**: Full CRUD for Events, Sermons, Ministries, Leadership
- **Media Storage**: Upload and manage images/videos via Supabase Storage
- **Contact Messages**: View and manage form submissions
- **Site Settings**: Update church info, service times, social links
- **Prayer Requests**: Manage prayer submissions

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| Next.js 14 | React Framework (App Router) |
| React 18 | UI Library |
| TypeScript | Type Safety |
| TailwindCSS | Styling |
| Framer Motion | Animations |
| Supabase | Database, Auth, Storage |
| Lucide React | Icons |

## 🎨 Brand Colors

| Color | Hex | Usage |
|-------|-----|-------|
| Primary Red | `#A70000` | Main CTAs, buttons, links |
| Bright Red | `#CC0000` | Gradients, navbar, energetic sections |
| Gray | `#808080` | Secondary text, subtle elements |
| Dark Gray | `#333333` | Footer, dark sections, headings |

## 📁 Project Structure

```
├── src/
│   ├── app/              # Next.js App Router pages
│   ├── components/       # Reusable React components
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utilities and Supabase client
│   └── contexts/         # React contexts
├── admin/                # Admin panel (separate Next.js app)
│   ├── src/
│   │   ├── app/          # Admin pages
│   │   ├── components/   # Admin components
│   │   └── lib/          # Admin utilities
├── public/               # Static assets
└── docs/                 # SQL scripts and documentation
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/imageword-ministries-website.git
   cd imageword-ministries-website
   ```

2. **Install dependencies**
   ```bash
   # Frontend
   npm install

   # Admin panel
   cd admin && npm install
   ```

3. **Set up environment variables**
   ```bash
   # Copy example files
   cp .env.example .env.local
   cp admin/.env.example admin/.env.local
   ```

4. **Configure Supabase**
   - Create a new Supabase project
   - Run the SQL scripts in `/docs` folder
   - Update `.env.local` with your credentials

5. **Run development servers**
   ```bash
   # Frontend (port 3000)
   npm run dev

   # Admin panel (port 3001)
   cd admin && npm run dev
   ```

## 🔧 Environment Variables

### Frontend (`.env.local`)
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### Admin (`admin/.env.local`)
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## 📦 Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Import project in Vercel
3. Set environment variables
4. Deploy

### Build Commands
```bash
# Frontend
npm run build

# Admin
cd admin && npm run build
```

## 📄 License

This project is proprietary software for ImageWord Ministries.

## 👨‍💻 Developer

Built with ❤️ for ImageWord Ministries

---

**Live Demo**: [Coming Soon]
**Admin Panel**: [Coming Soon]
