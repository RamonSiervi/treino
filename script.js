/* Helpers */
const $ = (s, el=document)=>el.querySelector(s);
const $$ = (s, el=document)=>[...el.querySelectorAll(s)];
const toast = (msg)=>{
  const t=$('#toast');t.textContent=msg;t.style.display='block';
  clearTimeout(t._h);t._h=setTimeout(()=>t.style.display='none',2000);
};
function vibrate(p){if(navigator.vibrate)navigator.vibrate(p);}

/* Avatar upload */
$('#avatarBtn').addEventListener('click',()=>$('#avatarInput').click());
$('#avatarInput').addEventListener('change',e=>{
  const f=e.target.files?.[0]; if(!f) return;
  const r=new FileReader();
  r.onload=()=>{ $('#avatarImg').src=r.result; localStorage.setItem('avatar_v8', r.result); };
  r.readAsDataURL(f);
});
(function(){ const a=localStorage.getItem('avatar_v8'); if(a) $('#avatarImg').src=a; })();

/* Assistência toast */
function setAssistant(txt){
  const a=$('#assistantTip');
  a.textContent=txt;a.classList.add('show');
  clearTimeout(a._h);a._h=setTimeout(()=>a.classList.remove('show'),4000);
}

/* Seções */
function toggleSection(btn){
  const sec=btn.closest('.section');sec.classList.toggle('open');
}
window.toggleSection=toggleSection;

/* Progress */
const LS_DONE='doneCards_v8';const LS_HIST='hist_v8';const LS_GOAL='goal_v8';
function cKey(c){return c.querySelector('h5').innerText;}
function toggleDone(e,btn){
  e.stopPropagation();const card=btn.closest('.card');card.classList.toggle('done');
  saveProgress();toast(card.classList.contains('done')?'✔ Concluído':'↩ Desmarcado');
}
window.toggleDone=toggleDone;
function saveProgress(){
  const done=$$('.card.done').map(c=>cKey(c));
  localStorage.setItem(LS_DONE,JSON.stringify(done));
  const today=new Date();today.setHours(0,0,0,0);
  const k=today.toISOString().slice(0,10);
  const hist=JSON.parse(localStorage.getItem(LS_HIST)||'{}');
  hist[k]=$$('.card.done').length;
  localStorage.setItem(LS_HIST,JSON.stringify(hist));
  paintWeekly();
}
function loadProgress(){
  const done=JSON.parse(localStorage.getItem(LS_DONE)||'[]');
  $$('.card').forEach(c=>{if(done.includes(cKey(c)))c.classList.add('done')});
}

/* Weekly calendar */
const weekNames=['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];
function paintWeekly(){
  const hist=JSON.parse(localStorage.getItem(LS_HIST)||'{}');
  const grid=$('#weekGrid');grid.innerHTML='';
  const today=new Date();const day=today.getDay();
  let total=0,daysActive=0,bestCount=0,bestIdx=null;
  for(let i=0;i<7;i++){
    const d=new Date(today);d.setDate(today.getDate()-(day-i));
    const k=d.toISOString().slice(0,10);
    const val=hist[k]||0;
    total+=val;if(val>0)daysActive++;
    if(val>bestCount){bestCount=val;bestIdx=i;}
    const div=document.createElement('div');
    div.className='day-cell'+(val>0?' active':''); 
    div.innerHTML=`<strong>${val}</strong><small>${weekNames[i]}</small>`;
    grid.appendChild(div);
  }
  $('#totalDone').textContent=total;
  $('#daysActive').textContent=daysActive;
  $('#bestDay').textContent=bestIdx==null?'—':weekNames[bestIdx];
}

/* Timer */
let tRunning=false,tLeft=0,tTick=null;
const disp=$('#timerDisplay'),btnStart=$('#timerStartPause');
function format(s){return `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;}
function beep(f=800,d=120,g=0.06){
  try{const ctx=new (window.AudioContext||window.webkitAudioContext)();const o=ctx.createOscillator();const gn=ctx.createGain();
    o.type='sine';o.frequency.value=f;gn.gain.value=g;o.connect(gn);gn.connect(ctx.destination);o.start();
    setTimeout(()=>{o.stop();ctx.close();},d);}catch{}
}
function startTimer(secs){tLeft=secs;disp.textContent=format(tLeft);$('#timerModal').style.display='flex';btnStart.textContent='Iniciar';}
function openTimer(btn){
  let secs=30;const meta=btn.closest('.card').dataset.int;
  if(meta)secs=parseInt(meta,10);
  startTimer(secs);
}
window.openTimer=openTimer;
function tick(){
  if(!tRunning)return;tLeft--;disp.textContent=format(tLeft);
  if(tLeft===5){vibrate([50,50,200]);beep(700);beep(900);}
  if(tLeft<=0){stopTimer();vibrate([200,100,200]);beep(880);toast('⏱ Intervalo concluído');$('#timerModal').style.display='none';}
}
function startPause(){
  if(!tRunning){tRunning=true;btnStart.textContent='Pausar';tTick=setInterval(tick,1000);vibrate(40);beep(600);}
  else{tRunning=false;btnStart.textContent='Retomar';clearInterval(tTick);vibrate(20);}
}
btnStart.addEventListener('click',startPause);
$('#timerCancel').addEventListener('click',()=>{$('#timerModal').style.display='none';stopTimer();});
$('#timerConclude').addEventListener('click',()=>{stopTimer();$('#timerModal').style.display='none';toast('✔ Intervalo concluído');});
function stopTimer(){tRunning=false;clearInterval(tTick);tTick=null;btnStart.textContent='Iniciar';}

/* History modal */
$('#historyBtn').addEventListener('click',()=>{$('#historyModal').style.display='flex';paintWeekly();});
function closeHistory(){$('#historyModal').style.display='none';}
window.closeHistory=closeHistory;

/* Reset + Meta */
$('#resetBtn').addEventListener('click',()=>{if(confirm('Zerar progresso?')){localStorage.removeItem(LS_DONE);localStorage.removeItem(LS_HIST);loadProgress();paintWeekly();}});
$('#editGoal').addEventListener('click',()=>{const v=prompt('Nova meta semanal',localStorage.getItem(LS_GOAL)||25);if(v){localStorage.setItem(LS_GOAL,v);$('#goalVal').textContent=v;}});

/* Init */
loadProgress();paintWeekly();
setTimeout(()=>setAssistant('💡 Comece com 5–8 min de aquecimento leve (bike/esteira).'),1800);
setTimeout(()=>setAssistant('💧 Mantenha-se hidratado entre as séries.'),7000);
