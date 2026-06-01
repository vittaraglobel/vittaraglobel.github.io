/* ── VITTARA AI CHATBOT ──────────────────────────────────────────────
   Powered by Claude (Anthropic) — smart accounting assistant for Vittara
   Inject this script at the bottom of every page
   ─────────────────────────────────────────────────────────────────── */

(function () {
  /* ── CONFIG ── */
  const BRAND = {
    name: 'Vittara AI',
    tagline: 'Your accounting assistant',
    gold: '#C9A84C',
    navy: '#0A1628',
    navyMid: '#112240',
  };

  const SYSTEM_PROMPT = `You are Vittara's friendly and expert accounting assistant. Vittara is an accounting and financial services firm founded by Darshik Pratapbhai Fataniya, headquartered in Porbandar, Gujarat, India, serving UK, Australian, and UAE businesses.

Your role: Help website visitors understand Vittara's services, pricing, and how to get started. Be warm, professional, and concise. Always encourage booking a free consultation for complex questions.

KEY FACTS:
- Founded 2024 by Darshik Pratapbhai Fataniya (B.Com, MBA Finance, MSc Accounting & Finance)
- India-based team, UK/Australia/UAE focused clients
- HMRC MTD compliant, Xero & QuickBooks certified, FCA paraplanning standards

SERVICES & PRICING:
- Bookkeeping & Accounting: from £149/month (bank reconciliation, P&L, VAT, payroll, cloud setup)
- Tax Preparation & Planning: from £299/year (self-assessment, corporation tax, CGT, R&D claims)
- VAT Returns (MTD): from £79/return (all VAT schemes, OSS/IOSS for e-commerce)
- Paraplanning Support: from £85/report (FCA-compliant suitability reports, pension analysis)
- Financial Strategy & Advisory: from £199/session (investments, retirement, wealth management)
- Business Consulting & Compliance: from £249/month (company formation, regulatory compliance)
- Virtual CFO / FD Services: custom pricing (KPI dashboards, management accounts, investor packs)

COUNTRIES SERVED:
- UK: HMRC, Companies House, FCA compliance — full UK accounting suite
- Australia: BAS lodgements, GST, ATO compliant, MYOB & Xero, STP payroll
- UAE: FTA VAT returns, UAE corporate tax, IFRS reporting, free zone accounting

HOW IT WORKS:
1. Free 30-min consultation call
2. Tailored proposal with transparent pricing
3. Onboarding within 5-7 business days
4. Monthly ongoing support

KEY ADVANTAGES:
- 50-60% cheaper than local UK/AU/UAE firms
- Time zone advantage (work done overnight, ready for UK morning)
- Dedicated account manager
- Fixed monthly pricing, no surprises
- GDPR compliant, secure data handling

CONTACT:
- Email: info@vittaraglobel.com
- Booking: https://vittaraglobel.github.io/#contact
- Free consultation available

Keep responses concise (2-4 sentences max). End responses with a helpful next step. If asked about very specific tax situations, recommend booking a free consultation. Do not make up specific numbers that aren't listed above. Be friendly and use plain English — avoid jargon.`;

  /* ── STYLES ── */
  const style = document.createElement('style');
  style.textContent = `
    #vt-chat-btn {
      position: fixed; bottom: 90px; right: 24px; z-index: 9998;
      width: 60px; height: 60px;
      background: linear-gradient(135deg, ${BRAND.gold}, #E8C97A);
      border-radius: 50%; border: none; cursor: pointer;
      box-shadow: 0 8px 28px rgba(201,168,76,0.5);
      display: flex; align-items: center; justify-content: center;
      font-size: 26px; transition: all 0.3s;
      animation: vtPulse 3s ease-in-out infinite;
    }
    #vt-chat-btn:hover { transform: scale(1.1); box-shadow: 0 12px 36px rgba(201,168,76,0.6); }
    @keyframes vtPulse {
      0%,100% { box-shadow: 0 8px 28px rgba(201,168,76,0.5); }
      50% { box-shadow: 0 8px 28px rgba(201,168,76,0.5), 0 0 0 8px rgba(201,168,76,0.1); }
    }
    #vt-chat-tooltip {
      position: fixed; bottom: 158px; right: 24px; z-index: 9998;
      background: ${BRAND.navy}; color: #fff; font-size: 12px; font-weight: 600;
      padding: 6px 14px; border-radius: 20px; white-space: nowrap;
      font-family: 'DM Sans', sans-serif; pointer-events: none;
      opacity: 0; transition: opacity 0.3s;
    }
    #vt-chat-btn:hover + #vt-chat-tooltip,
    #vt-chat-tooltip.show { opacity: 1; }
    #vt-chat-window {
      position: fixed; bottom: 100px; right: 24px; z-index: 9999;
      width: 380px; max-width: calc(100vw - 32px);
      height: 560px; max-height: calc(100vh - 120px);
      background: #fff; border-radius: 20px;
      box-shadow: 0 24px 80px rgba(10,22,40,0.25);
      display: flex; flex-direction: column; overflow: hidden;
      font-family: 'DM Sans', sans-serif;
      transform: scale(0.8) translateY(20px); opacity: 0;
      transition: all 0.3s cubic-bezier(0.34,1.56,0.64,1);
      pointer-events: none;
    }
    #vt-chat-window.open {
      transform: scale(1) translateY(0); opacity: 1; pointer-events: all;
    }
    #vt-chat-header {
      background: linear-gradient(135deg, ${BRAND.navy}, ${BRAND.navyMid});
      padding: 16px 20px; display: flex; align-items: center; gap: 12px;
      border-radius: 20px 20px 0 0; flex-shrink: 0;
    }
    #vt-chat-avatar {
      width: 40px; height: 40px; border-radius: 50%; flex-shrink: 0;
      background: linear-gradient(135deg, ${BRAND.gold}, #E8C97A);
      display: flex; align-items: center; justify-content: center;
      font-size: 18px;
    }
    #vt-chat-header-text { flex: 1; }
    #vt-chat-header-name { font-size: 15px; font-weight: 700; color: #fff; }
    #vt-chat-header-status { font-size: 12px; color: rgba(255,255,255,0.6); display: flex; align-items: center; gap: 6px; margin-top: 2px; }
    #vt-chat-header-status::before { content: ''; width: 6px; height: 6px; background: #4ade80; border-radius: 50%; display: inline-block; }
    #vt-chat-close {
      width: 32px; height: 32px; background: rgba(255,255,255,0.1); border: none;
      border-radius: 50%; cursor: pointer; color: rgba(255,255,255,0.7);
      font-size: 16px; display: flex; align-items: center; justify-content: center;
      transition: background 0.2s; flex-shrink: 0;
    }
    #vt-chat-close:hover { background: rgba(255,255,255,0.2); color: #fff; }
    #vt-chat-msgs {
      flex: 1; overflow-y: auto; padding: 16px;
      display: flex; flex-direction: column; gap: 12px;
      background: #F8F6F1;
    }
    #vt-chat-msgs::-webkit-scrollbar { width: 4px; }
    #vt-chat-msgs::-webkit-scrollbar-track { background: transparent; }
    #vt-chat-msgs::-webkit-scrollbar-thumb { background: rgba(10,22,40,0.15); border-radius: 4px; }
    .vt-msg { display: flex; gap: 8px; align-items: flex-end; max-width: 90%; }
    .vt-msg.user { flex-direction: row-reverse; margin-left: auto; }
    .vt-msg-avatar {
      width: 28px; height: 28px; border-radius: 50%; flex-shrink: 0;
      background: linear-gradient(135deg, ${BRAND.gold}, #E8C97A);
      display: flex; align-items: center; justify-content: center; font-size: 12px;
    }
    .vt-msg.user .vt-msg-avatar { background: linear-gradient(135deg, ${BRAND.navy}, ${BRAND.navyMid}); color: ${BRAND.gold}; font-size: 10px; font-weight: 700; }
    .vt-msg-bubble {
      padding: 10px 14px; border-radius: 18px; font-size: 14px; line-height: 1.5;
      max-width: calc(100% - 36px);
    }
    .vt-msg.bot .vt-msg-bubble {
      background: #fff; color: #2C2C2C; border: 1px solid #E5E0D5;
      border-radius: 4px 18px 18px 18px;
    }
    .vt-msg.user .vt-msg-bubble {
      background: linear-gradient(135deg, ${BRAND.navy}, ${BRAND.navyMid});
      color: #fff; border-radius: 18px 18px 4px 18px;
    }
    .vt-typing {
      display: flex; gap: 4px; align-items: center; padding: 12px 14px;
      background: #fff; border: 1px solid #E5E0D5; border-radius: 4px 18px 18px 18px;
    }
    .vt-typing span {
      width: 6px; height: 6px; background: ${BRAND.gold}; border-radius: 50%;
      animation: vtBounce 1.4s ease-in-out infinite;
    }
    .vt-typing span:nth-child(2) { animation-delay: 0.2s; }
    .vt-typing span:nth-child(3) { animation-delay: 0.4s; }
    @keyframes vtBounce { 0%,80%,100%{transform:scale(0.6);opacity:.4} 40%{transform:scale(1);opacity:1} }
    .vt-quick-replies {
      display: flex; flex-wrap: wrap; gap: 6px; margin-top: 4px;
    }
    .vt-quick-btn {
      padding: 6px 12px; border-radius: 20px; border: 1px solid ${BRAND.gold};
      background: rgba(201,168,76,0.08); color: ${BRAND.navy}; font-size: 12px;
      font-weight: 600; cursor: pointer; font-family: 'DM Sans', sans-serif;
      transition: all 0.2s; white-space: nowrap;
    }
    .vt-quick-btn:hover { background: ${BRAND.gold}; color: ${BRAND.navy}; }
    #vt-chat-footer {
      padding: 12px 16px; background: #fff; border-top: 1px solid #E5E0D5;
      flex-shrink: 0;
    }
    #vt-chat-input-row { display: flex; gap: 8px; align-items: flex-end; }
    #vt-chat-input {
      flex: 1; border: 1px solid #E5E0D5; border-radius: 12px;
      padding: 10px 14px; font-family: 'DM Sans', sans-serif; font-size: 14px;
      color: #2C2C2C; resize: none; outline: none; max-height: 100px;
      line-height: 1.4; transition: border-color 0.2s;
    }
    #vt-chat-input:focus { border-color: ${BRAND.gold}; }
    #vt-chat-input::placeholder { color: #9CA3AF; }
    #vt-chat-send {
      width: 40px; height: 40px; background: linear-gradient(135deg, ${BRAND.gold}, #E8C97A);
      border: none; border-radius: 12px; cursor: pointer; flex-shrink: 0;
      display: flex; align-items: center; justify-content: center;
      transition: all 0.2s; font-size: 16px;
    }
    #vt-chat-send:hover { transform: scale(1.05); }
    #vt-chat-send:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
    #vt-chat-powered {
      text-align: center; font-size: 11px; color: #9CA3AF;
      margin-top: 8px; font-family: 'DM Sans', sans-serif;
    }
    .vt-cta-card {
      background: linear-gradient(135deg, ${BRAND.navy}, ${BRAND.navyMid});
      border-radius: 12px; padding: 14px; margin-top: 4px;
    }
    .vt-cta-card p { font-size: 13px; color: rgba(255,255,255,0.8); margin-bottom: 10px; }
    .vt-cta-btn {
      display: block; text-align: center; background: linear-gradient(135deg, ${BRAND.gold}, #E8C97A);
      color: ${BRAND.navy}; font-weight: 700; font-size: 13px; padding: 10px;
      border-radius: 8px; text-decoration: none; transition: all 0.2s; cursor: pointer; border: none;
      font-family: 'DM Sans', sans-serif; width: 100%;
    }
    .vt-cta-btn:hover { transform: translateY(-1px); }
    @media (max-width: 480px) {
      #vt-chat-window { right: 8px; width: calc(100vw - 16px); bottom: 90px; }
      #vt-chat-btn { right: 16px; }
      #vt-chat-tooltip { right: 16px; }
    }
  `;
  document.head.appendChild(style);

  /* ── HTML STRUCTURE ── */
  const container = document.createElement('div');
  container.innerHTML = `
    <button id="vt-chat-btn" aria-label="Chat with Vittara AI">🤖</button>
    <div id="vt-chat-tooltip">Chat with our AI assistant</div>
    <div id="vt-chat-window" role="dialog" aria-label="Vittara AI Chat">
      <div id="vt-chat-header">
        <div id="vt-chat-avatar">🤖</div>
        <div id="vt-chat-header-text">
          <div id="vt-chat-header-name">${BRAND.name}</div>
          <div id="vt-chat-header-status">Online — here to help</div>
        </div>
        <button id="vt-chat-close" aria-label="Close chat">✕</button>
      </div>
      <div id="vt-chat-msgs"></div>
      <div id="vt-chat-footer">
        <div id="vt-chat-input-row">
          <textarea id="vt-chat-input" placeholder="Ask about our services, pricing..." rows="1"></textarea>
          <button id="vt-chat-send" aria-label="Send">➤</button>
        </div>
        <div id="vt-chat-powered">Powered by Claude AI · Vittara Financial Services</div>
      </div>
    </div>
  `;
  document.body.appendChild(container);

  /* ── STATE ── */
  const state = {
    open: false,
    loading: false,
    messages: [], // {role, content}
    greeted: false,
  };

  /* ── ELEMENTS ── */
  const btn = document.getElementById('vt-chat-btn');
  const win = document.getElementById('vt-chat-window');
  const msgs = document.getElementById('vt-chat-msgs');
  const input = document.getElementById('vt-chat-input');
  const sendBtn = document.getElementById('vt-chat-send');
  const closeBtn = document.getElementById('vt-chat-close');
  const tooltip = document.getElementById('vt-chat-tooltip');

  /* ── QUICK REPLIES ── */
  const QUICK_REPLIES = [
    ['💷 Pricing', 'What are your pricing plans?'],
    ['📊 Bookkeeping', 'Tell me about your bookkeeping service'],
    ['💼 Tax Returns', 'How do you handle UK tax returns?'],
    ['🇦🇺 Australia', 'Do you serve Australian businesses?'],
    ['🇦🇪 UAE', 'Do you serve UAE businesses?'],
    ['🔒 Data Safety', 'How do you keep my data safe?'],
    ['📞 Book Call', 'I want to book a free consultation'],
  ];

  /* ── TOGGLE ── */
  function toggleChat() {
    state.open = !state.open;
    win.classList.toggle('open', state.open);
    btn.textContent = state.open ? '✕' : '🤖';
    tooltip.classList.remove('show');
    if (state.open && !state.greeted) {
      state.greeted = true;
      setTimeout(() => greet(), 400);
    }
    if (state.open) setTimeout(() => input.focus(), 350);
  }

  btn.addEventListener('click', toggleChat);
  closeBtn.addEventListener('click', toggleChat);

  // Tooltip pulse after 8 seconds
  setTimeout(() => {
    if (!state.open) { tooltip.classList.add('show'); setTimeout(() => tooltip.classList.remove('show'), 3500); }
  }, 8000);

  /* ── GREETING ── */
  function greet() {
    const hour = new Date().getHours();
    const timeGreet = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
    addBotMsg(
      `${timeGreet}! 👋 I'm Vittara's AI assistant — I can help you with questions about our accounting services, pricing, and how we work.\n\nWhat can I help you with today?`,
      QUICK_REPLIES
    );
  }

  /* ── ADD MESSAGE ── */
  function addBotMsg(text, quickReplies) {
    const div = document.createElement('div');
    div.className = 'vt-msg bot';
    const avatar = document.createElement('div');
    avatar.className = 'vt-msg-avatar';
    avatar.textContent = '🤖';
    const bubble = document.createElement('div');
    bubble.className = 'vt-msg-bubble';

    // Format text — convert **bold** and \n
    const formatted = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br>');
    bubble.innerHTML = formatted;

    div.appendChild(avatar);

    const wrapper = document.createElement('div');
    wrapper.style.display = 'flex';
    wrapper.style.flexDirection = 'column';
    wrapper.style.gap = '8px';
    wrapper.style.maxWidth = 'calc(100% - 36px)';
    wrapper.appendChild(bubble);

    if (quickReplies && quickReplies.length) {
      const qr = document.createElement('div');
      qr.className = 'vt-quick-replies';
      quickReplies.forEach(([label, msg]) => {
        const b = document.createElement('button');
        b.className = 'vt-quick-btn';
        b.textContent = label;
        b.onclick = () => { qr.remove(); sendMsg(msg); };
        qr.appendChild(b);
      });
      wrapper.appendChild(qr);
    }

    div.appendChild(wrapper);
    msgs.appendChild(div);
    scrollBottom();
  }

  function addUserMsg(text) {
    const div = document.createElement('div');
    div.className = 'vt-msg user';
    const avatar = document.createElement('div');
    avatar.className = 'vt-msg-avatar';
    avatar.textContent = 'You';
    const bubble = document.createElement('div');
    bubble.className = 'vt-msg-bubble';
    bubble.textContent = text;
    div.appendChild(bubble);
    div.appendChild(avatar);
    msgs.appendChild(div);
    scrollBottom();
  }

  function addTyping() {
    const div = document.createElement('div');
    div.className = 'vt-msg bot';
    div.id = 'vt-typing';
    const avatar = document.createElement('div');
    avatar.className = 'vt-msg-avatar';
    avatar.textContent = '🤖';
    const typing = document.createElement('div');
    typing.className = 'vt-typing';
    typing.innerHTML = '<span></span><span></span><span></span>';
    div.appendChild(avatar);
    div.appendChild(typing);
    msgs.appendChild(div);
    scrollBottom();
  }

  function removeTyping() {
    const t = document.getElementById('vt-typing');
    if (t) t.remove();
  }

  function scrollBottom() {
    msgs.scrollTop = msgs.scrollHeight;
  }

  /* ── SEND MESSAGE ── */
  async function sendMsg(text) {
    const trimmed = (text || input.value).trim();
    if (!trimmed || state.loading) return;
    input.value = '';
    input.style.height = 'auto';

    addUserMsg(trimmed);
    state.messages.push({ role: 'user', content: trimmed });
    state.loading = true;
    sendBtn.disabled = true;
    addTyping();

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 400,
          system: SYSTEM_PROMPT,
          messages: state.messages,
        }),
      });

      const data = await response.json();
      removeTyping();

      if (data.content && data.content[0]) {
        const reply = data.content[0].text;
        state.messages.push({ role: 'assistant', content: reply });

        // Check if we should show booking CTA
        const bookingKeywords = ['consult', 'book', 'call', 'speak', 'talk', 'appointment', 'meet'];
        const showBooking = bookingKeywords.some(k => reply.toLowerCase().includes(k));

        addBotMsg(reply);

        if (showBooking) {
          setTimeout(() => {
            const card = document.createElement('div');
            card.className = 'vt-msg bot';
            card.innerHTML = `
              <div class="vt-msg-avatar">🤖</div>
              <div style="max-width:calc(100% - 36px)">
                <div class="vt-cta-card">
                  <p>Book your free 30-minute discovery call with Darshik — no obligation, no pressure.</p>
                  <button class="vt-cta-btn" onclick="if(window.openModal)openModal();else window.location.href='index.html'">📅 Book Free Consultation →</button>
                </div>
              </div>`;
            msgs.appendChild(card);
            scrollBottom();
          }, 600);
        }
      } else {
        throw new Error('No response');
      }
    } catch (err) {
      removeTyping();
      // Fallback to rule-based response
      const fallback = getFallbackResponse(trimmed);
      state.messages.push({ role: 'assistant', content: fallback.text });
      addBotMsg(fallback.text, fallback.quickReplies);
    }

    state.loading = false;
    sendBtn.disabled = false;
    input.focus();
  }

  /* ── FALLBACK RULE-BASED RESPONSES ── */
  function getFallbackResponse(text) {
    const t = text.toLowerCase();

    if (t.match(/pric|cost|fee|cheap|much|rate|£|\$/)) {
      return {
        text: `Our pricing is fixed and transparent:\n\n**Bookkeeping:** from £149/month\n**Tax Returns:** from £299/year\n**VAT Returns:** from £79/return\n**Paraplanning:** from £85/report\n**Advisory:** from £199/session\n\nAll prices are 50–60% less than equivalent UK firms. Want a personalised quote?`,
        quickReplies: [['📞 Get a Quote', 'I want a personalised quote'], ['📊 Bookkeeping', 'Tell me more about bookkeeping']],
      };
    }
    if (t.match(/book|consult|call|speak|meet|appoin/)) {
      return {
        text: `Booking is easy! Our free 30-minute discovery call is completely no-obligation.\n\nClick "Book Consultation" in the navigation, or I can direct you to our contact page. Darshik typically responds within a few hours during UK business hours.`,
        quickReplies: [['📅 Book Now', 'How do I book a consultation?']],
      };
    }
    if (t.match(/australia|aus|ato|bas|gst|myob/)) {
      return {
        text: `Yes! We serve Australian businesses. Our Australia services include:\n\n• **BAS lodgements** (from A$149)\n• **GST returns** — ATO compliant\n• **Company tax returns** (from A$399/year)\n• **Xero & MYOB** certified\n• **STP payroll** compliance\n\nWould you like to discuss your Australian accounting needs?`,
        quickReplies: [['🇦🇺 AU Pricing', 'What are your Australian prices?'], ['📞 Book Call', 'I want to discuss my Australian business']],
      };
    }
    if (t.match(/uae|dubai|abu dhabi|fta|vat uae|emira/)) {
      return {
        text: `Absolutely — we specialise in UAE businesses! Our UAE services cover:\n\n• **UAE VAT returns** (FTA compliant)\n• **Corporate Tax** (introduced June 2023)\n• **Free zone accounting** (DIFC, JAFZA, ADGM)\n• **IFRS financial statements**\n• **Virtual CFO services**\n\nWant to know more about our UAE offering?`,
        quickReplies: [['🇦🇪 UAE Services', 'Tell me more about UAE services'], ['📞 Book Call', 'I want to discuss my UAE business']],
      };
    }
    if (t.match(/safe|secure|gdpr|data|privacy|confidenti/)) {
      return {
        text: `Your data security is our top priority. Here's how we protect you:\n\n🔒 **TLS/SSL encryption** on all transfers\n📋 **GDPR Data Processing Agreement** with every client\n☁️ **ISO 27001 certified platforms** (Xero/QuickBooks)\n🔑 **Two-factor authentication** on all systems\n👁️ **Full audit logging** of all data access\n\nWe operate fully under UK GDPR for all client data.`,
        quickReplies: [['📋 Learn More', 'Tell me more about data security'], ['📞 Book Call', 'I want to get started']],
      };
    }
    if (t.match(/tax|hmrc|self.assess|corporation|capital gain|r&d/)) {
      return {
        text: `Our UK tax services include:\n\n• **Self-assessment returns** from £199\n• **Corporation tax (CT600)** from £299/year\n• **Capital gains tax** from £149/disposal\n• **R&D tax relief claims** from £499\n• **Property & rental income tax** from £249/year\n\nAll with zero HMRC penalties and full MTD compliance. Need help with a specific tax situation?`,
        quickReplies: [['💼 Tax Planning', 'Tell me about tax planning'], ['📞 Book Call', 'I want a free tax review']],
      };
    }
    if (t.match(/paraplann|ifa|suitability|pension|fca/)) {
      return {
        text: `Our paraplanning service is built specifically for UK IFAs and financial advisers:\n\n• **FCA-compliant suitability reports** from £85/report\n• **48-hour turnaround** guaranteed\n• Pension transfer & drawdown analysis\n• Investment research & fund comparisons\n• CDD support & compliance documentation\n\nWe've helped IFA firms double their report output while maintaining FCA compliance.`,
        quickReplies: [['📈 Paraplanning', 'Tell me more about paraplanning'], ['📞 Book Call', 'I want to discuss paraplanning support']],
      };
    }
    if (t.match(/bookkeep|account|reconcil|payroll|cloud|xero|quickbook/)) {
      return {
        text: `Our bookkeeping service covers everything from day one:\n\n✓ Monthly bank reconciliation\n✓ Profit & loss statements\n✓ VAT return preparation (MTD)\n✓ Payroll management\n✓ Xero/QuickBooks setup & migration\n✓ Dedicated account manager\n\n**From £149/month** — with reports delivered by the 5th of every month.`,
        quickReplies: [['💷 See Pricing', 'Tell me about bookkeeping pricing'], ['📞 Get a Quote', 'I want a bookkeeping quote']],
      };
    }
    if (t.match(/vat|mtd|making tax digital|scheme/)) {
      return {
        text: `We handle all UK VAT requirements:\n\n• All VAT schemes (Standard, Flat Rate, Cash, Annual, OSS/IOSS)\n• **£79 per return** — preparation, review, and MTD submission\n• Zero penalties across all clients\n• E-commerce VAT OSS for EU sales\n• HMRC correspondence handled\n\nFully Making Tax Digital compliant from day one.`,
        quickReplies: [['💷 VAT Pricing', 'What is your VAT pricing?'], ['📞 Book Call', 'I want to discuss VAT services']],
      };
    }
    if (t.match(/hello|hi|hey|good|morning|afternoon|evening/)) {
      return {
        text: `Hello! 👋 Great to hear from you. I'm Vittara's AI assistant — I can help with questions about our accounting services for UK, Australian, and UAE businesses.\n\nWhat can I help you with today?`,
        quickReplies: QUICK_REPLIES.slice(0, 4),
      };
    }
    // Default
    return {
      text: `Thanks for your message! For the most accurate answer, I'd recommend booking a **free 30-minute consultation** with our founder Darshik — he can give you specific advice tailored to your situation.\n\nIn the meantime, is there anything specific about our services or pricing I can help with?`,
      quickReplies: [['💷 Pricing', 'What are your prices?'], ['📞 Book Call', 'I want to book a free consultation'], ['🔒 Data Safety', 'How do you keep my data safe?']],
    };
  }

  /* ── EVENT LISTENERS ── */
  sendBtn.addEventListener('click', () => sendMsg());

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMsg();
    }
  });

  // Auto-resize textarea
  input.addEventListener('input', () => {
    input.style.height = 'auto';
    input.style.height = Math.min(input.scrollHeight, 100) + 'px';
  });

  // Escape key closes chat
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && state.open) toggleChat();
  });

})();
