# AsterMed Healthcare

A production-ready healthcare clinic website with full backend, admin CMS, role-based authentication, appointment booking, chatbot, analytics, and Google Sheets as the primary database.

## Features

### Public Features
- **Home Page**: Hero section, services overview, testimonials, and CTA
- **About Page**: Clinic history, mission, vision, and values
- **Services Page**: Comprehensive healthcare services listing
- **Doctors Page**: Team of healthcare professionals
- **Blog**: Health tips and medical insights
- **Contact Page**: Contact form, location map, and clinic info
- **Appointment Booking**: Multi-step booking with date/time selection

### User Features
- **Authentication**: Email/password signup and login
- **Dashboard**: View appointments and support tickets
- **Profile Management**: Update personal information and password
- **Appointment Management**: View, track, and cancel appointments
- **Support Tickets**: Raise and track support queries

### Admin Features
- **Dashboard**: Overview of all system metrics
- **User Management**: Create, edit, enable/disable users
- **Appointment Management**: View, confirm, cancel, complete appointments
- **Blog Management**: Create, edit, publish, archive blog posts
- **Query Management**: Respond to customer support queries
- **Analytics Dashboard**: Page views, appointments, user signups
- **CMS**: Edit website content and images
- **Chatbot Settings**: Configure chatbot behavior and mode
- **System Settings**: Working hours, social media, booking settings

### Editor Features
- **Blog Management**: Create and edit blog posts
- **Query Response**: Respond to customer queries
- **CMS**: Edit website content
- **Analytics**: View website performance (read-only)

### Technical Features
- **PWA**: Installable progressive web app
- **Responsive Design**: Mobile-first, works on all devices
- **Role-Based Access**: Admin, Editor, User roles
- **Google Sheets Database**: No traditional database needed
- **Real-time Chatbot**: Appointment booking assistance

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: JWT with HTTP-only cookies
- **Database**: Google Sheets API
- **Icons**: Lucide React
- **Forms**: React Hook Form + Zod validation
- **Animations**: Framer Motion, CSS animations

## Default Credentials

### Admin Account
```
Email: admin@astermed.com
Password: AsterMed@Admin2024
```

### Editor Account
```
Email: editor@astermed.com
Password: AsterMed@Editor2024
```

**⚠️ IMPORTANT: Change these passwords after first login!**

## Setup Instructions

### Prerequisites
- Node.js 18+ installed
- A Google Cloud project with Sheets API enabled
- A Google service account with access to your spreadsheet

### 1. Clone the Repository
```bash
git clone https://github.com/your-repo/astermed.git
cd astermed
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables

Copy the example environment file:
```bash
cp .env.example .env.local
```

Update `.env.local` with your credentials:
```env
# Google Sheets Configuration
GOOGLE_SHEET_ID=your-google-sheet-id
GOOGLE_SERVICE_ACCOUNT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# JWT Secret (generate a secure random string)
JWT_SECRET=your-super-secure-jwt-secret

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=AsterMed Healthcare
```

### 4. Initialize Google Sheets

Run the schema initializer to create all required sheets and default data:
```bash
npm run init-sheets
```

This script will:
- Create all required sheets (users, appointments, queries, blogs, analytics, settings, content)
- Add column headers to each sheet
- Create default admin and editor accounts
- Initialize default settings

### 5. Start Development Server
```bash
npm run dev
```

Visit http://localhost:3000 to view the application.

## Google Sheets Setup

### 1. Create a Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable the Google Sheets API

### 2. Create a Service Account
1. Go to IAM & Admin > Service Accounts
2. Create a new service account
3. Download the JSON key file
4. Copy the `client_email` and `private_key` to your `.env.local`

### 3. Create a Google Spreadsheet
1. Create a new Google Spreadsheet
2. Copy the spreadsheet ID from the URL
3. Share the spreadsheet with your service account email (Editor access)

### 4. Required Sheets Structure
The `init-sheets` script automatically creates these sheets:

| Sheet | Purpose |
|-------|---------|
| users | User accounts and authentication |
| appointments | Appointment bookings |
| queries | Support tickets |
| blogs | Blog posts |
| analytics | Page views and events |
| settings | System configuration |
| content | CMS content |

## Deployment to Vercel

### 1. Push to GitHub
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### 2. Deploy to Vercel
1. Go to [Vercel](https://vercel.com)
2. Import your GitHub repository
3. Configure environment variables in Vercel dashboard:
   - `GOOGLE_SHEET_ID`
   - `GOOGLE_SERVICE_ACCOUNT_EMAIL`
   - `GOOGLE_PRIVATE_KEY`
   - `JWT_SECRET`
   - `NEXT_PUBLIC_APP_URL` (your Vercel URL)
   - `NEXT_PUBLIC_APP_NAME`

4. Deploy!

### Important Notes for Vercel
- The `GOOGLE_PRIVATE_KEY` should include the `\n` characters as-is
- Set `NEXT_PUBLIC_APP_URL` to your Vercel deployment URL
- Run `npm run init-sheets` locally before deploying to set up the database

## Project Structure

```
astermed/
├── public/
│   ├── manifest.json        # PWA manifest
│   └── icons/               # App icons
├── scripts/
│   └── init-sheets.ts       # Database initializer
├── src/
│   ├── app/
│   │   ├── (auth)/          # Auth pages (login, signup)
│   │   ├── (dashboard)/     # Dashboard, admin, editor
│   │   ├── (public)/        # Public pages
│   │   └── api/             # API routes
│   ├── components/
│   │   ├── chatbot/         # Chatbot component
│   │   ├── layout/          # Header, Footer, Layout
│   │   └── ui/              # Reusable UI components
│   └── lib/
│       ├── auth.ts          # Authentication utilities
│       ├── google-sheets.ts # Google Sheets API wrapper
│       ├── types.ts         # TypeScript types
│       ├── utils.ts         # Utility functions
│       └── validation.ts    # Zod schemas
├── .env.example             # Environment variables template
├── .env.local               # Local environment variables
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Appointments
- `GET /api/appointments` - List appointments
- `POST /api/appointments` - Create appointment
- `GET /api/appointments/[id]` - Get appointment
- `PATCH /api/appointments/[id]` - Update appointment
- `GET /api/appointments/slots` - Get available slots

### Blogs
- `GET /api/blogs` - List blogs
- `POST /api/blogs` - Create blog
- `GET /api/blogs/[id]` - Get blog
- `PATCH /api/blogs/[id]` - Update blog
- `DELETE /api/blogs/[id]` - Delete blog

### Queries
- `GET /api/queries` - List queries
- `POST /api/queries` - Create query
- `GET /api/queries/[id]` - Get query
- `PATCH /api/queries/[id]` - Update query

### Users (Admin only)
- `GET /api/users` - List users
- `POST /api/users` - Create user
- `GET /api/users/[id]` - Get user
- `PATCH /api/users/[id]` - Update user

### Analytics
- `GET /api/analytics?type=stats` - Get dashboard stats
- `GET /api/analytics?type=summary` - Get analytics summary
- `POST /api/analytics` - Track event

### Settings
- `GET /api/settings` - Get settings
- `POST /api/settings` - Create/update setting
- `PUT /api/settings` - Bulk update settings

### Chatbot
- `POST /api/chatbot` - Send message to chatbot

## Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| Primary | #0B4F6C | Main brand color |
| Secondary | #1FA2A6 | Accent, highlights |
| Accent | #4CAF50 | Success, CTA |
| Background | #FFFFFF | Page background |
| Muted | #F5F7FA | Cards, sections |
| Text Primary | #1F2933 | Main text |
| Error | #E53935 | Error states |

## License

This project is proprietary and confidential. Unauthorized copying, modification, distribution, or use is strictly prohibited.

## Support

For support, contact:
- **Phone**: 093816 59308
- **Email**: contact@astermedhealthcare.com
- **Address**: Vinayaka Nagar, Hafeezpet, Hyderabad, Telangana 500049
