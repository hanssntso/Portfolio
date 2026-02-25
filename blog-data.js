/* ===================================
   BLOG DATA REGISTRY
   Alan Timothy Lie Hans Santoso
   ===================================

   HOW TO ADD A NEW BLOG POST
   ==========================

   STEP 1: Create a folder for your blog post
   -------------------------------------------
   Create a new folder inside the "blogs/" directory.
   Name it using a short slug (lowercase, hyphens instead of spaces).

   Example:
     blogs/coastal-resilience-study/

   STEP 2: Add your content file
   ------------------------------
   Create a file named "content.html" inside your blog folder.
   This file should contain ONLY the body content of your blog
   (no <html>, <head>, or <body> tags needed).

   You can write your content using standard HTML tags:
     <p>       - Paragraphs
     <h2>, <h3> - Section headings
     <img>      - Images
     <ul>, <ol> - Lists
     <blockquote> - Quotes
     <strong>, <em> - Bold, italic

   See "blogs/template/content.html" for a full example.

   STEP 3: Add images
   -------------------
   Place all images for the blog post in the same folder.
   Reference them in your content.html using relative paths:

     <img src="blogs/coastal-resilience-study/photo1.jpg" alt="Description">

   The FIRST image in your blog will work well as the thumbnail.
   Set the "thumbnail" field below to that image path.

   STEP 4: Register the blog post below
   --------------------------------------
   Add a new entry to the "blogPosts" array below.
   Copy the template entry and fill in your details.

   STEP 5: Test locally
   ---------------------
   Open blog.html in your browser to verify everything looks correct.

   ==========================
   ALTERNATIVE: DOCX/PDF TO HTML CONVERSION
   ==========================

   If you prefer writing in Word/Google Docs instead of raw HTML:

   Option A - Online converter (Easiest):
     1. Write your blog in Google Docs or MS Word
     2. Go to https://wordhtml.com or https://html-cleaner.com
     3. Paste your document content
     4. Copy the generated HTML
     5. Paste it into your content.html file
     6. Manually add <img> tags for any images

   Option B - Pandoc command-line tool (More control):
     1. Install Pandoc: https://pandoc.org/installing.html
     2. Run: pandoc your-blog.docx -o content.html --extract-media=.
     3. Move the generated content.html and images to your blog folder
     4. Update image paths in content.html to match your folder structure

   Note: After conversion, you may need to clean up the HTML slightly
   and add your images manually with proper paths.

   ==========================
   NOTES ON LIKES & VIEWS
   ==========================

   Likes and views are stored in each visitor's browser (localStorage).
   This means:
   - Each person can like a blog post once per browser
   - View counts increment once per browser session per post
   - Counts are NOT shared across different visitors' browsers

   For shared/global counters visible to all visitors, you would need
   a backend service. Some free options:
   - Firebase Realtime Database (free tier)
   - Supabase (free tier)
   - CountAPI or similar free counting services

   =================================== */

// Maximum number of blog posts shown per page
var BLOGS_PER_PAGE = 10;

// Blog posts data array
// Add new entries here to publish blog posts
var blogPosts = [

    // =============================================
    // TEMPLATE - Copy this block for each new post
    // =============================================
    // {
    //     id: 1,                                          // Unique number (increment for each post)
    //     slug: "my-first-blog-post",                     // URL-friendly name (lowercase, hyphens)
    //     title: "My First Blog Post Title",              // Display title
    //     date: "2026-03-01",                             // Publication date (YYYY-MM-DD)
    //     summary: "A brief 1-2 sentence description of what this blog post covers.",
    //     tags: ["engineering", "research"],               // Category tags (1-3 recommended)
    //     thumbnail: "blogs/my-first-blog-post/cover.jpg", // Path to thumbnail image
    //     contentFile: "blogs/my-first-blog-post/content.html"  // Path to content file
    // },

];
