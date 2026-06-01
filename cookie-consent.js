/* ── VITTARA COOKIE CONSENT ─────────────────────────────────────────────
   Inject this script on every page: <script src="cookie-consent.js"></script>
   Place just before </body> on every HTML file.
   ─────────────────────────────────────────────────────────────────────── */

(function () {
  'use strict';

  // Don't show on the landing page itself
  if (window.location.pathname.includes('landing.html')) return;

  // Already made a choice?
  if (localStorage.getItem('vt_cookies')) return;

  const GOLD = '#C9A84C';
  const NAVY = '#0A1628';

  /* ── INJECT STYLES ── */
  const style = document.createElement('style');
  style.textContent = `
    #vt-cookie-banner {
      position: fixed; bottom: 0; left: 0; right: 0; z-index: 9990;
      background: rgba(10,22,40,0.97);
      border-top: 1px solid rgba(201,168,76,0.25);
      backdrop-filter: blur(16px);
      padding: 18px 5%;
      display: flex; align-items: center; justify-content: space-between;
      gap: 20px; flex-wrap: wrap;
      font-family: 'DM Sans', sans-serif;
      transform: translateY(100%);
      transition: transform 0.5s cubic-bezier(0.34,1.3,0.64,1);
      box-shadow: 0 -8px 32px rgba(0,0,0,0.4);
    }
    #vt-cookie-banner.show { transform: translateY(0); }
    #vt-cookie-banner p {
      font-size: 13px; color: rgba(255,255,255,0.65);
      line-height: 1.6; flex: 1; min-width: 240px; margin: 0;
    }
    #vt-cookie-banner a { color: ${GOLD}; text-decoration: none; }
    #vt-cookie-banner a:hover { text-decoration: underline; }
    .vt-ck-btns { display: flex; gap: 10px; flex-wrap: wrap; align-items: center; }
    .vt-ck-manage {
      font-size: 12px; color: rgba(255,255,255,0.4); cursor: pointer;
      background: none; border: none; font-family: 'DM Sans', sans-serif;
      text-decoration: underline; padding: 0 4px; transition: color 0.2s;
    }
    .vt-ck-manage:hover { color: rgba(255,255,255,0.7); }
    .vt-ck-reject {
      background: transparent; color: rgba(255,255,255,0.55);
      border: 1px solid rgba(255,255,255,0.15); border-radius: 8px;
      padding: 9px 18px; font-family: 'DM Sans', sans-serif;
      font-size: 13px; font-weight: 600; cursor: pointer;
      transition: all 0.2s; white-space: nowrap;
    }
    .vt-ck-reject:hover { border-color: rgba(255,255,255,0.35); color: rgba(255,255,255,0.85); }
    .vt-ck-accept {
      background: linear-gradient(135deg, ${GOLD}, #E8C97A);
      color: ${NAVY}; border: none; border-radius: 8px;
      padding: 9px 22px; font-family: 'DM Sans', sans-serif;
      font-size: 13px; font-weight: 700; cursor: pointer;
      transition: all 0.2s; white-space: nowrap;
    }
    .vt-ck-accept:hover { transform: translateY(-1px); box-shadow: 0 6px 18px rgba(201,168,76,0.4); }

    /* Preferences modal */
    #vt-cookie-modal {
      display: none; position: fixed; inset: 0; z-index: 9995;
      background: rgba(0,0,0,0.7); backdrop-filter: blur(6px);
      align-items: center; justify-content: center;
    }
    #vt-cookie-modal.open { display: flex; }
    .vt-modal-box {
      background: #fff; border-radius: 20px; padding: 36px;
      width: 90%; max-width: 520px; position: relative;
      animation: vt-mi 0.3s ease;
      font-family: 'DM Sans', sans-serif;
    }
    @keyframes vt-mi { from{opacity:0;transform:scale(.95) translateY(16px);} to{opacity:1;transform:scale(1) translateY(0);} }
    .vt-modal-title { font-family: 'Playfair Display', serif; font-size: 22px; font-weight: 700; color: ${NAVY}; margin-bottom: 6px; }
    .vt-modal-desc { font-size: 14px; color: #6B7280; margin-bottom: 24px; line-height: 1.6; }
    .vt-pref-row {
      display: flex; justify-content: space-between; align-items: flex-start;
      padding: 16px 0; border-bottom: 1px solid #E5E0D5; gap: 16px;
    }
    .vt-pref-row:last-of-type { border-bottom: none; }
    .vt-pref-info h4 { font-size: 14px; font-weight: 700; color: ${NAVY}; margin-bottom: 4px; }
    .vt-pref-info p { font-size: 12px; color: #6B7280; line-height: 1.5; }
    .vt-toggle { position: relative; width: 44px; height: 24px; flex-shrink: 0; }
    .vt-toggle input { opacity: 0; width: 0; height: 0; }
    .vt-slider {
      position: absolute; inset: 0; cursor: pointer;
      background: #E5E0D5; border-radius: 24px; transition: background 0.3s;
    }
    .vt-slider::before {
      content: ''; position: absolute; width: 18px; height: 18px;
      left: 3px; top: 3px; background: #fff; border-radius: 50%;
      transition: transform 0.3s; box-shadow: 0 1px 4px rgba(0,0,0,0.2);
    }
    .vt-toggle input:checked + .vt-slider { background: ${GOLD}; }
    .vt-toggle input:checked + .vt-slider::before { transform: translateX(20px); }
    .vt-toggle input:disabled + .vt-slider { cursor: not-allowed; opacity: 0.7; }
    .vt-modal-btns { display: flex; gap: 12px; margin-top: 24px; flex-wrap: wrap; }
    .vt-modal-save {
      flex: 1; background: linear-gradient(135deg, ${GOLD}, #E8C97A);
      color: ${NAVY}; border: none; border-radius: 8px;
      padding: 12px; font-family: 'DM Sans', sans-serif;
      font-size: 14px; font-weight: 700; cursor: pointer; transition: all 0.2s;
    }
    .vt-modal-reject {
      background: #F8F6F1; color: #6B7280; border: 1px solid #E5E0D5;
      border-radius: 8px; padding: 12px 20px; font-family: 'DM Sans', sans-serif;
      font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.2s;
    }
  `;
  document.head.appendChild(style);

  /* ── BANNER HTML ── */
  const banner = document.createElement('div');
  banner.id = 'vt-cookie-banner';
  banner.innerHTML = `
    <p>We use cookies to improve your browsing experience and analyse site traffic.
      <a href="cookie-policy.html">Cookie Policy</a> · <a href="privacy-policy.html">Privacy Policy</a></p>
    <div class="vt-ck-btns">
      <button class="vt-ck-manage" onclick="vtOpenPrefs()">Manage Preferences</button>
      <button class="vt-ck-reject" onclick="vtSetCookies('essential')">Essential Only</button>
      <button class="vt-ck-accept" onclick="vtSetCookies('all')">Accept All Cookies</button>
    </div>
  `;
  document.body.appendChild(banner);

  /* ── PREFERENCES MODAL ── */
  const modal = document.createElement('div');
  modal.id = 'vt-cookie-modal';
  modal.innerHTML = `
    <div class="vt-modal-box">
      <h2 class="vt-modal-title">Cookie Preferences</h2>
      <p class="vt-modal-desc">Choose which cookies you allow. Essential cookies cannot be disabled as the site requires them to function.</p>
      <div class="vt-pref-row">
        <div class="vt-pref-info"><h4>Essential Cookies</h4><p>Required for the site to work — session management, security, and preferences. Cannot be disabled.</p></div>
        <label class="vt-toggle"><input type="checkbox" checked disabled><span class="vt-slider"></span></label>
      </div>
      <div class="vt-pref-row">
        <div class="vt-pref-info"><h4>Analytics Cookies</h4><p>Help us understand how visitors use the site so we can improve your experience.</p></div>
        <label class="vt-toggle"><input type="checkbox" id="vt-ck-analytics" checked><span class="vt-slider"></span></label>
      </div>
      <div class="vt-pref-row">
        <div class="vt-pref-info"><h4>Functional Cookies</h4><p>Remember your preferences like country selection and language to personalise your visit.</p></div>
        <label class="vt-toggle"><input type="checkbox" id="vt-ck-functional" checked><span class="vt-slider"></span></label>
      </div>
      <div class="vt-modal-btns">
        <button class="vt-modal-reject" onclick="vtSetCookies('essential')">Reject Non-Essential</button>
        <button class="vt-modal-save" onclick="vtSavePrefs()">Save My Preferences</button>
      </div>
    </div>
  `;
  modal.addEventListener('click', (e) => { if (e.target === modal) vtClosePrefs(); });
  document.body.appendChild(modal);

  /* ── SHOW BANNER after short delay ── */
  setTimeout(() => banner.classList.add('show'), 800);

  /* ── FUNCTIONS ── */
  window.vtSetCookies = function (choice) {
    localStorage.setItem('vt_cookies', choice);
    hideBanner();
  };

  window.vtOpenPrefs = function () {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  window.vtClosePrefs = function () {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  };

  window.vtSavePrefs = function () {
    const analytics = document.getElementById('vt-ck-analytics').checked;
    const functional = document.getElementById('vt-ck-functional').checked;
    const choice = (analytics || functional) ? 'custom' : 'essential';
    localStorage.setItem('vt_cookies', choice);
    localStorage.setItem('vt_ck_analytics', analytics);
    localStorage.setItem('vt_ck_functional', functional);
    vtClosePrefs();
    hideBanner();
  };

  function hideBanner() {
    banner.style.transform = 'translateY(100%)';
    setTimeout(() => banner.remove(), 500);
  }

})();
