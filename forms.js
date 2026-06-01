/* ============================================================
   Vittara — Shared form handler
   ------------------------------------------------------------
   Sends every form on the site to Formspree (works on static
   hosting like GitHub Pages — no server needed).

   >>> SETUP (do this once): <<<
   1. Create a free form at https://formspree.io
   2. You'll get an endpoint like https://formspree.io/f/abcdwxyz
   3. This is already set to your form (xaqppadw).
      (Already configured with your form ID: xaqppadw)
   ============================================================ */

const FORMSPREE_ENDPOINT = "https://formspree.io/f/xaqppadw";

(function () {
  "use strict";

  // Turn a label / placeholder into a clean field name.
  function slugify(text, fallback) {
    if (!text) return fallback;
    const s = text
      .replace(/\*/g, "")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "");
    return s || fallback;
  }

  // Find a human label for a field so Formspree emails read nicely.
  function labelFor(field) {
    // explicit <label for="id">
    if (field.id) {
      const lbl = document.querySelector('label[for="' + field.id + '"]');
      if (lbl) return lbl.textContent;
    }
    // wrapping <label>…<input></label>
    const wrap = field.closest("label");
    if (wrap) return wrap.textContent;
    // a label as a previous sibling within the same group
    const group = field.closest(".form-group, div");
    if (group) {
      const lbl = group.querySelector("label");
      if (lbl) return lbl.textContent;
    }
    return field.placeholder || "";
  }

  // Give every field a name if it doesn't already have one.
  function ensureNames(form) {
    const used = {};
    const fields = form.querySelectorAll("input, select, textarea");
    fields.forEach(function (field, i) {
      if (field.type === "submit" || field.type === "button") return;

      // The visitor's email field MUST be named "email" so Formspree
      // knows where to send the automatic thank-you reply.
      if (field.type === "email" && !used["email"]) {
        field.name = "email";
        used["email"] = true;
        return;
      }

      if (!field.name) {
        let base = slugify(labelFor(field), "field_" + (i + 1));
        let name = base;
        let n = 2;
        while (used[name]) {
          name = base + "_" + n++;
        }
        used[name] = true;
        field.name = name;
      } else {
        used[field.name] = true;
      }
    });

    // Add _replyto so when YOU hit reply, it goes to the customer.
    const emailField = form.querySelector('[name="email"]');
    if (emailField && !form.querySelector('[name="_replyto"]')) {
      const rt = document.createElement("input");
      rt.type = "hidden";
      rt.name = "_replyto";
      form.appendChild(rt);
      // keep it in sync on submit
      form.addEventListener("submit", function () {
        rt.value = emailField.value;
      });
      rt.value = emailField.value;
    }
  }

  function setStatus(form, message, ok) {
    let box = form.querySelector(".form-status");
    if (!box) {
      box = document.createElement("div");
      box.className = "form-status";
      box.style.cssText =
        "margin-top:14px;padding:12px 16px;border-radius:8px;font-size:14px;font-family:inherit;";
      form.appendChild(box);
    }
    box.textContent = message;
    box.style.background = ok
      ? "rgba(45,106,79,.18)"
      : "rgba(180,40,40,.18)";
    box.style.color = ok ? "#7BE0A5" : "#FF9B9B";
    box.style.border =
      "1px solid " + (ok ? "rgba(82,183,136,.4)" : "rgba(255,120,120,.4)");
  }

  async function send(form) {
    ensureNames(form);

    const submitBtn = form.querySelector(
      'button[type="submit"], button:not([type]), input[type="submit"]'
    );
    const originalText = submitBtn ? submitBtn.textContent : "";
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.dataset.original = originalText;
      submitBtn.textContent = "Sending…";
    }

    // Tag which form/page this came from, for your inbox.
    let pageField = form.querySelector('input[name="_page"]');
    if (!pageField) {
      pageField = document.createElement("input");
      pageField.type = "hidden";
      pageField.name = "_page";
      form.appendChild(pageField);
    }
    pageField.value = document.title || location.pathname;

    const redirect = form.dataset.redirect; // optional: thank-you.html

    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(form),
      });

      if (res.ok) {
        if (redirect) {
          window.location.href = redirect;
          return;
        }
        form.reset();
        setStatus(
          form,
          "✓ Thank you! Your message has been sent — we'll reply within a few hours.",
          true
        );
        if (submitBtn) {
          submitBtn.textContent = "✓ Sent!";
        }
        // close booking modal if this form is inside one
        if (typeof closeModal === "function" && form.closest(".modal")) {
          setTimeout(closeModal, 1200);
        }
      } else {
        let msg = "Something went wrong. Please email info@vittaraglobel.com.";
        try {
          const data = await res.json();
          if (data && data.errors && data.errors.length) {
            msg = data.errors.map(function (x) { return x.message; }).join(", ");
          }
        } catch (e) {}
        setStatus(form, "⚠ " + msg, false);
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = submitBtn.dataset.original || "Submit";
        }
      }
    } catch (err) {
      setStatus(
        form,
        "⚠ Network error — please check your connection or email info@vittaraglobel.com.",
        false
      );
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = submitBtn.dataset.original || "Submit";
      }
    }
  }

  // Public entry point used by inline onsubmit="vittaraSubmit(event)".
  window.vittaraSubmit = function (e) {
    e.preventDefault();
    send(e.target.closest("form") || e.target);
    return false;
  };

  // Safety net: auto-bind any form that wasn't given an explicit handler,
  // and re-route the old inline handlers (handleSubmit/submitContact/etc.)
  document.addEventListener("DOMContentLoaded", function () {
    if (FORMSPREE_ENDPOINT.indexOf("YOUR_FORM_ID") !== -1) {
      console.warn(
        "[Vittara] Formspree endpoint not set yet — edit forms.js (FORMSPREE_ENDPOINT)."
      );
    }
    document.querySelectorAll("form").forEach(function (form) {
      // skip pure on-page UI forms that opt out
      if (form.dataset.noSend === "true") return;
      // overwrite any legacy inline onsubmit with our sender
      form.onsubmit = window.vittaraSubmit;
    });
  });
})();
