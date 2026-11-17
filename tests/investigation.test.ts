import test from 'node:test';
import assert from 'node:assert/strict';
import {assessReport,evidenceIds,type EvidenceId} from '../src/content/case-one';
import {newState,collect,completeCase,validateState,objective} from '../src/domain/state';
import {loadSave,saveGame,SAVE_KEY,BACKUP_KEY,readSettings} from '../src/domain/save';
import {safePosition} from '../src/content/headquarters';
class MemoryStorage {
  values=new Map<string,string>();
  getItem(k:string){return this.values.get(k)??null;}
  setItem(k:string,v:string){this.values.set(k,v);}
  removeItem(k:string){this.values.delete(k);}
}
const core:EvidenceId[]=['message','bulletin','confirmation'];
test('case clues cannot be collected before the briefing or collected twice',()=>{const s=newState();assert.equal(collect(s,'message'),false);s.caseStatus='active';assert.equal(collect(s,'message'),true);assert.equal(collect(s,'message'),false);assert.deepEqual(s.evidence,['message']);});
test('supported reports require a claim and two independent checks',()=>{assert.equal(assessReport('impersonation',core,'corroboration').supported,true);for(const id of core)assert.equal(assessReport('impersonation',core.filter(x=>x!==id),'corroboration').supported,false);});
test('collecting everything does not validate unsupported reasoning',()=>{for(const reason of ['appearance','urgency',''] as const)assert.equal(assessReport('impersonation',evidenceIds,reason).supported,false);assert.equal(assessReport('genuine',evidenceIds,'corroboration').supported,false);});
test('insufficient-evidence option leaves the investigation open',()=>{const s=newState();s.caseStatus='active';assert.equal(assessReport('insufficient',[],'').supported,false);assert.equal(s.caseStatus,'active');assert.equal(s.xp,0);});
test('completion rewards are idempotent and report survives round trip',()=>{const s=newState();s.caseStatus='active';core.forEach(id=>collect(s,id));assert.equal(completeCase(s,core),true);assert.equal(completeCase(s,core),false);assert.equal(s.xp,50);assert.equal(s.reputation,10);assert.equal(s.inventory.filter(x=>x==='Pressed-leaf bookmark').length,1);assert.deepEqual(validateState(JSON.parse(JSON.stringify(s))),s);});
test('mid-case saves retain position, inspected clues, and objectives',()=>{const storage=new MemoryStorage(),s=newState();s.introduced=true;s.caseStatus='active';s.player={x:560,y:320,direction:'left'};collect(s,'message');s.inspected.push('message');const saved=saveGame(storage,s);assert.ok(saved.savedAt);assert.deepEqual(loadSave(storage).state,saved);assert.match(objective(saved),/Jun/);});
test('save keeps one prior valid backup and unrelated application storage',()=>{const storage=new MemoryStorage(),s=newState();storage.setItem('statreport.history.v1','keep');saveGame(storage,s);s.introduced=true;saveGame(storage,s);assert.equal(JSON.parse(storage.getItem(BACKUP_KEY)!).introduced,false);assert.equal(storage.getItem('statreport.history.v1'),'keep');});
test('corrupt primary recovers backup without overwriting it with corruption',()=>{const storage=new MemoryStorage(),s=newState();saveGame(storage,s);s.introduced=true;saveGame(storage,s);storage.setItem(SAVE_KEY,'{broken');const loaded=loadSave(storage);assert.equal(loaded.recovered,true);assert.equal(loaded.state?.introduced,false);saveGame(storage,loaded.state!);assert.doesNotThrow(()=>validateState(JSON.parse(storage.getItem(BACKUP_KEY)!)));});
test('unreadable primary and backup report failure and preserve data',()=>{const storage=new MemoryStorage();storage.setItem(SAVE_KEY,'bad');storage.setItem(BACKUP_KEY,'also bad');assert.throws(()=>loadSave(storage),/retained/);assert.equal(storage.getItem(SAVE_KEY),'bad');});
test('blocked and full storage fail instead of reporting success',()=>{const s=newState();assert.throws(()=>loadSave({getItem(){throw Error('blocked');},setItem(){},removeItem(){}}));assert.throws(()=>saveGame({getItem(){return null;},setItem(){throw Error('quota');},removeItem(){}},s),/quota/);});
test('failed backup write leaves the current save unchanged',()=>{const storage=new MemoryStorage();saveGame(storage,newState());const original=storage.getItem(SAVE_KEY);const s=newState();s.introduced=true;assert.throws(()=>saveGame({getItem:k=>storage.getItem(k),setItem(k,v){if(k===BACKUP_KEY)throw Error('quota');storage.setItem(k,v);},removeItem:k=>storage.removeItem(k)},s));assert.equal(storage.getItem(SAVE_KEY),original);});
test('imports reject unknown versions, invalid positions, duplicate or unknown clues, and forged completed cases',()=>{const invalid=[{...newState(),version:2},{...newState(),player:{x:Infinity,y:300,direction:'up'}},{...newState(),evidence:['message','message']},{...newState(),evidence:['nonexistent']},{...newState(),caseStatus:'completed'},{...newState(),inspected:['message']}];for(const s of invalid)assert.throws(()=>validateState(s));});
test('loading positions inside furniture moves to a clear spawn',()=>{assert.deepEqual(safePosition(300,200),{x:390,y:421});assert.deepEqual(safePosition(500,400),{x:500,y:400});});
test('missing and corrupt settings have usable defaults',()=>{const storage=new MemoryStorage();assert.equal(readSettings(storage).textSpeed,'normal');storage.setItem('clueberry.settings.v1','broken');assert.equal(readSettings(storage).sound,true);});
