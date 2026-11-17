export const esc=(s:unknown)=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));
export const icon=(name:string)=>{
 const paths:Record<string,string>={
  search:'<circle cx="10" cy="10" r="6"/><path d="m15 15 6 6"/>',
  book:'<path d="M3 4h6l3 2 3-2h6v16h-6l-3 2-3-2H3zM12 6v16"/>',
  leaf:'<path d="M20 3C8 2 2 8 5 16c7 5 15-1 15-13ZM4 21 15 9"/>',
  sun:'<circle cx="12" cy="12" r="4"/><path d="M12 1v3m0 16v3M1 12h3m16 0h3M4 4l2 2m12 12 2 2M4 20l2-2M18 6l2-2"/>',
  menu:'<path d="M4 6h16M4 12h16M4 18h16"/>',
  arrow:'<path d="M4 12h16m-6-6 6 6-6 6"/>',
  check:'<path d="m5 12 4 4L19 6"/>',
  mail:'<rect x="3" y="5" width="18" height="14" rx="1"/><path d="m3 5 9 8 9-8"/>',
  save:'<path d="M4 3h14l3 3v15H3V3h1ZM7 3v6h10V3M7 21v-8h10v8"/>',
  close:'<path d="m6 6 12 12M6 18 18 6"/>',
  clock:'<circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 2"/>'
 };return `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${paths[name]||paths.search}</svg>`;
};
export class View {
 root=document.querySelector<HTMLDivElement>('#ui')!;
 overlay:HTMLDivElement;
 hud:HTMLDivElement;
 close:()=>void=()=>{};
 advance:(()=>void)|null=null;
 private timer:ReturnType<typeof setInterval>|null=null;
 constructor(){this.root.innerHTML='<div id="hud" hidden></div><div id="interaction" hidden></div><div id="overlay"></div><div id="toast" role="status"></div>';this.overlay=document.querySelector('#overlay')!;this.hud=document.querySelector('#hud')!;
  this.overlay.addEventListener('keydown',e=>{if(e.key!=='Tab')return;const els=Array.from(this.overlay.querySelectorAll<HTMLElement>('button:not([disabled]),input,select,[tabindex="0"]')).filter(x=>x.offsetParent!==null);if(!els.length)return;const first=els[0],last=els[els.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}});
 }
 stopTyping(){if(this.timer)clearInterval(this.timer);this.timer=null;this.advance=null;}
 set(html:string,close:()=>void=()=>{}){this.stopTyping();this.overlay.innerHTML=html;this.close=close;document.body.classList.toggle('has-modal',!!html);requestAnimationFrame(()=>this.overlay.querySelector<HTMLElement>('button:not([disabled]),[tabindex="0"]')?.focus());}
 bind(action:string,fn:(el:HTMLElement)=>void){this.overlay.querySelectorAll<HTMLElement>(`[data-action="${action}"]`).forEach(el=>el.addEventListener('click',()=>fn(el)));}
 modal(title:string,kicker:string,body:string,footer:string='',wide=false){return `<div class="scrim"><section class="paper-panel ${wide?'wide':''}" role="dialog" aria-modal="true" aria-label="${esc(title)}"><header class="panel-header"><div><div class="eyebrow">${kicker}</div><h2>${title}</h2></div><button class="icon-button" data-action="close" aria-label="Close">${icon('close')}</button></header><div class="panel-content">${body}</div>${footer?`<footer class="panel-footer">${footer}</footer>`:''}</section></div>`;}
 toast(message:string){const el=document.querySelector('#toast')!;el.textContent=message;el.classList.add('visible');setTimeout(()=>el.classList.remove('visible'),4200);}
 type(text:string,instant:boolean,done:()=>void){const target=this.overlay.querySelector('.speech-text');if(!target)return;let index=0;const finish=()=>{if(this.timer)clearInterval(this.timer);this.timer=null;target.textContent=text;this.advance=null;done();};if(instant){finish();return;}target.textContent='';this.advance=finish;this.timer=setInterval(()=>{index+=2;target.textContent=text.slice(0,index);if(index>=text.length)finish();},22);}
}
