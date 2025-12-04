# ImageWord Ministries - Admin Panel

A separate admin panel for managing church website content.

## Features

- 🔐 Secure authentication with Supabase Auth
- 📊 Dashboard with statistics
- 📅 Event management (CRUD)
- 🎥 Sermon management (CRUD)
- 👥 Ministry management (CRUD)
- 👤 Leadership team management (CRUD)
- 💬 Contact form submissions viewer
- 🙏 Prayer requests viewer
- ⚙️ Site settings editor
- 📁 File upload to Supabase Storage

## Setup

### 1. Install Dependencies

```bash
cd admin
npm install
```

### 2. Configure Environment

Copy `.env.local.example` to `.env.local` and fill in your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 3. Create Admin User

In Supabase Dashboard:

1. Go to **Authentication** > **Users**
2. Click **"Add user"**
3. Choose **"Create new user"**
4. Enter email and password
5. Click **"Create user"**

### 4. Run Development Server

```bash
npm run dev
```

Admin panel will run on: **http://localhost:3001**

## Project Structure

```
admin/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Login page
│   │   ├── dashboard/
│   │   │   ├── page.tsx          # Dashboard home
│   │   │   ├── events/           # Event management
│   │   │   ├── sermons/          # Sermon management
│   │   │   ├── ministries/       # Ministry management
│   │   │   ├── leadership/       # Leadership management
│   │   │   ├── contacts/         # Contact submissions
│   │   │   ├── prayers/          # Prayer requests
│   │   │   └── settings/         # Site settings
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── components/
│   │   └── DashboardLayout.tsx   # Admin layout with sidebar
│   └── lib/
│       └── supabase.ts           # Supabase client
├── package.json
├── tsconfig.json
└── tailwind.config.js
```

## Usage

### Login

1. Navigate to http://localhost:3001
2. Enter your admin email and password
3. Click "Sign In"

### Managing Content

#### Events
- View all events
- Create new events
- Edit existing events
- Delete events
- Upload event images

#### Sermons
- View all sermons
- Add new sermons
- Edit sermon details
- Upload thumbnails
- Add video/audio URLs

#### Ministries
- Manage ministry programs
- Update leader information
- Upload ministry photos

#### Leadership
- Add/edit team members
- Upload leader photos
- Manage bios and contact info

#### Site Settings
- Update church name and contact info
- Edit service times
- Update social media links
- Change logo

## Security

- Authentication required for all admin pages
- Row Level Security (RLS) enabled on database
- Service role key kept server-side only
- Automatic session management

## Deployment

### Option 1: Vercel (Recommended)

1. Push admin folder to separate Git repository
2. Import to Vercel
3. Set environment variables
4. Deploy

### Option 2: Subdomain

Deploy to: `admin.imagewordministries.org`

1. Configure DNS to point subdomain to deployment
2. Update CORS settings in Supabase if needed

## Development

### Adding New Pages

1. Create page in `src/app/dashboard/[page-name]/page.tsx`
2. Add route to navigation in `DashboardLayout.tsx`
3. Implement CRUD operations using Supabase client

### Styling

Uses TailwindCSS with same color scheme as main website.

## Troubleshooting

### "Missing Supabase environment variables"
- Check `.env.local` exists and has correct values
- Restart dev server after updating env vars

### "Authentication failed"
- Verify admin user exists in Supabase Auth
- Check email/password are correct
- Ensure Supabase URL and keys are correct

### Port 3001 already in use
```bash
npm run dev -- -p 3002
```

## Next Steps

- [ ] Complete CRUD pages for all content types
- [ ] Add file upload components
- [ ] Implement rich text editor for content
- [ ] Add image cropping/resizing
- [ ] Create analytics dashboard
- [ ] Add email notification settings
- [ ] Implement role-based access control

---

**Admin Panel v1.0.0**
