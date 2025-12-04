# ImageWord Ministries - Admin Panel Documentation

This folder contains documentation for the **admin panel** (content management system).

## 📚 Documentation Files

- **[README.md](../README.md)** - Admin panel overview and setup (in admin root)
- **[PROGRESS.md](./PROGRESS.md)** - Build progress and feature checklist
- **[ADMIN-CONTENT-MANAGEMENT.md](./ADMIN-CONTENT-MANAGEMENT.md)** - Guide to managing content via admin panel

## 🗂️ Admin Panel Structure

```
admin/
├── docs/                           # Admin documentation (you are here)
│   ├── README.md
│   ├── PROGRESS.md
│   └── ADMIN-CONTENT-MANAGEMENT.md
├── src/
│   ├── app/
│   │   ├── page.tsx               # Login page
│   │   ├── dashboard/
│   │   │   ├── page.tsx           # Dashboard home
│   │   │   ├── events/            # Events management
│   │   │   ├── sermons/           # Sermons management
│   │   │   ├── ministries/        # Ministries management (coming soon)
│   │   │   ├── leadership/        # Leadership management (coming soon)
│   │   │   ├── contacts/          # Contact messages (coming soon)
│   │   │   ├── prayers/           # Prayer requests (coming soon)
│   │   │   └── settings/          # Site settings (coming soon)
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── components/
│   │   └── DashboardLayout.tsx    # Admin layout with sidebar
│   └── lib/
│       └── supabase.ts            # Supabase client
├── package.json
├── .env.local
└── README.md
```

## 🚀 Quick Start

1. **Install Dependencies**
   ```bash
   cd admin
   npm install
   ```

2. **Configure Environment**
   - Copy `.env.local.example` to `.env.local`
   - Add your Supabase credentials

3. **Create Admin User**
   - Go to Supabase Dashboard > Authentication > Users
   - Click "Add user" and create an admin account

4. **Run Admin Panel**
   ```bash
   npm run dev
   ```
   - Admin panel runs on: http://localhost:3001

## 📖 Documentation Guide

### For Setup
- Read `../README.md` (admin root) for installation and configuration

### For Content Management
- Read `ADMIN-CONTENT-MANAGEMENT.md` for how to manage content

### For Development Progress
- Read `PROGRESS.md` for feature status and roadmap

## ✅ Current Features

- ✅ Authentication (login/logout)
- ✅ Dashboard with statistics
- ✅ Events management (full CRUD)
- ✅ Sermons management (list view)
- 🚧 Sermons create/edit forms (in progress)
- ⏳ Ministries management (planned)
- ⏳ Leadership management (planned)
- ⏳ Site settings editor (planned)
- ⏳ Contact messages viewer (planned)
- ⏳ Prayer requests viewer (planned)

## 🔗 Related Documentation

For main website documentation, see:
- `../../docs/` - Main website docs
- `../../README.md` - Project overview

---

**Admin Panel Documentation**
