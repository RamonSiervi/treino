/* ========= STATE / CONST ========= */
const LS_KEYS = {
  DONE: 'personal_done_v81',
  AVATAR: 'personal_avatar_v81',
  GOAL: 'personal_goal_v81',
  HISTORY: 'personal_history_v81'
};
const DEFAULT_GOAL = 25;

/* Exercícios e vídeos (substituindo todos, na ordem enviada) */
const WORKOUTS = [
  {
    colorClass: 'sec-blue',
    name: 'Posterior & Glúteo',
    items: [
      { n:'Agachamento Sumô com Halteres', s:'3x10/10/10 Drop faz td e conta como uma série', c:'0kg', i:60, v:'https://media.musclewiki.com/media/uploads/videos/branded/female-dumbbell-sumo-squat-front.mp4' },
      { n:'Leg Press 45', s:'4x15 pés colados + 15 afastados', c:'12kg', i:40, v:'https://media.musclewiki.com/media/uploads/videos/branded/female-Machine-leg-press-front.mp4' },
      { n:'Adução de Quadril Máquina', s:'3x10/10/10 Drop', c:'0kg', i:60, v:'https://media.musclewiki.com/media/uploads/videos/branded/female-Machine-machine-hip-adduction-front.mp4' },
      { n:'Cadeira Flexora', s:'3x10/10/10 Drop', c:'0kg', i:60, v:'https://media.musclewiki.com/media/uploads/videos/branded/female-Machine-seated-leg-curl-side.mp4' },
      { n:'Cadeira Flexora Unilateral', s:'3x10/10/10/10 Drop', c:'0kg', i:60, v:'https://media.musclewiki.com/media/uploads/videos/branded/machines/_1080/Seated_Leg_Curl_FR_1080.mp4' },
      { n:'Panturrilha no Step', s:'4x15', c:'0kg', i:30, v:'https://media.musclewiki.com/media/uploads/videos/branded/female-calves-stretch-variation-3-side.mp4' },
      { n:'Abdominal Canivete', s:'4x15', c:'0kg', i:30, v:'https://media.musclewiki.com/media/uploads/videos/branded/female-dumbbell-suitcase-crunch-side.mp4' },
      { n:'Esteira Caminhada', s:'30 reps', c:'—', i:30, v:'https://media.musclewiki.com/media/uploads/videos/branded/female-Cardio-treadmill-walk-side.mp4' },
    ]
  },
  {
    colorClass: 'sec-pink',
    name: 'Quadríceps',
    items: [
      { n:'Agachamento com Halteres', s:'3x10+10+10 Drop', c:'0kg', i:60, v:'https://media.musclewiki.com/media/uploads/videos/branded/female-Dumbbells-dumbbell-front-rack-squat-side.mp4' },
      { n:'Abdução de Quadril Máquina', s:'3x10+10+10 Drop', c:'0kg', i:60, v:'https://media.musclewiki.com/media/uploads/videos/branded/female-Machine-machine-hip-abduction-front.mp4' },
      { n:'Elíptico', s:'25 reps', c:'0kg', i:30, v:'https://media.musclewiki.com/media/uploads/videos/branded/female-Cardio-elliptical-side.mp4' },
      { n:'Afundo com Barra Livre', s:'3x12 3x10 2x8', c:'0kg', i:60, v:'https://media.musclewiki.com/media/uploads/videos/branded/female-barbell-reverse-lunge-side.mp4' },
      { n:'Agachamento Sumô no Step com Halteres', s:'3x10+10+10 Drop', c:'0kg', i:60, v:'https://media.musclewiki.com/media/uploads/videos/branded/dumbbells/_1080/DB_Sumo_Squat_FR_1080.mp4' },
      { n:'Abdução de Quadril Máquina', s:'3x10+10+10 Drop', c:'0kg', i:60, v:'https://media.musclewiki.com/media/uploads/videos/branded/machines/_1080/Hip_Abduction_FR_1080.mp4' },
      { n:'Cadeira Extensora', s:'3x10+10+10 Drop', c:'0kg', i:60, v:'https://media.musclewiki.com/media/uploads/videos/branded/female-machine-leg-extension-side.mp4' },
      { n:'Cadeira Extensora Unilateral', s:'3x10+10+10 Drop', c:'0kg', i:60, v:'https://media.musclewiki.com/media/uploads/videos/branded/machines/_1080/Single_Leg_Extension_FR_1080.mp4' },
      { n:'Leg Press 45 Unilateral', s:'3x12 3x10 2x8', c:'0kg', i:60, v:'https://media.musclewiki.com/media/uploads/videos/branded/machines/_1080/Leg_Press_FR_1080.mp4' },
    ]
  },
  {
    colorClass: 'sec-emerald',
    name: 'Peito, Tríceps e Bíceps',
    items: [
      { n:'Alongamento de Ombros e Tríceps II', s:'3x20', c:'0kg', i:30, v:'https://media.musclewiki.com/media/uploads/videos/branded/female-shoulders-stretch-variation-1-front.mp4' },
      { n:'Bike Spinning Sentada', s:'40 reps', c:'—', i:30, v:'https://media.musclewiki.com/media/uploads/videos/branded/female-Cardio-stationary-bike-side.mp4' },
      { n:'Abdominal Supra Solo', s:'5x15', c:'0kg', i:40, v:'https://media.musclewiki.com/media/uploads/videos/branded/bodyweight/_1080/Crunch_FR_1080.mp4' },
      { n:'Tríceps Unilateral na Polia Alta (Pegada Neutra)', s:'3x15', c:'0kg', i:30, v:'https://media.musclewiki.com/media/uploads/videos/branded/female-Cables-cable-single-arm-rope-pushdown-side.mp4' },
      { n:'Alongamento de Peitoral Espaldar', s:'3x15', c:'0kg', i:40, v:'https://media.musclewiki.com/media/uploads/videos/branded/female-chest-stretch-variation-1-side.mp4' },
      { n:'Mobilidade de Ombro III', s:'3x20', c:'0kg', i:30, v:'https://media.musclewiki.com/media/uploads/videos/branded/female-Recovery-thoracic-extensions-via-shoulder-flexion-foam-roller-front.mp4' },
      { n:'Rosca Alternada com Halteres', s:'3x15', c:'0kg', i:30, v:'https://media.musclewiki.com/media/uploads/videos/branded/female-Dumbbells-dumbbell-curl-side.mp4' },
      { n:'Tríceps na Polia com Corda', s:'3x15 lento + 15 curto', c:'0kg', i:30, v:'https://media.musclewiki.com/media/uploads/videos/branded/female-Cables-cable-push-down-side.mp4' },
      { n:'Tríceps Unilateral na Polia Alta (Pegada Neutra)', s:'3x15', c:'0kg', i:30, v:'https://media.musclewiki.com/media/uploads/videos/branded/female-Cables-cable-single-arm-rope-pushdown-side.mp4' },
      { n:'Crucifixo com Halteres', s:'4x12', c:'0kg', i:30, v:'https://media.musclewiki.com/media/uploads/videos/branded/female-dumbbell-incline-chest-fly-front.mp4' },
      { n:'Crucifixo Inclinado com Halteres', s:'4x12', c:'0kg', i:30, v:'https://media.musclewiki.com/media/uploads/videos/branded/female-dumbbell-incline-chest-flys-side.mp4' },
      { n:'Rosca Martelo com Halteres', s:'4x12', c:'0kg', i:30, v:'https://media.musclewiki.com/media/uploads/videos/branded/female-Dumbbells-dumbbell-hammer-curl-side.mp4' },
    ]
  },
  {
    colorClass: 'sec-purple',
    name: 'Ombro e Costas',
    items: [
      { n:'Puxada Alta (pegada neutra)', s:'3x10/8/6 Drop', c:'0kg', i:30, v:'https://media.musclewiki.com/media/uploads/videos/branded/female-machine-pulldown-side.mp4' },
      { n:'Abdominal Canivete', s:'3x12', c:'0kg', i:30, v:'https://media.musclewiki.com/media/uploads/videos/branded/bodyweight/_1080/V-Up_FR_1080.mp4' },
      { n:'Esteira Caminhada', s:'40 reps', c:'—', i:30, v:'https://media.musclewiki.com/media/uploads/videos/branded/female-Cardio-treadmill-walk-side.mp4' },
      { n:'Elevação Lateral Unilateral Sentado c/ Halteres', s:'3x10/8/6 Drop', c:'0kg', i:30, v:'https://media.musclewiki.com/media/uploads/videos/branded/female-dumbbell-seated-overhead-press-front.mp4'.replace('ttps://','https://') },
      { n:'Elevação Frontal Alternada', s:'3x12', c:'4 a 6kg', i:30, v:'https://media.musclewiki.com/media/uploads/videos/branded/female-Dumbbells-dumbbell-front-raise-side.mp4' },
      { n:'Desenvolvimento com Halteres (Pegada Neutra)', s:'3x10/8/6 Drop', c:'0kg', i:30, v:'https://media.musclewiki.com/media/uploads/videos/branded/dumbbells/_1080/Neutral_Grip_DB_Press_FR_1080.mp4' },
      { n:'Puxada Neutra Triângulo', s:'3x10/8/6 Drop', c:'0kg', i:30, v:'https://media.musclewiki.com/media/uploads/videos/branded/cables/_1080/Seated_Row_V_Grip_FR_1080.mp4' },
      { n:'Remada Baixa Triângulo', s:'3x10/8/6 Drop', c:'0kg', i:30, v:'https://media.musclewiki.com/media/uploads/videos/branded/female-machine-seated-cable-row-front.mp4' },
      { n:'Puxada Aberta Barra Reta', s:'3x10/8/6 Drop', c:'0kg', i:30, v:'https://media.musclewiki.com/media/uploads/videos/branded/female-machine-pulldown-side.mp4' },
    ]
  }
];

/* ========= RENDER ========= */
const sectionsContainer = document.getElementById('sectionsContainer');

function renderSections(){
  sectionsContainer.innerHTML = '';
  WORKOUTS.forEach((sec, secIdx) => {
    const section = document.createElement('section');
    section.className = `section ${sec.colorClass}`;
    section.innerHTML = `
      <button class="section-header" onclick="toggleSection(this)" aria-expanded="false">
        <div class="section-title"><span class="badge">Treino</span>${sec.name}</div>
        <span class="toggle" aria-hidden="true">+</span>
      </button>
      <div class="section-body">
        <div class="grid">
          ${sec.items.map((it, idx) => cardTemplate(it, secIdx, idx)).join('')}
        </div>
      </div>
    `;
    sectionsContainer.appendChild(section);
  });
  restoreDoneState();
}

function cardTemplate(it, secIdx, idx){
  const vid = (it.v || '').startsWith('http') ? it.v : (it.v || '').replace('ttps://','https://');
  const key = `${secIdx}-${idx}`;
  return `
    <article class="card" data-key="${key}" data-int="${it.i||30}">
      <button class="check" onclick="toggleDone(event,this)" title="Concluir exercício" aria-label="Concluir">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="11" stroke="currentColor"/>
          <path d="M8 12l3 3 5-6" stroke="currentColor"/>
        </svg>
      </button>
      <h5>${it.n}</h5>
      <div class="meta">Séries: ${it.s} • Carga: ${it.c} • Intervalo: ${it.i||30}s</div>
      <video controls playsinline src="${vid}"></video>
      <div class="row">
        <button class="btn ghost" onclick="openTimer(this)">⏱ Intervalo</button>
      </div>
    </article>
  `;
}

/* ========= SECTION TOGGLE ========= */
window.toggleSection = (btn)=>{
  const section = btn.closest('.section');
  const open = section.classList.toggle('open');
  btn.setAttribute('aria-expanded', String(open));
  const t = btn.querySelector('.toggle');
  t.textContent = open ? '−' : '+';
};

/* ========= DONE / STORAGE ========= */
function getDone(){ return JSON.parse(localStorage.getItem(LS_KEYS.DONE)||'{}'); }
function setDone(obj){ localStorage.setItem(LS_KEYS.DONE, JSON.stringify(obj)); }
function restoreDoneState(){
  const done = getDone();
  document.querySelectorAll('.card').forEach(card=>{
    const key = card.dataset.key;
    if(done[key]) card.classList.add('done'); else card.classList.remove('done');
  });
  refreshSummary();
}
window.toggleDone = (e, el)=>{
  e.preventDefault();
  const card = el.closest('.card');
  const key = card.dataset.key;
  const done = getDone();
  done[key] = !done[key];
  if(done[key]) {
    card.classList.add('done');
    logHistory(card);
    tip('Boa! Lembre-se de hidratar e preparar o próximo exercício 💧');
  } else {
    card.classList.remove('done');
  }
  setDone(done);
  refreshSummary();
};

/* ========= SUMMARY / WEEK GRID ========= */
function getGoal(){ return parseInt(localStorage.getItem(LS_KEYS.GOAL)||DEFAULT_GOAL,10); }
function setGoal(v){ localStorage.setItem(LS_KEYS.GOAL, String(v)); }

function todayKey(d=new Date()){
  const y=d.getFullYear(), m=d.getMonth()+1, dd=d.getDate();
  return `${y}-${String(m).padStart(2,'0')}-${String(dd).padStart(2,'0')}`;
}
function getHistory(){ return JSON.parse(localStorage.getItem(LS_KEYS.HISTORY)||'{}'); }
function setHistory(h){ localStorage.setItem(LS_KEYS.HISTORY, JSON.stringify(h)); }
function logHistory(card){
  const h = getHistory(); const tk = todayKey();
  h[tk] = (h[tk]||0) + 1;
  setHistory(h);
}
function refreshSummary(){
  const done = getDone();
  const totalDone = Object.values(done).filter(Boolean).length;
  document.getElementById('totalDone').textContent = totalDone;

  // Week grid (dom/dom -6)
  const grid = document.getElementById('weekGrid'); grid.innerHTML='';
  const goal = getGoal(); document.getElementById('goalVal').textContent = goal;
  const h = getHistory();
  let daysActive = 0, bestCount = 0, bestName = '—';
  for(let i=6;i>=0;i--){
    const d = new Date(); d.setDate(d.getDate()-i);
    const k = todayKey(d);
    const count = h[k]||0;
    if(count>0) daysActive++;
    if(count>bestCount){ bestCount=count; bestName = d.toLocaleDateString('pt-BR', {weekday:'short'}); }
    const cell = document.createElement('div');
    cell.className = 'week-cell';
    cell.title = `${d.toLocaleDateString('pt-BR', {weekday:'long'})}: ${count} concl.`;
    const ratio = Math.min(count/goal, 1);
    const base = 230; // azul clarinho
    const intensity = Math.floor( (1-ratio)*230 );
    cell.style.backgroundColor = `rgb(${intensity},${intensity+10},255)`;
    cell.dataset.count = count;
    if(i===0) cell.setAttribute('aria-current','true');
    grid.appendChild(cell);
  }
  document.getElementById('daysActive').textContent = daysActive;
  document.getElementById('bestDay').textContent = bestCount>0 ? `${bestName}` : '—';
}

/* Histórico modal */
const historyBtn = document.getElementById('historyBtn');
const historyModal = document.getElementById('historyModal');
historyBtn.addEventListener('click', ()=>{
  const list = document.getElementById('historyList');
  const h = getHistory();
  const keys = Object.keys(h).sort((a,b)=>a<b?1:-1);
  list.innerHTML = keys.length? keys.map(k=>`<li><strong>${k}</strong> — ${h[k]} exercícios concluídos</li>`).join('') : '<li>Nenhum registro ainda.</li>';
  historyModal.classList.add('show'); historyModal.setAttribute('aria-hidden','false');
});
window.closeHistory = ()=>{
  historyModal.classList.remove('show'); historyModal.setAttribute('aria-hidden','true');
};

/* Editar meta */
document.getElementById('editGoal').addEventListener('click', ()=>{
  const cur = getGoal();
  const v = prompt('Defina a meta semanal de exercícios concluídos:', cur);
  if(!v) return;
  const n = Math.max(1, Math.min(200, parseInt(v,10)||cur));
  setGoal(n); refreshSummary();
});

/* ========= TIMER ========= */
let timer = { duration:30, remaining:30, intId:null, running:false, started:false };
const timerModal = document.getElementById('timerModal');
const timerDisplay = document.getElementById('timerDisplay');
const btnStartPause = document.getElementById('timerStartPause');
const btnConclude = document.getElementById('timerConclude');
const btnCancel = document.getElementById('timerCancel');
let audioCtx = null;

function fmt(s){ const m=Math.floor(s/60), ss=String(s%60).padStart(2,'0'); return `${String(m).padStart(2,'0')}:${ss}`; }

function beep(freq=880, dur=120, vol=0.2){
  try{
    audioCtx = audioCtx || new (window.AudioContext||window.webkitAudioContext)();
    const o = audioCtx.createOscillator(); const g = audioCtx.createGain();
    o.type='sine'; o.frequency.value=freq; g.gain.value=vol; o.connect(g); g.connect(audioCtx.destination);
    o.start(); setTimeout(()=>{o.stop();}, dur);
  }catch(e){}
}
function vibrate(pattern){ if(navigator.vibrate) navigator.vibrate(pattern); }

function showTimer(seconds, title='Intervalo'){
  timer.duration = timer.remaining = seconds;
  timer.running=false; timer.started=false; clearInterval(timer.intId);
  document.getElementById('timerTitle').textContent = title;
  timerDisplay.textContent = fmt(seconds);
  btnStartPause.textContent = 'Iniciar';
  timerModal.classList.add('show'); timerModal.setAttribute('aria-hidden','false');

  // Sinal de início (curto)
  beep(880,120,.25); vibrate([60,40,60]);
}

function tick(){
  if(!timer.running) return;
  timer.remaining--;
  timerDisplay.textContent = fmt(timer.remaining);

  // Aviso em 5s restantes (beep + vibração mais forte)
  if(timer.remaining === 5){ beep(1200,180,.3); vibrate([120,60,120,60,120]); tip('Faltam 5s — prepare o próximo exercício!'); }

  if(timer.remaining <= 0){
    clearInterval(timer.intId);
    timer.running=false;
    // Fim (alerta forte)
    beep(600,200,.35); setTimeout(()=>beep(600,200,.35),220); vibrate([180,80,180,80,300]);
    showToast('Intervalo finalizado ✅');
  }
}

btnStartPause.addEventListener('click', ()=>{
  if(!timer.started){
    // iniciar
    timer.started = true; timer.running = true;
    btnStartPause.textContent = 'Pausar';
    timer.intId = setInterval(tick, 1000);
  } else {
    // toggle pause
    timer.running = !timer.running;
    btnStartPause.textContent = timer.running ? 'Pausar' : 'Retomar';
    if(timer.running && !timer.intId) timer.intId = setInterval(tick, 1000);
  }
});
btnConclude.addEventListener('click', ()=>{
  clearInterval(timer.intId); timer.running=false;
  timerModal.classList.remove('show'); timerModal.setAttribute('aria-hidden','true');
  showToast('Intervalo concluído');
});
btnCancel.addEventListener('click', ()=>{
  clearInterval(timer.intId); timer.running=false;
  timerModal.classList.remove('show'); timerModal.setAttribute('aria-hidden','true');
});

window.openTimer = (btn)=>{
  const card = btn.closest('.card');
  const sec = parseInt(card.dataset.int||'30',10);
  showTimer(sec, 'Intervalo • '+sec+'s');
};

/* ========= ASSISTÊNCIA MINIMALISTA ========= */
const tipBox = document.getElementById('assistantTip');
let tipTimeout = null;
function tip(text){
  tipBox.textContent = text;
  tipBox.classList.add('show');
  clearTimeout(tipTimeout);
  tipTimeout = setTimeout(()=> tipBox.classList.remove('show'), 3500);
}
// Dicas contextuais leves
function initialTips(){
  tip('Aqueça por 5–8 min antes do primeiro exercício 🔥');
  setTimeout(()=> tip('Use intervalos curtos (30–60s) para manter o ritmo ⏱️'), 4500);
}

/* ========= TOAST ========= */
const toast = document.getElementById('toast'); let toastTO=null;
function showToast(msg){
  toast.textContent = msg; toast.classList.add('show');
  clearTimeout(toastTO); toastTO = setTimeout(()=>toast.classList.remove('show'), 2600);
}

/* ========= AVATAR ========= */
const avatarBtn = document.getElementById('avatarBtn');
const avatarInput = document.getElementById('avatarInput');
const avatarImg = document.getElementById('avatarImg');

avatarBtn.addEventListener('click', ()=> avatarInput.click());
avatarInput.addEventListener('change', (e)=>{
  const f = e.target.files?.[0]; if(!f) return;
  const reader = new FileReader();
  reader.onload = ()=> {
    avatarImg.src = reader.result;
    localStorage.setItem(LS_KEYS.AVATAR, reader.result);
  };
  reader.readAsDataURL(f);
});
(function restoreAvatar(){
  const data = localStorage.getItem(LS_KEYS.AVATAR);
  if(data) avatarImg.src = data;
})();

/* ========= RESET ========= */
document.getElementById('resetBtn').addEventListener('click', ()=>{
  if(confirm('Zerar progresso e histórico?')) {
    localStorage.removeItem(LS_KEYS.DONE);
    localStorage.removeItem(LS_KEYS.HISTORY);
    refreshSummary(); restoreDoneState();
    showToast('Progresso zerado');
  }
});

/* ========= INIT ========= */
document.addEventListener('DOMContentLoaded', ()=>{
  // set default goal if not set
  if(!localStorage.getItem(LS_KEYS.GOAL)) setGoal(DEFAULT_GOAL);
  renderSections();
  refreshSummary();
  initialTips();
});
