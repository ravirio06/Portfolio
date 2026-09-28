# ⚡ Ravinithishkumar S — Full-Stack Portfolio & Admin CMS Suite

> A production-ready, ultra-low-latency full-stack portfolio with a complete **Admin CMS (Content Management System)** engineered with **Node.js**, **Express**, **MongoDB / Resilient Dual-Store**, **Vanilla HTML5/CSS3/JavaScript**, and **Cyber-Glassmorphism** aesthetics.

---

## 🌟 Highlights & Key Features

### 🖥️ Public Portfolio Dynamic Engine
- **Zero-Code Maintenance**: Every piece of portfolio content (profile, bio, avatar, hero typography, about section, projects, skills, education, experience, achievements, certificates, resume, social links, SEO, and section ordering) is dynamically fetched from backend APIs (`GET /api/content/all`) and rendered on-the-fly. No source-code editing required.
- **Cyber-Glassmorphism Aesthetic**: Tailored deep-space dark palette (`#060913`), neon indigo/purple/cyan accents, responsive glass cards with backdrop-blur, and subtle ambient glows.
- **Interactive Constellation Particle Canvas**: Lightweight, 60fps HTML5 canvas rendering interactive network nodes reacting to cursor proximity.
- **Interactive Cyber Terminal Shell (`Ctrl + K`)**: Built-in Unix emulator supporting commands (`help`, `bio`, `skills`, `projects`, `contact`, `health`, `sudo hire`, `clear`).
- **Dynamic Typewriter & Live Status Telemetry**: Shows live system uptime, database connection status, and API round-trip ping.
- **Web Audio API Cyber Synthesizer**: Generates subtle futuristic click and chime audio effects on-the-fly without external audio dependencies, equipped with a mute toggle.

---

## 🛡️ Admin CMS & Control Center (`/admin` or `/admin/login`)

Accessible directly at **[http://localhost:5000/admin](http://localhost:5000/admin)** or via the footer **[Admin CMS Portal]** link.

### Default Admin Credentials
- **Email / Username**: `admin` or `admin@ravinithish.dev`
- **Password**: `admin123`
- *Includes a 1-click **Auto-Fill Demo Credentials** button for instant evaluation.*

### 18 Specialized Management Modules
1. **Overview Dashboard**: High-level statistics (Total Projects, Active Skills, Unread Inquiries, Certificates, Profile Completion, Last Updated timestamp) with quick-action shortcuts.
2. **Contact Inquiries Triage**: Live message inbox with search, status filters (`new`, `read`, `replied`, `archived`), 1-click triage actions, and 1-click JSON message export.
3. **Profile Management**: Live editing of Full Name, Professional Title, Tagline, Comprehensive Bio, Location, Email, Phone, and Avatar Photo upload/preview.
4. **Hero Section**: Live configuration of Hero Heading, Subtitle, Description, Primary CTA text/URL, Secondary CTA text/URL, Hero Image, and visibility toggles.
5. **About Section**: Edit heading, long-form narrative description, "Currently Exploring" highlights, and bulleted engineering accomplishments.
6. **Skills Matrix**: Complete CRUD for technical skills with Category (`Programming`, `Frontend`, `Backend`, `AI/ML`, `Tools`, `Other`), icon picker, manual proficiency percentage (0-100%), and years of experience.
7. **Projects Management**:
   - Create, Edit, Delete, and **Duplicate** projects with 1 click.
   - Slug, Short Description, Detailed Architecture Breakdown, Live Demo URL, GitHub URL, Category, Tech Stack tags, Metrics pills, and Featured / Published status flags.
   - Pre-seeded with **buildAI** (`https://github.com/ravirio06/buildAI`) and production cloud architectures.
8. **Experience Management**: Add, edit, reorder, and publish/unpublish work history with Job Title, Company, Location, Start Date, End Date, Currently Working toggle, and description.
9. **Education Management**: Add, edit, and reorder academic qualifications (e.g., B.E. in Electronics and Communication Engineering).
10. **Achievements**: Manage hackathons, milestones, awards, and competitions with dates and links.
11. **Certificates**: Upload and manage technical certifications with Issuer, Issue Date, Credential ID, Credential URL, and document preview.
12. **Resume Management**:
    - Upload and validate PDF resume documents (MIME type, file size, extension).
    - Designate "Current Active Resume" with 1 click; public "Download Resume" buttons dynamically serve the active PDF.
13. **Social Links**: Dynamically add and reorder GitHub, LinkedIn, Twitter/X, YouTube, Email, and custom external profiles without touching code.
14. **Media Library**: View, upload, copy URL, and manage all uploaded assets (`.jpg`, `.jpeg`, `.png`, `.webp`, `.pdf`) stored securely in `/uploads`.
15. **SEO & Metadata**: Real-time management of Site Title, Meta Description, Keywords, Author, Open Graph (OG) tags, and Twitter Cards.
16. **Site Settings & Section Ordering**:
    - Toggle visibility for any portfolio section (`Hero`, `About`, `Skills`, `Projects`, `Experience`, `Contact`).
    - Adjust primary and secondary neon accent colors on the fly.
    - Drag-and-drop / Up-Down section reordering that immediately rearranges sections on the live public website.
17. **Activity Audit Log**: Cryptographically logged timeline of all administrative operations (logins, creations, edits, deletions, settings changes) with timestamps and IP records.
18. **Admin Account Security**: Update admin email, change password with bcrypt hashing and minimum length validation, and view current session token.
19. **Backup Export & Import**: 1-click full JSON database export (excluding credentials) and instant restoration.

---

## 📂 Project Architecture

```
d:\portfolio\
├── package.json                   # Root orchestrator scripts
├── backend\
│   ├── .env                       # Environment variables
│   ├── .env.example               # Example template
│   ├── package.json               # Backend dependencies & test scripts
│   ├── data\
│   │   └── cms_store.json         # Resilient auto-syncing JSON store
│   ├── uploads\                   # Validated uploaded media & PDF files
│   ├── test\
│   │   └── api.test.js            # 24 Automated integration tests (node:test)
│   └── src\
│       ├── config\
│       │   └── db.js              # Resilient MongoDB connector & status probe
│       ├── controllers\
│       │   ├── authController.js      # JWT authentication, session & admin account
│       │   ├── cmsController.js       # Complete CMS CRUD & public bundle engine
│       │   ├── contactController.js   # Message submission, triage & export
│       │   └── portfolioController.js # Health probe and legacy fallbacks
│       ├── middleware\
│       │   ├── auth.js            # JWT verification & admin guard
│       │   ├── errorHandler.js    # 404 & centralized error handlers
│       │   ├── rateLimiter.js     # Express rate limiters
│       │   └── upload.js          # Multer secure file upload & MIME validation
│       ├── models\
│       │   ├── Admin.js           # Admin credentials with bcrypt compare
│       │   ├── Profile.js         # Developer profile schema
│       │   ├── Hero.js            # Hero section schema
│       │   ├── About.js           # About narrative schema
│       │   ├── Education.js       # Education schema
│       │   ├── Skill.js           # Technical skills schema
│       │   ├── Project.js         # Comprehensive project schema
│       │   ├── Experience.js      # Work history schema
│       │   ├── Achievement.js     # Milestone schema
│       │   ├── Certificate.js     # Certification schema
│       │   ├── Resume.js          # PDF resume versioning schema
│       │   ├── SocialLink.js      # Social profiles schema
│       │   ├── ContactMessage.js  # Contact submission schema
│       │   ├── SiteSettings.js    # Section visibility & ordering schema
│       │   ├── Media.js           # Media metadata schema
│       │   ├── ActivityLog.js     # Audit log schema
│       │   └── SEOSettings.js     # Meta tags schema
│       ├── routes\
│       │   └── apiRoutes.js       # Centralized REST API endpoints
│       ├── utils\
│       │   ├── mailer.js          # Nodemailer email dispatcher
│       │   ├── memoryStore.js     # Resilient dual-store fallback engine
│       │   └── sanitize.js        # Input sanitization & normalization
│       └── server.js              # Express app, Helmet, CORS & static server
└── frontend\
    ├── index.html                 # Dynamic public portfolio application
    ├── css\
    │   └── style.css              # Cyber-Glassmorphism CSS design system
    ├── js\
    │   ├── main.js                # Dynamic CMS renderer & interactive UI
    │   ├── audio.js               # Web Audio API sound synthesizer
    │   ├── admin.js               # Quick modal admin helper
    │   ├── particles.js           # HTML5 Canvas constellation system
    │   └── terminal.js            # Interactive cyber terminal emulator
    ├── admin\                     # Standalone Admin CMS Application
    │   ├── index.html             # Admin CMS SPA with 18 management views
    │   ├── admin.css              # Cyber-Glassmorphism Admin styling
    │   └── admin.js               # Admin CMS client logic & state management
    └── assets\
        ├── avatar.jpg             # High-res developer headshot
        └── projects\              # Bespoke high-resolution project mockups
```

---

## 🚀 Getting Started

### 1. Start the Server
Run directly from workspace root:
```bash
npm start
```

Or run from the `backend` folder:
```bash
cd backend
npm start
```

- Public Portfolio: **[http://localhost:5000](http://localhost:5000)**
- Admin CMS Portal: **[http://localhost:5000/admin](http://localhost:5000/admin)**
- Public Dynamic Bundle: **[http://localhost:5000/api/content/all](http://localhost:5000/api/content/all)**
- System Health Probe: **[http://localhost:5000/api/health](http://localhost:5000/api/health)**

### 2. Run Automated Integration Tests
The project includes 24 automated tests covering authentication, authorization, CRUD operations, public bundle delivery, file exports, and contact sanitization:
```bash
cd backend
npm test
```
Result: **24/24 passing tests (100% pass rate)**.

---

## 📡 REST API Reference

### Public Endpoints (Read-Only)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | System uptime, node version, and DB status |
| `GET` | `/api/content/all` | Complete dynamic bundle consumed by public frontend |
| `GET` | `/api/profile` | Developer bio, title, location, and avatar |
| `GET` | `/api/hero` | Hero heading, subtitle, description, and CTA buttons |
| `GET` | `/api/about` | Narrative description and highlights |
| `GET` | `/api/projects` | All published projects (supports `?category=...&featured=true`) |
| `GET` | `/api/projects/:id` | Single project lookup by slug or ID |
| `GET` | `/api/skills` | Categorized tech stack & experience years |
| `GET` | `/api/education` | Education history |
| `GET` | `/api/experience` | Career milestones and employment history |
| `GET` | `/api/achievements` | Awards, hackathons, and competitions |
| `GET` | `/api/certificates` | Certifications with credential links |
| `GET` | `/api/resume/current` | Active PDF resume URL and metadata |
| `GET` | `/api/social-links` | Visible social media links |
| `GET` | `/api/settings` | Section ordering, visibility, and accent colors |
| `GET` | `/api/seo` | Title tags, meta descriptions, and Open Graph config |
| `POST` | `/api/contact` | Submit contact inquiry (rate-limited, sanitized, dispatches email) |

### Admin Endpoints (Protected by Bearer JWT)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Authenticate admin (`username` or `email`, `password`) |
| `POST` | `/api/auth/logout` | Invalidate admin session |
| `GET` | `/api/auth/me` | Retrieve authenticated administrator identity |
| `PUT` | `/api/auth/account` | Update admin email and change password |
| `GET` | `/api/admin/dashboard/stats` | Overview cards statistics |
| `PUT` | `/api/admin/profile` | Update profile information |
| `PUT` | `/api/admin/hero` | Update hero banner configuration |
| `PUT` | `/api/admin/about` | Update about narrative and highlights |
| `POST` | `/api/admin/projects` | Create a new project |
| `PUT` | `/api/admin/projects/:id` | Update project details, links, tags, and status |
| `DELETE` | `/api/admin/projects/:id` | Delete project |
| `POST` | `/api/admin/projects/:id/duplicate`| Clone an existing project |
| `PATCH` | `/api/admin/projects/reorder` | Update project display order |
| `POST` | `/api/admin/skills` | Add technical skill |
| `PUT` | `/api/admin/skills/:id` | Edit skill level, category, and experience |
| `DELETE` | `/api/admin/skills/:id` | Delete skill |
| `PATCH` | `/api/admin/skills/reorder` | Update skills display order |
| `POST` | `/api/admin/education` | Add education record |
| `PUT` | `/api/admin/education/:id` | Edit education record |
| `DELETE` | `/api/admin/education/:id` | Delete education record |
| `POST` | `/api/admin/experience` | Add experience record |
| `PUT` | `/api/admin/experience/:id` | Edit experience record |
| `DELETE` | `/api/admin/experience/:id` | Delete experience record |
| `POST` | `/api/admin/resumes` | Upload new PDF resume (multipart/form-data) |
| `PATCH` | `/api/admin/resumes/:id/current` | Set active resume served to visitors |
| `DELETE` | `/api/admin/resumes/:id` | Delete resume document |
| `GET` | `/api/admin/messages` | List contact submissions with status and search |
| `PATCH` | `/api/admin/messages/:id/status`| Update status (`new`, `read`, `replied`, `archived`) |
| `DELETE` | `/api/admin/messages/:id` | Delete contact inquiry |
| `GET` | `/api/admin/messages/export` | Export all messages as JSON |
| `PUT` | `/api/admin/settings` | Save section ordering and visibility |
| `PUT` | `/api/admin/seo` | Save site title and meta tags |
| `GET` | `/api/admin/media` | List uploaded files |
| `POST` | `/api/admin/media/upload` | Upload media files (images, PDFs) |
| `DELETE` | `/api/admin/media/:id` | Remove file from disk and database |
| `GET` | `/api/admin/logs` | Retrieve chronological activity audit trail |
| `GET` | `/api/admin/backup/export` | Download full portfolio JSON backup |
| `POST` | `/api/admin/backup/import` | Restore portfolio from JSON backup |

---

## 🛡️ Security & Upload Validation
- **Authentication**: Bcrypt password hashing (10 salt rounds) and JWT signing.
- **Upload Restrictions**: Only `.jpg`, `.jpeg`, `.png`, `.webp`, and `.pdf` files accepted. 10MB file limit with MIME-type and extension validation. Filenames are cryptographically randomized to prevent path traversal. Large files are saved in `/uploads`, never stored as large binary documents in MongoDB.
- **Rate Limiting**: Express rate limiting protects against brute force attacks on `/api/auth/login` and spam submissions on `/api/contact`.
- **Sanitization**: All text inputs are stripped of malicious script tags and HTML entities are escaped.
- **Resilient Dual Storage**: Automatically utilizes MongoDB when `MONGODB_URI` is provided; seamlessly falls back to persistent, auto-syncing `cms_store.json` disk storage when running locally without a database.
