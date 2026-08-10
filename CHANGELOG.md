# Changelog

All notable changes to this project will be documented in this file.

## [1.2.0] - 2026-08-10

### Added

- Separate Blog infrastructure and empty-state listing at `/blog/`
- Dedicated `content/blog/` Markdown collection with published/draft handling
- Blog Posts collection in Pages CMS
- Reusable responsive Blog Article layout and scoped Blog styles
- Blog navigation links in the existing Navbar and Footer
- Blog-specific canonical, Open Graph, and Twitter metadata fallbacks

### Preserved

- Existing Projects collection, Case Study templates, cards, routes, and homepage logic
- Exact legacy Case Study slug redirects from `/blog/<old-case-study>/` to `/projects/<slug>/`

## [1.1.0] - 2026-08-08

### Added

- Minimal Eleventy static-generation pipeline with `_dist/` production output
- Pages CMS Markdown collection for reusable Case Study pages
- Automatically sorted Case Studies listing at `/projects/`
- CMS-driven homepage Portfolio cards, limited to three enabled entries
- Conditional Case Study sections and project links
- Per-Case-Study canonical, Open Graph, and Twitter metadata
- Shared Case Study navigation, footer, analytics, Clarity, and Webflow assets
- Case Study workflow and Hostinger deployment documentation

### Preserved

- Existing Webflow-exported homepage design and interactions
- PHP contact form and Cloudflare Turnstile integration
- Existing static assets, analytics, social links, and responsive navigation

## [1.0.0] - 2026-08-06

### Added

- Initial public release
- Responsive portfolio website
- Custom PHP contact form
- Cloudflare Turnstile integration
- SEO optimization
- Google Analytics integration
- Google Search Console integration
- Schema.org structured data
- GitHub profile integration

### Improved

- Contact form validation
- Success and error message styling
- Accessibility
- Performance optimization
- Code organization

### Security

- Cloudflare Turnstile protection
- Honeypot spam protection
- Server-side validation
