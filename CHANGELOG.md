# Changelog

All notable changes to Cappy Studios will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.1.0] - 2025-11-29

### Added
- Contact form with Firebase Cloud Function backend integration
- Email notifications via nodemailer for contact form submissions
- Security headers for enhanced protection
  - X-Frame-Options (clickjacking protection)
  - X-Content-Type-Options (MIME type sniffing prevention)
  - X-XSS-Protection
  - Referrer-Policy
  - Permissions-Policy
- Form validation with user feedback messages
- Animated success/error notifications on form submission

### Security
- Input sanitization to prevent XSS attacks in contact form
- CORS restrictions limited to production domain (cappystudios.dev)
- Gmail credentials stored securely in Firebase Secrets Manager
- Email regex validation for contact form
- HTML escaping for all user-submitted content

### Changed
- Contact form now functional (previously placeholder)
- Improved error handling with user-friendly messages

## [1.0.1] - 2025-11-28

### Added
- Snake-50 game screenshots and preview images
- Direct links to Snake-50 live game

### Fixed
- Firebase deployment configuration
- Partner logos not displaying correctly
- Missing game assets

## [1.0.0] - 2025-11-27

### Added
- Initial portfolio website launch
- Home page with hero section and game showcase
- Projects gallery page
- About page with skills and background
- Contact page (form placeholder)
- Responsive design for mobile, tablet, and desktop
- Glassmorphism card design system
- Interactive ripple effects on buttons
- Custom Cappy Studios branding and color scheme
- Snake-50 game showcase
- "Once I Was a Crybaby" project preview
- Planned games section (Trucker Idle, Tea Farmer Idle)
- Partner/technology logos (Firebase, Godot, CS50)
- Firebase Hosting setup
- Custom CSS theme with matte black and purple/pink-blue accents

### Technical
- HTML5, CSS3, vanilla JavaScript
- Firebase Hosting configuration
- Responsive navigation menu
- Font Awesome icons integration
- Google Fonts (custom typography)

---

## Version Guidelines

- **Major version (X.0.0)**: Breaking changes, major redesigns, or significant feature additions
- **Minor version (0.X.0)**: New features, enhancements, backward-compatible changes
- **Patch version (0.0.X)**: Bug fixes, minor tweaks, security patches

## Categories

- **Added**: New features
- **Changed**: Changes to existing functionality
- **Deprecated**: Soon-to-be removed features
- **Removed**: Removed features
- **Fixed**: Bug fixes
- **Security**: Security improvements or vulnerability fixes
- **Technical**: Infrastructure, build, or deployment changes
