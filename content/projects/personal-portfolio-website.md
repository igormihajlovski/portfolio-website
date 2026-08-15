---
title: Personal Portfolio Website
slug: personal-portfolio-website
translation_id: project-personal-portfolio-website
status: Published
category: Development
published_date: 2026-08-09
project_status: Maintenance
featured_project: true
show_on_homepage: true
short_description: A personal portfolio originally designed and built in
  Webflow, later transformed into a self-hosted, CMS-driven website with
  Eleventy, Pages CMS, GitHub Actions, and automated deployment to Hostinger.
hero:
  subtitle: Webflow Portfolio Evolved into a Self-Hosted CMS Platform
  featured_image: /images/Featured-image-Portfolio-p-1080.png
  services:
    - Web Design
    - Web Development
    - Webflow Development
    - Website Migration
    - CMS Development
    - Deployment Automation
  technologies:
    - Webflow
    - HTML5
    - CSS3
    - JavaScript
    - Eleventy
    - Nunjucks
    - Markdown
    - Pages CMS
    - Git
    - GitHub
    - GitHub Actions
    - PHP
    - Cloudflare Turnstile
    - Hostinger
    - FTP
project_information:
  client: Personal Project
  industry: Web Design & Development
  country: North Macedonia
  business_type: Personal Portfolio
  platform: Webflow / Self-Hosted
  cms: Pages CMS
  duration: Ongoing
  website: https://igormihajlovski.com/
project_overview: >-
  My personal portfolio started as a website designed in Figma and developed in
  Webflow to showcase my work, services, and experience as a Webflow developer.


  As the portfolio evolved, I wanted greater control over the codebase, hosting,
  content management, and future development while preserving the existing
  design and responsive experience. The Webflow site was therefore exported and
  migrated to Hostinger, where it became the foundation for a progressively more
  customized development setup.


  The website was later extended with Eleventy as a static site generator,
  reusable Nunjucks templates, Markdown-based project content, and Pages CMS for
  managing case studies without manually editing HTML. Git and GitHub were
  introduced for version control, while GitHub Actions now automatically builds
  the Eleventy site and deploys the production files to Hostinger after content
  or code changes are committed.


  The result is an evolving, self-hosted portfolio platform that combines the
  visual foundation created in Figma and Webflow with a lightweight CMS,
  structured content, version control, and an automated deployment workflow.
challenge: >-
  The main challenge was to move an existing Webflow portfolio toward a more
  flexible and independently managed setup without rebuilding the website from
  scratch or compromising its established design, responsive behavior, and
  interactions.


  The original website depended on Webflow for hosting and content structure.
  After exporting the site, the existing HTML, CSS, JavaScript, animations,
  contact form, and responsive behavior had to continue working correctly in a
  self-hosted environment. At the same time, the portfolio needed a practical
  way to add and maintain case studies without manually creating and updating
  HTML pages for every new project.


  Another challenge was creating a publishing workflow that remained simple to
  use. Content changes made through the CMS needed to be stored in GitHub,
  converted into production-ready pages by Eleventy, and deployed automatically
  to Hostinger without requiring a manual build and file upload after every
  update.


  The solution therefore had to preserve the original frontend while gradually
  introducing structured content, reusable templates, version control, CMS-based
  editing, secure form handling, and reliable automated deployment — without
  introducing an unnecessary backend or paid CMS dependency.
goals:
  - Preserve the original Webflow design, responsive behavior, and user
    experience after migration.
  - Move the portfolio to a self-hosted environment with greater control over
    hosting, code, and future development.
  - Create a structured and maintainable system for publishing portfolio
    projects and case studies.
  - Introduce a lightweight CMS that allows content to be managed without
    manually editing HTML files.
  - Use reusable templates and structured content to keep all case study pages
    visually and technically consistent.
  - Establish Git-based version control and an automated build and deployment
    workflow.
  - Keep the architecture lightweight and cost-efficient without introducing an
    unnecessary backend or paid CMS dependency.
my_role:
  roles:
    - UI/UX Designer
    - Webflow Developer
    - Front-End Developer
    - CMS Developer
    - Deployment & Automation
  responsibilities:
    - Designed the original portfolio interface and user experience in Figma.
    - Developed the original responsive website in Webflow.
    - Managed the Webflow export and migration to a self-hosted Hostinger
      environment.
    - Preserved and extended the existing HTML, CSS, JavaScript, animations, and
      responsive behavior.
    - Implemented and maintained the PHP contact form with Cloudflare Turnstile
      protection.
    - Designed the Eleventy and Nunjucks architecture for reusable case study
      pages.
    - Implemented Markdown-based project content and Pages CMS for content
      management.
    - Configured Git and GitHub for source control and content versioning.
    - Built the GitHub Actions workflow for automatic Eleventy builds and FTP
      deployment to Hostinger.
    - Maintain and continuously extend the portfolio with new projects, case
      studies, and functionality.
my_approach: >-
  I approached the project as a gradual evolution rather than a complete
  rebuild. The existing Webflow portfolio already had an established visual
  identity, responsive structure, and working interactions, so the priority was
  to preserve that foundation while progressively gaining more control over the
  website and its development workflow.


  The first step was to export the Webflow website and establish a clean local
  development structure. Instead of replacing the existing frontend, I retained
  the generated HTML, CSS, JavaScript, assets, and interactions, then adapted
  and extended them where necessary for independent hosting.


  The next stage focused on making the portfolio easier to maintain and expand.
  Eleventy was introduced as a lightweight static site generator, with reusable
  Nunjucks templates and Markdown-based content separating project information
  from presentation. Pages CMS was then added as an editing layer, allowing case
  studies to be created and updated through a visual interface while keeping the
  content stored directly in the GitHub repository.


  Finally, I automated the publishing workflow. Changes committed to the main
  GitHub branch trigger GitHub Actions, which installs the project dependencies,
  builds the Eleventy site, and deploys the generated production files to
  Hostinger through a dedicated FTP account restricted to the portfolio’s public
  directory.


  This incremental approach allowed the portfolio to evolve from a hosted
  Webflow website into an independently managed platform without sacrificing the
  original design or introducing unnecessary infrastructure.
design_process: >-
  The design process started in Figma, where I created the visual direction,
  page structure, typography, spacing, color system, and overall user experience
  for the portfolio. The goal was to create a clean and modern presentation that
  keeps the focus on my work while maintaining a distinctive personal identity.


  The interface was designed around clear content hierarchy, strong project
  presentation, and straightforward navigation between services, portfolio work,
  and contact information. Reusable visual patterns were established to maintain
  consistency across sections and screen sizes.


  After the design direction was established, I recreated the interface in
  Webflow and refined it directly in the browser. Responsive layouts were
  developed and tested across desktop, tablet, and mobile breakpoints, with
  particular attention to typography, spacing, content flow, and interactive
  elements.


  Motion and interaction were used selectively to make the experience more
  engaging without distracting from the content. The resulting Webflow
  implementation became the visual foundation that was preserved throughout the
  later migration and technical evolution of the website.
development_process: >-
  Development began with the original Webflow implementation, where the approved
  Figma design was translated into a responsive website using Webflow’s layout
  system together with custom HTML, CSS, and JavaScript where additional control
  was required.


  As the project evolved, the Webflow website was exported and moved into a
  local development environment. The existing frontend structure, styles,
  JavaScript, images, animations, and other assets were preserved while the
  project was reorganized for independent development and deployment. The
  website was then migrated to Hostinger, removing the dependency on Webflow
  hosting while retaining the established frontend experience.


  The self-hosted version was further extended with custom functionality. The
  contact form uses a PHP endpoint for server-side processing and Cloudflare
  Turnstile for bot protection, while existing interactive components and
  responsive behavior were maintained and refined where necessary.


  The next major development stage introduced Eleventy as the static site
  generator for portfolio case studies. Project content was separated from
  presentation and stored as structured Markdown, while reusable Nunjucks
  templates generate consistent case study pages. Pages CMS was connected to the
  GitHub repository to provide a visual interface for creating and editing
  project content without manually modifying Markdown or HTML files.


  Git and GitHub provide version control for both the website code and
  CMS-managed content. The publishing process was then automated with GitHub
  Actions: every relevant change pushed to the main branch triggers dependency
  installation and an Eleventy production build, after which the generated
  `_dist` files are deployed automatically to the portfolio’s `public_html`
  directory on Hostinger through a dedicated FTP account.


  This development workflow allows future case studies and website improvements
  to move from content or code changes to the live production website through a
  consistent, version-controlled, and largely automated process.
tech_stack:
  development:
    - HTML5
    - CSS3
    - JavaScript
    - PHP
    - Eleventy (11ty)
    - Nunjucks
    - Markdown
  cms:
    - Pages CMS
  libraries:
    - jQuery
    - GSAP
    - WebFont Loader
  integrations:
    - Cloudflare Turnstile
    - GitHub Actions
    - FTP Deployment
  tools:
    - Figma
    - Webflow
    - Visual Studio Code
    - Git
    - GitHub
    - Hostinger
    - Google Search Console
    - Google Analytics
    - Microsoft Clarity
third_party_integrations:
  - name: Cloudflare Turnstile
    purpose: Bot protection and spam prevention for the portfolio contact form.
    website: https://www.cloudflare.com/products/turnstile/
  - name: GitHub
    purpose: Source control and repository hosting for the website code and
      CMS-managed content.
    website: https://github.com/
  - name: GitHub Actions
    purpose: Automated production builds and deployment after changes are pushed to
      the main branch.
    website: https://github.com/features/actions
  - name: Hostinger
    purpose: Production hosting, domain management, PHP processing, and FTP
      deployment destination.
    website: https://www.hostinger.com/
  - name: Google Search Console
    purpose: Search performance monitoring, indexing visibility, and SEO diagnostics.
    website: https://search.google.com/search-console/
  - name: Google Analytics
    purpose: Website traffic and visitor behavior analytics.
    website: https://analytics.google.com/
  - name: Microsoft Clarity
    purpose: User behavior analytics through session recordings and heatmaps to
      identify usability issues and improve the website experience.
    website: https://clarity.microsoft.com/
key_features:
  - Responsive Webflow-based frontend preserved and adapted for independent
    hosting.
  - Self-hosted production website with full control over the codebase and
    hosting environment.
  - Eleventy-powered static generation for portfolio projects and case studies.
  - Reusable Nunjucks templates for consistent case study layouts.
  - Markdown-based structured content separated from presentation and page
    templates.
  - Pages CMS interface for creating and editing case studies without manually
    modifying code.
  - Git and GitHub version control for both website code and CMS-managed content.
  - Automated GitHub Actions workflow that builds and deploys production changes
    to Hostinger.
  - PHP-powered contact form protected against spam and bots with Cloudflare
    Turnstile.
  - Microsoft Clarity integration for heatmaps, session recordings, and user
    behavior analysis.
  - SEO and analytics setup for monitoring search visibility, traffic, and
    website performance.
  - Expandable case study system designed for continuously adding new portfolio
    projects.
deliverables:
  - Custom-designed responsive portfolio website
  - Production-ready self-hosted website on Hostinger
  - Eleventy static site generation architecture
  - Reusable Nunjucks case study template system
  - Markdown-based structured project content
  - Pages CMS content management interface
  - GitHub repository and version-controlled development workflow
  - Automated GitHub Actions build and deployment pipeline
  - Secure PHP contact form with Cloudflare Turnstile protection
  - Analytics and user behavior tracking integration
  - SEO-ready project and case study structure
  - Scalable portfolio system for publishing future projects
results: >-
  The project evolved from a Webflow-hosted portfolio into an independently
  managed, self-hosted platform while preserving the original visual design,
  responsive behavior, and frontend experience.


  Moving the website to Hostinger provided greater control over the production
  environment and removed the portfolio’s dependency on Webflow hosting. The
  existing frontend could continue to be developed independently while retaining
  the design foundation originally created in Figma and Webflow.


  The introduction of Eleventy, reusable Nunjucks templates, and structured
  Markdown content transformed the way portfolio projects are managed. New case
  studies can now be created through Pages CMS instead of manually building
  individual HTML pages, while all projects follow the same reusable structure
  and presentation.


  GitHub now acts as the central source of truth for both code and CMS-managed
  content. With GitHub Actions and automated deployment in place, changes pushed
  to the main branch are built and published to Hostinger automatically,
  significantly simplifying the publishing workflow and reducing repetitive
  manual deployment work.


  The portfolio also retains a secure server-side contact workflow with
  Cloudflare Turnstile protection and includes analytics and user-behavior
  monitoring to support future improvements.


  Most importantly, the website is no longer just a finished portfolio page. It
  has become a maintainable and extensible platform that can continue evolving
  as new projects, case studies, services, and functionality are added.
lessons_learned: >-
  This project reinforced the value of evolving an existing website
  incrementally instead of rebuilding it simply because the underlying
  architecture needs to change. The original Webflow frontend provided a strong
  visual foundation, and preserving it allowed the technical architecture to
  evolve without unnecessarily recreating work that was already successful.


  Migrating away from Webflow hosting also demonstrated the importance of
  separating design, content, and deployment concerns. Once the website was
  self-hosted, the frontend could remain largely intact while Eleventy,
  Nunjucks, and Markdown were introduced specifically where they provided value
  — reusable templates and structured case study content.


  Building the CMS workflow highlighted another important lesson: a content
  management system does not necessarily require a traditional database or
  backend. For a portfolio with relatively structured and infrequently changing
  content, Markdown stored in GitHub combined with Pages CMS provides a
  lightweight solution with built-in version history and full ownership of the
  content.


  Automating deployment was equally important. Manual uploads are manageable at
  the beginning, but they quickly become inefficient once content is updated
  through a CMS. Connecting Pages CMS, GitHub, GitHub Actions, Eleventy, and
  Hostinger created a much cleaner publishing workflow and reduced the number of
  manual steps required to move a change into production.


  The project also reinforced the importance of choosing technology according to
  the actual problem rather than adding complexity for its own sake. The current
  architecture remains intentionally lightweight while still providing content
  management, reusable templates, version control, automated deployment,
  security, analytics, and room for future expansion.


  Because the portfolio remains an ongoing project, the architecture can
  continue evolving as new requirements appear without requiring another
  complete rebuild.
project_links:
  live_url: https://igormihajlovski.com/
  live_button_text: View Project
  github_url: https://github.com/igormihajlovski/portfolio-website
  github_button_text: View Source Code
  demo_button_text: View Demo
seo:
  title: Personal Portfolio Website Case Study | Igor Mihajlovski
  description: See how I transformed my Webflow portfolio into a self-hosted
    website with Eleventy, Pages CMS, GitHub Actions, and automated Hostinger
    deployment.
  og_image: /images/Featured-image-Portfolio-p-1080.png
---
