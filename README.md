# GitGo - AI-Powered Developer Portfolio & Open Source Matcher

GitGo is a modern web application that helps developers discover open source projects matching their skills, build professional portfolios, and connect with the developer community.

## 🚀 Features

### 1. GitHub Integration
- **OAuth Authentication**: Secure sign-in with GitHub
- **Automatic Data Sync**: Fetches repositories, languages, and statistics
- **Real-time Updates**: Keep your profile data fresh with one-click sync
- **Technology Mapping**: Tracks which technologies you use across projects

### 2. AI-Powered Portfolio Builder
- **4 Professional Templates**: Modern, Minimal, Creative, and Professional designs
- **6 Color Themes**: Midnight, Ocean, Forest, Sunset, Lavender, and Monochrome
- **JSON Schema-Based**: All content driven by structured data, not hardcoded HTML
- **Inline Editing**: Click any text to edit directly in the preview
- **Drag & Drop Sections**: Reorder portfolio sections (coming soon)
- **AI Content Generation**: Automatically generates portfolio from GitHub data
- **HTML/CSS Export**: Download standalone HTML file for full customization
- **Code Editor**: View and copy HTML/CSS with syntax highlighting

### 3. Smart Project Matching
- **Skill-Based Recommendations**: Find projects matching your tech stack
- **Match Scoring**: See how well projects align with your skills
- **Trending Projects**: Discover popular open source repositories
- **Beginner-Friendly Filters**: Find projects with good first issues

### 4. Developer Community
- **Social Feed**: Share updates, milestones, and achievements
- **Likes & Comments**: Engage with other developers
- **Post Composer**: Share code snippets, projects, and thoughts
- **Real-time Interactions**: Instant feedback on community posts

### 5. Settings & Customization
- **Profile Management**: Update name, bio, location, and contact info
- **Notification Preferences**: Control email and push notifications
- **Integration Management**: Connect GitHub and other services
- **Technology Map**: View your tech stack usage across projects

## 🛠️ Tech Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Beautiful UI components
- **Lucide Icons** - Modern icon library

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **NextAuth.js** - Authentication with GitHub OAuth
- **MongoDB** - Document database for user data
- **Mongoose** - MongoDB object modeling
- **Redis** - Caching layer for performance

### Infrastructure
- **Vercel** - Deployment platform (recommended)
- **GitHub API** - Repository and user data
- **MongoDB Atlas** - Cloud database (recommended)
- **Redis Cloud** - Managed Redis instance (recommended)

## 📋 Prerequisites

- Node.js 18+ and npm/pnpm
- MongoDB instance (local or Atlas)
- Redis instance (local or cloud)
- GitHub OAuth App credentials

## 🔧 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/gitgo.git
cd gitgo/source_code
```

### 2. Install Dependencies

```bash
npm install
# or
pnpm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the `source_code` directory:

```env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# GitHub OAuth
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# Database
MONGODB_URI=mongodb://localhost:27017/gitgo
# or MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/gitgo

# Redis
REDIS_URL=redis://localhost:6379
# or Redis Cloud:
# REDIS_URL=redis://username:password@host:port
```

### 4. Set Up GitHub OAuth App

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Fill in the details:
   - **Application name**: GitGo (or your preferred name)
   - **Homepage URL**: `http://localhost:3000`
   - **Authorization callback URL**: `http://localhost:3000/api/auth/callback/github`
4. Copy the Client ID and Client Secret to your `.env` file

### 5. Set Up MongoDB

**Option A: Local MongoDB**
```bash
# Install MongoDB locally
# macOS
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community
```

**Option B: MongoDB Atlas (Recommended)**
1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Get connection string and add to `.env`

### 6. Set Up Redis

**Option A: Local Redis**
```bash
# Install Redis locally
# macOS
brew install redis

# Start Redis
brew services start redis
```

**Option B: Redis Cloud (Recommended)**
1. Create account at [Redis Cloud](https://redis.com/try-free/)
2. Create a free database
3. Get connection string and add to `.env`

### 7. Run the Development Server

```bash
npm run dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
source_code/
├── app/                          # Next.js App Router
│   ├── api/                      # API routes
│   │   ├── auth/                 # NextAuth endpoints
│   │   ├── community/            # Community posts API
│   │   ├── github/               # GitHub data API
│   │   ├── portfolio/            # Portfolio management API
│   │   └── user/                 # User settings API
│   ├── dashboard/                # Dashboard pages
│   │   ├── community/            # Community feed
│   │   ├── explore/              # Project discovery
│   │   ├── projects/             # User projects
│   │   └── settings/             # User settings
│   ├── onboarding/               # Onboarding flow
│   ├── portfolio/                # Portfolio builder
│   └── page.tsx                  # Landing page
├── components/                   # React components
│   ├── community/                # Community components
│   ├── dashboard/                # Dashboard components
│   ├── landing/                  # Landing page components
│   ├── portfolio/                # Portfolio components
│   │   ├── sections/             # Portfolio section components
│   │   ├── templates/            # Portfolio templates
│   │   ├── code-editor-modal.tsx
│   │   ├── editable-text.tsx
│   │   ├── portfolio-controls.tsx
│   │   ├── portfolio-preview.tsx
│   │   └── schema-renderer.tsx
│   ├── settings/                 # Settings components
│   └── ui/                       # shadcn/ui components
├── hooks/                        # Custom React hooks
│   ├── use-github.ts             # GitHub data hook
│   └── use-toast.ts              # Toast notifications
├── lib/                          # Utility libraries
│   ├── auth.ts                   # NextAuth configuration
│   ├── github.ts                 # GitHub API client
│   ├── mongodb.ts                # MongoDB connection
│   ├── redis.ts                  # Redis client
│   ├── portfolio-export.ts       # HTML/CSS export
│   ├── portfolio-schema.ts       # Portfolio JSON schema
│   ├── portfolio-templates.ts    # Template definitions
│   └── utils.ts                  # Utility functions
├── models/                       # MongoDB models
│   ├── Portfolio.ts              # Portfolio schema
│   ├── Post.ts                   # Community post schema
│   ├── Repository.ts             # Repository schema
│   ├── User.ts                   # User schema
│   └── UserPreferences.ts        # User preferences schema
├── types/                        # TypeScript types
│   └── next-auth.d.ts            # NextAuth type extensions
└── public/                       # Static assets
```

## 🎨 Portfolio Builder

### Templates

1. **Modern**: Clean contemporary design with gradient hero and card-based projects
2. **Minimal**: Typography-focused with generous whitespace
3. **Creative**: Bold artistic design with asymmetric layouts
4. **Professional**: Corporate polished design for business

### Themes

1. **Midnight**: Blue tones with dark background
2. **Ocean**: Cyan/teal ocean-inspired palette
3. **Forest**: Green nature-inspired colors
4. **Sunset**: Warm orange/amber tones
5. **Lavender**: Purple/violet aesthetic
6. **Monochrome**: Black and white minimalist

### Portfolio Sections

- **Hero**: Title, subtitle, description, CTA button
- **Stats**: GitHub statistics (repos, stars, forks, followers)
- **Skills**: Technology tags with project counts
- **Projects**: Featured repositories with thumbnails
- **About**: Bio, highlights, and personal info
- **Contact**: Email and social media links

### Inline Editing

Click any text element to edit:
- Single-line text: Click, edit, press Enter or click away
- Multi-line text: Click, edit, press Escape to cancel
- Visual indicators show editable elements on hover

### Export Options

1. **View Code**: Opens modal with HTML/CSS tabs
2. **Copy Code**: Copy full HTML, CSS only, or body content
3. **Download HTML**: Get standalone HTML file
4. **Customize**: Edit downloaded file in any editor

## 🔐 Authentication Flow

1. User clicks "Sign in with GitHub"
2. Redirected to GitHub OAuth
3. User authorizes the app
4. GitHub returns access token
5. Token stored in JWT session
6. User data synced to MongoDB
7. Cached in Redis for performance

## 💾 Data Flow

### GitHub Data Sync

```
User → GitHub API → MongoDB → Redis Cache → UI
```

1. User triggers sync
2. Fetch data from GitHub API
3. Store in MongoDB (source of truth)
4. Cache in Redis (1 hour TTL)
5. Subsequent requests served from cache

### Cache Strategy

- **User Profile**: 1 hour TTL
- **Repository List**: 30 minutes TTL
- **Repository Details**: 24 hours TTL
- **Technology Map**: 1 hour TTL

### Portfolio Generation

```
GitHub Data → AI Generator → JSON Schema → Renderer → HTML/CSS
```

1. Fetch GitHub data and technology map
2. AI generates portfolio sections
3. Store JSON schema in MongoDB
4. Render from schema with selected theme
5. Export to standalone HTML

## 🚀 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Environment Variables for Production

```env
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your-production-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
MONGODB_URI=your-mongodb-atlas-uri
REDIS_URL=your-redis-cloud-uri
```

### Database Setup for Production

1. **MongoDB Atlas**:
   - Create production cluster
   - Whitelist Vercel IPs or use 0.0.0.0/0
   - Create database user
   - Get connection string

2. **Redis Cloud**:
   - Create production database
   - Get connection string
   - Configure SSL if required

## 🧪 Testing

```bash
# Run type checking
npm run type-check

# Build for production
npm run build

# Start production server
npm start
```

## 📊 Performance Optimization

### Caching Strategy
- Redis for GitHub API responses
- MongoDB for persistent data
- Next.js static generation where possible

### Image Optimization
- GitHub OpenGraph images for projects
- Next.js Image component for avatars
- Lazy loading for project cards

### Code Splitting
- Dynamic imports for heavy components
- Route-based code splitting
- Suspense boundaries for loading states

## 🔒 Security

- **OAuth 2.0**: Secure GitHub authentication
- **JWT Sessions**: Encrypted session tokens
- **Environment Variables**: Sensitive data in .env
- **API Rate Limiting**: Prevent abuse (coming soon)
- **Input Validation**: Sanitize user inputs
- **CORS**: Configured for API routes

## 🐛 Troubleshooting

### MongoDB Connection Issues
```bash
# Check MongoDB is running
mongosh

# Test connection string
mongosh "your-connection-string"
```

### Redis Connection Issues
```bash
# Check Redis is running
redis-cli ping

# Test connection
redis-cli -u your-redis-url
```

### GitHub OAuth Issues
- Verify callback URL matches exactly
- Check client ID and secret are correct
- Ensure app is not suspended

### Build Errors
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Rebuild
npm run build
```

## 📝 API Documentation

### GitHub Endpoints

- `GET /api/github/profile` - Get user profile and repos
- `POST /api/github/sync` - Sync latest GitHub data
- `GET /api/github/skills` - Get user skills/languages
- `GET /api/github/technology-map` - Get technology usage map
- `GET /api/github/repo/[id]` - Get specific repository

### Portfolio Endpoints

- `GET /api/portfolio` - Get user's portfolio
- `POST /api/portfolio` - Save portfolio changes
- `POST /api/portfolio/generate` - Generate portfolio from GitHub

### User Endpoints

- `GET /api/user/profile` - Get user profile
- `PATCH /api/user/profile` - Update user profile
- `GET /api/user/preferences` - Get notification preferences
- `PATCH /api/user/preferences` - Update preferences

### Community Endpoints

- `GET /api/community/posts` - Get community posts
- `POST /api/community/posts` - Create new post
- `POST /api/community/posts/[id]/like` - Like a post
- `POST /api/community/posts/[id]/comment` - Comment on post

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [shadcn/ui](https://ui.shadcn.com/) - UI components
- [NextAuth.js](https://next-auth.js.org/) - Authentication
- [MongoDB](https://www.mongodb.com/) - Database
- [Redis](https://redis.io/) - Caching
- [Vercel](https://vercel.com/) - Hosting platform

## 📧 Support

For support, email support@gitgo.dev or open an issue on GitHub.

## 🗺️ Roadmap

- [ ] Drag & drop section reordering
- [ ] Custom section types
- [ ] Image upload for projects
- [ ] LinkedIn integration
- [ ] Resume parser
- [ ] AI-powered project recommendations
- [ ] Team portfolios
- [ ] Analytics dashboard
- [ ] Custom domain support
- [ ] SEO optimization tools

---

Built with ❤️ by developers, for developers.
