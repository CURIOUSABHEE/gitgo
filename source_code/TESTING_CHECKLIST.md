# Testing Checklist

## Prerequisites
- [ ] MongoDB is running (local or Atlas)
- [ ] Redis is running (local or cloud)
- [ ] Environment variables are set in `.env`
- [ ] Dependencies are installed (`npm install`)

## 1. Authentication & Onboarding
- [ ] Landing page shows "Get Started via GitHub" button when not logged in
- [ ] Landing page shows "Go to Dashboard" button when logged in
- [ ] GitHub OAuth flow works correctly
- [ ] User is redirected to onboarding after first login
- [ ] Onboarding shows actual repository count (not hardcoded 12)
- [ ] Onboarding displays real languages from GitHub repos
- [ ] User data is stored in MongoDB after onboarding

## 2. Dashboard
- [ ] Dashboard displays user's name and avatar in sidebar
- [ ] Skills are fetched and displayed in sidebar (not hardcoded)
- [ ] "My Tech Stack" filter works and shows matching repos
- [ ] "Trending" filter works and sorts by stars
- [ ] Default view shows all recommended repos
- [ ] Banner text updates based on active filter

## 3. Settings Page
- [ ] User's GitHub data is pre-populated (name, email, username, bio, location, website)
- [ ] Avatar is displayed from GitHub
- [ ] Email field shows user's email (including private emails)
- [ ] GitHub username field is disabled
- [ ] Form fields can be edited

## 4. Community Tab
- [ ] Community page loads without errors
- [ ] Post composer is visible
- [ ] Can create a new post
- [ ] Posts are fetched from MongoDB and displayed
- [ ] Like button works (toggles like/unlike)
- [ ] Like count updates in real-time
- [ ] Comment button opens dialog
- [ ] Can add comments to posts
- [ ] Comment count updates after adding comment
- [ ] Empty state shows when no posts exist
- [ ] User avatar displays in posts
- [ ] Time ago displays correctly (e.g., "2m ago", "1h ago")

## 5. My Projects Tab
- [ ] Displays user's actual GitHub repositories
- [ ] Repository data is cached in Redis
- [ ] Repository details are fetched from MongoDB/cache
- [ ] No hardcoded "janeDoe" or placeholder data

## 6. Data Flow & Caching
- [ ] User data is stored in MongoDB
- [ ] User data is cached in Redis (1 hour TTL)
- [ ] Repository list is cached in Redis (30 min TTL)
- [ ] Repository details are cached in Redis (24 hour TTL)
- [ ] Skills are extracted from repos and stored in MongoDB
- [ ] Languages are extracted from repos and stored in MongoDB
- [ ] Cache-first approach works (Redis → MongoDB → GitHub API)

## 7. API Endpoints
- [ ] `GET /api/github/profile` - Returns user profile
- [ ] `POST /api/github/sync` - Syncs user data from GitHub
- [ ] `GET /api/github/skills` - Returns user skills and languages
- [ ] `GET /api/github/repo/[id]` - Returns repository details
- [ ] `GET /api/community/posts` - Returns all posts
- [ ] `POST /api/community/posts` - Creates new post
- [ ] `POST /api/community/posts/[id]/like` - Likes/unlikes post
- [ ] `POST /api/community/posts/[id]/comment` - Adds comment to post

## 8. Error Handling
- [ ] Graceful handling when MongoDB is unavailable
- [ ] Graceful handling when Redis is unavailable
- [ ] Proper error messages for failed API calls
- [ ] Loading states display correctly
- [ ] No console errors in browser

## 9. UI/UX
- [ ] No hardcoded values visible anywhere
- [ ] All user-specific data is dynamic
- [ ] Loading states show while fetching data
- [ ] Buttons are disabled during API calls
- [ ] Success feedback after actions (like, comment, post)
- [ ] Responsive design works on mobile

## 10. Database Schema
- [ ] User model includes: githubId, login, name, email, avatar_url, languages, skills, techStack
- [ ] Repository model includes: name, owner, description, stars, forks, language, topics
- [ ] Post model includes: userId, author, content, type, likes, comments, tags
- [ ] Proper indexes are set on frequently queried fields

## Testing Commands

```bash
# Start development server
npm run dev

# Test database connection
npm run test:db

# Check for TypeScript errors
npm run build

# Lint code
npm run lint
```

## Manual Testing Steps

1. **Fresh User Flow**
   - Clear browser cookies
   - Visit landing page
   - Click "Get Started via GitHub"
   - Complete OAuth flow
   - Verify onboarding shows real data
   - Complete onboarding
   - Verify dashboard loads with real data

2. **Community Features**
   - Navigate to Community tab
   - Create a new post
   - Like your own post
   - Add a comment
   - Refresh page and verify data persists

3. **Filter Testing**
   - Click "My Tech Stack" in sidebar
   - Verify URL has `?filter=techstack`
   - Verify repos are filtered
   - Click "Trending" in sidebar
   - Verify repos are sorted by stars

4. **Settings Testing**
   - Navigate to Settings
   - Verify all fields are populated
   - Edit some fields
   - Click "Save Changes"

## Known Issues
- None currently

## Notes
- All hardcoded values have been replaced with dynamic data
- Community tab is now fully functional with MongoDB backend
- Tech stack filter works by matching user skills against repo technologies
- Repository count in onboarding is now dynamic
