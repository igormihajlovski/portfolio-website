---
title: Jaeger Immobilien Morsbach
slug: jaeger-immobilien-morsbach
category: CRM Integration
published_date: 2026-08-09
project_status: Completed
featured_project: true
show_on_homepage: true
short_description: A Webflow real estate website with dynamic property and blog
  CMS collections, enhanced by an automated Propstack CRM integration using Make
  and Cloudflare Workers.
hero:
  subtitle: A scalable Webflow real estate platform combining dynamic property
    listings, a structured Blog CMS, and automated Propstack CRM synchronization
    through Make and Cloudflare Workers.
  featured_image: /images/Jaeger-Immobilien-project-p-500.jpg
  services:
    - Webflow Development
    - CMS Development
    - CRM Integration
    - Workflow Automation
    - API Integration
    - Responsive Design
    - SEO Foundation
  technologies:
    - Webflow
    - Webflow CMS
    - Propstack CRM
    - Make
    - Cloudflare Workers
    - REST API
    - HTML5
    - CSS3
    - JavaScript
project_information:
  client: Jaeger Immobilien
  industry: Real Estate
  country: Germany
  business_type: Real Estate Agency
  platform: Webflow
  cms: Webflow CMS
  duration: 10 weeks
  website: https://www.jaeger-immobilien-morsbach.de/
project_overview: >-
  Jaeger Immobilien Morsbach is a modern real estate website built in Webflow to
  provide a structured, scalable platform for presenting properties, company
  content, and editorial content.


  The website combines a custom Webflow build with dedicated CMS structures for
  property listings and blog content, allowing dynamic pages and reusable
  content while maintaining a consistent design across the site.


  A key part of the project was connecting the website with Propstack CRM. Using
  Make and Cloudflare Workers, property data can be transferred from the CRM
  into Webflow CMS, reducing the need for duplicate manual entry and helping
  keep property information synchronized between the internal CRM workflow and
  the public website.


  The project brings together responsive Webflow development, CMS architecture,
  API integration, workflow automation, and SEO-focused implementation in a
  single maintainable system designed around the agency’s day-to-day real estate
  workflow.
challenge: >-
  The main challenge was to create a real estate website that could support both
  rich property presentation and an efficient content workflow without requiring
  the client to maintain the same property information manually in multiple
  systems.


  Property listings contain a large amount of structured data, including
  property characteristics, pricing, areas, features, descriptions, energy
  information, images, documents, and availability status. This information
  needed to be presented clearly on the website while remaining manageable
  within Webflow CMS.


  At the same time, Propstack was already the central CRM for managing property
  data. Maintaining separate property records manually in both Propstack and
  Webflow would create unnecessary duplicate work and increase the risk of
  outdated or inconsistent information.


  The challenge was therefore not only to build the website and its CMS
  structure, but also to establish a reliable connection between Propstack and
  Webflow that could translate CRM data into the website’s content structure
  while respecting the presentation and conditional visibility requirements of
  individual property pages.


  The website also required a separate, structured Blog CMS with reusable
  templates and content features, adding another dynamic content layer that
  needed to remain consistent with the overall design and responsive experience.
goals:
  - Build a modern, responsive real estate website that presents the agency, its
    services, properties, and content in a clear and professional way.
  - Create a scalable Webflow CMS architecture for dynamic property listings
    with structured data and reusable property pages.
  - Integrate Propstack CRM with Webflow to reduce duplicate manual property
    entry and improve the consistency of property information across both
    systems.
  - Automate the transfer and processing of property data through Make and
    Cloudflare Workers while keeping Webflow CMS as the website’s presentation
    layer.
  - Support complex property information, media, status changes, and conditional
    content without compromising the clarity of individual property pages.
  - Build a structured Blog CMS with reusable post templates and content
    features for ongoing editorial and SEO-focused content.
  - Create a maintainable system that allows the website and its content
    workflows to scale as new properties and blog posts are added.
my_role:
  roles:
    - Webflow Developer & Integration Developer
  responsibilities:
    - Webflow website development and responsive implementation
    - Webflow CMS architecture for property listings and blog content
    - Dynamic property template development and conditional content logic
    - Propstack CRM and REST API integration
    - Make automation workflow development
    - Cloudflare Workers integration and data-processing logic
    - Property data mapping between Propstack and Webflow CMS
    - Dynamic media, property status, and structured field handling
    - Blog CMS development and reusable post template implementation
    - Responsive testing, performance optimization, and SEO implementation
my_approach: >-
  I approached the project as both a website development and systems integration
  project. The first priority was to establish a clean Webflow structure that
  could support the agency’s public-facing content independently of the
  automation layer.


  I designed the CMS architecture around two main content systems: property
  listings and blog content. Property fields were structured to support detailed
  real estate data while allowing individual sections and values to appear only
  when relevant. The Blog CMS followed a reusable content structure for
  consistent publishing and presentation.


  For the property workflow, I treated Propstack as the source of property data
  and mapped the relevant CRM information to the corresponding Webflow CMS
  fields. This required aligning two different data structures while preserving
  the way each property needed to be presented on the website.


  Make was used to orchestrate the automated workflow, while Cloudflare Workers
  handled the additional processing required between the connected systems. This
  separated automation and transformation logic from the presentation layer and
  kept Webflow focused on rendering the final website experience.


  I implemented and tested the integration incrementally, validating property
  data, statuses, media, optional fields, and frontend conditional visibility
  rather than attempting to automate the entire workflow at once. This made it
  possible to identify mapping and presentation issues early while keeping the
  system maintainable.
design_process: >-
  The design process focused on creating a clear and professional real estate
  experience while accommodating a large amount of dynamic content.


  For property pages, information was organized into logical sections so
  visitors could quickly understand the most important details without being
  overwhelmed by the underlying amount of property data. Strong visual
  hierarchy, structured information groups, property imagery, features, pricing,
  and descriptive content were combined into a consistent reusable template.


  Conditional visibility was an important part of the design. Optional property
  information is displayed only when relevant data is available, preventing
  empty fields and unnecessary sections from appearing on the published page.


  The property gallery was designed to give imagery a prominent role while
  supporting multiple photos in a responsive carousel experience. Property
  status and other important information were positioned to remain easy to
  identify throughout the listing experience.


  The Blog followed the same visual system as the rest of the website, with
  reusable CMS templates designed for readability and long-form content.
  Features such as a table of contents, estimated reading time, and reading
  progress help visitors navigate longer articles more comfortably.


  Throughout the process, layouts were adapted and tested across desktop,
  tablet, and mobile breakpoints to maintain clear hierarchy, readable content,
  usable interactions, and consistent presentation across the website.
development_process: >-
  Development began with the Webflow structure and reusable components, followed
  by the CMS architecture required for both property listings and blog content.
  The property collection was designed to accommodate detailed real estate data
  while keeping the frontend template flexible enough to handle properties with
  different sets of available information.


  The dynamic property template was built around conditional visibility.
  Property descriptions, characteristics, pricing and cost information, areas,
  condition, energy and heating data, features, images, and other optional
  information are rendered only when the corresponding CMS data is available.
  This prevents incomplete records from creating empty or irrelevant sections on
  the live website.


  Property features were structured through CMS relationships, while the image
  gallery and carousel were designed to work dynamically with the available
  property media. Status-specific presentation logic was also incorporated so
  that the frontend could respond appropriately to changes in a property's
  marketing state.


  The next stage was the Propstack integration. Relevant property information
  from the CRM was mapped to the corresponding Webflow CMS structure, creating a
  consistent relationship between the internal property-management workflow and
  the public website.


  Make was used to orchestrate the automation between the systems, while
  Cloudflare Workers provided an additional server-side processing layer where
  required. Together, these components handle the transformation and transfer of
  data before it reaches the Webflow CMS, allowing the website to remain focused
  on presentation rather than integration logic.


  The Blog CMS was implemented as a separate dynamic content system with
  reusable post templates. Finsweet Attributes were integrated for the table of
  contents and estimated reading time, while a reading progress indicator
  improves navigation through longer articles. Heyflow was integrated where
  required for interactive lead-generation forms.


  Throughout development, the responsive layouts, CMS conditions, property data
  mappings, media behavior, automation workflow, and generated pages were tested
  incrementally to ensure that information arriving from the connected systems
  was represented correctly on the frontend.
tech_stack:
  development:
    - Webflow
    - HTML5
    - CSS3
    - JavaScript
  cms:
    - Webflow CMS
  libraries:
    - Finsweet Attributes
  integrations:
    - Propstack CRM
    - Make
    - Cloudflare Workers
    - Google Analytics
    - Google reCAPTCHA
  tools:
    - Webflow Designer
    - Propstack
    - Make
    - Cloudflare
    - Google Search Console
    - Google Analytics
    - Google reCAPTCHA
third_party_integrations:
  - name: Propstack CRM
    purpose: Serves as the central source for property data used in the automated
      property publishing workflow.
    website: https://www.propstack.de/
  - name: Make
    purpose: Orchestrates the automated workflow between Propstack and the website,
      coordinating the transfer and processing of property data.
    website: https://www.make.com/en
  - name: Cloudflare Workers
    purpose: Provides a server-side processing layer for the integration, handling
      additional data transformation and communication required by the automated
      workflow.
    website: https://www.cloudflare.com/products/workers/
  - name: Google reCAPTCHA
    purpose: Provides spam and bot protection for website forms.
    website: https://developers.google.com/recaptcha
  - name: Google Analytics
    purpose: Provides website traffic measurement and visitor analytics.
    website: https://developers.google.com/analytics
key_features:
  - Dynamic Property Listings
  - Propstack CRM Property Synchronization
  - Automated Property Data Processing with Make
  - Cloudflare Worker Integration
  - Structured Property CMS Architecture
  - Dynamic Property Detail Pages
  - Conditional Visibility for Property Data
  - Property Status-Based Content Logic
  - Dynamic Property Image Gallery & Carousel
  - Dynamic Property Features
  - Property Documents and Structured Data
  - Dynamic Blog CMS
  - Finsweet Table of Contents
  - Finsweet Reading Time
  - Post Reading Progress Indicator
  - Responsive Design
  - SEO Foundation
  - Contact Forms with Google reCAPTCHA Protection
deliverables:
  - Complete Responsive Webflow Website
  - Webflow CMS Architecture
  - Dynamic Property Listing System
  - Reusable Property Detail Template
  - Propstack CRM Integration
  - Make Automation Workflow
  - Cloudflare Worker Integration
  - Automated Property Data Synchronization
  - Dynamic Property Gallery & Carousel
  - Conditional Property Content System
  - Property Status-Based Display Logic
  - Dynamic Blog CMS
  - Reusable Blog Post Template
  - Finsweet Table of Contents & Reading Time
  - Post Reading Progress Indicator
  - SEO Foundation & Search Console Setup
  - Google Analytics Integration
  - Contact Forms with Google reCAPTCHA Protection
results: >-
  The completed website provides Jaeger Immobilien Morsbach with a modern,
  responsive platform for presenting the agency, publishing property listings,
  and managing editorial content through Webflow CMS.


  The property system transforms detailed real estate data into structured,
  reusable property pages while conditional visibility keeps each listing clean
  by displaying only the information that is relevant and available.


  The Propstack integration significantly improves the property publishing
  workflow by connecting the CRM with Webflow CMS. Make and Cloudflare Workers
  provide the automation and processing layer required to move property data
  between the systems, reducing duplicate manual data entry and the risk of
  inconsistencies between the CRM and the public website.


  The separate Blog CMS gives the client a scalable publishing system for
  ongoing content, while features such as the table of contents, reading time,
  and reading progress improve the experience of longer articles.


  The result is not only a new website, but a more maintainable digital workflow
  in which Webflow serves as the presentation layer while the CRM and automation
  infrastructure support the agency’s day-to-day property management process.
lessons_learned: >-
  This project reinforced the importance of designing the CMS architecture
  before building the automation layer. When an external CRM becomes the source
  of property data, the structure of the website CMS needs to anticipate how
  that data will be mapped, transformed, and presented on the frontend.


  Integrating Propstack with Webflow also demonstrated that connecting two
  platforms is more than simply transferring field values. Different data
  structures, optional information, property statuses, media, and presentation
  requirements need to be translated into a consistent website experience.


  Separating responsibilities between Propstack, Make, Cloudflare Workers, and
  Webflow proved especially valuable. Propstack remains the source of property
  data, Make coordinates the workflow, Cloudflare Workers handle additional
  processing where required, and Webflow CMS remains focused on structured
  content and presentation.


  The project also reinforced the value of incremental testing. Building and
  validating the integration step by step made it easier to identify mapping,
  conditional visibility, and presentation issues before expanding the
  automation.


  Most importantly, the project showed how Webflow can extend beyond a
  traditional CMS website when combined with external systems and automation,
  creating a workflow that reduces repetitive content management while
  preserving full control over the frontend experience.
gallery:
  - title: Initial Project Meeting in Skopje
    image: /images/Christian-Jaeger-Testimonial-Review-p-1080.jpg
    alt: Igor Mihajlovski and the client during the initial project meeting in
      Skopje
    caption: Initial project meeting in Skopje, where the requirements, goals, and
      direction for the Jaeger Immobilien Morsbach website were first discussed.
  - title: Project Requirements Discussion
    image: /images/5.jpeg
    alt: Project requirements discussion during the client meeting in Skopje
    caption: Discussing the website requirements, property presentation, and project
      workflow during the initial planning meeting in Skopje.
  - title: Project Workflow Presentation
    image: /images/7.jpeg
    alt: Client presenting the project workflow during the planning meeting in
      Skopje
    caption: Presenting and discussing the planned website structure and workflow
      during the initial project meeting in Skopje.
  - title: Project Planning Materials
    image: /images/6.jpeg
    alt: Project planning materials and documents from the client meeting in Skopje
    caption: Planning materials used during the initial meeting to discuss the
      website requirements, content structure, and real estate workflow.
project_links:
  live_url: https://www.jaeger-immobilien-morsbach.de/
  live_button_text: View Project
  github_button_text: View Source Code
  demo_button_text: View Demo
seo:
  title: Jaeger Immobilien Morsbach | Webflow & Propstack Case Study
  description: Webflow case study featuring Propstack CRM integration, Make
    automation, Cloudflare Workers, dynamic property listings, and a scalable
    CMS architecture.
  og_image: /images/Jaeger-Immobilien-project-p-500.jpg
---
