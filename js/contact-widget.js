(() => {
  "use strict";

  const initializeContactWidgets = () => {
    document.querySelectorAll("[data-contact-widget]").forEach((widget) => {
      const trigger = widget.querySelector(".contact-widget-trigger");
      const panel = widget.querySelector(".contact-widget-panel");

      if (!trigger || !panel) return;

      const isOpen = () => trigger.getAttribute("aria-expanded") === "true";

      const openWidget = () => {
        panel.inert = false;
        panel.setAttribute("aria-hidden", "false");
        trigger.setAttribute("aria-expanded", "true");
        trigger.setAttribute("aria-label", "Close contact options");
        widget.classList.add("is-open");
      };

      const closeWidget = (restoreFocus = false) => {
        widget.classList.remove("is-open");
        trigger.setAttribute("aria-expanded", "false");
        trigger.setAttribute("aria-label", "Open contact options");
        panel.setAttribute("aria-hidden", "true");

        if (restoreFocus) trigger.focus();

        panel.inert = true;
      };

      trigger.addEventListener("click", () => {
        if (isOpen()) {
          closeWidget();
        } else {
          openWidget();
        }
      });

      panel.addEventListener("click", (event) => {
        if (event.target.closest("a")) closeWidget(true);
      });

      document.addEventListener("click", (event) => {
        if (isOpen() && !widget.contains(event.target)) closeWidget();
      });

      document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && isOpen()) closeWidget(true);
      });
    });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeContactWidgets);
  } else {
    initializeContactWidgets();
  }
})();
