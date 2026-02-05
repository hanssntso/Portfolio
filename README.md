# Alan Timothy Lie Hans Santoso - Portfolio Website

A professional portfolio website showcasing engineering problem-solving expertise, research, and projects. Built with clean HTML, CSS, and JavaScript featuring a navy blue and brown color scheme.

## Design Features

- **Single-page vertical scroll** layout
- **Problem - Process - Outcome** project structure
- **Navy blue & brown** professional color palette
- **Fully responsive** design (mobile, tablet, desktop)
- **Smooth animations** and scroll effects
- **Engineering-focused** professional presentation

## File Structure

```
portfolio/
├── index.html          # Main HTML file
├── style.css           # Complete stylesheet
├── script.js           # JavaScript interactions
├── README.md           # This file
├── IMAGE-GUIDE.md      # Photo preparation guide
├── DEPLOYMENT-CHECKLIST.md  # Step-by-step deployment
└── images/             # Your photos and images folder
    ├── profile-photo.jpg
    ├── kmitl-campus.jpg
    ├── ministry-before.jpg
    ├── ministry-process.jpg
    ├── ministry-after.jpg
    ├── batik-solo-bus.jpg
    ├── transport-analysis.jpg
    ├── transport-results.jpg
    ├── highway-construction.jpg
    ├── highway-inspection.jpg
    ├── highway-completed.jpg
    ├── event-1.jpg
    ├── event-2.jpg
    ├── event-3.jpg
    ├── event-4.jpg
    ├── event-5.jpg
    └── event-6.jpg
```

## Quick Start Guide

### Step 1: Create GitHub Account (if you don't have one)
1. Go to [github.com](https://github.com)
2. Click "Sign up"
3. Complete registration

### Step 2: Create Repository
1. Click the "+" icon (top right) - "New repository"
2. **Repository name:** `yourusername.github.io` (replace `yourusername` with your actual GitHub username)
3. Set to **Public**
4. Check "Add a README file"
5. Click "Create repository"

### Step 3: Upload Files
1. In your repository, click "Add file" - "Upload files"
2. Drag and drop these files:
   - `index.html`
   - `style.css`
   - `script.js`
3. Add commit message: "Initial portfolio upload"
4. Click "Commit changes"

### Step 4: Create Images Folder
1. In your repository, click "Add file" - "Create new file"
2. Type `images/placeholder.txt` (this creates the folder)
3. Add some text in the file
4. Click "Commit new file"

### Step 5: Upload Your Images
1. Click into the `images` folder
2. Click "Add file" - "Upload files"
3. Upload all your photos (see Image Requirements section below)
4. Commit changes

### Step 6: Enable GitHub Pages
1. Go to repository **Settings**
2. Scroll to **Pages** section (left sidebar)
3. Under "Source", select **main** branch
4. Click **Save**
5. Wait 2-3 minutes
6. Your site will be live at: `https://yourusername.github.io`

## Image Requirements

### Required Images & Specifications

#### Profile Section
- `profile-photo.jpg` - Square format, 500x500px minimum
  - Professional headshot or field photo
  - Clear, well-lit, engineering context preferred

#### Research Section
- `kmitl-campus.jpg` - Landscape, 1200x800px minimum
  - Wide angle of KMITL campus or research facility
  - High quality, professional

#### Ministry of Education Project
- `ministry-before.jpg` - Any aspect ratio, 1200px width minimum
- `ministry-process.jpg` - Any aspect ratio, 1200px width minimum
- `ministry-after.jpg` - Any aspect ratio, 1200px width minimum

#### Batik Solo Trans Project
- `batik-solo-bus.jpg` - Any aspect ratio, 1200px width minimum
- `transport-analysis.jpg` - Any aspect ratio, 1200px width minimum
- `transport-results.jpg` - Any aspect ratio, 1200px width minimum

#### Highway Infrastructure Project
- `highway-construction.jpg` - Any aspect ratio, 1200px width minimum
- `highway-inspection.jpg` - Any aspect ratio, 1200px width minimum
- `highway-completed.jpg` - Any aspect ratio, 1200px width minimum

#### Events & Organizations
- `event-1.jpg` through `event-6.jpg` - Square format preferred, 800x800px minimum

### Image Optimization Tips
- Use high-quality images (not blurry or pixelated)
- Keep file sizes under 500KB each (use online compressors like TinyPNG)
- Use JPG format for photos
- Ensure good lighting and composition
- Professional context preferred

## Customization Guide

### Changing Text Content

Open `index.html` in any text editor and look for these sections:

#### 1. Hero Section
```html
<h1 class="hero-name">ALAN TIMOTHY LIE HANS SANTOSO</h1>
<p class="hero-tagline">Your custom tagline here</p>
```

#### 2. Contact Information
Update all instances of:
- Email: `hanssntso@gmail.com`
- Phone: `+6683856838811`
- Link: `https://lynk.id/hanssntso`

#### 3. Research Description
```html
<div class="research-description">
    <p>Update your research description here...</p>
</div>
```

### Changing Colors

Open `style.css` and modify the `:root` variables at the top:

```css
:root {
    --deep-navy: #1A2332;      /* Main dark background */
    --navy-accent: #2C3E50;    /* Secondary dark sections */
    --warm-brown: #8B6F47;     /* Primary accent color */
    --bronze: #B8956A;         /* Secondary accent */
    --cream: #F5F5F0;          /* Light background & text */
    --accent-gold: #C9A961;    /* Highlight color */
}
```

### Changing Fonts

In `style.css`, modify:
```css
:root {
    --font-heading: 'Inter', sans-serif;
    --font-body: 'Open Sans', sans-serif;
}
```

To use different Google Fonts:
1. Go to [Google Fonts](https://fonts.google.com)
2. Select your fonts
3. Copy the `<link>` tag to `index.html` `<head>` section
4. Update the CSS variable names

## Testing Your Website

### Local Testing (Before Publishing)
1. Open `index.html` directly in your web browser
2. Test all links and navigation
3. Check on different screen sizes (resize browser window)
4. Test on mobile device

### Online Testing (After Publishing)
1. Visit `https://yourusername.github.io`
2. Test on multiple devices:
   - Desktop (Chrome, Firefox, Safari)
   - Tablet (iPad, Android tablet)
   - Mobile (iPhone, Android phone)
3. Check loading speed: [PageSpeed Insights](https://pagespeed.web.dev/)
4. Validate HTML: [W3C Validator](https://validator.w3.org/)

## Troubleshooting

### Images Not Showing
- Check file names match exactly (case-sensitive)
- Ensure images are in `images/` folder
- Verify file extensions (.jpg, not .jpeg)
- Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)

### Website Not Published
- Wait 5-10 minutes after enabling GitHub Pages
- Check repository is set to Public
- Verify repository name is exactly `yourusername.github.io`
- Check GitHub Pages settings shows green checkmark

### Layout Broken on Mobile
- Ensure viewport meta tag is present in `<head>`
- Test responsive breakpoints in CSS
- Check browser console for errors (F12)

### Links Not Working
- Verify all `href` attributes are correct
- Check for typos in section IDs
- Ensure smooth scroll JavaScript is loaded

## Updating Your Portfolio

### To Update Content:
1. Go to your GitHub repository
2. Click on the file you want to edit (e.g., `index.html`)
3. Click the pencil icon (Edit)
4. Make your changes
5. Scroll down, add commit message
6. Click "Commit changes"
7. Changes appear live in 1-2 minutes

### To Update Images:
1. Go to `images/` folder in repository
2. Delete old image (click image - three dots - Delete)
3. Upload new image with same filename
4. Commit changes

## Helpful Resources

### Links:
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [HTML Reference](https://developer.mozilla.org/en-US/docs/Web/HTML)
- [CSS Reference](https://developer.mozilla.org/en-US/docs/Web/CSS)
- [JavaScript Reference](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

### Free Image Editors:
- [Photopea](https://www.photopea.com/) - Online Photoshop alternative
- [GIMP](https://www.gimp.org/) - Desktop image editor
- [Canva](https://www.canva.com/) - Easy design tool

### Free Image Compression:
- [TinyPNG](https://tinypng.com/)
- [Squoosh](https://squoosh.app/)
- [Compressor.io](https://compressor.io/)

## Checklist Before Going Live

- [ ] All personal information updated
- [ ] All images uploaded and displaying correctly
- [ ] Contact information is accurate
- [ ] All links tested and working
- [ ] Mobile responsive tested
- [ ] Spelling and grammar checked
- [ ] Project descriptions are accurate
- [ ] Image file sizes optimized (under 500KB each)
- [ ] Tested on multiple browsers
- [ ] GitHub Pages enabled and site is live
- [ ] Shared link with friends for feedback

---

**Created by:** Alan Timothy Lie Hans Santoso
**Last Updated:** February 2025
**Version:** 1.0
