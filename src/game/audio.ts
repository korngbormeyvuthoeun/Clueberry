export class AudioManager {
  enabled=true;
  private context:AudioContext|null=null;
  unlock(){if(!this.enabled)return;try{this.context??=new AudioContext();void this.context.resume().catch(()=>{});}catch{/* Audio is optional. */}}
  chime(kind:'click'|'clue'|'success'='click'){
    if(!this.enabled)return;this.unlock();const c=this.context;if(!c||c.state!=='running')return;
    const notes=kind==='success'?[523.25,659.25,783.99,1046.5]:kind==='clue'?[659.25,880]:[440];
    notes.forEach((frequency,i)=>{const o=c.createOscillator(),g=c.createGain(),t=c.currentTime+i*.12;o.type='sine';o.frequency.value=frequency;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.035,t+.012);g.gain.exponentialRampToValueAtTime(.0001,t+.38);o.connect(g);g.connect(c.destination);o.start(t);o.stop(t+.4);});
  }
}
