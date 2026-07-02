// workspace_dashboard.js
// Mubtkir Theme - Workspace Dashboard Override
// This file replaces the Custom HTML Block approach

frappe.provide("mubtkir.workspace_dashboard");

// =========================================================
//  Language helper
// =========================================================
mubtkir.workspace_dashboard.get_lang = function () {
  const stored = localStorage.getItem("mub_lang") || "";
  if (stored.toLowerCase().startsWith("ar")) return "ar";
  const boot = (window.frappe && frappe.boot)
    ? (frappe.boot.lang || (frappe.boot.user && frappe.boot.user.language) || "")
    : "";
  return boot.toLowerCase().startsWith("ar") ? "ar" : "en";
};

// =========================================================
//  Cards data  (ar values stored as unicode escapes)
// =========================================================
mubtkir.workspace_dashboard.cards = [
  {
    en: "Data",
    ar: "\u0627\u0644\u0628\u064a\u0627\u0646\u0627\u062a",
    icon: "\uD83D\uDDC2\uFE0F",
    items: [
      { en: "Import Data",       ar: "\u0628\u064a\u0627\u0646\u0627\u062a \u0627\u0644\u0627\u0633\u062a\u064a\u0631\u0627\u062f",   type: "special", route: "data-import" },
      { en: "Export Data",       ar: "\u062a\u0635\u062f\u064a\u0631 \u0627\u0644\u0628\u064a\u0627\u0646\u0627\u062a",                type: "special", route: "data-export" },
      { en: "Bulk Update",       ar: "\u062a\u062d\u062f\u064a\u062b \u0628\u0627\u0644\u062c\u0645\u0644\u0629",                       type: "special", route: "bulk-update" },
      { en: "Download Backups",  ar: "\u062a\u062d\u0645\u064a\u0644 \u0627\u0644\u0646\u0633\u062e \u0627\u0644\u0627\u062d\u062a\u064a\u0627\u0637\u064a\u0629", type: "special", route: "backups" },
      { en: "Deleted Documents", ar: "\u0627\u0644\u0645\u0633\u062a\u0646\u062f\u0627\u062a \u0627\u0644\u0645\u062d\u0630\u0648\u0641\u0629",              type: "list",    route: "Deleted Document" }
    ]
  },
  {
    en: "Tools",
    ar: "\u0627\u0644\u0623\u062f\u0648\u0627\u062a",
    icon: "\uD83E\uDDF0",
    items: [
      { en: "To Do",    ar: "\u0642\u0627\u0626\u0645\u0629 \u0627\u0644\u0645\u0647\u0627\u0645",  type: "list",    route: "ToDo" },
      { en: "Calendar", ar: "\u062a\u0642\u0648\u064a\u0645",                                            type: "special", route: "calendar" },
      { en: "Note",     ar: "\u0645\u0644\u0627\u062d\u0638\u0627\u062a",                               type: "list",    route: "Note" },
      { en: "Files",    ar: "\u0627\u0644\u0645\u0644\u0641\u0627\u062a",                               type: "list",    route: "File" }
    ]
  },
  {
    en: "Alerts and Notifications",
    ar: "\u0627\u0644\u062a\u0646\u0628\u064a\u0647\u0627\u062a \u0648\u0627\u0644\u0625\u0634\u0639\u0627\u0631\u0627\u062a",
    icon: "\uD83D\uDD14",
    items: [
      { en: "Notification",          ar: "\u0625\u0634\u0639\u0627\u0631",                                                         type: "list",   route: "Notification" },
      { en: "Auto Email Report",     ar: "\u0625\u0631\u0633\u0627\u0644 \u0627\u0644\u062a\u0642\u0627\u0631\u064a\u0631 \u0622\u0644\u064a\u064b\u0627", type: "list",   route: "Auto Email Report" },
      { en: "Notification Settings", ar: "\u0625\u0639\u062f\u0627\u062f\u0627\u062a \u0627\u0644\u0625\u0634\u0639\u0627\u0631",                           type: "single", route: "Notification Settings" }
    ]
  },
  {
    en: "Email",
    ar: "\u0627\u0644\u0628\u0631\u064a\u062f \u0627\u0644\u0625\u0644\u0643\u062a\u0631\u0648\u0646\u064a",
    icon: "\u2709\uFE0F",
    items: [
      { en: "Email Account",  ar: "\u062d\u0633\u0627\u0628 \u0627\u0644\u0628\u0631\u064a\u062f \u0627\u0644\u0625\u0644\u0643\u062a\u0631\u0648\u0646\u064a", type: "list", route: "Email Account" },
      { en: "Email Domain",   ar: "\u0645\u062c\u0627\u0644 \u0627\u0644\u0628\u0631\u064a\u062f \u0627\u0644\u0625\u0644\u0643\u062a\u0631\u0648\u0646\u064a", type: "list", route: "Email Domain" },
      { en: "Email Template", ar: "\u0646\u0645\u0648\u0630\u062c \u0627\u0644\u0628\u0631\u064a\u062f \u0627\u0644\u0625\u0644\u0643\u062a\u0631\u0648\u0646\u064a", type: "list", route: "Email Template" }
    ]
  },
  {
    en: "Printing",
    ar: "\u0637\u0628\u0639",
    icon: "\uD83D\uDDA8\uFE0F",
    items: [
      { en: "Print Format Builder",       ar: "\u0645\u0646\u0634\u0626 \u062a\u0646\u0633\u064a\u0642 \u0627\u0644\u0637\u0628\u0627\u0639\u0629",   type: "special", route: "print-format-builder" },
      { en: "Print Format Builder (New)", ar: "Print Format Builder (New)",                                                                                         type: "special", route: "print-format-builder-beta" },
      { en: "Print Settings",             ar: "\u0625\u0639\u062f\u0627\u062f\u0627\u062a \u0627\u0644\u0637\u0628\u0627\u0639\u0629",                  type: "single",  route: "Print Settings" },
      { en: "Print Heading",              ar: "\u0637\u0628\u0627\u0639\u0629 \u0627\u0644\u0631\u0623\u0633\u064a\u0629",                               type: "list",    route: "Print Heading" }
    ]
  },
  {
    en: "Automation",
    ar: "\u0627\u0644\u062a\u0634\u063a\u064a\u0644 \u0627\u0644\u0622\u0644\u064a",
    icon: "\u2699\uFE0F",
    items: [
      { en: "Assignment Rule", ar: "\u0642\u0627\u0639\u062f\u0629 \u0627\u0644\u062a\u0643\u0644\u064a\u0641", type: "list", route: "Assignment Rule" },
      { en: "Milestone",       ar: "\u0645\u0631\u062d\u0644\u0629",                                                  type: "list", route: "Milestone" },
      { en: "Auto Repeat",     ar: "\u062a\u0643\u0631\u0627\u0631 \u062a\u0644\u0642\u0627\u0626\u064a",        type: "list", route: "Auto Repeat" }
    ]
  },
  {
    en: "Newsletter",
    ar: "\u0627\u0644\u0646\u0634\u0631\u0629 \u0627\u0644\u0625\u062e\u0628\u0627\u0631\u064a\u0629",
    icon: "\uD83D\uDCF0",
    items: [
      { en: "Newsletter",  ar: "\u0627\u0644\u0646\u0634\u0631\u0629 \u0627\u0644\u0625\u062e\u0628\u0627\u0631\u064a\u0629",                         type: "list", route: "Newsletter" },
      { en: "Email Group", ar: "\u0645\u062c\u0645\u0648\u0639\u0629 \u0627\u0644\u0628\u0631\u064a\u062f \u0627\u0644\u0625\u0644\u0643\u062a\u0631\u0648\u0646\u064a", type: "list", route: "Email Group" }
    ]
  }
];

// =========================================================
//  Render helpers
// =========================================================
mubtkir.workspace_dashboard._esc = function (v) {
  return String(v ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

mubtkir.workspace_dashboard._label = function (item, lang) {
  return lang === "ar" ? item.ar : item.en;
};

mubtkir.workspace_dashboard.build_html = function (cards, lang) {
  const esc = mubtkir.workspace_dashboard._esc;
  const lbl = mubtkir.workspace_dashboard._label;
  const isAr = lang === "ar";
  const arrow = isAr ? "\u2190" : "\u2192";
  const sectionTitle = isAr
    ? "\u0645\u0633\u062a\u0646\u062f\u0627\u062a"
    : "Documents";

  const cardsHtml = cards.map((card, idx) => {
    const links = card.items.map(item =>
      '<button type="button" class="documents-link"' +
      ' data-mub-route="' + esc(item.route) + '"' +
      ' data-mub-type="' + esc(item.type) + '">' +
      '<span class="documents-link-text">' + esc(lbl(item, lang)) + '</span>' +
      '<span class="documents-link-arrow" aria-hidden="true">' + arrow + '</span>' +
      '</button>'
    ).join("");

    return (
      '<article class="documents-card tone-' + (idx % 5) + '" data-mub-card>' +
        '<button type="button" class="documents-card-heading" data-mub-toggle aria-expanded="false">' +
          '<span class="documents-icon" aria-hidden="true">' + card.icon + '</span>' +
          '<span class="documents-card-title">' + esc(lbl(card, lang)) + '</span>' +
          '<span class="documents-chevron" aria-hidden="true">\u23C4</span>' +
        '</button>' +
        '<div class="documents-card-links">' + links + '</div>' +
      '</article>'
    );
  }).join("");

  return (
    '<div class="documents-dashboard' + (isAr ? " is-arabic" : "") + '"' +
    ' dir="' + (isAr ? "rtl" : "ltr") + '" data-mub-dashboard>' +
      '<img src="/files/back%20ground%20logo.png" class="documents-background" alt="">' +
      '<div class="documents-header">' +
        '<img src="/files/logo-mu.png" class="documents-logo" alt="Mubtkir">' +
      '</div>' +
      '<div class="documents-content">' +
        '<section class="documents-section">' +
          '<h2 class="documents-section-title">' + sectionTitle + '</h2>' +
          '<div class="documents-grid">' + cardsHtml + '</div>' +
        '</section>' +
      '</div>' +
    '</div>'
  );
};

// =========================================================
//  Open route
// =========================================================
mubtkir.workspace_dashboard.open_route = function (route, type) {
  if (!window.frappe || typeof frappe.set_route !== "function") return;
  if (type === "single")  { frappe.set_route("Form", route); return; }
  if (type === "special") { frappe.set_route(route); return; }
  frappe.set_route("List", route);
};

// =========================================================
//  Close all cards
// =========================================================
mubtkir.workspace_dashboard.close_all = function (root) {
  root.querySelectorAll("[data-mub-card]").forEach(function (card) {
    card.classList.remove("is-open");
    var btn = card.querySelector("[data-mub-toggle]");
    if (btn) btn.setAttribute("aria-expanded", "false");
  });
};

// =========================================================
//  Bind events on a rendered dashboard root
// =========================================================
mubtkir.workspace_dashboard.bind = function (root) {
  var self = mubtkir.workspace_dashboard;
  var dashboard = root.querySelector("[data-mub-dashboard]");
  if (!dashboard) return;

  // Touch toggle
  root.querySelectorAll("[data-mub-toggle]").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      var canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
      if (canHover) { e.preventDefault(); return; }
      e.preventDefault();
      e.stopPropagation();
      var card = btn.closest("[data-mub-card]");
      if (!card) return;
      var shouldOpen = !card.classList.contains("is-open");
      self.close_all(root);
      if (shouldOpen) {
        card.classList.add("is-open");
        btn.setAttribute("aria-expanded", "true");
      }
    });
  });

  // Link click
  root.addEventListener("click", function (e) {
    var btn = e.target.closest("[data-mub-route]");
    if (!btn) return;
    e.preventDefault();
    e.stopPropagation();
    self.open_route(btn.dataset.mubRoute, btn.dataset.mubType);
  });

  // Click outside
  document.addEventListener("click", function (e) {
    if (!dashboard.contains(e.target)) self.close_all(root);
  });
};

// =========================================================
//  Inject into a container element
// =========================================================
mubtkir.workspace_dashboard.inject = function (container) {
  var self = mubtkir.workspace_dashboard;
  if (container.getAttribute("data-mub-injected")) return;
  container.setAttribute("data-mub-injected", "true");
  var lang = self.get_lang();
  container.innerHTML = self.build_html(self.cards, lang);
  self.bind(container);
};

// =========================================================
//  Watch the DOM for workspace blocks that need injection
// =========================================================
mubtkir.workspace_dashboard._observer = null;

mubtkir.workspace_dashboard.start_observer = function () {
  var self = mubtkir.workspace_dashboard;
  if (self._observer) return;

  self._observer = new MutationObserver(function () {
    // Target: custom block wrapper containing our placeholder
    document.querySelectorAll("[data-documents-dashboard]").forEach(function (placeholder) {
      var wrapper = placeholder.parentElement;
      if (!wrapper || wrapper.getAttribute("data-mub-injected")) return;
      self.inject(wrapper);
    });
  });

  self._observer.observe(document.body, { childList: true, subtree: true });
};

// Start watching once Frappe is ready
$(document).on("page-change", function () {
  mubtkir.workspace_dashboard.start_observer();
});

frappe.ready(function () {
  mubtkir.workspace_dashboard.start_observer();
});
