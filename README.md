# Igor Mihajlovski – Portfolio Website

Official source code for my personal portfolio website.

🌐 Live Website: https://igormihajlovski.com

---

## Overview

This project is the official source code for my personal portfolio website.

Although originally designed in Webflow, the website has been migrated to independent hosting to provide full control over hosting, security, performance, and future development.

The project includes a custom PHP contact form protected with Cloudflare Turnstile, SEO optimization, structured data, responsive layouts, and modern frontend development practices.

---

## Features

- Responsive Design
- Custom Contact Form
- PHP Backend
- Cloudflare Turnstile Protection
- SEO Optimized
- Schema.org Structured Data
- Google Analytics
- Google Search Console
- CMS-ready Architecture
- Optimized Images
- Accessibility Best Practices

---

## Technologies

- HTML5
- CSS3
- JavaScript (ES6)
- PHP
- Eleventy (build time only)
- Markdown and Pages CMS
- Cloudflare Turnstile
- Google Analytics
- Webflow Export

---

## Case Study Content Workflow

Pages CMS edits Markdown files in `content/projects/` using the authoritative
schema in `.pages.yml`. Each saved entry is collected by Eleventy and generates:

- an individual page at `/projects/<slug>/`
- a card on `/projects/`, sorted by `published_date` (newest first)
- a homepage Portfolio card when `show_on_homepage` is enabled

The homepage uses the same date sorting and displays no more than three enabled
entries. Empty optional fields and sections are omitted by the shared Case Study
template.

To add a Case Study, create it in Pages CMS, complete the configured fields, and
save it. Do not edit the frontmatter structure outside the CMS schema. Images are
stored under `images/` and their CMS paths are used directly at build time.

---

## Blog Content Workflow

The Blog is a separate content system from Projects. Pages CMS writes Blog Posts
to `content/blog/` using the dedicated Blog Posts schema in `.pages.yml`.
Published entries generate:

- an individual article at `/blog/<slug>/`
- a card on `/blog/`, sorted by `published_date` (newest first)

Draft entries are excluded from the Blog collection and do not generate public
article pages. Blog Posts use the reusable `templates/layouts/blog-post.njk`
layout. Until the first article is published, `/blog/` displays its empty state.
The homepage does not include a Blog feed.

---

## Local Development and Build

Install the build dependencies once:

```bash
npm install
```

Run the local Eleventy development server:

```bash
npm run dev
```

Create a clean production build:

```bash
npm run build
```

The deployable static site is written to `_dist/`. Eleventy and Node.js are only
used during development/build and are not required on Hostinger.

---

## Hostinger Deployment

After reviewing a successful production build, upload the contents of `_dist/`
to the Hostinger web root. The build copies the existing CSS, JavaScript, images,
documents, and `php/` contact endpoint without processing the PHP files. Keep the
server-side contact configuration protected as it is in the current hosting
workflow.

---

## Project Structure

```text
portfolio-website/
│
├── css/
├── documents/
├── images/
├── js/
├── php/
├── projects/
├── blog/
├── content/projects/
├── content/blog/
├── templates/
├── eleventy.config.js
├── package.json
├── index.html
└── styleguide.html
```

---

## Live Demo

https://igormihajlovski.com

---

## Author

**Igor Mihajlovski**

Freelance Webflow Developer

- Website: https://igormihajlovski.com
- LinkedIn: https://www.linkedin.com/in/igor-mihajlovski-37914a164
- GitHub: https://github.com/igormihajlovski

---

## License

This project is licensed under the MIT License.
