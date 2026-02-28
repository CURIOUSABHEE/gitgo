# LinkedIn Integration Setup Guide

## Prerequisites

### 1. Create LinkedIn OAuth App

1. Go to [LinkedIn Developers](https://www.linkedin.com/developers/apps)
2. Click "Create app"
3. Fill in the required information:
   - App name: "GitGo" (or your app name)
   - LinkedIn Page: Select or create a page
   - App logo: Upload your logo
   - Legal agreement: Accept terms

4. Go to "Auth" tab
5. Add Redirect URLs:
   ```
   http://localhost:3000/api/auth/callback/linkedin
   https://yourdomain.com/api/auth/callback/linkedin
   ```

6. Under "OAuth 2.0 scopes", request these permissions:
   - `r_liteprofile` - Basic profile info
   - `r_emailaddress` - Email address
   - `w_member_social` - (Optional) Share content

7. Copy your credentials:
   - Client ID
   - Client Secret

### 2. Add Environment Variables

Add to your `.env` file:

```env
# LinkedIn OAuth
LINKEDIN_CLIENT_ID=your_linkedin_client_id
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret
```

### 3. Install Dependencies

The required packages should already be installed:
```bash
npm install next-auth
```

## What Data We'll Fetch from LinkedIn

### Profile Data
- Full name
- Headline (professional title)
- Summary (bio)
- Profile picture URL
- Location
- Industry
- Email address

### Experience Data
- Company name
- Job title
- Start date / End date
- Description
- Location

### Education Data
- School name
- Degree
- Field of study
- Start date / End date
- Description

### Skills
- Skill names
- Endorsement counts

## Implementation Steps

The implementation includes:

1. ✅ NextAuth LinkedIn provider configuration
2. ✅ User model updated with LinkedIn fields
3. ✅ LinkedIn API service for data fetching
4. ✅ API endpoints for LinkedIn sync
5. ✅ Frontend integration in settings
6. ✅ Data storage in MongoDB

## Testing

### 1. Test OAuth Flow
1. Go to Settings → Integrations
2. Click "Connect" on LinkedIn
3. Authorize the app on LinkedIn
4. Should redirect back to settings
5. LinkedIn should show as "Connected"

### 2. Test Data Sync
1. After connecting, click "Re-sync Data"
2. Check MongoDB for LinkedIn data
3. Verify profile data is populated

### 3. Test Data Display
1. Go to Settings → Profile
2. LinkedIn data should be available
3. Check if experience/education is stored

## Security Notes

- LinkedIn access tokens expire after 60 days
- Refresh tokens can be used to get new access tokens
- Store tokens securely in database
- Never expose tokens in client-side code
- Use HTTPS in production

## Rate Limits

LinkedIn API rate limits:
- 500 requests per user per day
- 100,000 requests per app per day

## Troubleshooting

### "Redirect URI mismatch"
- Verify redirect URL in LinkedIn app settings
- Must match exactly (including http/https)

### "Invalid scope"
- Check requested scopes in LinkedIn app
- Verify scopes are approved

### "Token expired"
- Implement token refresh logic
- Re-authenticate user if refresh fails

## Next Steps

After setup:
1. Test OAuth flow
2. Verify data is fetched correctly
3. Check MongoDB storage
4. Test re-sync functionality
5. Add error handling
6. Implement token refresh

## API Endpoints

### Connect LinkedIn
```
GET /api/auth/signin/linkedin
```

### Sync LinkedIn Data
```
POST /api/linkedin/sync
Response: { success: true, data: {...} }
```

### Get LinkedIn Profile
```
GET /api/linkedin/profile
Response: { profile: {...}, experience: [...], education: [...] }
```

## Database Schema

LinkedIn data is stored in the User model:

```typescript
{
  linkedinId: string
  linkedinAccessToken: string
  linkedinRefreshToken: string
  linkedinTokenExpiry: Date
  linkedinProfile: {
    headline: string
    summary: string
    industry: string
    profilePicture: string
  }
  linkedinExperience: [{
    company: string
    title: string
    startDate: Date
    endDate: Date
    description: string
    location: string
  }]
  linkedinEducation: [{
    school: string
    degree: string
    fieldOfStudy: string
    startDate: Date
    endDate: Date
  }]
  linkedinSkills: [string]
}
```

## Resources

- [LinkedIn OAuth Documentation](https://docs.microsoft.com/en-us/linkedin/shared/authentication/authentication)
- [LinkedIn API Reference](https://docs.microsoft.com/en-us/linkedin/shared/references/v2)
- [NextAuth LinkedIn Provider](https://next-auth.js.org/providers/linkedin)
