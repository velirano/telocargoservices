/* Telo Cargo Services – assistant conversationnel (chat + voix) – FR / EN / MG */
(function () {
  'use strict';
  if (window.__tcsbot) return; window.__tcsbot = true;

  var ENDPOINT = '/assistant/chat.php';
  var STORE = 'tcsbot_v1';

  var T = {
    fr: {
      title: 'Telo', status: 'Assistant TCS · En ligne',
      open: 'Discuter avec l’assistant', close: 'Fermer', placeholder: 'Écrivez votre question…',
      send: 'Envoyer', mic: 'Parler', stop: 'Arrêter l’écoute', speakOn: 'Lecture vocale activée', speakOff: 'Lecture vocale désactivée',
      hello: 'Bonjour ! Je suis **Telo**, l’assistant de Telo Cargo Services. Je peux vous renseigner sur nos services (fret maritime et aérien, dédouanement, MAD), préparer une demande de devis ou transmettre une demande à notre équipe. Que puis-je faire pour vous ?',
      chips: ['Demander un devis', 'Quels documents pour importer ?', 'Suivre mon expédition', 'Où sont vos agences ?'],
      privacy: 'Assistant automatisé (IA). Ne partagez pas d’informations sensibles. <a href="/mentions.html#assistant">Confidentialité</a>',
      typing: 'Telo écrit…', listening: 'Je vous écoute…',
      err: 'Désolé, je ne peux pas répondre pour le moment. Appelez-nous au **+261 34 11 311 04** ou écrivez à **sales@telocargoservices.com**.',
      rate: 'Vous avez envoyé beaucoup de messages. Réessayez dans quelques minutes, ou appelez le **+261 34 11 311 04**.',
      noMic: 'La dictée vocale n’est pas disponible sur ce navigateur. Essayez Chrome, Edge ou Safari, ou écrivez votre question.',
      noMicLang: 'La dictée vocale en malgache n’est pas encore prise en charge par les navigateurs. Écrivez votre question en malgache, je vous réponds dans votre langue.',
      noVoiceLang: 'La lecture vocale en malgache n’est pas disponible sur cet appareil : la réponse s’affiche en texte.',
      reset: 'Nouvelle conversation', handoff: 'Demande transmise à l’équipe ✓'
    },
    en: {
      title: 'Telo', status: 'TCS assistant · Online',
      open: 'Chat with the assistant', close: 'Close', placeholder: 'Type your question…',
      send: 'Send', mic: 'Speak', stop: 'Stop listening', speakOn: 'Voice replies on', speakOff: 'Voice replies off',
      hello: 'Hello! I’m **Telo**, the Telo Cargo Services assistant. I can tell you about our services (ocean and air freight, customs clearance, bonded warehouse), help you prepare a quote request or pass a request on to our team. How can I help?',
      chips: ['Get a quote', 'Documents to import?', 'Track my shipment', 'Where are your offices?'],
      privacy: 'Automated AI assistant. Do not share sensitive information. <a href="/mentions.html#assistant">Privacy</a>',
      typing: 'Telo is typing…', listening: 'Listening…',
      err: 'Sorry, I can’t answer right now. Call us on **+261 34 11 311 04** or email **sales@telocargoservices.com**.',
      rate: 'You have sent a lot of messages. Please try again in a few minutes, or call **+261 34 11 311 04**.',
      noMic: 'Voice input isn’t available in this browser. Try Chrome, Edge or Safari, or type your question.',
      noMicLang: 'Browsers don’t support Malagasy voice input yet. Type your question in Malagasy and I’ll answer in Malagasy.',
      noVoiceLang: 'Malagasy voice playback isn’t available on this device: the answer is shown as text.',
      reset: 'New conversation', handoff: 'Request sent to the team ✓'
    },
    mg: {
      title: 'Telo', status: 'Mpanampy TCS · Mifandray',
      open: 'Hiresaka amin’ny mpanampy', close: 'Hidy', placeholder: 'Soraty eto ny fanontanianao…',
      send: 'Alefa', mic: 'Miteny', stop: 'Ajanony', speakOn: 'Mamaky mafy ny valiny', speakOff: 'Tsy mamaky mafy',
      hello: 'Manao ahoana! Izaho no **Telo**, mpanampy an’i Telo Cargo Services. Afaka manazava aminao ny tolotray aho (fitaterana an-dranomasina sy an’habakabaka, fanafahana entana amin’ny ladoany, MAD), manampy anao hanomana fangatahana tombam-bidy (devis), na mampita ny fangatahanao amin’ny ekipanay. Inona no azoko anampiana anao?',
      chips: ['Hangataka devis', 'Taratasy ilaina hanafarana?', 'Hanaraka ny entako', 'Aiza ny biraonareo?'],
      privacy: 'Mpanampy mandeha ho azy (IA). Aza mizara fampahalalana saro-pady. <a href="/mentions.html#assistant">Fiarovana ny angona</a>',
      typing: 'Manoratra i Telo…', listening: 'Mihaino aho…',
      err: 'Miala tsiny, tsy afaka mamaly aho izao. Antsoy ny **+261 34 11 311 04** na manorata amin’ny **sales@telocargoservices.com**.',
      rate: 'Hafatra maro loatra no nalefanao. Andramo indray afaka minitra vitsivitsy, na antsoy ny **+261 34 11 311 04**.',
      noMic: 'Tsy misy ny fitenenana amin’ity navigateur ity. Andramo Chrome, Edge na Safari, na soraty ny fanontanianao.',
      noMicLang: 'Mbola tsy mahay mihaino teny malagasy ny navigateur. Soraty amin’ny teny malagasy ny fanontanianao, dia hamaly amin’ny teny malagasy aho.',
      noVoiceLang: 'Tsy misy feo malagasy amin’ity fitaovana ity: soratra no hanehoana ny valiny.',
      reset: 'Resaka vaovao', handoff: 'Voalefa any amin’ny ekipa ny fangatahana ✓'
    }
  };
  var SR_LANG = { fr: 'fr-FR', en: 'en-US', mg: 'mg-MG' };

  function load() { try { return JSON.parse(sessionStorage.getItem(STORE)) || null; } catch (e) { return null; } }
  function save() { try { sessionStorage.setItem(STORE, JSON.stringify(state)); } catch (e) {} }
  function prefLang() {
    try { var l = localStorage.getItem('tcsbot_lang'); if (T[l]) return l; } catch (e) {}
    var d = (document.documentElement.lang || 'fr').slice(0, 2);
    return T[d] ? d : 'fr';
  }

  var state = load() || { lang: prefLang(), msgs: [], open: false, voice: false };
  if (!T[state.lang]) state.lang = 'fr';

  /* ---------- Styles ---------- */
  var css = '' +
    '.tcsbot,.tcsbot *{box-sizing:border-box;font-family:Inter,system-ui,-apple-system,sans-serif}' +
    '.tcsbot-launch{position:fixed;right:20px;bottom:90px;z-index:9998;display:flex;align-items:center;gap:10px;padding:0 18px 0 6px;height:56px;border:0;border-radius:999px;cursor:pointer;color:#fff;background:linear-gradient(135deg,#14306a,#0b1226);box-shadow:0 0 0 1px rgba(169,208,255,.25),0 14px 34px -10px rgba(36,104,214,.8);font:600 14px/1 Montserrat,Inter,sans-serif;transition:transform .2s}' +
    '.tcsbot-launch:hover{transform:translateY(-2px)}' +
    '.tcsbot-launch .av{width:44px;height:44px;border-radius:50%;display:grid;place-items:center;background:radial-gradient(circle at 30% 25%,#5fb0ff,#1d56c4)}' +
    '.tcsbot-launch .av svg{width:24px;height:24px}' +
    '.tcsbot-launch .dot{position:absolute;left:38px;top:8px;width:11px;height:11px;border-radius:50%;background:#ff7a3d;border:2px solid #0b1226}' +
    '.tcsbot-panel{margin:0;padding:0;position:fixed;right:20px;bottom:20px;z-index:9999;width:min(400px,calc(100vw - 24px));height:min(640px,calc(100vh - 40px));display:none;flex-direction:column;background:#fff;border-radius:22px;overflow:hidden;box-shadow:0 30px 80px -20px rgba(7,11,24,.6),0 0 0 1px rgba(15,31,69,.08)}' +
    '.tcsbot.open .tcsbot-panel{display:flex;animation:tcsbotIn .25s ease}.tcsbot.open .tcsbot-launch{display:none}' +
    '@keyframes tcsbotIn{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}' +
    '.tcsbot-head{display:flex;align-items:center;gap:12px;padding:14px 14px 14px 16px;color:#fff;background:radial-gradient(120% 140% at 0% 0%,#1d4c9a,transparent 60%),linear-gradient(180deg,#0b1226,#070b18)}' +
    '.tcsbot-head .av{width:40px;height:40px;flex:none;border-radius:50%;display:grid;place-items:center;background:radial-gradient(circle at 30% 25%,#5fb0ff,#1d56c4)}.tcsbot-head .av svg{width:22px;height:22px}' +
    '.tcsbot-head .t{flex:1;min-width:0}.tcsbot-head b{display:block;font:700 15px/1.2 Montserrat,Inter,sans-serif;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.tcsbot-head small{display:block;margin-top:3px;font-size:12px;color:rgba(220,232,248,.75)}' +
    '.tcsbot-head small::before{content:"";display:inline-block;width:7px;height:7px;margin-right:6px;border-radius:50%;background:#3ddc84;vertical-align:1px}' +
    '.tcsbot-langs{display:flex;padding:3px;border:1px solid rgba(255,255,255,.18);border-radius:999px}' +
    '.tcsbot-langs button{border:0;background:none;color:rgba(255,255,255,.65);font:600 11px/1 Montserrat,Inter,sans-serif;letter-spacing:.06em;padding:6px 8px;border-radius:999px;cursor:pointer}' +
    '.tcsbot-langs button.on{background:#fff;color:#0f1f45}' +
    '.tcsbot-ib{width:34px;height:34px;flex:none;border:0;border-radius:10px;background:rgba(255,255,255,.08);color:#fff;display:grid;place-items:center;cursor:pointer}.tcsbot-ib:hover{background:rgba(255,255,255,.16)}.tcsbot-ib svg{width:18px;height:18px}' +
    '.tcsbot-ib.on{background:#ff7a3d}' +
    '.tcsbot-body{flex:1;overflow-y:auto;padding:16px;background:#f4f7fc;display:flex;flex-direction:column;gap:10px}' +
    '.tcsbot-msg{max-width:86%;padding:10px 13px;border-radius:16px;font-size:14.5px;line-height:1.55;color:#16182b;white-space:normal;word-wrap:break-word}' +
    '.tcsbot-msg.bot{align-self:flex-start;background:#fff;border:1px solid #e3e8f1;border-bottom-left-radius:5px}' +
    '.tcsbot-msg.me{align-self:flex-end;background:linear-gradient(135deg,#2468d6,#1d56c4);color:#fff;border-bottom-right-radius:5px}' +
    '.tcsbot-msg a{color:#2468d6;text-decoration:underline;text-underline-offset:2px;overflow-wrap:anywhere}.tcsbot-msg.me a{color:#fff}' +
    '.tcsbot-msg ul{margin:6px 0 2px 18px;padding:0}.tcsbot-msg p{margin:0 0 6px}.tcsbot-msg p:last-child{margin:0}' +
    '.tcsbot-note{align-self:center;font-size:12px;color:#56607a;background:#fff;border:1px dashed #cfd8e6;border-radius:10px;padding:6px 10px;max-width:92%;text-align:center}' +
    '.tcsbot-note.ok{color:#1d6b3b;border-color:#9fd6b3;background:#eefaf2}' +
    '.tcsbot-typing{align-self:flex-start;display:flex;gap:4px;padding:12px 14px;background:#fff;border:1px solid #e3e8f1;border-radius:16px}' +
    '.tcsbot-typing i{width:7px;height:7px;border-radius:50%;background:#9fb0c6;animation:tcsbotB 1s infinite}.tcsbot-typing i:nth-child(2){animation-delay:.15s}.tcsbot-typing i:nth-child(3){animation-delay:.3s}' +
    '@keyframes tcsbotB{0%,60%,100%{transform:none;opacity:.5}30%{transform:translateY(-4px);opacity:1}}' +
    '.tcsbot-chips{display:flex;flex-wrap:wrap;gap:6px;padding:2px 0}' +
    '.tcsbot-chips button{border:1px solid #c9dbf5;background:#fff;color:#14306a;border-radius:999px;padding:7px 11px;font:500 12.5px/1.2 Inter,sans-serif;cursor:pointer}.tcsbot-chips button:hover{border-color:#ff7a3d}' +
    '.tcsbot-foot{padding:10px 12px 8px;background:#fff;border-top:1px solid #e3e8f1}' +
    '.tcsbot-row{display:flex;align-items:flex-end;gap:8px}' +
    '.tcsbot-row textarea{flex:1;resize:none;max-height:110px;min-height:42px;padding:11px 13px;border:1.5px solid #e3e8f1;border-radius:14px;font-size:14.5px;line-height:1.4;color:#16182b;background:#f4f7fc;outline:0}' +
    '.tcsbot-row textarea:focus{border-color:#2468d6;background:#fff}' +
    '.tcsbot-btn{width:42px;height:42px;flex:none;border:0;border-radius:12px;display:grid;place-items:center;cursor:pointer;color:#fff;background:linear-gradient(135deg,#ff7a3d,#f05a24)}.tcsbot-btn:disabled{opacity:.5;cursor:default}' +
    '.tcsbot-btn.mic{background:#0f1f45}.tcsbot-btn.mic.rec{background:#e5484d;animation:tcsbotP 1.2s infinite}' +
    '@keyframes tcsbotP{0%{box-shadow:0 0 0 0 rgba(229,72,77,.5)}100%{box-shadow:0 0 0 12px rgba(229,72,77,0)}}' +
    '.tcsbot-btn svg{width:20px;height:20px}' +
    '.tcsbot-priv{margin-top:7px;font-size:11px;color:#7a8299;text-align:center}.tcsbot-priv a{color:#56607a;text-decoration:underline}' +
    '.tcsbot-reset{border:0;background:none;color:#7a8299;font-size:11px;text-decoration:underline;cursor:pointer;margin-left:4px}' +
    '@media(max-width:560px){.tcsbot-panel{right:0;bottom:0;width:100vw;height:100dvh;border-radius:0}.tcsbot-launch{bottom:86px;right:16px;padding:0 6px}.tcsbot-launch .lbl{display:none}}' +
    '@media(prefers-reduced-motion:reduce){.tcsbot *{animation:none!important;transition:none!important}}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  var I = {
    bot: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="M8 10h.01M12 10h.01M16 10h.01"/></svg>',
    send: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2 11 13"/><path d="M22 2 15 22l-4-9-9-4z"/></svg>',
    mic: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10a7 7 0 0 0 14 0M12 17v5"/></svg>',
    spk: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5 6 9H2v6h4l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14"/></svg>',
    x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>'
  };

  /* ---------- DOM ---------- */
  var root = document.createElement('div'); root.className = 'tcsbot';
  root.innerHTML =
    '<button class="tcsbot-launch" type="button"><span class="av">' + I.bot + '</span><span class="dot"></span><span class="lbl"></span></button>' +
    '<div class="tcsbot-panel" role="dialog" aria-modal="false">' +
      '<div class="tcsbot-head"><span class="av">' + I.bot + '</span><div class="t"><b></b><small></small></div>' +
        '<div class="tcsbot-langs" role="group" aria-label="Langue / Language / Fiteny"><button data-l="fr" lang="fr">FR</button><button data-l="en" lang="en">EN</button><button data-l="mg" lang="mg">MG</button></div>' +
        '<button class="tcsbot-ib spk" type="button">' + I.spk + '</button><button class="tcsbot-ib cls" type="button">' + I.x + '</button></div>' +
      '<div class="tcsbot-body" aria-live="polite"></div>' +
      '<div class="tcsbot-foot"><div class="tcsbot-row"><textarea rows="1" maxlength="2000"></textarea>' +
        '<button class="tcsbot-btn mic" type="button">' + I.mic + '</button><button class="tcsbot-btn snd" type="button">' + I.send + '</button></div>' +
        '<div class="tcsbot-priv"><span class="pv"></span> · <button class="tcsbot-reset" type="button"></button></div></div>' +
    '</div>';
  document.body.appendChild(root);

  var $ = function (s) { return root.querySelector(s); };
  var body = $('.tcsbot-body'), ta = $('textarea'), btnSend = $('.snd'), btnMic = $('.mic'), btnSpk = $('.spk');
  var busy = false;

  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function md(s) {
    var h = esc(s);
    h = h.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    h = h.replace(/(https?:\/\/[^\s<)]+[^\s<).,;:!?])/g, '<a href="$1" target="_blank" rel="noopener">$1</a>');
    h = h.replace(/(^|[\s(])([\w.+-]+@[\w-]+\.[\w.-]+\w)/g, '$1<a href="mailto:$2">$2</a>');
    h = h.replace(/(\+261[\d ]{9,14}\d)/g, function (m) { return '<a href="tel:' + m.replace(/\s/g, '') + '">' + m + '</a>'; });
    var out = [], list = false;
    h.split(/\n/).forEach(function (line) {
      var m = line.match(/^\s*[-•*]\s+(.*)/);
      if (m) { if (!list) { out.push('<ul>'); list = true; } out.push('<li>' + m[1] + '</li>'); }
      else { if (list) { out.push('</ul>'); list = false; } if (line.trim()) out.push('<p>' + line + '</p>'); }
    });
    if (list) out.push('</ul>');
    return out.join('');
  }
  function t() { return T[state.lang]; }

  function addBubble(role, text) {
    var d = document.createElement('div');
    d.className = 'tcsbot-msg ' + (role === 'user' ? 'me' : 'bot');
    d.innerHTML = md(text);
    body.appendChild(d); body.scrollTop = body.scrollHeight;
  }
  function addNote(text, ok) {
    var d = document.createElement('div'); d.className = 'tcsbot-note' + (ok ? ' ok' : ''); d.innerHTML = md(text);
    body.appendChild(d); body.scrollTop = body.scrollHeight;
  }
  function render() {
    var L = t();
    $('.tcsbot-launch .lbl').textContent = L.open;
    $('.tcsbot-launch').setAttribute('aria-label', L.open);
    $('.tcsbot-head b').textContent = L.title;
    $('.tcsbot-head small').textContent = L.status;
    $('.tcsbot-panel').setAttribute('aria-label', L.title);
    $('.cls').setAttribute('aria-label', L.close); $('.cls').title = L.close;
    btnSpk.setAttribute('aria-label', state.voice ? L.speakOn : L.speakOff); btnSpk.title = btnSpk.getAttribute('aria-label');
    btnSpk.classList.toggle('on', !!state.voice); btnSpk.setAttribute('aria-pressed', state.voice ? 'true' : 'false');
    ta.placeholder = L.placeholder; ta.setAttribute('aria-label', L.placeholder);
    btnSend.setAttribute('aria-label', L.send); btnSend.title = L.send;
    btnMic.setAttribute('aria-label', L.mic); btnMic.title = L.mic;
    $('.pv').innerHTML = L.privacy; $('.tcsbot-reset').textContent = L.reset;
    root.querySelectorAll('.tcsbot-langs button').forEach(function (b) { var on = b.dataset.l === state.lang; b.classList.toggle('on', on); b.setAttribute('aria-pressed', on ? 'true' : 'false'); });
    body.innerHTML = '';
    addBubble('assistant', L.hello);
    state.msgs.forEach(function (m) { addBubble(m.role, m.content); });
    if (!state.msgs.length) {
      var c = document.createElement('div'); c.className = 'tcsbot-chips';
      L.chips.forEach(function (txt) { var b = document.createElement('button'); b.type = 'button'; b.textContent = txt; b.onclick = function () { send(txt); }; c.appendChild(b); });
      body.appendChild(c);
    }
    root.classList.toggle('open', !!state.open);
  }

  function setOpen(v) { state.open = v; save(); root.classList.toggle('open', v); if (v) setTimeout(function () { ta.focus(); body.scrollTop = body.scrollHeight; }, 50); else stopSpeak(); }

  /* ---------- Envoi ---------- */
  function send(text, fromVoice) {
    text = (text || '').trim();
    if (!text || busy) return;
    var chips = body.querySelector('.tcsbot-chips'); if (chips) chips.remove();
    state.msgs.push({ role: 'user', content: text.slice(0, 2000) }); save();
    addBubble('user', text); ta.value = ''; autosize();
    busy = true; btnSend.disabled = true;
    var typing = document.createElement('div'); typing.className = 'tcsbot-typing'; typing.setAttribute('aria-label', t().typing);
    typing.innerHTML = '<i></i><i></i><i></i>'; body.appendChild(typing); body.scrollTop = body.scrollHeight;
    fetch(ENDPOINT, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lang: state.lang, page: location.pathname + location.hash, messages: state.msgs.slice(-24) })
    }).then(function (r) { return r.json().catch(function () { return { ok: false, error: 'http' + r.status }; }); })
      .then(function (j) {
        typing.remove();
        if (j && j.ok && j.reply) {
          state.msgs.push({ role: 'assistant', content: j.reply }); save();
          addBubble('assistant', j.reply);
          if (j.handoff) addNote(t().handoff, true);
          if (state.voice || fromVoice) speak(j.reply);
        } else {
          state.msgs.pop(); save();
          addNote(j && j.error === 'rate' ? t().rate : t().err);
        }
      })
      .catch(function () { typing.remove(); state.msgs.pop(); save(); addNote(t().err); })
      .then(function () { busy = false; btnSend.disabled = false; });
  }

  /* ---------- Voix : synthèse ---------- */
  var warnedVoice = false;
  function stopSpeak() { try { window.speechSynthesis && speechSynthesis.cancel(); } catch (e) {} }
  function speak(text) {
    if (!('speechSynthesis' in window)) return;
    var want = SR_LANG[state.lang], voices = speechSynthesis.getVoices() || [];
    var v = voices.filter(function (x) { return x.lang && x.lang.toLowerCase().indexOf(state.lang) === 0; });
    if (state.lang === 'mg' && !v.length) { if (!warnedVoice) { addNote(t().noVoiceLang); warnedVoice = true; } return; }
    var clean = text.replace(/\*\*/g, '').replace(/https?:\/\/\S+/g, '').replace(/^\s*[-•]\s*/gm, '').slice(0, 1200);
    stopSpeak();
    var u = new SpeechSynthesisUtterance(clean); u.lang = want; if (v[0]) u.voice = v[0]; u.rate = 1.02;
    speechSynthesis.speak(u);
  }
  if ('speechSynthesis' in window) { try { speechSynthesis.getVoices(); speechSynthesis.onvoiceschanged = function () {}; } catch (e) {} }

  /* ---------- Voix : reconnaissance ---------- */
  var SR = window.SpeechRecognition || window.webkitSpeechRecognition, rec = null, recOn = false;
  function startRec() {
    if (!SR) { addNote(t().noMic); return; }
    if (state.lang === 'mg') { addNote(t().noMicLang); ta.focus(); return; }
    stopSpeak();
    rec = new SR(); rec.lang = SR_LANG[state.lang]; rec.interimResults = true; rec.continuous = false; rec.maxAlternatives = 1;
    var finalText = '';
    rec.onresult = function (e) {
      var interim = '';
      for (var i = e.resultIndex; i < e.results.length; i++) { if (e.results[i].isFinal) finalText += e.results[i][0].transcript; else interim += e.results[i][0].transcript; }
      ta.value = (finalText + interim).trim(); autosize();
    };
    rec.onerror = function (e) { if (e.error === 'not-allowed' || e.error === 'service-not-allowed' || e.error === 'language-not-supported') addNote(t().noMic); };
    rec.onend = function () { recOn = false; btnMic.classList.remove('rec'); btnMic.setAttribute('aria-label', t().mic); ta.placeholder = t().placeholder; if (finalText.trim()) send(finalText, true); };
    try { rec.start(); recOn = true; btnMic.classList.add('rec'); btnMic.setAttribute('aria-label', t().stop); ta.placeholder = t().listening; } catch (e) { addNote(t().noMic); }
  }
  btnMic.onclick = function () { if (recOn && rec) { rec.stop(); } else startRec(); };

  /* ---------- Événements ---------- */
  function autosize() { ta.style.height = 'auto'; ta.style.height = Math.min(ta.scrollHeight, 110) + 'px'; }
  ta.addEventListener('input', autosize);
  ta.addEventListener('keydown', function (e) { if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) { e.preventDefault(); send(ta.value); } });
  btnSend.onclick = function () { send(ta.value); };
  $('.tcsbot-launch').onclick = function () { setOpen(true); };
  $('.cls').onclick = function () { setOpen(false); };
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && state.open) setOpen(false); });
  btnSpk.onclick = function () { state.voice = !state.voice; save(); if (!state.voice) stopSpeak(); render(); };
  $('.tcsbot-reset').onclick = function () { state.msgs = []; save(); stopSpeak(); render(); };
  root.querySelectorAll('.tcsbot-langs button').forEach(function (b) {
    b.onclick = function () { state.lang = b.dataset.l; try { localStorage.setItem('tcsbot_lang', state.lang); } catch (e) {} save(); render(); };
  });
  // liens « #assistant » du site : ouvrent l'assistant
  document.addEventListener('click', function (e) { var a = e.target.closest && e.target.closest('a[href="#assistant"],[data-open-assistant]'); if (a) { e.preventDefault(); setOpen(true); } });

  render();
  // L'assistant ne s'affiche que s'il est configuré côté serveur (clé API présente)
  root.style.display = 'none';
  var ready = null; try { ready = sessionStorage.getItem('tcsbot_ready'); } catch (e) {}
  if (ready === '1') root.style.display = '';
  else fetch(ENDPOINT + '?ping=1', { cache: 'no-store' }).then(function (r) { return r.json(); }).then(function (j) {
    if (j && j.ready) { root.style.display = ''; try { sessionStorage.setItem('tcsbot_ready', '1'); } catch (e) {} }
  }).catch(function () {});
})();
