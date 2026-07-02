// workspace_dashboard.js  -  Mubtkir Theme
// Option A: fully replaces the Frappe Workspace render with a
// custom layout (header, number-cards, shortcuts, doc-cards, footer).
// Home workspace is skipped (handled separately via Custom HTML Block).

frappe.provide("mubtkir.workspace_dashboard");

// ─────────────────────────────────────────────
//  Config  (edit these to match your brand)
// ─────────────────────────────────────────────
mubtkir.workspace_dashboard.config = {
  logo_url         : "/assets/nxt_theme/images/mubtkir-logo.png",
  bg_logo_url      : "/files/back%20ground%20logo.png",
  skip_workspaces  : ["Home"],          // keep default Frappe render
  footer_links : [
    { icon: "\uD83C\uDF10", label_en: "Website",  label_ar: "\u0645\u0648\u0642\u0639\u0646\u0627",  href: "https://mubtkir.com",          cls: "mub-ws-footer__btn--website"   },
    { icon: "\uD83D\uDCAC", label_en: "WhatsApp", label_ar: "\u0648\u0627\u062a\u0633\u0622\u0628", href: "https://wa.me/966500000000",     cls: "mub-ws-footer__btn--whatsapp"  },
    { icon: "\uD83D\uDCDE", label_en: "Support",  label_ar: "\u0627\u0644\u062f\u0639\u0645",       href: "mailto:support@mubtkir.com",    cls: "mub-ws-footer__btn--support"   }
  ]
};

// ─────────────────────────────────────────────
//  Helpers
// ─────────────────────────────────────────────
mubtkir.workspace_dashboard.get_lang = function () {
  const stored = localStorage.getItem("mub_lang") || "";
  if (stored.toLowerCase().startsWith("ar")) return "ar";
  const boot = (window.frappe && frappe.boot)
    ? (frappe.boot.lang || (frappe.boot.user && frappe.boot.user.language) || "")
    : "";
  return boot.toLowerCase().startsWith("ar") ? "ar" : "en";
};

mubtkir.workspace_dashboard.esc = function (v) {
  return String(v ?? "")
    .replace(/&/g,"&amp;").replace(/</g,"&lt;")
    .replace(/>/g,"&gt;").replace(/"/g,"&quot;");
};

mubtkir.workspace_dashboard.lbl = function (obj, lang) {
  if (lang === "ar" && obj.label_ar) return obj.label_ar;
  return obj.label_en || obj.label || obj.name || "";
};

// ─────────────────────────────────────────────
//  Number Cards  (reads from frappe.call)
// ─────────────────────────────────────────────
mubtkir.workspace_dashboard.render_number_cards = function (cards_data, container, lang) {
  if (!cards_data || !cards_data.length) return;
  const colors = ["--0","--1","--2","--3","--4","--5"];
  const html = cards_data.map((card, i) => {
    const label = lang === "ar" && card.label_ar ? card.label_ar : (card.label || card.name);
    return (
      '<div class="mub-nc-card mub-nc-card-' + colors[i % colors.length].replace("--","") + '" ' +
      'style="--nc-color:' + (card.color || "") + '" ' +
      'data-mub-nc-name="' + mubtkir.workspace_dashboard.esc(card.name) + '">' +
        '<div class="mub-nc-card__label">' + mubtkir.workspace_dashboard.esc(label) + '</div>' +
        '<div class="mub-nc-card__value mub-nc-card--loading"></div>' +
        '<div class="mub-nc-card__footer">' +
          '<span class="mub-nc-card__trend mub-nc-card__trend--flat">—</span>' +
        '</div>' +
      '</div>'
    );
  }).join("");

  container.innerHTML = '<div class="mub-nc-grid">' + html + '</div>';

  // fetch real values
  cards_data.forEach(function (card) {
    if (!card.name) return;
    frappe.call({
      method: "frappe.desk.doctype.number_card.number_card.get_result",
      args: { doc: card, filters: card.filters_json || "[]", use_report_chart: 0 },
      callback: function (r) {
        const val = r && r.message != null ? r.message : "—";
        const el = container.querySelector(
          '[data-mub-nc-name="' + card.name + '"] .mub-nc-card__value'
        );
        if (el) {
          el.classList.remove("mub-nc-card--loading");
          el.textContent = typeof val === "number"
            ? val.toLocaleString(lang === "ar" ? "ar-SA" : "en-US")
            : String(val);
        }
      }
    });
  });
};

// ─────────────────────────────────────────────
//  Shortcuts
// ─────────────────────────────────────────────
mubtkir.workspace_dashboard.render_shortcuts = function (shortcuts, container, lang) {
  if (!shortcuts || !shortcuts.length) { container.innerHTML = ""; return; }
  const isAr = lang === "ar";
  const arrow = isAr ? "\u2190" : "\u2192";

  const btns = shortcuts.map(function (sc) {
    const label = lang === "ar" && sc.label_ar ? sc.label_ar : (sc.label || sc.link_to || sc.name);
    return (
      '<button type="button" class="mub-sc-btn" ' +
      'data-mub-sc-type="' + mubtkir.workspace_dashboard.esc(sc.type || "DocType") + '" ' +
      'data-mub-sc-link="' + mubtkir.workspace_dashboard.esc(sc.link_to || sc.url || "") + '">' +
        '<span class="mub-sc-btn__icon">' + (sc.icon || "\uD83D\uDCC4") + '</span>' +
        '<span>' + mubtkir.workspace_dashboard.esc(label) + '</span>' +
        '<span style="font-size:11px;opacity:.5">' + arrow + '</span>' +
      '</button>'
    );
  }).join("");

  const scTitle = isAr ? "\u0627\u062e\u062a\u0635\u0627\u0631\u0627\u062a" : "Quick Access";
  container.innerHTML =
    '<div class="mub-sc-section">' +
      '<div class="mub-sc-title">' + scTitle + '</div>' +
      '<div class="mub-sc-grid">' + btns + '</div>' +
    '</div>';

  container.querySelectorAll(".mub-sc-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      const type = btn.dataset.mubScType;
      const link = btn.dataset.mubScLink;
      if (!link || !frappe || typeof frappe.set_route !== "function") return;
      if (type === "URL") { window.open(link, "_blank"); return; }
      if (type === "Report") { frappe.set_route("query-report", link); return; }
      if (type === "Page")   { frappe.set_route(link); return; }
      frappe.set_route("List", link);
    });
  });
};

// ─────────────────────────────────────────────
//  Document Cards  (hover-reveal)
// ─────────────────────────────────────────────
mubtkir.workspace_dashboard.close_all_cards = function (root) {
  root.querySelectorAll(".mub-dc-card").forEach(function (card) {
    card.classList.remove("is-open");
    var btn = card.querySelector(".mub-dc-card__heading");
    if (btn) btn.setAttribute("aria-expanded","false");
  });
};

mubtkir.workspace_dashboard.render_cards = function (sections, container, lang) {
  if (!sections || !sections.length) { container.innerHTML = ""; return; }
  const self = mubtkir.workspace_dashboard;
  const isAr = lang === "ar";
  const arrow = isAr ? "\u2190" : "\u2192";
  const sectionTitle = isAr ? "\u0645\u0633\u062a\u0646\u062f\u0627\u062a" : "Documents";
  const accentColors = ["#2563eb","#16a34a","#7c3aed","#ea580c","#dc2626"];

  const cardsHtml = sections.map(function (sec, idx) {
    const title  = self.lbl(sec, lang);
    const icon   = sec.icon || "\uD83D\uDCC1";
    const accent = accentColors[idx % accentColors.length];

    const linksHtml = (sec.items || []).map(function (item) {
      const linkLabel = self.lbl(item, lang);
      const doctype   = item.link_to || item.name || "";
      const type      = item.type || "DocType";
      return (
        '<button type="button" class="mub-dc-link" ' +
        'data-mub-dc-link="' + self.esc(doctype) + '" ' +
        'data-mub-dc-type="' + self.esc(type)    + '">' +
          '<span class="mub-dc-link__text">' + self.esc(linkLabel) + '</span>' +
          '<span class="mub-dc-link__arrow" aria-hidden="true">' + arrow + '</span>' +
        '</button>'
      );
    }).join("");

    return (
      '<article class="mub-dc-card mub-dc-card--' + (idx % 5) + '" ' +
      'style="--card-accent:' + accent + ';--card-soft:' + accent.replace('#','rgba(') + ',0.07)" ' +
      'data-mub-card>' +
        '<button type="button" class="mub-dc-card__heading" aria-expanded="false">' +
          '<span class="mub-dc-card__icon" aria-hidden="true">' + icon + '</span>' +
          '<span class="mub-dc-card__title">' + self.esc(title) + '</span>' +
          '<span class="mub-dc-card__chevron" aria-hidden="true">\u23C4</span>' +
        '</button>' +
        '<div class="mub-dc-card__links">' + linksHtml + '</div>' +
      '</article>'
    );
  }).join("");

  container.innerHTML =
    '<div class="mub-dc-section">' +
      '<h2 class="mub-dc-section-title">' + sectionTitle + '</h2>' +
      '<div class="mub-dc-grid">' + cardsHtml + '</div>' +
    '</div>';

  // touch toggle
  const root = container.closest(".mub-ws-root") || container;
  container.querySelectorAll(".mub-dc-card__heading").forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
      if (canHover) { e.preventDefault(); return; }
      e.preventDefault(); e.stopPropagation();
      const card = btn.closest("[data-mub-card]");
      if (!card) return;
      const open = !card.classList.contains("is-open");
      self.close_all_cards(root);
      if (open) { card.classList.add("is-open"); btn.setAttribute("aria-expanded","true"); }
    });
  });

  // link click
  container.addEventListener("click", function (e) {
    const btn = e.target.closest("[data-mub-dc-link]");
    if (!btn) return;
    e.preventDefault(); e.stopPropagation();
    const link = btn.dataset.mubDcLink;
    const type = btn.dataset.mubDcType;
    if (!link || !frappe || typeof frappe.set_route !== "function") return;
    if (type === "Page")   { frappe.set_route(link); return; }
    if (type === "Report") { frappe.set_route("query-report", link); return; }
    if (type === "URL")    { window.open(link, "_blank"); return; }
    frappe.set_route("List", link);
  });

  // close on outside click
  document.addEventListener("click", function (e) {
    if (!container.contains(e.target)) self.close_all_cards(container);
  });
};

// ─────────────────────────────────────────────
//  Footer (fixed, rendered once)
// ─────────────────────────────────────────────
mubtkir.workspace_dashboard._footer_rendered = false;

mubtkir.workspace_dashboard.render_footer = function (lang) {
  if (mubtkir.workspace_dashboard._footer_rendered) return;
  if (document.getElementById("mub-ws-footer")) return;

  const cfg  = mubtkir.workspace_dashboard.config;
  const isAr = lang === "ar";

  const btns = cfg.footer_links.map(function (lnk, i) {
    const label = isAr ? lnk.label_ar : lnk.label_en;
    const sep   = i < cfg.footer_links.length - 1
      ? '<span class="mub-ws-footer__divider"></span>' : "";
    return (
      '<a href="' + lnk.href + '" target="_blank" rel="noopener" ' +
      'class="mub-ws-footer__btn ' + (lnk.cls || "") + '">' +
        lnk.icon + ' ' + label +
      '</a>' + sep
    );
  }).join("");

  const footer = document.createElement("div");
  footer.id = "mub-ws-footer";
  footer.className = "mub-ws-footer";
  footer.innerHTML = btns;
  document.body.appendChild(footer);
  mubtkir.workspace_dashboard._footer_rendered = true;
};

// ─────────────────────────────────────────────
//  Main  –  build the full workspace DOM
// ─────────────────────────────────────────────
mubtkir.workspace_dashboard.build = function (page_wrapper, workspace_data) {
  const self   = mubtkir.workspace_dashboard;
  const cfg    = self.config;
  const lang   = self.get_lang();
  const isAr   = lang === "ar";
  const dir    = isAr ? "rtl" : "ltr";

  // clear original Frappe content
  page_wrapper.innerHTML = "";

  // root container
  const root = document.createElement("div");
  root.className = "mub-ws-root";
  root.setAttribute("dir", dir);
  page_wrapper.appendChild(root);

  // background logo
  root.insertAdjacentHTML("beforeend",
    '<img src="' + cfg.bg_logo_url + '" class="mub-ws-bg" alt="">'
  );

  // header
  root.insertAdjacentHTML("beforeend",
    '<header class="mub-ws-header">' +
      '<img src="' + cfg.logo_url + '" class="mub-ws-header__logo" alt="Mubtkir ERP">' +
    '</header>'
  );

  // body
  const body = document.createElement("div");
  body.className = "mub-ws-body";
  root.appendChild(body);

  // workspace title
  const wsName = workspace_data && (workspace_data.title || workspace_data.name) || "";
  body.insertAdjacentHTML("beforeend",
    '<h1 class="mub-ws-title">' + self.esc(wsName) + '</h1>'
  );

  // number cards area
  const ncArea = document.createElement("div");
  body.appendChild(ncArea);
  if (workspace_data && workspace_data.number_cards && workspace_data.number_cards.length) {
    self.render_number_cards(workspace_data.number_cards, ncArea, lang);
  }

  // shortcuts area
  const scArea = document.createElement("div");
  body.appendChild(scArea);
  if (workspace_data && workspace_data.shortcuts && workspace_data.shortcuts.length) {
    self.render_shortcuts(workspace_data.shortcuts, scArea, lang);
  }

  // document cards area
  const dcArea = document.createElement("div");
  body.appendChild(dcArea);
  if (workspace_data && workspace_data.cards && workspace_data.cards.length) {
    self.render_cards(workspace_data.cards, dcArea, lang);
  }

  // footer
  self.render_footer(lang);
};

// ─────────────────────────────────────────────
//  Hook into Frappe Workspace page
// ─────────────────────────────────────────────
mubtkir.workspace_dashboard._hooked = false;

mubtkir.workspace_dashboard.hook = function () {
  if (mubtkir.workspace_dashboard._hooked) return;
  mubtkir.workspace_dashboard._hooked = true;

  const self = mubtkir.workspace_dashboard;

  // frappe.views.Workspace is the class that renders each workspace.
  // We patch its "render_page" (or equivalent) after it loads data.
  frappe.router.on("change", function () {
    const route = frappe.get_route();
    if (!route || route[0] !== "Workspaces") return;

    const ws_name = route[1] || "";
    if (!ws_name) return;

    // skip workspaces in the skip list
    if (self.config.skip_workspaces.indexOf(ws_name) !== -1) return;

    // wait for frappe to render the page, then take over
    setTimeout(function () {
      // find the active workspace page container
      const page = document.querySelector(".page-container[data-page-route^='Workspaces']");
      if (!page) return;
      const layout = page.querySelector(".layout-main-section");
      if (!layout) return;
      if (layout.getAttribute("data-mub-built")) return;
      layout.setAttribute("data-mub-built", "true");

      // fetch workspace data
      frappe.call({
        method: "frappe.desk.desktop.get_desktop_page_data",
        args: { page: ws_name },
        callback: function (r) {
          if (!r || !r.message) return;
          const data = r.message;

          // parse sections into a flat cards array the renderer expects
          const ws_data = {
            name  : ws_name,
            title : data.page_data && data.page_data.title
                    ? data.page_data.title : ws_name,
            number_cards : (data.number_cards || []).map(function (nc) {
              return Object.assign({}, nc.doc || nc, {
                label_ar: nc.doc && nc.doc.label ? nc.doc.label : (nc.label || nc.name)
              });
            }),
            shortcuts : (data.shortcuts || []).map(function (sc) {
              return Object.assign({}, sc, { label_ar: sc.label || sc.name });
            }),
            cards : (data.cards || []).map(function (section) {
              return {
                name     : section.card_name || section.name || "",
                label_en : section.card_name || section.name || "",
                label_ar : section.card_name || section.name || "",
                icon     : section.icon || "\uD83D\uDCC1",
                items    : (section.links || []).map(function (link) {
                  return {
                    name     : link.link_to || link.name || "",
                    label_en : link.label   || link.name || "",
                    label_ar : link.label   || link.name || "",
                    link_to  : link.link_to || link.name || "",
                    type     : link.type    || "DocType"
                  };
                })
              };
            })
          };

          self.build(layout, ws_data);
        }
      });
    }, 300);
  });
};

// ─────────────────────────────────────────────
//  Bootstrap
// ─────────────────────────────────────────────
frappe.ready(function () {
  mubtkir.workspace_dashboard.hook();
});
