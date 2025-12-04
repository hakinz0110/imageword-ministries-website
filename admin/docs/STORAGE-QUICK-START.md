# Storage Browser - Quick Start

## ✅ What's New

You now have **two separate file management systems**:

### 1. 📸 Media Manager (`/dashboard/media`)
- Manage church logo
- Manage homepage carousel images
- Simple, focused interface

### 2. 🗄️ Storage Browser (`/dashboard/storage`)
- Browse ALL files in Supabase storage
- Navigate folders like Windows Explorer
- Upload, delete, search files
- Get file URLs instantly

---

## 🚀 Quick Usage

### Upload a File to an Event

**Before** (old way):
1. Click upload area
2. Select file from computer
3. Wait for upload
4. Done

**Now** (three options):
1. **Upload new file** - Same as before
2. **Browse Storage** - Pick from existing files ✨ NEW
3. **Enter URL** - Paste external link

### Browse All Files

1. Go to **Storage** in sidebar
2. Select a bucket (Images, Documents, etc.)
3. Navigate folders
4. Upload/delete/search files
5. Click "Select" to use a file

---

## 📁 File Organization

### Recommended Structure
```
project_image/
├── events/
│   ├── 2024/
│   └── 2025/
├── ministries/
│   ├── youth/
│   └── worship/
└── general/

documents/
├── flyers/
└── bulletins/
```

### Naming Convention
✅ `easter-service-2024.jpg`  
✅ `youth-retreat-flyer.pdf`  
❌ `IMG_1234.jpg`  
❌ `Untitled.png`

---

## 💡 Pro Tips

### Avoid Duplicate Uploads
Before uploading a new file:
1. Click "Browse Storage"
2. Check if file already exists
3. Reuse existing file if found

### Get File URLs
1. Go to Storage
2. Navigate to file
3. Click file to select
4. URL is in the format:
   ```
   https://[project].supabase.co/storage/v1/object/public/[bucket]/[path]
   ```

### Organize by Date
Create folders by year/month:
- `events/2024/december/`
- `sermons/2025/january/`

---

## 🎯 Common Tasks

### Task: Add Image to Event
1. Create/Edit Event
2. Scroll to "Event Image"
3. Click "Browse Storage"
4. Navigate to `project_image/events/`
5. Select image or upload new
6. Save event

### Task: Upload Sermon Video
1. Go to Storage
2. Select "Videos" bucket
3. Navigate to `sermons/` folder
4. Click "Upload"
5. Select video file
6. Copy URL for use

### Task: Delete Old Files
1. Go to Storage
2. Select bucket
3. Navigate to file
4. Hover and click trash icon
5. Confirm deletion

---

## 🔧 Troubleshooting

**Files not showing?**
- Click refresh button (↻)
- Check you're in correct bucket
- Verify upload completed

**Can't upload?**
- Check file size (Images: 5MB, Docs: 10MB)
- Verify file type is allowed
- Check internet connection

**File deleted by accident?**
- No undo available
- Check Supabase Dashboard for backups
- Re-upload if needed

---

## 📊 Storage Buckets

| Bucket | Purpose | Max Size |
|--------|---------|----------|
| `project_image` | Event images, photos | 5MB |
| `project_logo` | Logos, branding | 2MB |
| `documents` | PDFs, flyers | 10MB |
| `videos` | Sermon videos | External hosting recommended |
| `audio` | Sermon audio | External hosting recommended |

---

## ✨ Benefits

**For You:**
- ✅ No more duplicate uploads
- ✅ Reuse existing files easily
- ✅ Better file organization
- ✅ Visual file browser
- ✅ Quick file discovery

**For Your Storage:**
- ✅ Less wasted space
- ✅ Organized structure
- ✅ Easy to find files
- ✅ Consistent URLs

---

## 🎓 Next Steps

1. **Explore Storage** - Click around and get familiar
2. **Organize Files** - Create folder structure
3. **Upload Content** - Add your media files
4. **Use Browse Feature** - Try picking existing files
5. **Clean Up** - Delete unused files

---

**Need Help?** See full documentation in `STORAGE-GUIDE.md`

**Last Updated**: November 28, 2025
