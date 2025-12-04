# Storage & Media Management Guide

## Overview

The admin panel now has **two separate systems** for managing files:

### 1. Media Manager (`/dashboard/media`)
**Purpose**: Manage site-specific media like logos and carousel images

**Features**:
- Upload and manage church logo
- Manage hero carousel images
- Direct integration with site settings
- Simplified interface for non-technical users

**Use this for**:
- Updating the church logo
- Managing homepage carousel/hero images
- Site branding assets

---

### 2. Storage Browser (`/dashboard/storage`)
**Purpose**: Browse and manage all files in Supabase storage buckets

**Features**:
- Supabase-like interface for browsing storage
- Navigate through folders and buckets
- Upload, download, and delete files
- View file metadata (size, date, type)
- Search functionality
- Direct file URL access

**Available Buckets**:
- `project_image` - Event images, ministry photos, etc.
- `project_logo` - Church logos and branding
- `documents` - PDFs, flyers, and documents
- `videos` - Sermon videos and media
- `audio` - Sermon audio and music

**Use this for**:
- Managing event images
- Organizing sermon media
- Uploading documents and flyers
- Browsing all uploaded files
- Getting file URLs for content

---

## File Upload Workflow

When uploading files anywhere in the admin panel (events, sermons, etc.), you now have **three options**:

### Option 1: Direct Upload
1. Click or drag-and-drop a file into the upload area
2. File uploads directly to Supabase storage
3. URL is automatically generated and used

### Option 2: Browse Storage
1. Click the **"Browse Storage"** button
2. Navigate through folders in the storage browser
3. Select an existing file
4. File URL is automatically populated

### Option 3: Enter URL
1. Paste an external URL (from any source)
2. URL is used directly without uploading

---

## Storage Browser Features

### Navigation
- **Breadcrumb navigation**: Click any folder in the path to jump back
- **Folder browsing**: Click folders to navigate deeper
- **Home button**: Return to bucket root instantly

### File Management
- **Upload**: Click "Upload" button in the top-right
- **Delete**: Hover over a file and click the trash icon
- **Download**: Hover over a file and click the download icon
- **Search**: Use the search bar to filter files by name

### Selection Mode
When opened from a file upload component:
- Files show a "Select" button
- Selected file is highlighted
- Click "Select" to use that file
- Modal closes automatically

---

## Best Practices

### Organizing Files
1. **Use folders**: Create folders for different content types
   - `events/2024/`
   - `sermons/series-name/`
   - `ministries/youth/`

2. **Naming conventions**: Use descriptive, lowercase names
   - ✅ `easter-service-2024.jpg`
   - ❌ `IMG_1234.jpg`

3. **File sizes**: Optimize images before uploading
   - Images: < 5MB
   - Documents: < 10MB
   - Videos: Consider external hosting (YouTube, Vimeo)

### When to Use Each System

**Use Media Manager when**:
- Updating site-wide branding
- Managing homepage carousel
- Non-technical staff need simple interface

**Use Storage Browser when**:
- Uploading event/sermon media
- Organizing content by folders
- Need to browse all files
- Getting URLs for existing files
- Managing large file collections

---

## Technical Details

### File URLs
All uploaded files get a public URL in this format:
```
https://[project].supabase.co/storage/v1/object/public/[bucket]/[path]/[filename]
```

### Storage Structure
```
project_image/
├── events/
│   ├── 2024/
│   └── 2025/
├── ministries/
└── general/

documents/
├── flyers/
└── bulletins/

videos/
└── sermons/

audio/
└── sermons/
```

### Integration
- FileUpload component automatically includes Storage Browser
- All file uploads support browsing existing files
- URLs are stored in database, files in Supabase Storage
- Row Level Security (RLS) controls access

---

## Troubleshooting

### "Failed to load files"
- Check Supabase connection
- Verify bucket exists in Supabase Dashboard
- Check RLS policies allow reading

### "Failed to upload"
- Check file size limits
- Verify bucket has public access
- Check RLS policies allow inserting

### "File not showing after upload"
- Click the refresh button
- Check you're in the correct folder
- Verify upload completed successfully

---

## Future Enhancements

Planned features:
- [ ] Bulk file upload
- [ ] File renaming
- [ ] Folder creation from UI
- [ ] Image preview/lightbox
- [ ] File metadata editing
- [ ] Usage statistics
- [ ] Duplicate file detection

---

**Last Updated**: November 28, 2025
