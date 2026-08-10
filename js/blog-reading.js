(function () {
  "use strict";

  const progressBar = document.querySelector("[data-blog-reading-progress]");
  const readingRegion = document.querySelector("[data-blog-reading-region]");

  if (!progressBar || !readingRegion) return;

  let articleStart = 0;
  let readingDistance = 1;
  let animationFrame = null;

  function measureReadingRegion() {
    const bounds = readingRegion.getBoundingClientRect();
    articleStart = window.scrollY + bounds.top;
    readingDistance = Math.max(bounds.height - window.innerHeight, 1);
  }

  function updateProgress() {
    animationFrame = null;

    const progress = Math.min(
      1,
      Math.max(0, (window.scrollY - articleStart) / readingDistance),
    );

    progressBar.style.transform = `scaleX(${progress})`;
  }

  function requestProgressUpdate() {
    if (animationFrame !== null) return;
    animationFrame = window.requestAnimationFrame(updateProgress);
  }

  function refreshMeasurements() {
    measureReadingRegion();
    requestProgressUpdate();
  }

  window.addEventListener("scroll", requestProgressUpdate, { passive: true });
  window.addEventListener("resize", refreshMeasurements);
  window.addEventListener("load", refreshMeasurements, { once: true });

  if ("ResizeObserver" in window) {
    const observer = new ResizeObserver(refreshMeasurements);
    observer.observe(readingRegion);
  }

  refreshMeasurements();

  const tableOfContents = document.querySelector(".blog-table-of-contents");
  const tocLinks = tableOfContents
    ? Array.from(tableOfContents.querySelectorAll('a[href^="#"]'))
    : [];
  const linksByHeadingId = new Map(
    tocLinks.map((link) => [decodeURIComponent(link.hash.slice(1)), link]),
  );
  const observedHeadings = Array.from(
    readingRegion.querySelectorAll("h2[id]"),
  ).filter((heading) => linksByHeadingId.has(heading.id));

  if (
    tableOfContents &&
    observedHeadings.length &&
    "IntersectionObserver" in window
  ) {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    let activeLink = null;

    function keepActiveLinkVisible(link) {
      const tocBounds = tableOfContents.getBoundingClientRect();
      const linkBounds = link.getBoundingClientRect();

      if (
        linkBounds.top >= tocBounds.top &&
        linkBounds.bottom <= tocBounds.bottom
      ) {
        return;
      }

      link.scrollIntoView({
        block: "nearest",
        inline: "nearest",
        behavior: reduceMotion ? "auto" : "smooth",
      });
    }

    function setActiveLink(link) {
      if (!link || link === activeLink) return;

      if (activeLink) activeLink.removeAttribute("aria-current");
      link.setAttribute("aria-current", "location");
      activeLink = link;
      keepActiveLinkVisible(link);
    }

    const sectionObserver = new IntersectionObserver(
      (entries) => {
        const approachingHeadings = entries
          .filter((entry) => entry.isIntersecting)
          .sort((left, right) =>
            left.boundingClientRect.top - right.boundingClientRect.top,
          );

        if (!approachingHeadings.length) return;

        setActiveLink(
          linksByHeadingId.get(approachingHeadings[0].target.id),
        );
      },
      {
        root: null,
        rootMargin: "-110px 0px -70% 0px",
        threshold: 0,
      },
    );

    observedHeadings.forEach((heading) => sectionObserver.observe(heading));
  }
})();
