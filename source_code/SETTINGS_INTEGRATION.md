# Settings Page GitHub Integration

## Overview

The settings page now automatically populates with GitHub data after user authentication. All fields are editable, and empty fields remain empty if no data is available from GitHub.

## Changes Made

### 1. Profile Settings (`components/settings/settings-profile.tsx`)

**Features:**
- Automatically fetches and displays GitHub user data
- Shows GitHub avatar with fallback to initials
- Populates form fields with GitHub data:
  - Name (split into first/last name)
  - Username (GitHub login, read-only)
  - Email
  - Bio
  - Location
  - Website (from GitHub blog field)
  - Title (from GitHub bio)
- All fields are editable except GitHub username
- Shows loading state while fetching data
- Empty fields remain empty if no GitHub data available

**Data Mapping:**
```
GitHub → Settings Form
------------------------
name → firstName + lastName (split by space)
login → username (disabled field)
email → email
bio → bio + title
location → location
blog → website
avatar_url → profile photo
```

### 2. Integrations Settings (`components/settings/settings-integrations.tsx`)

**Features:**
- Shows real GitHub connection status
- Displays connected GitHub username
- Shows last sync time
- Re-sync button to refresh GitHub data
- Connect button for GitHub if not authenticated
- Loading state while fetching data

**Functionality:**
- Detects if user is authenticated via session
- Shows "Connected" status with green indicator if authenticated
- Shows "Not connected" status with gray indicator if not authenticated
- Re-sync button triggers fresh data fetch from GitHub API
- Connect button redirects to GitHub OAuth flow

### 3. Enhanced GitHub API (`lib/github.ts`)

**Added Fields:**
- `twitter_username` - User's Twitter handle
- `hireable` - Whether user is available for hire

## User Experience

### First-Time User (No GitHub Connection)
1. User navigates to Settings
2. All profile fields are empty with placeholders
3. Integrations shows GitHub as "Not connected"
4. User can click "Connect" to authenticate with GitHub

### Authenticated User
1. User logs in via GitHub OAuth
2. User navigates to Settings
3. Profile tab shows loading spinner briefly
4. All available GitHub data populates automatically:
   - Avatar displays GitHub profile picture
   - Name fields split from GitHub name
   - Email, bio, location, website auto-filled
   - Username shows GitHub login (read-only)
5. Empty fields remain empty if no data in GitHub profile
6. User can edit any field except username
7. Integrations tab shows:
   - GitHub as "Connected" with green indicator
   - Username displayed as "@username"
   - Last sync timestamp
   - "Re-sync Data" button

### Re-syncing Data
1. User clicks "Re-sync Data" button
2. Button shows spinning icon and "Syncing..." text
3. Fresh data fetched from GitHub API
4. Last sync timestamp updates
5. Profile data refreshes with latest GitHub info

## Technical Implementation

### State Management
- Uses `useSession()` hook to check authentication
- Uses `useGitHub()` custom hook to fetch profile data
- Local state for form fields with controlled inputs
- Loading states for better UX

### Data Flow
```
GitHub OAuth → Session (access token) → useGitHub hook → 
API route (/api/github/profile) → GitHub API → 
Profile data → Settings components
```

### Error Handling
- Shows loading spinner while fetching
- Gracefully handles missing data (empty fields)
- Console logs errors for debugging
- Fallback to empty strings if data unavailable

## Future Enhancements

Consider adding:
- Save functionality to persist edited data to database
- Validation for email and website fields
- Image upload for custom avatar (override GitHub avatar)
- Sync status indicators (success/error messages)
- Auto-sync on interval or webhook
- Conflict resolution if user edits data that differs from GitHub
- LinkedIn integration similar to GitHub
- Export profile data functionality
