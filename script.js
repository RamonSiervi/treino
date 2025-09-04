/* ===== Utils ===== */
const $ = (s, el=document) => el.querySelector(s);
const $$ = (s, el=document) => [...el.querySelectorAll(s)];
const toast = (m) => {
  const t = $('#toast');
  t.textContent = m; t.style.display = 'block';
  clearTimeout(t._h); t._h = setTimeout(()=> t.style.display='none', 1800);
};
const vibrate = (pattern)=> { try{ if(navigator.vibrate) navigator.vibrate(pattern);}catch{} };

/* ===== EmailJS (foto) ===== */
(function(){ emailjs.init("NoSQUcbjAnuG0LhrW"); })();
const EMAILJS_SERVICE = "service_vg6xd6v";
const EMAILJS_TEMPLATE = "template_je6fsmc";
const SENDER_NAME = "Ramon";      // nome de exibição no email
const TO_NAME = "Ramon";          // destinatário exibido

/* ===== Estado ===== */
let focusIndex = null; // índice do card atualmente no foco (no NodeList linear)
let cardsList = [];    // lista linear de todos os cards (para próximo exercício)

/* ===== Avatar fixo (upload local) ===== */
$('#avatarBtn').addEventListener('click', async ()=>{
  const inp = document.createElement('input');
  inp.type='file'; inp.accept='image/*';
  inp.onchange = ()=>{
    const f = inp.files?.[0]; if(!f) return;
    const r = new FileReader();
    r.onload=()=> $('#avatarImg').src = r.result;
    r.readAsDataURL(f);
  };
  inp.click();
});

/* ===== Seções (acordeão com +/− animado) ===== */
function toggleSection(btn){
  const sec = btn.closest('.section');
  const opened = sec.classList.toggle('open');
  // acessibilidade leve
  btn.setAttribute('aria-expanded', opened ? 'true':'false');
}
window.toggleSection = toggleSection;

/* ===== Progresso / Histórico ===== */
const LS_DONE = 'doneCards_v7';
const LS_HIST = 'hist_v7';
const LS_GOAL = 'goal_v7';

function loadProgress(){
  const done = JSON.parse(localStorage.getItem(LS_DONE)||'[]');
  $$('.card').forEach(c=>{
    const key = cKey(c);
    if(done.includes(key)) c.classList.add('done');
  });
}
function saveProgress(){
  const done = $$('.card.done').map(c=>cKey(c));
  localStorage.setItem(LS_DONE, JSON.stringify(done));
  // atualizar histórico do dia (contagem)
  const today = new Date(); today.setHours(0,0,0,0);
  const dkey = today.toISOString().slice(0,10);
  const hist = JSON.parse(localStorage.getItem(LS_HIST)||'{}');
  hist[dkey] = $$('.card.done').length;
  localStorage.setItem(LS_HIST, JSON.stringify(hist));
  paintWeekly();
}
function cKey(card){ return card.querySelector('h5').innerText.trim(); }

function toggleDone(ev, btn){
  ev.stopPropagation();
  const card = btn.closest('.card');
  card.classList.toggle('done');
  saveProgress();
  toast(card.classList.contains('done')? '✔ Exercício concluído!':'↩ Desmarcado');
}
window.toggleDone = toggleDone;

/* ===== Resumo semanal ===== */
const weekNames = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];
function paintWeekly(){
  const hist = JSON.parse(localStorage.getItem(LS_HIST)||'{}');
  const goal = parseInt(localStorage.getItem(LS_GOAL)||'25',10);
  $('#goalVal').textContent = goal; $('#goalCap').textContent = goal;
  const today = new Date();
  // pegar domingo como primeira coluna
  const start = new Date(today);
  const day = start.getDay();
  start.setDate(today.getDate() - day);
  let total = 0, daysActive = 0, bestCount = 0, bestIdx = null, todayCount = 0;

  for(let i=0;i<7;i++){
    const d = new Date(start); d.setDate(start.getDate()+i);
    const key = d.toISOString().slice(0,10);
    const val = hist[key] || 0;
    total += val; if(val>0) daysActive++;
    if(val>bestCount){ bestCount=val; bestIdx=i; }
    if(i===day){ todayCount = val; }
    const col = $('#d'+i);
    if(col){
      const pct = Math.min(100, val*10); // escala simples
      col.style.setProperty('--h', pct+'%');
      col.style.position='relative';
      col.innerHTML = '';
      col.style.setProperty('background','#eef3ff');
      col.style.setProperty('border-radius','8px');
      // usa pseudo via inline: simulamos com filho
      const fill = document.createElement('b'); fill.style.cssText=`position:absolute;left:0;bottom:0;width:100%;height:${pct}%;background:linear-gradient(180deg,#7b6cff,#5ec2ff)`;
      col.appendChild(fill);
    }
  }
  $('#totalDone').textContent = total;
  $('#goalBar').style.width = Math.min(100, (total/goal)*100) + '%';
  $('#daysActive').textContent = daysActive;
  $('#bestDay').textContent = bestIdx==null?'—':weekNames[bestIdx];
  $('#todayCount').textContent = todayCount;
}
$('#editGoal').addEventListener('click', ()=>{
  const cur = parseInt(localStorage.getItem(LS_GOAL)||'25',10);
  const v = prompt('Nova meta semanal (exercícios):', cur);
  if(!v) return;
  const n = Math.max(1, Number(v)||cur);
  localStorage.setItem(LS_GOAL, String(n));
  paintWeekly();
});

/* ===== Histórico Modal ===== */
$('#historyBtn').addEventListener('click', ()=>{
  const hist = JSON.parse(localStorage.getItem(LS_HIST)||'{}');
  const list = $('#historyList'); list.innerHTML = '';
  Object.keys(hist).sort().reverse().slice(0,21).forEach(k=>{
    const li = document.createElement('li');
    li.innerHTML = `<span>${k}</span><b>${hist[k]}</b>`;
    list.appendChild(li);
  });
  $('#historyModal').style.display='flex';
});
function closeHistory(){ $('#historyModal').style.display='none'; }
window.closeHistory = closeHistory;

/* ===== Upload Foto (EmailJS) ===== */
$('#uploadBtn').addEventListener('click', ()=> $('#uploadModal').style.display='flex');
function closeUpload(){ $('#uploadModal').style.display='none'; }
window.closeUpload = closeUpload;

$('#uploadForm').addEventListener('submit', async (e)=>{
  e.preventDefault();
  const file = $('#fileInput').files[0];
  if(!file){ toast('Selecione uma imagem.'); return; }

  const msg = $('#msgInput').value || 'Foto de treino';
  // Converte para base64
  const b64 = await fileToBase64(file); // dataURL
  const data = {
    from_name: SENDER_NAME,
    to_name: TO_NAME,
    message: msg,
    // EmailJS aceita attachments como [{name, data}]
    attachments: [{ name: file.name || 'foto.jpg', data: b64 }]
  };
  try{
    await emailjs.send(EMAILJS_SERVICE, EMAILJS_TEMPLATE, data);
    toast('📸 Foto enviada para seu e-mail!');
    closeUpload();
  }catch(err){
    console.error(err);
    toast('Falha no envio. Verifique EmailJS/template.');
  }
});
function fileToBase64(f){
  return new Promise((res,rej)=>{
    const r = new FileReader();
    r.onload = ()=> res(r.result);
    r.onerror = rej;
    r.readAsDataURL(f);
  });
}

/* ===== Timer (Pomodoro de Intervalo) ===== */
let tRunning = false, tLeft = 0, tTick = null, tOrigin = 0;
const display = $('#timerDisplay');
const btnStart = $('#timerStartPause');
const btnConclude = $('#timerConclude');
const btnCancel = $('#timerCancel');

function format(s){ const m=Math.floor(s/60), ss=s%60; return `${String(m).padStart(2,'0')}:${String(ss).padStart(2,'0')}`; }
function beep(freq=880, dur=120, gain=0.05){
  try{
    const ctx = new (window.AudioContext||window.webkitAudioContext)();
    const o = ctx.createOscillator(); const g = ctx.createGain();
    o.type='sine'; o.frequency.value=freq;
    g.gain.value=gain; o.connect(g); g.connect(ctx.destination);
    o.start();
    setTimeout(()=>{ o.stop(); ctx.close(); }, dur);
  }catch{}
}
function startTimer(seconds){
  tLeft = seconds; tOrigin = seconds;
  display.textContent = format(tLeft);
  $('#timerModal').style.display='flex';
  btnStart.textContent='Iniciar';
}
function openTimer(btn){
  const card = btn.closest('.card');
  const meta = card.dataset.int || (card.querySelector('.meta')?.textContent||'');
  let seconds = 30;
  const m = String(meta).match(/(\d+)\s*s/i);
  if(m) seconds = parseInt(m[1],10);
  startTimer(seconds);
  // feedback de início (só quando realmente iniciar)
}
window.openTimer = openTimer;

function tick(){
  if(!tRunning) return;
  tLeft--;
  display.textContent = format(tLeft);
  // Aviso faltando 5s
  if(tLeft === 5){
    vibrate([50,50,200,50,200]);
    beep(700,120,.07);
    beep(900,120,.07);
  }
  if(tLeft <= 0){
    stopTimer();
    vibrate([200,80,200,80,300]);
    beep(880,120,.08); setTimeout(()=>beep(660,120,.08),150);
    toast('⏱ Intervalo concluído!');
    $('#timerModal').style.display='none';
  }
}
function playStartFeedback(){
  vibrate(60);
  beep(600,100,.06);
}
function startPause(){
  if(!tRunning){
    // start
    playStartFeedback();
    tRunning = true;
    btnStart.textContent='Pausar';
    clearInterval(tTick); tTick = setInterval(tick, 1000);
  }else{
    // pause
    tRunning = false;
    btnStart.textContent='Retomar';
    clearInterval(tTick);
    vibrate(30);
  }
}
function concludeTimer(){
  stopTimer();
  $('#timerModal').style.display='none';
  toast('✔ Intervalo concluído manualmente');
}
function stopTimer(){
  tRunning = false; clearInterval(tTick); tTick=null; btnStart.textContent='Iniciar';
}
btnStart.addEventListener('click', startPause);
btnCancel.addEventListener('click', ()=>{ stopTimer(); $('#timerModal').style.display='none'; });
btnConclude.addEventListener('click', concludeTimer);

/* ===== Modo Foco (útil) ===== */
let focusCards = [];
function buildCardsList(){
  cardsList = $$('.card');
  focusCards = cardsList;
}
function enterFocus(btn){
  buildCardsList();
  const card = btn.closest('.card');
  focusIndex = focusCards.indexOf(card);
  if(focusIndex < 0) focusIndex = 0;
  openFocusCard(focusCards[focusIndex]);
}
window.enterFocus = enterFocus;

function openFocusCard(card){
  $('#focusTitle').textContent = card.querySelector('h5')?.textContent || 'Foco';
  $('#focusMeta').textContent  = card.querySelector('.meta')?.textContent || '';
  $('#focusVideo').src         = card.querySelector('video')?.src || '';
  $('#focusModal').style.display='flex';
  // dica contextual
  const name = $('#focusTitle').textContent.toLowerCase();
  if(name.includes('agachamento') || name.includes('afundo')){
    setAssistant('💡 Mantenha o core firme e joelhos alinhados.');
  }else if(name.includes('crucifixo') || name.includes('peitoral')){
    setAssistant('💡 Controle na descida e não estenda demais o ombro.');
  }else if(name.includes('puxada') || name.includes('remada')){
    setAssistant('💡 Ombros longe das orelhas; puxe com as costas, não só braços.');
  }else{
    setAssistant('💡 Hidrate-se entre as séries. Respiração contínua.');
  }
}
function exitFocus(){ $('#focusModal').style.display='none'; }
window.exitFocus = exitFocus;

function nextExercise(){
  if(focusIndex==null) return;
  focusIndex = Math.min(focusIndex+1, focusCards.length-1);
  openFocusCard(focusCards[focusIndex]);
}
window.nextExercise = nextExercise;

function openTimerFromFocus(){
  const secs = parseInt(($('#focusMeta').textContent.match(/(\d+)\s*s/i)||[])[1]||'30',10);
  startTimer(secs);
}

/* ===== Assistente minimalista ===== */
function setAssistant(text){
  const a = $('#assistantTip'); a.textContent = text;
  a.style.animation = 'none'; a.offsetHeight; a.style.animation = null; // reset anim
}

/* ===== Reset ===== */
$('#resetBtn').addEventListener('click', ()=>{
  if(!confirm('Zerar todo o progresso?')) return;
  localStorage.removeItem(LS_DONE);
  localStorage.removeItem(LS_HIST);
  $$('.card').forEach(c=>c.classList.remove('done'));
  paintWeekly();
  toast('🔄 Progresso resetado.');
});

/* ===== Inicialização ===== */
function init(){
  loadProgress();
  paintWeekly();
  // Dica de aquecimento inicial
  setAssistant('💡 Aquecimento: 5 min de alongamento leve antes do primeiro exercício.');
  // Pré-cria lista linear de cards
  buildCardsList();
  // Clique no botão foco abre o foco no primeiro card não concluído
  $('#focusBtn').addEventListener('click', ()=>{
    const next = $$('.card').find(c=>!c.classList.contains('done')) || $$('.card')[0];
    if(next) openFocusCard(next);
  });
  // Upload modal close on backdrop
  $$('#uploadModal, #historyModal, #timerModal, #focusModal').forEach(m=>{
    m.addEventListener('click', (e)=>{ if(e.target===m) m.style.display='none'; });
  });
}
document.addEventListener('DOMContentLoaded', init);
