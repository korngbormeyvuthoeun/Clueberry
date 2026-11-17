import {validateState,type GameState,type Settings,defaults} from './state';
export const SAVE_KEY='clueberry.save.v1', BACKUP_KEY='clueberry.backup.v1', SETTINGS_KEY='clueberry.settings.v1';
export type StorageLike=Pick<Storage,'getItem'|'setItem'|'removeItem'>;
export function loadSave(storage:StorageLike):{state:GameState|null;recovered:boolean} {
  let primaryError:unknown;
  try {const raw=storage.getItem(SAVE_KEY);if(raw)return {state:validateState(JSON.parse(raw)),recovered:false};}catch(e){primaryError=e;}
  try{const raw=storage.getItem(BACKUP_KEY);if(raw)return {state:validateState(JSON.parse(raw)),recovered:true};}catch(e){primaryError??=e;}
  if(primaryError)throw Error('Your save could not be read. Import a backup, or start a new game. Existing save data has been retained.');
  return {state:null,recovered:false};
}
export function saveGame(storage:StorageLike,state:GameState):GameState {
  const snapshot=validateState({...state,savedAt:new Date().toISOString()});
  const raw=JSON.stringify(snapshot);
  const old=storage.getItem(SAVE_KEY);
  let validOld=false;
  if(old){try{validateState(JSON.parse(old));validOld=true;}catch{/* Preserve a valid backup when the primary save is damaged. */}}
  if(validOld)storage.setItem(BACKUP_KEY,old!);
  storage.setItem(SAVE_KEY,raw);
  return snapshot;
}
export function readSettings(storage:StorageLike):Settings {try{const s=JSON.parse(storage.getItem(SETTINGS_KEY)||'{}');return {sound:typeof s.sound==='boolean'?s.sound:defaults.sound,reducedMotion:typeof s.reducedMotion==='boolean'?s.reducedMotion:false,textSpeed:s.textSpeed==='instant'?'instant':'normal'};}catch{return {...defaults};}}
