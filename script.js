/* =========================================================
   PERSONAL v8.5 — script.js
   Ramon — Treinos + Linha do Tempo + Timer + Histórico
   ========================================================= */

const LS_KEYS = {
  DONE: 'personal_done_v85',
  AVATAR: 'personal_avatar_v85',
  HISTORY: 'personal_history_v85'
};

// ------------ UTIL ------------
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
const fmt2 = n => String(n).padStart(2, '0');

function todayISO(d = new Date()) {
  const y = d.getFullYear();
  const m = fmt2(d.getMonth() + 1);
  const day = fmt2(d.getDate());
  return `${y}-${m}-${day}`;
}
function getWeekStartMonday(d = new Date()) {
  const dt = new Date(d);
  const day = dt.getDay(); // 0=Dom..6=Sab
  const diff = (day === 0 ? -6 : 1) - day; // segunda
  dt.setDate(dt.getDate() + diff);
  dt.setHours(0,0,0,0);
  return dt;
}
function addDays(date, n) { const d = new Date(date); d.setDate(d.getDate()+n); return d; }
function dayNamePT(iMon0) { return ['Segunda','Terça','Quarta','Quinta','Sexta','Sábado','Domingo'][iMon0] || ''; }
function dayLetterPT(iMon0){ return ['S','T','Q','Q','S','S','D'][iMon0] || ''; }

function vibrate(msOrPattern){ if(navigator.vibrate) navigator.vibrate(msOrPattern); }
function beep(duration=180,freq=880,type='sine',volume=0.06){
  try{const ctx=new (window.AudioContext||window.webkitAudioContext)();const o=ctx.createOscillator();const g=ctx.createGain();o.type=type;o.frequency.value=freq;g.gain.value=volume;o.connect(g);g.connect(ctx.destination);o.start();setTimeout(()=>{o.stop();ctx.close();},duration);}catch(e){}}
function toast(msg,t=1800){ const el=$('#toast'); el.textContent=msg; el.classList.add('show'); setTimeout(()=>el.classList.remove('show'),t); }
function tip(msg,t=2600){ const el=$('#assistantTip'); el.textContent=msg; el.classList.add('show'); setTimeout(()=>el.classList.remove('show'),t); }
function loadJSON(k,f){ try{const v=localStorage.getItem(k); return v?JSON.parse(v):f;}catch{return f;} }
function saveJSON(k,v){ localStorage.setItem(k,JSON.stringify(v)); }

// ------------ DADOS DOS TREINOS ------------
const TREINOS = [
  {
    id:'posterior_gluteo', nome:'Posterior & Glúteo',
    itens:[
      { nome:'Agachamento Sumô com Halteres', serie:'3x10/10/10 (Drop: tudo conta como 1 série)', carga:'0kg', intervalo:60, video:'https://media.musclewiki.com/media/uploads/videos/branded/female-dumbbell-sumo-squat-front.mp4' },
      { nome:'Leg Press 45', serie:'4x15 pés colados + 15 afastados', carga:'12kg', intervalo:40, video:'https://media.musclewiki.com/media/uploads/videos/branded/female-Machine-leg-press-front.mp4' },
      { nome:'Adução de Quadril Máquina', serie:'3x10/10/10 (Drop: tudo conta como 1 série)', carga:'0kg', intervalo:60, video:'https://media.musclewiki.com/media/uploads/videos/branded/female-Machine-machine-hip-adduction-front.mp4' },
      { nome:'Cadeira Flexora', serie:'3x10/10/10 (Drop: tudo conta como 1 série)', carga:'0kg', intervalo:60, video:'https://media.musclewiki.com/media/uploads/videos/branded/female-Machine-seated-leg-curl-side.mp4' },
      { nome:'Cadeira Flexora Unilateral', serie:'3x10/10/10/10 (Drop: tudo conta como 1 série)', carga:'0kg', intervalo:60, video:'https://media.musclewiki.com/media/uploads/videos/branded/machines/_1080/Seated_Leg_Curl_FR_1080.mp4' },
      { nome:'Panturrilha no Step', serie:'4x15', carga:'0kg', intervalo:30, video:'https://media.musclewiki.com/media/uploads/videos/branded/female-calves-stretch-variation-3-side.mp4' },
      { nome:'Abdominal Canivete', serie:'4x15', carga:'0kg', intervalo:30, video:'https://media.musclewiki.com/media/uploads/videos/branded/female-dumbbell-suitcase-crunch-side.mp4' },
      { nome:'Esteira Caminhada', serie:'30 reps', carga:'—', intervalo:30, video:'https://media.musclewiki.com/media/uploads/videos/branded/female-Cardio-treadmill-walk-side.mp4' }
    ]
  },
  {
    id:'quadriceps', nome:'Quadríceps',
    itens:[
      { nome:'Agachamento com Halteres', serie:'3x10+10+10 (Drop: tudo conta como 1 série)', carga:'0kg', intervalo:60, video:'https://media.musclewiki.com/media/uploads/videos/branded/female-Dumbbells-dumbbell-front-rack-squat-side.mp4' },
      { nome:'Abdução de Quadril Máquina', serie:'3x10+10+10 (Drop: tudo conta como 1 série)', carga:'0kg', intervalo:60, video:'https://media.musclewiki.com/media/uploads/videos/branded/female-Machine-machine-hip-abduction-front.mp4' },
      { nome:'Elíptico', serie:'25 reps', carga:'0kg', intervalo:30, video:'https://media.musclewiki.com/media/uploads/videos/branded/female-Cardio-elliptical-side.mp4' },
      { nome:'Afundo com Barra Livre', serie:'3x12, 3x10, 2x8', carga:'0kg', intervalo:60, video:'https://media.musclewiki.com/media/uploads/videos/branded/female-barbell-reverse-lunge-side.mp4' },
      { nome:'Agachamento Sumô no Step c/ Halteres', serie:'3x10+10+10 (Drop: tudo conta como 1 série)', carga:'0kg', intervalo:60, video:'https://media.musclewiki.com/media/uploads/videos/branded/dumbbells/_1080/DB_Sumo_Squat_FR_1080.mp4' },
      { nome:'Abdução de Quadril Máquina (var.)', serie:'3x10+10+10 (Drop: tudo conta como 1 série)', carga:'0kg', intervalo:60, video:'https://media.musclewiki.com/media/uploads/videos/branded/machines/_1080/Hip_Abduction_FR_1080.mp4' },
      { nome:'Cadeira Extensora', serie:'3x10+10+10 (Drop: tudo conta como 1 série)', carga:'0kg', intervalo:60, video:'https://media.musclewiki.com/media/uploads/videos/branded/female-machine-leg-extension-side.mp4' },
      { nome:'Cadeira Extensora Unilateral', serie:'3x10+10+10 (Drop: tudo conta como 1 série)', carga:'0kg', intervalo:60, video:'https://media.musclewiki.com/media/uploads/videos/branded/machines/_1080/Single_Leg_Extension_FR_1080.mp4' },
      { nome:'Leg Press 45 Unilateral', serie:'3x12, 3x10, 2x8', carga:'0kg', intervalo:60, video:'https://media.musclewiki.com/media/uploads/videos/branded/machines/_1080/Leg_Press_FR_1080.mp4' }
    ]
  },
  {
    id:'peito_triceps_biceps', nome:'Peito, Tríceps e Bíceps',
    itens:[
      { nome:'Alongamento de Ombros e Tríceps II', serie:'3x20', carga:'0kg', intervalo:30, video:'https://media.musclewiki.com/media/uploads/videos/branded/female-shoulders-stretch-variation-1-front.mp4' },
      { nome:'Bike Spinning Sentada', serie:'40 reps', carga:'—', intervalo:30, video:'https://media.musclewiki.com/media/uploads/videos/branded/female-Cardio-stationary-bike-side.mp4' },
      { nome:'Abdominal Supra Solo', serie:'5x15', carga:'0kg', intervalo:40, video:'https://media.musclewiki.com/media/uploads/videos/branded/bodyweight/_1080/Crunch_FR_1080.mp4' },
      { nome:'Tríceps Unilateral Polia Alta (Neutra)', serie:'3x15', carga:'0kg', intervalo:30, video:'https://media.musclewiki.com/media/uploads/videos/branded/female-Cables-cable-single-arm-rope-pushdown-side.mp4' },
      { nome:'Alongamento de Peitoral (Espaldar)', serie:'3x15', carga:'0kg', intervalo:40, video:'https://media.musclewiki.com/media/uploads/videos/branded/female-chest-stretch-variation-1-side.mp4' },
      { nome:'Mobilidade de Ombro III', serie:'3x20', carga:'0kg', intervalo:30, video:'https://media.musclewiki.com/media/uploads/videos/branded/female-Recovery-thoracic-extensions-via-shoulder-flexion-foam-roller-front.mp4' },
      { nome:'Rosca Alternada com Halteres', serie:'3x15', carga:'0kg', intervalo:30, video:'https://media.musclewiki.com/media/uploads/videos/branded/female-Dumbbells-dumbbell-curl-side.mp4' },
      { nome:'Tríceps na Polia com Corda', serie:'3x15 lento + 15 curto', carga:'0kg', intervalo:30, video:'https://media.musclewiki.com/media/uploads/videos/branded/female-Cables-cable-push-down-side.mp4' },
      { nome:'Tríceps Unilateral Polia Alta (rep.)', serie:'3x15', carga:'0kg', intervalo:30, video:'https://media.musclewiki.com/media/uploads/videos/branded/female-Cables-cable-single-arm-rope-pushdown-side.mp4' },
      { nome:'Crucifixo com Halteres', serie:'4x12', carga:'0kg', intervalo:30, video:'https://media.musclewiki.com/media/uploads/videos/branded/female-dumbbell-incline-chest-fly-front.mp4' },
      { nome:'Crucifixo Inclinado com Halteres', serie:'4x12', carga:'0kg', intervalo:30, video:'https://media.musclewiki.com/media/uploads/videos/branded/female-dumbbell-incline-chest-flys-side.mp4' },
      { nome:'Rosca Martelo com Halteres', serie:'4x12', carga:'0kg', intervalo:30, video:'https://media.musclewiki.com/media/uploads/videos/branded/female-Dumbbells-dumbbell-hammer-curl-side.mp4' }
    ]
  },
  {
    id:'ombro_costas', nome:'Ombro & Costas',
    itens:[
      { nome:'Puxada Alta (pegada neutra)', serie:'3x10/8/6 (Drop: tudo conta como 1 série)', carga:'0kg', intervalo:30, video:'https://media.musclewiki.com/media/uploads/videos/branded/female-machine-pulldown-side.mp4' },
      { nome:'Abdominal Canivete', serie:'3x12', carga:'0kg', intervalo:30, video:'https://media.musclewiki.com/media/uploads/videos/branded/bodyweight/_1080/V-Up_FR_1080.mp4' },
      { nome:'Esteira Caminhada', serie:'40 reps', carga:'—', intervalo:30, video:'https://media.musclewiki.com/media/uploads/videos/branded/female-Cardio-treadmill-walk-side.mp4' },
      { nome:'Elevação Lateral Unilateral Sentado', serie:'3x10/8/6 (Drop: tudo conta como 1 série)', carga:'0kg', intervalo:30, video:'https://media.musclewiki.com/media/uploads/videos/branded/female-Dumbbells-dumbbell-neutral-overhead-press-side.mp4' },
      { nome:'Elevação Frontal Alternada', serie:'3x12', carga:'4 a 6kg', intervalo:30, video:'https://media.musclewiki.com/media/uploads/videos/branded/female-Dumbbells-dumbbell-front-raise-side.mp4' },
      { nome:'Desenvolvimento com Halteres (neutra)', serie:'3x10/8/6 (Drop: tudo conta como 1 série)', carga:'0kg', intervalo:30, video:'https://media.musclewiki.com/media/uploads/videos/branded/dumbbells/_1080/Neutral_Grip_DB_Press_FR_1080.mp4' },
      { nome:'Puxada Neutra (triângulo)', serie:'3x10/8/6 (Drop: tudo conta como 1 série)', carga:'0kg', intervalo:30, video:'https://media.musclewiki.com/media/uploads/videos/branded/cables/_1080/Seated_Row_V_Grip_FR_1080.mp4' },
      { nome:'Remada Baixa (triângulo)', serie:'3x10/8/6 (Drop: tudo conta como 1 série)', carga:'0kg', intervalo:30, video:'https://media.musclewiki.com/media/uploads/videos/branded/female-machine-seated-cable-row-front.mp4' },
      { nome:'Puxada Aberta Barra Reta', serie:'3x10/8/6 (Drop: tudo conta como 1 série)', carga:'0kg', intervalo:30, video:'https://media.musclewiki.com/media/uploads/videos/branded/female-machine-pulldown-side.mp4' }
    ]
  }
];

// ------------ ESTADO ------------
let doneState = loadJSON(LS_KEYS.DONE, {});      // { [exerciseId]: true }
let historyState = loadJSON(LS_KEYS.HISTORY, {}); // { 'YYYY-MM-DD': count }
function exerciseId(sectionId, idx){ return `${sectionId}__${idx}`; }

// ------------ ÍCONES ------------
function circleIcon() {
  return `
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="9" stroke="rgba(34,197,94,.55)" stroke-width="1.8" fill="rgba(34,197,94,.08)"/>
  </svg>`;
}
function okIcon() {
  return `
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="12" r="10" fill="rgba(34,197,94,.25)" stroke="rgba(34,197,94,.6)" stroke-width="1.8"/>
    <path d="M8 12.5l2.3 2.3L16 9.5" stroke="rgba(34,197,94,.95)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;
}

// ------------ RENDER ------------
function renderSections(){
  const container = $('#sectionsContainer');
  container.innerHTML = '';
  TREINOS.forEach(sec=>{
    const secEl = document.createElement('section');
    secEl.className = 'section';
    secEl.dataset.section = sec.id;

    const headerBtn = document.createElement('button');
    headerBtn.className = 'section-header';
    headerBtn.setAttribute('aria-expanded','false');

    const title = document.createElement('div');
    title.className = 'section-title';
    title.innerHTML = `<span>${sec.nome}</span><span class="badge">${sec.itens.length} exercícios</span>`;

    const toggle = document.createElement('div');
    toggle.className = 'toggle';
    toggle.textContent = '+';

    headerBtn.appendChild(title);
    headerBtn.appendChild(toggle);

    const body = document.createElement('div');
    body.className = 'section-body';
    const grid = document.createElement('div');
    grid.className = 'grid';

    sec.itens.forEach((it,i)=>{
      const id = exerciseId(sec.id, i);
      const card = document.createElement('div');
      card.className = 'card';
      if (doneState[id]) card.classList.add('done');

      // Botão de check flutuante
      const check = document.createElement('button');
      check.className = 'check';
      check.setAttribute('aria-label','Marcar como concluído');
      check.innerHTML = card.classList.contains('done') ? okIcon() : circleIcon();
      check.addEventListener('click', e=>{
        e.stopPropagation();
        toggleDone(id, card, it.nome);
      });
      card.appendChild(check);

      const head = document.createElement('div');
      head.className = 'card-head';

      const h5 = document.createElement('h5');
      h5.textContent = it.nome;

      head.appendChild(h5);

      const meta = document.createElement('div');
      meta.className = 'meta';
      meta.innerHTML = `<strong>Série:</strong> ${it.serie} · <strong>Carga:</strong> ${it.carga}`;

      const video = document.createElement('video');
      video.src = it.video; video.controls = true; video.preload='none'; video.playsInline = true;

      const row = document.createElement('div');
      row.className = 'row';

      const btnInterval = document.createElement('button');
      btnInterval.className = 'btn ghost';
      btnInterval.textContent = `Intervalo ${it.intervalo || 30}s`;
      btnInterval.addEventListener('click', e=>{
        e.stopPropagation();
        openTimer(it.intervalo || 30);
      });

      const btnConcluir = document.createElement('button');
      btnConcluir.className = 'btn';
      btnConcluir.textContent = 'Concluir';
      btnConcluir.addEventListener('click', e=>{
        e.stopPropagation();
        toggleDone(id, card, it.nome, true);
      });

      row.appendChild(btnInterval);
      row.appendChild(btnConcluir);

      card.appendChild(head);
      card.appendChild(meta);
      card.appendChild(video);
      card.appendChild(row);
      grid.appendChild(card);
    });

    body.appendChild(grid);
    secEl.appendChild(headerBtn);
    secEl.appendChild(body);

    headerBtn.addEventListener('click', ()=>{
      const open = secEl.classList.toggle('open');
      headerBtn.setAttribute('aria-expanded', String(open));
      toggle.textContent = open ? '−' : '+';
      if (open) tip('Dica: 3–5 min de aquecimento antes de iniciar 🔥');
    });

    container.appendChild(secEl);
  });
}

// ------------ CONCLUÍDO & HISTÓRICO ------------
function toggleDone(id, card, nome, forceTrue=false){
  const nowIso = todayISO();
  const isDone = !!doneState[id];
  if (isDone && !forceTrue){
    delete doneState[id];
    card.classList.remove('done');
    card.querySelector('.check').innerHTML = circleIcon();
    saveJSON(LS_KEYS.DONE, doneState);
    toast(`"${nome}" desmarcado.`);
  } else {
    doneState[id] = true;
    card.classList.add('done');
    card.querySelector('.check').innerHTML = okIcon();
    saveJSON(LS_KEYS.DONE, doneState);
    historyState[nowIso] = (historyState[nowIso] || 0) + 1;
    saveJSON(LS_KEYS.HISTORY, historyState);
    toast(`Boa! "${nome}" concluído 💪`);
    updateTimeline();
  }
  updateMiniStats();
}

// ------------ LINHA DO TEMPO ------------
function buildTimelineSkeleton(){
  const wrap = $('#timeline');
  wrap.innerHTML = '';
  const ws = getWeekStartMonday();
  for(let i=0;i<7;i++){
    const d = addDays(ws,i);
    const el = document.createElement('div');
    el.className='day';
    el.dataset.date = todayISO(d);
    el.dataset.level='0';
    el.innerHTML = `<span>${dayLetterPT(i)}</span><div class="tooltip">${dayNamePT(i)}: 0 concluídos</div>`;
    wrap.appendChild(el);
  }
}
function updateTimeline(){
  const ws = getWeekStartMonday();
  let total=0, best={count:-1,idx:-1};
  $$('.timeline .day').forEach((el,i)=>{
    const date=todayISO(addDays(ws,i));
    const count=historyState[date]||0;
    total+=count;

    let level=0;
    if(count>=1&&count<=2) level=1;
    else if(count>=3&&count<=5) level=2;
    else if(count>=6) level=3;

    el.dataset.level=String(level);
    el.dataset.meta = level===3 ? 'true':'false';
    $('.tooltip',el).textContent = `${dayNamePT(i)}: ${count} concluído${count!==1?'s':''}`;
    if(count>best.count) best={count,idx:i};
  });

  $('#totalDone').textContent = String(total);
  $('#daysActive').textContent = String($$('.timeline .day').filter(d => (d.dataset.level|0)>0).length);
  $('#bestDay').textContent = best.count>0 ? dayNamePT(best.idx) : '—';

  // Preenche histórico modal
  const list = $('#historyList');
  list.innerHTML = '';
  for(let i=0;i<7;i++){
    const date=todayISO(addDays(ws,i));
    const count=historyState[date]||0;
    const li=document.createElement('li');
    li.textContent = `${dayNamePT(i)} (${date}): ${count} concluído${count!==1?'s':''}`;
    list.appendChild(li);
  }
}

// ------------ TIMER (intervalo) ------------
let timer = { total:0, left:0, tick:null, running:false };
function openTimer(seconds=30){
  timer.total=seconds; timer.left=seconds; timer.running=false;
  $('#timerDisplay').textContent=`00:${fmt2(seconds)}`;
  $('#timerStartPause').textContent='Iniciar';
  $('#timerModal').classList.add('show');

  const startPause=$('#timerStartPause'), cancel=$('#timerCancel'), conclude=$('#timerConclude');

  const start=()=>{
    if(timer.running) return;
    timer.running=true; startPause.textContent='Pausar';
    beep(150,920,'sine',0.07); vibrate([60,40,60]);
    timer.tick=setInterval(()=>{
      timer.left--;
      if(timer.left<=0){
        $('#timerDisplay').textContent='00:00';
        clearInterval(timer.tick); timer.running=false;
        beep(300,1000,'square',0.09); vibrate([120,60,120,60,180]);
        tip('Intervalo finalizado! Vamos voltar 👊',2200);
      }else{
        if(timer.left<=5){ beep(120,980+(5-timer.left)*40,'triangle',0.08); vibrate([50,50,80]); }
        const m=Math.floor(timer.left/60), s=timer.left%60;
        $('#timerDisplay').textContent=`${fmt2(m)}:${fmt2(s)}`;
      }
    },1000);
  };
  const pause=()=>{
    if(!timer.running) return;
    timer.running=false; clearInterval(timer.tick); startPause.textContent='Retomar'; toast('Pausado');
  };

  startPause.onclick=()=>{ if(!timer.running) start(); else pause(); };
  cancel.onclick=()=>{ clearInterval(timer.tick); timer.running=false; $('#timerModal').classList.remove('show'); };
  conclude.onclick=()=>{ clearInterval(timer.tick); timer.running=false; $('#timerModal').classList.remove('show'); toast('Intervalo concluído ✔'); };
}

// ------------ HISTÓRICO MODAL / RESET ------------
$('#historyBtn')?.addEventListener('click',()=>$('#historyModal').classList.add('show'));
function closeHistory(){ $('#historyModal').classList.remove('show'); }
window.closeHistory = closeHistory;

$('#resetBtn')?.addEventListener('click',()=>{
  if(confirm('Zerar progresso e histórico da semana?')){
    localStorage.removeItem(LS_KEYS.DONE);
    localStorage.removeItem(LS_KEYS.HISTORY);
    doneState={}; historyState={};
    renderSections(); buildTimelineSkeleton(); updateTimeline(); updateMiniStats();
    toast('Tudo zerado.');
  }
});

// ------------ AVATAR ------------
(function initAvatar(){
  const img=$('#avatarImg'), inp=$('#avatarInput'), btn=$('#avatarBtn');
  const stored=localStorage.getItem(LS_KEYS.AVATAR); if(stored) img.src=stored;
  btn.addEventListener('click',()=>inp.click());
  inp.addEventListener('change',e=>{
    const file=e.target.files?.[0]; if(!file) return;
    const reader=new FileReader();
    reader.onload=()=>{ img.src=reader.result; localStorage.setItem(LS_KEYS.AVATAR, reader.result); };
    reader.readAsDataURL(file);
  });
})();

// ------------ MINI STATS ------------
function updateMiniStats(){ $('#totalDone').textContent = String(Object.keys(doneState).length); }

// ------------ INIT ------------
function initAssistant(){
  setTimeout(()=>tip('Hidrate-se entre as séries 💧'),1200);
  setTimeout(()=>tip('Postura e controle primeiro; carga depois.'),3800);
}
function init(){
  renderSections();               // seções iniciam FECHADAS
  buildTimelineSkeleton(); 
  updateTimeline(); 
  updateMiniStats();
  initAssistant();
}
document.addEventListener('DOMContentLoaded', init);
