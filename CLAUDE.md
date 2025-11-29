# CLAUDE.md - Cappy Studios Development Guide

This file helps Claude Code understand the project context and assist with development.

## Project Overview

**Cappy Studios** is a personal portfolio/studio website showcasing games, web apps, and pixel art.

- **Owner**: Dylan
- **Location**: Belgium
- **Tech Stack**: HTML5, CSS3, JavaScript, Firebase Hosting
- **Design Style**: Matte black with purple/pink-blue accents, glassmorphism, ripple effects

## Brand Guidelines

### Colors
```css
--bg-primary: #0a0a0a      /* Matte black */
--accent-purple: #9333ea    /* Primary accent */
--accent-pink: #ec4899      /* Secondary accent */
--accent-blue: #3b82f6      /* Tertiary accent */
```

### Typography
- Headers: Bold, uppercase, letter-spacing
- Body: Clean, readable, light on dark
- Logo: Gradient text effect

### Design Principles
- Clean and fluid
- Responsive on all devices
- No watermarks or third-party branding
- Interactive elements (ripples, hover effects)
- Glassmorphism cards
- Smooth animations

## File Structure

```
cappy-studios/
├── index.html              # Home page
├── projects.html           # Projects gallery
├── about.html              # About page
├── contact.html            # Contact form
├── assets/
│   ├── css/
│   │   ├── main.css        # Base template styles
│   │   └── custom.css      # Cappy Studios custom theme
│   ├── js/
│   │   ├── main.js         # Template scripts
│   │   └── custom/
│   │       └── cappy.js    # Custom interactions
│   └── images/
│       ├── games/          # Game screenshots & previews
│       ├── pixel-art/      # Pixel art gallery
│       └── partners/       # Partner/tool logos
└── CLAUDE.md               # This file
```

## Current Projects to Feature

### Games

| Name | Status | Tech | Description |
|------|--------|------|-------------|
| Snake-50 | ✅ Live | JS, Firebase | Classic snake with modes, auth, leaderboards |
| Once I Was a Crybaby | 🔨 In Dev | Godot | Narrative adventure (with CS master partner) |
| Trucker Idle | 📋 Planned | TBD | Build a trucking empire idle game |
| Tea Farmer Idle | 📋 Planned | TBD | Relaxing tea farm idle game |

### Skills to Display
- Python, JavaScript, HTML/CSS, C, SQLite
- CS50 Certified
- Pixel art, video editing, music

## Common Tasks

### Adding a New Game
1. Add screenshot to `assets/images/games/`
2. Edit `index.html` - add card to games showcase
3. Edit `projects.html` - add full entry
4. Update status badge (live/development/planned)

### Updating Styles
- All custom styles go in `assets/css/custom.css`
- Use CSS variables for colors
- Follow glassmorphism pattern for cards

### Adding Interactive Effects
- Edit `assets/js/custom/cappy.js`
- Follow existing class-based pattern
- Initialize in DOMContentLoaded

## Deployment

### Live Site
- **URL**: https://cappy-studios.web.app
- **Custom Domain**: cappystudios.dev (when configured)
- **Firebase Project**: cappy-studios

### Quick Deploy Commands

```bash
# Deploy everything (hosting + functions)
firebase deploy

# Deploy only the website (faster for HTML/CSS/JS changes)
firebase deploy --only hosting

# Deploy only Cloud Functions (for backend changes)
firebase deploy --only functions
```

### Firebase Setup (First Time Only)
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize (already done, but for reference)
firebase init
```

### Deployment Workflow

1. **Make your changes** to HTML/CSS/JS or functions code
2. **Test locally** (optional but recommended)
   ```bash
   npx serve
   # or
   python -m http.server 8000
   ```
3. **Update CHANGELOG.md** with changes (add to `[Unreleased]` section)
4. **Commit to git**
   ```bash
   git add .
   git commit -m "Description of changes"
   git push origin master
   ```
5. **Deploy to Firebase**
   ```bash
   firebase deploy
   ```

### Contact Form Cloud Function

The contact form uses a Firebase Gen 2 Cloud Function that:
- Receives form submissions via POST request
- Validates input and sanitizes against XSS
- Sends email notifications via nodemailer (Gmail)
- Uses Firebase Secrets Manager for credentials

**Current Function URL**: `https://submitcontactform-cgelub3v5a-uc.a.run.app`

**Important**: If you redeploy functions and the URL changes, update `assets/js/custom/contact-form.js` line 31 with the new URL from the deployment output.

### Secrets Management

Gmail credentials are stored in Firebase Secrets Manager (NOT in code):
- `GMAIL_EMAIL` - Email address for sending contact form notifications
- `GMAIL_PASSWORD` - Gmail app password

These are automatically available when deploying from any authenticated device.

To update secrets:
```bash
firebase functions:secrets:set GMAIL_EMAIL
firebase functions:secrets:set GMAIL_PASSWORD
```

### File Structure for Deployment

**What's deployed:**
- All HTML files (index.html, projects.html, about.html, contact.html)
- `assets/` folder (CSS, JS, images)
- `functions/` folder (Cloud Function code)

**What's ignored:**
- `.firebase/` (build cache)
- `node_modules/` (installed during deployment)
- `.git/`, `.claude/` (dev files)
- `CLAUDE.md`, `CHANGELOG.md` (documentation)

### Common Deployment Issues

**Issue**: Function URL changed after deployment
- **Cause**: Firebase Gen 2 functions use different URL format
- **Fix**: Update the fetch URL in `assets/js/custom/contact-form.js`
- **Look for**: Deployment output shows new URL

**Issue**: Functions package.json outdated warning
- **Warning**: `firebase-functions` version outdated
- **Impact**: Non-critical, functions still work
- **Fix** (when ready):
  ```bash
  cd functions
  npm install --save firebase-functions@latest
  cd ..
  firebase deploy --only functions
  ```

**Issue**: Can't deploy from new device
- **Cause**: Not logged into Firebase CLI
- **Fix**: Run `firebase login` first

**Issue**: Secrets not found
- **Cause**: Gmail credentials not set in Firebase Secrets Manager
- **Fix**: Set secrets using `firebase functions:secrets:set`

### Firebase Config Files

**firebase.json** - Main config
```json
{
  "functions": {
    "source": "functions"
  },
  "hosting": {
    "public": ".",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "headers": [
      {
        "source": "**",
        "headers": [
          {"key": "X-Frame-Options", "value": "DENY"},
          {"key": "X-Content-Type-Options", "value": "nosniff"},
          {"key": "Referrer-Policy", "value": "strict-origin-when-cross-origin"}
        ]
      }
    ]
  }
}
```

**.firebaserc** - Project ID
```json
{
  "projects": {
    "default": "cappy-studios"
  }
}
```

## Image Placeholders Needed

Replace these placeholder images:
- `images/games/snake-50-preview.jpg` - Snake-50 screenshot
- `images/games/snake-50-bg.jpg` - Snake-50 for slider
- `images/games/crybaby-preview.jpg` - Crybaby concept art
- `images/games/crybaby-bg.jpg` - Crybaby for slider
- `images/games/trucker-idle-preview.jpg` - Trucker Idle concept
- `images/games/trucker-idle-bg.jpg` - Trucker for slider
- `images/games/tea-farmer-preview.jpg` - Tea Farmer concept
- `images/about-photo.jpg` - Personal photo
- `images/partners/firebase-logo.png` - Firebase logo
- `images/partners/godot-logo.png` - Godot logo
- `images/partners/cs50-logo.png` - CS50 badge
- `images/pixel-art/art-01.png` through `art-06.png` - Pixel art pieces

## Quick Commands for Claude Code

### Preview locally
```bash
# Simple Python server
python -m http.server 8000

# Or with npm
npx serve
```

### Check for broken links
```bash
grep -r "href=\"#\"" *.html
```

### Minify CSS for production
```bash
npx csso assets/css/custom.css -o assets/css/custom.min.css
```

## Future Enhancements

- [x] Add actual form submission (Firebase Functions or Formspree) - ✅ DONE (v1.1.0)
- [x] Add security headers for production - ✅ DONE (v1.1.0)
- [ ] Implement image lazy loading
- [ ] Add dark/light mode toggle (currently dark only)
- [ ] Add blog/devlog section
- [ ] Implement game embed previews
- [ ] Add Ko-fi or support button
- [ ] SEO optimization (meta tags, Open Graph, structured data)
- [ ] Analytics integration (Google Analytics or privacy-focused alternative)
- [ ] Performance optimization (minify CSS/JS, compress images)
- [ ] PWA support (service worker, offline capability)
- [ ] Upgrade firebase-functions to latest version

## Notes for Claude

- Keep the matte black + purple/pink-blue aesthetic consistent
- Use glass-card class for any new card components
- Maintain responsive design (test on mobile)
- Avoid adding dependencies - keep it vanilla JS
- When adding new sections, follow existing HTML structure
- Always test ripple effect doesn't interfere with interactions

## Contact Info (for forms)

- Email: hello@cappystudios.com (placeholder - update when domain active)
- Location: Belgium
- Social links: Update href="#" with actual links when ready
