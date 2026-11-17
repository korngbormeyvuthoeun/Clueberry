import Phaser from 'phaser';
import {interactions,solidObjects,safePosition,WORLD,type InteractId} from '../content/headquarters';
import type {GameState,Settings,Direction} from '../domain/state';
export interface Host {state:GameState;settings:Settings;started:boolean;locked:boolean;interact:(id:InteractId)=>void;onReady:()=>void;}
export class Headquarters extends Phaser.Scene {
  player!:Phaser.Physics.Arcade.Sprite;
  private keys!:Record<string,Phaser.Input.Keyboard.Key>;
  private shadow!:Phaser.GameObjects.Ellipse;
  private markers=new Map<string,Phaser.GameObjects.Container>();
  private actors:Phaser.GameObjects.Sprite[]=[];
  private particles:Phaser.GameObjects.Arc[]=[];
  private current:InteractId|null=null;
  private step=0;
  private tick=0;
  private activeStarted=false;
  constructor(private host:Host){super('Headquarters');}
  preload(){this.load.image('room','assets/headquarters.png');this.load.image('cast','assets/cast.png');this.load.image('walk','assets/walk.png');this.load.json('frames','assets/frames.json');this.load.on('loaderror',()=>{document.querySelector('#announcer')!.textContent='An art asset could not load. Reload to try again.';});}
  create(){
    const atlas=this.cache.json.get('frames') as Record<string,{x:number;y:number;w:number;h:number}[]>;
    for(const [key,frames] of Object.entries(atlas))frames.forEach((f,i)=>this.textures.get(key).add(i,0,f.x,f.y,f.w,f.h));
    this.add.image(0,0,'room').setOrigin(0).setScale(.5);
    const g=this.make.graphics({x:0,y:0});g.fillStyle(0xffffff).fillRect(0,0,32,32);g.generateTexture('wall-tile',32,32);g.destroy();
    const map=this.make.tilemap({tileWidth:32,tileHeight:32,width:24,height:16});
    const tiles=map.addTilesetImage('walls','wall-tile',32,32)!;
    const walls=map.createBlankLayer('Room boundary',tiles)!;
    for(let x=0;x<24;x++)walls.putTileAt(0,x,0);
    walls.setCollision(0).setVisible(false);
    this.physics.world.setBounds(20,180,728,310);
    const bodies=this.physics.add.staticGroup();
    for(const o of solidObjects){const r=this.add.rectangle(o.x+o.w/2,o.y+o.h/2,o.w,o.h,0xff0000,0);this.physics.add.existing(r,true);bodies.add(r);}
    const p=safePosition(this.host.state.player.x,this.host.state.player.y);
    this.shadow=this.add.ellipse(p.x,p.y-1,22,7,0x171b12,.23);
    this.player=this.physics.add.sprite(p.x,p.y,'cast',3).setOrigin(.5,1).setDisplaySize(30,53).setCollideWorldBounds(true);
    this.resizeBody();this.physics.add.collider(this.player,bodies);this.physics.add.collider(this.player,walls);
    this.cameras.main.setBounds(0,0,WORLD.width,WORLD.height).setRoundPixels(true).centerOn(384,270);
    this.keys=this.input.keyboard!.addKeys('W,A,S,D,UP,LEFT,DOWN,RIGHT,E,SPACE') as typeof this.keys;
    for(const item of interactions){
      if(item.row!==undefined){
        const a=this.add.sprite(item.x,item.y,'cast',item.row*4).setOrigin(.5,1).setDisplaySize(31,55).setDepth(item.y);
        this.add.ellipse(item.x,item.y,23,7,0x171b12,.2).setDepth(item.y-1);this.actors.push(a);
        const body=this.add.rectangle(item.x,item.y-3,18,8,0x000000,0);this.physics.add.existing(body,true);bodies.add(body);
      }
      const isNpc=item.row!==undefined;
      const cy=item.y-(isNpc?64:17);
      const back=this.add.circle(0,0,isNpc?6:5,0xf4dda0,.92).setStrokeStyle(1,0x6e5630);
      const dot=this.add.text(0,0,isNpc?'…':'+',{fontFamily:'Georgia',fontSize:isNpc?'10px':'11px',color:'#443b25'}).setOrigin(.5,isNpc?.67:.5);
      this.markers.set(item.id,this.add.container(item.x,cy,[back,dot]).setDepth(1000));
    }
    // Transparent crops of foreground furniture share the original room texture.
    this.add.image(0,0,'room').setOrigin(0).setScale(.5).setCrop(514,410,486,100).setDepth(254);
    for(let i=0;i<18;i++)this.particles.push(this.add.circle(260+Math.random()*290,160+Math.random()*270,Math.random()>.5?1:.6,0xffe6a6,.25).setDepth(850));
    this.input.keyboard!.on('keydown-E',()=>this.activate());
    this.input.keyboard!.on('keydown-SPACE',(e:KeyboardEvent)=>{e.preventDefault();this.activate();});
    this.input.on('pointerdown',(pointer:Phaser.Input.Pointer)=>{if(!this.host.started||this.host.locked)return;const close=interactions.find(o=>Math.hypot(o.x-pointer.worldX,o.y-25-pointer.worldY)<35);if(close&&Math.hypot(this.player.x-close.x,this.player.y-close.y)<close.radius+8)this.host.interact(close.id);});
    this.game.events.on(Phaser.Core.Events.BLUR,()=>{this.input.keyboard?.resetKeys();this.player.setVelocity(0);});
    this.host.onReady();
  }
  private resizeBody(){const b=this.player.body as Phaser.Physics.Arcade.Body;const w=this.player.frame.realWidth,h=this.player.frame.realHeight;b.setSize(w*.48,h*.14);b.setOffset(w*.26,h*.86);}
  restore(){if(!this.player)return;const p=safePosition(this.host.state.player.x,this.host.state.player.y);this.player.setPosition(p.x,p.y);this.host.state.player.x=p.x;this.host.state.player.y=p.y;this.input.keyboard?.resetKeys();this.current=null;}
  private activate(){if(!this.host.locked&&this.host.started&&this.current)this.host.interact(this.current);}
  update(time:number,delta:number){
    if(!this.player)return;
    const playing=this.host.started;
    this.player.setVisible(playing);this.shadow.setVisible(playing);
    if(playing&&!this.activeStarted){this.cameras.main.startFollow(this.player,true,1,1);this.activeStarted=true;}else if(!playing&&this.activeStarted){this.cameras.main.stopFollow().centerOn(384,270);this.activeStarted=false;}
    const canMove=playing&&!this.host.locked;
    let vx=0,vy=0;let direction=this.host.state.player.direction;
    if(canMove){if(this.keys.A.isDown||this.keys.LEFT.isDown){vx=-100;direction='left';}else if(this.keys.D.isDown||this.keys.RIGHT.isDown){vx=100;direction='right';}else if(this.keys.W.isDown||this.keys.UP.isDown){vy=-100;direction='up';}else if(this.keys.S.isDown||this.keys.DOWN.isDown){vy=100;direction='down';}}
    this.player.setVelocity(vx,vy);const moving=vx!==0||vy!==0;const di=({down:0,left:1,right:2,up:3} as Record<Direction,number>)[direction];
    const key=moving?'walk':'cast',frame=moving?di*4+(Math.floor(time/150)%4):di;
    if(this.player.texture.key!==key||this.player.frame.name!==String(frame)){this.player.setTexture(key,frame).setDisplaySize(moving?31:30,53);this.resizeBody();}
    this.player.setDepth(this.player.y);this.shadow.setPosition(this.player.x,this.player.y-1).setDepth(this.player.y-.5);
    if(playing){this.host.state.player={x:this.player.x,y:this.player.y,direction};if(canMove)this.host.state.playSeconds+=Math.min(delta,100)/1000;}
    for(const a of this.actors){a.setScale(a.scaleX,this.host.settings.reducedMotion?55/a.frame.realHeight:(55+Math.sin(time/1000+a.x)*.35)/a.frame.realHeight);}
    if(!this.host.settings.reducedMotion)this.particles.forEach((p,i)=>{p.y-=delta*.002;if(p.y<150)p.y=430;p.alpha=.16+Math.sin(time/1800+i)*.12;});
    this.tick+=delta;if(this.tick>100){this.tick=0;let nearest:typeof interactions[number]|null=null;let distance=Infinity;
      if(import.meta.env.DEV)this.game.canvas.dataset.debug=JSON.stringify({x:Math.round(this.player.x),y:Math.round(this.player.y),vx,vy,locked:this.host.locked,bodyX:Math.round(this.player.body!.x),bodyY:Math.round(this.player.body!.y)});
      if(canMove)for(const o of interactions){const d=Math.hypot(o.x-this.player.x,o.y-this.player.y);if(d<o.radius&&d<distance){nearest=o;distance=d;}}
      this.current=nearest?.id??null;
      const prompt=document.querySelector<HTMLDivElement>('#interaction')!;
      prompt.hidden=!nearest;if(nearest){prompt.innerHTML=`<kbd>E</kbd><span>${nearest.verb}</span><span class="prompt-alt">SPACE</span>`;}
      for(const [id,m]of this.markers){m.setVisible(playing);m.setAlpha(id===this.current?1:.7);m.setScale(id===this.current?1.2:1);}
    }
  }
  snapshot(){return {x:this.player?.x,y:this.player?.y,interactable:this.current};}
}
