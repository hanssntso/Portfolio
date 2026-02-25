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

    {
        id: 1,
        slug: "blog-post-1",
        title: "Stay Tuned for Upcoming Blog Posts",
        date: "2026-03-01",
        summary: "Exciting content is on the way! This space will feature insights on civil engineering, sustainable infrastructure, and doctoral research.",
        tags: ["coming soon"],
        thumbnail: "",
        contentFile: "blogs/content-1.html"
    },
    {
        id: 2,
        slug: "blog-post-2",
        title: "Stay Tuned for Upcoming Blog Posts",
        date: "2026-03-01",
        summary: "New articles about coastal engineering and climate resilience will be published here soon. Stay connected!",
        tags: ["coming soon"],
        thumbnail: "",
        contentFile: "blogs/content-2.html"
    },
    {
        id: 3,
        slug: "blog-post-3",
        title: "Stay Tuned for Upcoming Blog Posts",
        date: "2026-03-01",
        summary: "Research updates and field experiences from doctoral studies at KMITL will be shared in upcoming posts.",
        tags: ["coming soon"],
        thumbnail: "",
        contentFile: "blogs/content-3.html"
    },
    {
        id: 4,
        slug: "blog-post-4",
        title: "Stay Tuned for Upcoming Blog Posts",
        date: "2026-03-01",
        summary: "Practical knowledge on construction management and quality control from real-world project experience coming soon.",
        tags: ["coming soon"],
        thumbnail: "",
        contentFile: "blogs/content-4.html"
    },
    {
        id: 5,
        slug: "blog-post-5",
        title: "Stay Tuned for Upcoming Blog Posts",
        date: "2026-03-01",
        summary: "Perspectives on sustainable development and infrastructure innovation will be explored in future articles.",
        tags: ["coming soon"],
        thumbnail: "",
        contentFile: "blogs/content-5.html"
    },
    {
        id: 6,
        slug: "blog-post-6",
        title: "Stay Tuned for Upcoming Blog Posts",
        date: "2026-03-01",
        summary: "Insights from public transportation optimization and urban planning projects will be featured here.",
        tags: ["coming soon"],
        thumbnail: "",
        contentFile: "blogs/content-6.html"
    },
    {
        id: 7,
        slug: "blog-post-7",
        title: "Stay Tuned for Upcoming Blog Posts",
        date: "2026-03-01",
        summary: "Discussions on data-driven engineering solutions and their real-world impact are coming soon.",
        tags: ["coming soon"],
        thumbnail: "",
        contentFile: "blogs/content-7.html"
    },
    {
        id: 8,
        slug: "blog-post-8",
        title: "Stay Tuned for Upcoming Blog Posts",
        date: "2026-03-01",
        summary: "Lessons learned from community engagement and infrastructure development projects will be shared.",
        tags: ["coming soon"],
        thumbnail: "",
        contentFile: "blogs/content-8.html"
    },
    {
        id: 9,
        slug: "blog-post-9",
        title: "Stay Tuned for Upcoming Blog Posts",
        date: "2026-03-01",
        summary: "Technical deep-dives into structural analysis and geotechnical engineering topics are on the way.",
        tags: ["coming soon"],
        thumbnail: "",
        contentFile: "blogs/content-9.html"
    },
    {
        id: 10,
        slug: "blog-post-10",
        title: "Stay Tuned for Upcoming Blog Posts",
        date: "2026-03-01",
        summary: "Reflections on international academic experiences and cross-cultural collaboration will be featured.",
        tags: ["coming soon"],
        thumbnail: "",
        contentFile: "blogs/content-10.html"
    },
    {
        id: 11,
        slug: "blog-post-11",
        title: "Stay Tuned for Upcoming Blog Posts",
        date: "2026-03-01",
        summary: "Analysis of emerging trends in climate-resilient infrastructure design is coming to this blog.",
        tags: ["coming soon"],
        thumbnail: "",
        contentFile: "blogs/content-11.html"
    },
    {
        id: 12,
        slug: "blog-post-12",
        title: "Stay Tuned for Upcoming Blog Posts",
        date: "2026-03-01",
        summary: "Case studies from school infrastructure revitalization projects across Central Java will be documented.",
        tags: ["coming soon"],
        thumbnail: "",
        contentFile: "blogs/content-12.html"
    },
    {
        id: 13,
        slug: "blog-post-13",
        title: "Stay Tuned for Upcoming Blog Posts",
        date: "2026-03-01",
        summary: "Guides on engineering software tools and technical methodologies will be published in future posts.",
        tags: ["coming soon"],
        thumbnail: "",
        contentFile: "blogs/content-13.html"
    },
    {
        id: 14,
        slug: "blog-post-14",
        title: "Stay Tuned for Upcoming Blog Posts",
        date: "2026-03-01",
        summary: "Discussions on highway construction quality control and national infrastructure development coming soon.",
        tags: ["coming soon"],
        thumbnail: "",
        contentFile: "blogs/content-14.html"
    },
    {
        id: 15,
        slug: "blog-post-15",
        title: "Stay Tuned for Upcoming Blog Posts",
        date: "2026-03-01",
        summary: "Thoughts on leadership, teamwork, and organizing large-scale academic conferences will be shared.",
        tags: ["coming soon"],
        thumbnail: "",
        contentFile: "blogs/content-15.html"
    },
    {
        id: 16,
        slug: "blog-post-16",
        title: "Stay Tuned for Upcoming Blog Posts",
        date: "2026-03-01",
        summary: "Exploration of environmental impact assessment methods and sustainable construction practices ahead.",
        tags: ["coming soon"],
        thumbnail: "",
        contentFile: "blogs/content-16.html"
    },
    {
        id: 17,
        slug: "blog-post-17",
        title: "Stay Tuned for Upcoming Blog Posts",
        date: "2026-03-01",
        summary: "Articles on research methodology and academic writing for engineering students are in preparation.",
        tags: ["coming soon"],
        thumbnail: "",
        contentFile: "blogs/content-17.html"
    },
    {
        id: 18,
        slug: "blog-post-18",
        title: "Stay Tuned for Upcoming Blog Posts",
        date: "2026-03-01",
        summary: "Updates on decarbonization pathways for Indonesia's transportation infrastructure will be covered.",
        tags: ["coming soon"],
        thumbnail: "",
        contentFile: "blogs/content-18.html"
    },
    {
        id: 19,
        slug: "blog-post-19",
        title: "Stay Tuned for Upcoming Blog Posts",
        date: "2026-03-01",
        summary: "Personal reflections on the journey from undergraduate studies to doctoral research will be featured.",
        tags: ["coming soon"],
        thumbnail: "",
        contentFile: "blogs/content-19.html"
    },
    {
        id: 20,
        slug: "blog-post-20",
        title: "Stay Tuned for Upcoming Blog Posts",
        date: "2026-03-01",
        summary: "Collaborative research insights and interdisciplinary approaches to solving infrastructure challenges coming soon.",
        tags: ["coming soon"],
        thumbnail: "",
        contentFile: "blogs/content-20.html"
    }

];
