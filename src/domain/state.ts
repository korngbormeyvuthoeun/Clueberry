import { evidenceIds, type EvidenceId } from '../content/case-one';
export type Direction = 'down' | 'left' | 'right' | 'up';
export interface GameState {
  version: 1;
  player: {x:number;y:number;direction:Direction};
  introduced: boolean;
  caseStatus: 'unopened' | 'active' | 'completed';
  evidence: EvidenceId[];
  inspected: EvidenceId[];
  conversations: string[];
  xp: number;
  reputation: number;
  inventory: string[];
  report: {evidence:EvidenceId[];reason:string} | null;
  savedAt: string | null;
  playSeconds: number;
}
export interface Settings { sound:boolean; reducedMotion:boolean; textSpeed:'normal'|'instant' }
export const defaults:Settings={sound:true,reducedMotion:false,textSpeed:'normal'};
export function newState():GameState {return {version:1,player:{x:390,y:421,direction:'up'},introduced:false,caseStatus:'unopened',evidence:[],inspected:[],conversations:[],xp:0,reputation:0,inventory:['DDB field notebook'],report:null,savedAt:null,playSeconds:0};}
export function validateState(value:unknown):GameState {
  if (!value || typeof value!=='object') throw Error('This file does not contain a Clueberry save.');
  const s=value as GameState;
  if(s.version!==1) throw Error('This save version is not supported by Phase 1.');
  const strings=(v:unknown):v is string[]=>Array.isArray(v)&&v.length<=100&&v.every(x=>typeof x==='string'&&x.length<250);
  const clues=(v:unknown):v is EvidenceId[]=>strings(v)&&new Set(v).size===v.length&&v.every(x=>evidenceIds.includes(x as EvidenceId));
  if(!s.player||!Number.isFinite(s.player.x)||!Number.isFinite(s.player.y)||s.player.x<20||s.player.x>748||s.player.y<180||s.player.y>490||!['down','left','right','up'].includes(s.player.direction)) throw Error('The saved player position is invalid.');
  if(typeof s.introduced!=='boolean'||!['unopened','active','completed'].includes(s.caseStatus)||!clues(s.evidence)||!clues(s.inspected)||!s.inspected.every(x=>s.evidence.includes(x))||!strings(s.conversations)||!strings(s.inventory)) throw Error('The saved investigation data is incomplete.');
  if(!Number.isInteger(s.xp)||s.xp<0||s.xp>100000||!Number.isInteger(s.reputation)||s.reputation<0||s.reputation>100000||!Number.isFinite(s.playSeconds)||s.playSeconds<0||s.playSeconds>1e9) throw Error('The saved progress is invalid.');
  if(s.savedAt!==null&&(typeof s.savedAt!=='string'||!Number.isFinite(Date.parse(s.savedAt)))) throw Error('The save date is invalid.');
  if(s.report!==null&&(!s.report||!clues(s.report.evidence)||s.report.reason!=='corroboration'||!['message','bulletin','confirmation'].every(id=>s.report!.evidence.includes(id as EvidenceId))||!s.report.evidence.every(id=>s.evidence.includes(id)))) throw Error('The saved report is invalid.');
  if(s.caseStatus==='completed'&&(!s.report||s.xp<50||s.reputation<10)) throw Error('The completed case is missing its report.');
  return structuredClone(s);
}
export function collect(s:GameState,id:EvidenceId):boolean {if(s.caseStatus==='unopened'||s.evidence.includes(id))return false;s.evidence.push(id);return true;}
export function completeCase(s:GameState,ids:EvidenceId[]) {if(s.caseStatus!=='active')return false;s.caseStatus='completed';s.report={evidence:[...ids],reason:'corroboration'};s.xp+=50;s.reputation+=10;s.inventory.push('Pressed-leaf bookmark');return true;}
export function objective(s:GameState) {
  if(!s.introduced)return 'Meet Mira and settle into your new office.';
  if(s.caseStatus==='unopened')return 'Use the desk computer to open your first case.';
  if(s.caseStatus==='completed')return 'Case closed. Take a breath. This little office is yours.';
  if(!s.evidence.includes('message'))return 'Inspect Jun’s message on the desk computer.';
  if(!s.evidence.includes('statement'))return 'Ask Jun what happened before the message arrived.';
  if(!s.evidence.includes('bulletin'))return 'Find the original fund notice in the reference shelf.';
  if(!s.evidence.includes('confirmation'))return 'Ask Ada to verify the claim independently.';
  return 'Compare your evidence, then file a report at the case board.';
}
