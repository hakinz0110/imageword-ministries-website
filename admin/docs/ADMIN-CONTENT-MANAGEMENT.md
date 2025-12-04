# Admin Content Management Guide

## Overview

All site content is managed through the Supabase database, allowing admins to update content without touching code. This includes:

- Site information (church name, contact, social media)
- Events
- Sermons
- Ministries
- Leadership team
- Blog posts (optional)

## Site Settings Management

### What's Stored in Database

All site information is stored in the `site_settings` table:

| Setting Key | Description | Example |
|------------|-------------|---------|
| `church_name` | Official church name | ImageWord Ministries |
| `tagline` | Church tagline | Reconcile, Disciple, Empower |
| `mission_statement` | Mission statement | Rise Up - Embrace Purpose... |
| `contact_email` | Main contact email | info@imagewordministries.org |
| `contact_phone` | Main phone number | +1 (555) 123-4567 |
| `address_line1` | Street address | 123 Faith Street |
| `address_line2` | Suite/Unit | Suite 100 |
| `city` | City | Your City |
| `state` | State/Province | Your State |
| `zip` | Postal code | 12345 |
| `country` | Country | USA |
| `service_time_1` | First service time | Sunday 9:00 AM |
| `service_time_2` | Second service time | Sunday 11:00 AM |
| `service_time_3` | Third service time (optional) | Wednesday 7:00 PM |
| `facebook_url` | Facebook page URL | https://facebook.com/... |
| `instagram_url` | Instagram profile URL | https://instagram.com/... |
| `youtube_url` | YouTube channel URL | https://youtube.com/... |
| `twitter_url` | Twitter profile URL | https://twitter.com/... |
| `logo_url` | Church logo URL | https://supabase.co/storage/... |

### How to Update Settings

#### Option 1: Supabase Dashboard (Quick Updates)

1. Go to your Supabase project
2. Click **Table Editor** > **site_settings**
3. Find the row with the setting you want to update
4. Click the `value` field and edit
5. Press Enter to save
6. Changes appear on the website immediately

#### Option 2: SQL Editor (Bulk Updates)

```sql
-- Update contact information
UPDATE site_settings SET value = 'newemail@church.com' WHERE key = 'contact_email';
UPDATE site_settings SET value = '+1 (555) 999-8888' WHERE key = 'contact_phone';

-- Update social media
UPDATE site_settings SET value = 'https://facebook.com/yourpage' WHERE key = 'facebook_url';
UPDATE site_settings SET value = 'https://instagram.com/yourpage' WHERE key = 'instagram_url';

-- Update service times
UPDATE site_settings SET value = 'Sunday 10:00 AM' WHERE key = 'service_time_1';
UPDATE site_settings SET value = 'Sunday 6:00 PM' WHERE key = 'service_time_2';
```

## Content Management

### Events

**Table**: `events`

**Add New Event:**
```sql
INSERT INTO events (title, description, event_date, location, image_url, category, is_published)
VALUES (
  'Youth Conference 2025',
  'Three days of worship, teaching, and fellowship for young adults.',
  '2025-06-15 09:00:00',
  'Main Sanctuary',
  'https://your-image-url.jpg',
  'Youth',
  true
);
```

**Update Event:**
```sql
UPDATE events 
SET title = 'Updated Event Title', 
    event_date = '2025-07-01 10:00:00'
WHERE id = 'event-uuid-here';
```

**Delete Event:**
```sql
DELETE FROM events WHERE id = 'event-uuid-here';
```

### Sermons

**Table**: `sermons`

**Add New Sermon:**
```sql
INSERT INTO sermons (title, description, pastor, sermon_date, video_url, thumbnail_url, series_name, scripture_reference, is_published)
VALUES (
  'Walking in Faith',
  'Discovering what it means to truly trust God in every circumstance.',
  'Pastor John Smith',
  '2025-11-17',
  'https://youtube.com/watch?v=...',
  'https://your-thumbnail.jpg',
  'Faith Series',
  'Hebrews 11:1-6',
  true
);
```

### Ministries

**Table**: `ministries`

**Add New Ministry:**
```sql
INSERT INTO ministries (name, description, image_url, leader_name, category, display_order, is_active)
VALUES (
  'Prayer Ministry',
  'Interceding for our church and community through prayer.',
  'https://your-image.jpg',
  'Jane Doe',
  'Prayer',
  7,
  true
);
```

### Leadership

**Table**: `leadership`

**Add New Leader:**
```sql
INSERT INTO leadership (name, title, bio, image_url, email, display_order, is_active)
VALUES (
  'Pastor David Lee',
  'Youth Pastor',
  'Pastor David has been serving in youth ministry for 10 years...',
  'https://your-photo.jpg',
  'david@church.com',
  4,
  true
);
```

## Using Settings in Components

### Client Components (React Hooks)

```typescript
'use client'
import { useSiteSettingsContext } from '@/contexts/SiteSettingsContext'

export default function MyComponent() {
  const { settings, loading, error } = useSiteSettingsContext()

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div>
      <h1>{settings?.church_name}</h1>
      <p>{settings?.tagline}</p>
      <a href={`mailto:${settings?.contact_email}`}>Contact Us</a>
    </div>
  )
}
```

### Server Components

```typescript
import { getSiteSettings } from '@/lib/getSiteSettings'

export default async function MyServerComponent() {
  const settings = await getSiteSettings()

  return (
    <div>
      <h1>{settings?.church_name}</h1>
      <p>{settings?.mission_statement}</p>
    </div>
  )
}
```

## Admin Panel (Future Development)

For easier content management, you can build an admin panel with:

1. **Authentication**: Use Supabase Auth for admin login
2. **Dashboard**: Overview of all content
3. **Forms**: Easy editing of events, sermons, ministries
4. **File Upload**: Direct upload to Supabase Storage
5. **Preview**: See changes before publishing

### Recommended Admin Panel Features

- [ ] Login/logout functionality
- [ ] Dashboard with stats (total events, sermons, etc.)
- [ ] Event management (CRUD operations)
- [ ] Sermon management with video upload
- [ ] Ministry management
- [ ] Leadership team management
- [ ] Site settings editor
- [ ] Contact form submissions viewer
- [ ] Prayer requests viewer
- [ ] Newsletter subscriber list
- [ ] Donation records (read-only)

## Security Notes

- Only authenticated admin users should have write access
- Use Row Level Security (RLS) policies to protect data
- Never expose `SUPABASE_SERVICE_ROLE_KEY` in client-side code
- Regular backups of database recommended

## Quick Reference

### View All Settings
```sql
SELECT * FROM site_settings ORDER BY key;
```

### View Upcoming Events
```sql
SELECT * FROM events 
WHERE event_date >= NOW() AND is_published = true 
ORDER BY event_date;
```

### View Latest Sermons
```sql
SELECT * FROM sermons 
WHERE is_published = true 
ORDER BY sermon_date DESC 
LIMIT 10;
```

### View Active Ministries
```sql
SELECT * FROM ministries 
WHERE is_active = true 
ORDER BY display_order;
```

---

**Need Help?**
- Supabase Docs: https://supabase.com/docs
- SQL Tutorial: https://www.w3schools.com/sql/
