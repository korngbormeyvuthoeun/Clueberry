export const WORLD={width:768,height:512};
export const solidObjects=[
  {x:15,y:0,w:738,h:176,name:'Back wall'},
  {x:16,y:170,w:208,h:29,name:'Bookcase'},
  {x:257,y:171,w:243,h:83,name:'Detective desk'},
  {x:530,y:169,w:168,h:28,name:'Case cabinet'},
  {x:715,y:172,w:37,h:145,name:'Archive shelves'},
  {x:687,y:210,w:31,h:57,name:'Archive boxes'},
  {x:42,y:239,w:65,h:75,name:'Visitor chair'},
  {x:148,y:237,w:55,h:69,name:'Visitor chair'},
  {x:105,y:248,w:39,h:52,name:'Tea table'},
  {x:20,y:260,w:22,h:43,name:'Floor lamp'},
  {x:630,y:396,w:72,h:54,name:'Companion basket'},
  {x:699,y:399,w:37,h:49,name:'Plant pot'},
  {x:329,y:454,w:16,h:58,name:'Door frame'},
  {x:423,y:454,w:16,h:58,name:'Door frame'}
];
export type InteractId='computer'|'board'|'shelf'|'mira'|'jun'|'ada'|'basket'|'tea'|'door';
export interface Interactable {id:InteractId;name:string;verb:string;x:number;y:number;radius:number;row?:number}
export const interactions:Interactable[]=[
  {id:'computer',name:'Desk computer',verb:'Open computer',x:293,y:272,radius:51},
  {id:'board',name:'Case board',verb:'Review case',x:610,y:214,radius:48},
  {id:'shelf',name:'Reference shelf',verb:'Search shelf',x:178,y:214,radius:45},
  {id:'mira',name:'Mira',verb:'Talk to Mira',x:535,y:307,radius:45,row:1},
  {id:'jun',name:'Jun',verb:'Talk to Jun',x:226,y:354,radius:43,row:2},
  {id:'ada',name:'Ada',verb:'Talk to Ada',x:661,y:314,radius:44,row:3},
  {id:'basket',name:'A little corner',verb:'Look closer',x:655,y:461,radius:40},
  {id:'tea',name:'Tea for two',verb:'Take a moment',x:121,y:324,radius:36},
  {id:'door',name:'Front door',verb:'Look outside',x:382,y:480,radius:37}
];
export function safePosition(x:number,y:number){
  const blocked=x<23||x>744||y<182||y>489||solidObjects.some(o=>x+7>o.x&&x-7<o.x+o.w&&y>o.y&&y-8<o.y+o.h);
  return blocked?{x:390,y:421}:{x,y};
}
