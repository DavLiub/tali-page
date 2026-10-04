(() => {
  "use strict";

  const siteConfig = window.SITE_CONFIG;
  const siteContent = window.SITE_CONTENT;
  const rootElement = document.documentElement;
  const storedLanguage = localStorage.getItem("tali-language");
  let currentLanguage = siteConfig.languages.includes(storedLanguage)
    ? storedLanguage
    : siteConfig.defaultLanguage;

  const translate = (key) => siteContent[currentLanguage][key] ?? siteContent.ru[key] ?? key;
  const escapeHtml = (value) => String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;",
  })[character]);

  function renderList(selector, items, template) {
    document.querySelector(selector).innerHTML = items.map(template).join("");
  }

  function renderDynamicContent() {
    renderList("[data-services]", translate("services"), (service) => `<article class="service-card"><div class="service-icon">${escapeHtml(service[0])}</div><h3>${escapeHtml(service[1])}</h3><p>${escapeHtml(service[2])}</p></article>`);
    renderList("[data-steps]", translate("steps"), (step) => `<li class="step"><div><h3>${escapeHtml(step[0])}</h3><p>${escapeHtml(step[1])}</p></div></li>`);
    renderList("[data-features]", translate("features"), (feature) => `<div class="feature">${escapeHtml(feature)}</div>`);
    renderList("[data-formats]", translate("formats"), (format) => `<article class="format-card"><b>${escapeHtml(format[0])}</b><h3>${escapeHtml(format[1])}</h3><p>${escapeHtml(format[2])}</p></article>`);
    renderList("[data-faq]", translate("faqs"), (faq, index) => `<section class="faq-item"><button class="faq-question" aria-expanded="false" aria-controls="faq-${index}"><span>${escapeHtml(faq[0])}</span><b>+</b></button><div class="faq-answer" id="faq-${index}" hidden>${escapeHtml(faq[1])}</div></section>`);

    document.querySelectorAll(".faq-question").forEach((button) => {
      button.onclick = () => {
        const isOpen = button.getAttribute("aria-expanded") === "true";
        button.setAttribute("aria-expanded", String(!isOpen));
        document.getElementById(button.getAttribute("aria-controls")).hidden = isOpen;
      };
    });
  }

  function setLanguage(language) {
    currentLanguage = language;
    localStorage.setItem("tali-language", currentLanguage);
    rootElement.lang = currentLanguage;
    rootElement.dir = currentLanguage === "he" ? "rtl" : "ltr";
    document.title = translate("pageTitle");
    document.querySelectorAll("[data-i18n]").forEach((element) => { element.textContent = translate(element.dataset.i18n); });
    document.querySelectorAll("[data-i18n-html]").forEach((element) => { element.innerHTML = translate(element.dataset.i18nHtml); });
    document.querySelectorAll("[data-site-name]").forEach((element) => { element.textContent = translate("siteName"); });
    document.querySelectorAll("[data-language]").forEach((button) => { button.setAttribute("aria-pressed", String(button.dataset.language === currentLanguage)); });
    renderDynamicContent();
  }

  function setupLanguageSwitcher() {
    document.querySelectorAll("[data-language]").forEach((button) => {
      button.onclick = () => setLanguage(button.dataset.language);
    });
  }

  function setupMobileMenu() {
    const menuButton = document.querySelector(".menu-button");
    const mobileNavigation = document.querySelector(".mobile-nav");
    menuButton.onclick = () => {
      const isOpen = menuButton.getAttribute("aria-expanded") === "true";
      menuButton.setAttribute("aria-expanded", String(!isOpen));
      mobileNavigation.hidden = isOpen;
      document.body.classList.toggle("menu-open", !isOpen);
    };
    mobileNavigation.querySelectorAll("a").forEach((link) => {
      link.onclick = () => {
        menuButton.setAttribute("aria-expanded", "false");
        mobileNavigation.hidden = true;
        document.body.classList.remove("menu-open");
      };
    });
  }

  function setupProfilePhoto() {
    if (!siteConfig.profilePhoto) return;
    const photoContainer = document.querySelector("[data-photo]");
    photoContainer.innerHTML = `<img src="${escapeHtml(siteConfig.profilePhoto)}" alt="${escapeHtml(translate("siteName"))}">`;
    photoContainer.classList.add("has-photo");
  }

  function setupContactForm() {
    const contactForm = document.querySelector("[data-form]");
    const formStatus = document.querySelector("[data-status]");
    const validateForm = () => {
      let isValid = true;
      contactForm.querySelectorAll("[required]").forEach((field) => {
        const hasValue = field.type === "checkbox" ? field.checked : Boolean(field.value.trim());
        field.setAttribute("aria-invalid", String(!hasValue));
        isValid = isValid && hasValue;
      });
      return isValid;
    };

    contactForm.oninput = validateForm;
    contactForm.onsubmit = async (event) => {
      event.preventDefault();
      formStatus.className = "form-status";
      if (!validateForm()) {
        formStatus.classList.add("error");
        formStatus.textContent = translate("required");
        return;
      }
      if (siteConfig.contact.mode === "preview" || !siteConfig.contact.endpoint) {
        formStatus.textContent = translate("previewStatus");
        return;
      }
      const submitButton = contactForm.querySelector("button");
      submitButton.disabled = true;
      try {
        const response = await fetch(siteConfig.contact.endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(Object.fromEntries(new FormData(contactForm))),
        });
        if (!response.ok) throw new Error("Request failed");
        contactForm.reset();
        formStatus.classList.add("success");
        formStatus.textContent = translate("sentStatus");
      } catch {
        formStatus.classList.add("error");
        formStatus.textContent = translate("sendError");
      } finally {
        submitButton.disabled = false;
      }
    };
  }

  setupLanguageSwitcher();
  setupMobileMenu();
  setupProfilePhoto();
  setupContactForm();
  document.querySelector("[data-year]").textContent = new Date().getFullYear();
  setLanguage(currentLanguage);
})();
