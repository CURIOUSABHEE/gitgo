# Dynamic User Data Implementation

## Overview

All hardcoded user data (Jane Doe, janedoe, JD) has been replaced with dynamic data from GitHub authentication.

## Changes Made

### 1. App Sidebar (`components/dashboard/app-sidebar.tsx`)
- Shows real GitHub avatar
- Displays actual user name from GitHub
- Shows GitHub username (@username)
- Generates initials from user's name
- Added logout functionality with `signOut()`

### 2. Post Composer (`components/community/post-composer.tsx`)
- Shows user's GitHub avatar
- Generates initials from user's name
- Fallback to "U" if no data available

### 3. Portfolio Preview (`components/portfolio/portfolio-preview.tsx`)
- Displays user's real name
- Shows GitHub username
- Uses GitHub bio or fallback text
- Shows user's website from GitHub blog field
- Generates initials for avatar placeholder

### 4. Settings Profile (`components/settings/settings-profile.tsx`)
- Already updated in previous implementation
- Auto-populates with GitHub data

### 5. Settings Integrations (`components/settings/settings-integrations.tsx`)
- Already updated in previous implementation
- Shows real GitHub connection status

### 6. Settings Preferences (`components/settings/settings-preferences.tsx`)
- Shows user's actual email from GitHub
- Fallback to placeholder if no email

### 7. Settings Resume (`components/settings/settings-resume.tsx`)
- Resume filename uses GitHub username
- Format: `{username}_resume_2025.pdf`

### 8. Notification Panel (`components/dashboard/notification-panel.tsx`)
- Mentions use actual GitHub username
- Dynamic @username in notification descriptions

## Data Sources

All data comes from the `useGitHub()` hook which fetches:
- `profile.user.name` - Full name
- `profile.user.login` - GitHub username
- `profile.user.email` - Email address
- `profile.user.avatar_url` - Profile picture
- `profile.user.bio` - Bio/description
- `profile.user.blog` - Website URL

## Fallback Behavior

When GitHub data is not available:
- Name: "User" or "Your Name"
- Username: "user" or "username"
- Email: "your.email@example.com"
- Bio: "Full-Stack Developer | Open Source Contributor"
- Initials: "U" or first 2 letters of username

## User Experience

### Before Login
- Generic placeholders shown
- No personal data displayed

### After Login
- All components automatically show real GitHub data
- Avatar images load from GitHub
- Names, usernames, and emails populate everywhere
- Consistent user identity across the app

## Components Using Dynamic Data

1. App Sidebar - User profile section
2. Post Composer - Avatar and identity
3. Portfolio Preview - Full profile display
4. Settings Profile - All form fields
5. Settings Integrations - Connection status
6. Settings Preferences - Email notifications
7. Settings Resume - File naming
8. Notification Panel - Mentions and references

## Technical Implementation

### Pattern Used
```tsx
const { profile } = useGitHub()
const userName = profile?.user.name || "Fallback Name"
const userLogin = profile?.user.login || "username"
const userAvatar = profile?.user.avatar_url
```

### Avatar Pattern
```tsx
<Avatar>
  {userAvatar && <AvatarImage src={userAvatar} alt={userName} />}
  <AvatarFallback>{initials}</AvatarFallback>
</Avatar>
```

### Initials Generation
```tsx
const initials = profile?.user.name
  ? profile.user.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
  : userLogin.slice(0, 2).toUpperCase()
```

## Benefits

1. Personalized experience for each user
2. No hardcoded test data in production
3. Consistent identity across all features
4. Automatic updates when GitHub data changes
5. Graceful fallbacks for missing data
6. Professional appearance with real user data
