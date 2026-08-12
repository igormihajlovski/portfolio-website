(function () {
  "use strict";

  var validChoices = { accepted: true, necessary: true };
  var consentState = window.portfolioConsent || {
    storageKey: "portfolio_analytics_consent",
    choice: null,
  };

  function persistChoice(choice) {
    var saved = false;

    try {
      window.localStorage.setItem(consentState.storageKey, choice);
      window.sessionStorage.removeItem(consentState.storageKey);
      saved = true;
    } catch (error) {
      try {
        window.sessionStorage.setItem(consentState.storageKey, choice);
        saved = true;
      } catch (sessionError) {
        saved = false;
      }
    }

    consentState.choice = choice;
    return saved;
  }

  function expireFirstPartyCookie(name) {
    var cookie = name + "=; Max-Age=0; Path=/; SameSite=Lax";
    document.cookie = cookie;

    var hostname = window.location.hostname;
    if (!hostname || /^\d+(?:\.\d+){3}$/.test(hostname) || hostname === "localhost") return;

    var labels = hostname.split(".");
    var domains = [hostname];
    if (labels.length > 2) domains.push(labels.slice(1).join("."));

    domains.forEach(function (domain) {
      document.cookie = cookie + "; Domain=" + domain;
    });
  }

  function removeAnalyticsCookies() {
    ["_ga", "_ga_BCKVPK8X20", "_clck", "_clsk"].forEach(expireFirstPartyCookie);
    try {
      window.sessionStorage.removeItem("_cltk");
    } catch (error) {
      // Storage can be unavailable; consent remains denied regardless.
    }
  }

  function updateGoogleConsent(choice) {
    if (typeof window.gtag !== "function") return;

    window.gtag("consent", "update", {
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      analytics_storage: choice === "accepted" ? "granted" : "denied",
    });
  }

  function updateClarityConsent(choice) {
    if (typeof window.clarity !== "function") return;

    window.clarity("consentv2", {
      ad_Storage: "denied",
      analytics_Storage: choice === "accepted" ? "granted" : "denied",
    });

    if (choice === "accepted" && typeof window.loadPortfolioClarity === "function") {
      window.loadPortfolioClarity();
    } else if (
      choice === "necessary" &&
      window.loadPortfolioClarity &&
      window.loadPortfolioClarity.loaded
    ) {
      window.clarity("consent", false);
    }
  }

  function initializeConsentControls() {
    var banner = document.querySelector("[data-analytics-consent]");
    var settingsButtons = document.querySelectorAll("[data-privacy-settings]");
    if (!banner) return;

    var choiceButtons = banner.querySelectorAll("[data-consent-choice]");

    function setExpanded(expanded) {
      settingsButtons.forEach(function (button) {
        button.setAttribute("aria-expanded", expanded ? "true" : "false");
      });
    }

    function reflectChoice() {
      choiceButtons.forEach(function (button) {
        button.setAttribute(
          "aria-pressed",
          button.getAttribute("data-consent-choice") === consentState.choice ? "true" : "false",
        );
      });
    }

    function closeBanner() {
      banner.hidden = true;
      setExpanded(false);
    }

    function choose(choice) {
      if (!validChoices[choice]) return;

      persistChoice(choice);
      updateGoogleConsent(choice);
      updateClarityConsent(choice);
      if (choice === "necessary") removeAnalyticsCookies();
      reflectChoice();
      closeBanner();

      window.dispatchEvent(new CustomEvent("portfolio:analytics-consent", {
        detail: { choice: choice },
      }));
    }

    choiceButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        choose(button.getAttribute("data-consent-choice"));
      });
    });

    settingsButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        reflectChoice();
        banner.hidden = false;
        setExpanded(true);
        var selectedButton = banner.querySelector('[aria-pressed="true"]');
        (selectedButton || choiceButtons[0]).focus();
      });
    });

    reflectChoice();
    if (!validChoices[consentState.choice]) {
      banner.hidden = false;
      setExpanded(true);
    } else {
      closeBanner();
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeConsentControls, { once: true });
  } else {
    initializeConsentControls();
  }
})();
