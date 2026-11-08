/* Architectural contracts and deterministic behavior preservation, without a DOM. */
'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const ROOT = path.resolve(__dirname, '..');
const Core = require('../scripts/core/state.js');
const Sim = require('../scripts/simulation.js');
const NPC = require('../scripts/characters/memory.js');
const Data = require('../scripts/game-data.js');
const Migration = require('../scripts/storage/migration.js');
const createRules = require('../scripts/simulation/session.js');
const createStorage = require('../scripts/storage/save-load.js');
const Assessment = require('../scripts/assessment/model.js');
const tests = [];
const test = (name, fn) => {try {fn();tests.push({name,status:'PASS'});} catch(e) {tests.push({name,status:'FAIL',details:e.stack});}};
const copy = x => JSON.parse(JSON.stringify(x));
const memoryStorage = () => {
 const items=new Map();return {getItem:key=>items.get(key)??null,setItem:(key,v)=>items.set(key,v),items};
};
function registry() {
 const scope=vm.createContext({});
 vm.runInContext(fs.readFileSync(path.join(ROOT,'scripts/core/modules.js'),'utf8'),scope);
 return {scope,api:scope.VCX};
}
test('Registry rejects missing, duplicate and circular dependencies with a useful path',()=>{
 const {api:r}=registry();assert.throws(()=>r.get('missing'),/Missing module/);
 r.define('a',['b'],()=>({}));assert.throws(()=>r.define('a',[],()=>({})),/Duplicate/);
 r.define('b',['a'],()=>({}));assert.throws(()=>r.get('a'),/a -> b -> a/);
 // A failed resolution must not poison independent modules.
 r.define('good',[],()=>({ready:true}));assert(r.get('good').ready);
});
test('Registry resolves each factory once and exposes a defensive graph copy',()=>{
 const {api:r}=registry();let calls=0;r.define('x',[],()=>{calls++;return {};});
 assert.equal(r.get('x'),r.get('x'));assert.equal(calls,1);
 const g=r.graph();g.x.push('bad');assert.equal(r.graph().x.length,0);
});
test('All production modules import without DOM side effects; dependency graph is acyclic',()=>{
 const {scope,api:r}=registry();
 const html=fs.readFileSync(path.join(ROOT,'index.html'),'utf8');
 const files=[...html.matchAll(/<script src="([^"]+)" defer><\/script>/g)].map(m=>m[1]);
 assert(!html.includes('type="module"'));
 for(const file of files){if(file==='scripts/core/modules.js')continue;
  const source=fs.readFileSync(path.join(ROOT,file),'utf8').replace(/VCX\.get\(["']app["']\);?\s*$/,'');
  vm.runInContext(source,scope,{filename:file});
 }
 const graph=r.graph(),active=new Set(),done=new Set();
 const visit=name=>{assert(graph[name],name);assert(!active.has(name),'cycle '+name);if(done.has(name))return;active.add(name);graph[name].forEach(visit);active.delete(name);done.add(name);};
 Object.keys(graph).forEach(visit);
 for(const name of ['core/state','characters/memory','simulation','story/dialogue','exploration/evidence','negotiation','learning','assessment','ui/rendering','audio','storage/save-load'])assert(done.has(name),name);
 Object.keys(graph).filter(n=>n!=='app').forEach(n=>r.get(n));
 assert.equal(scope.state,undefined);assert.equal(scope.VCXSim,undefined);
});
test('Stores and nested NPC, quiz and session data are isolated per game',()=>{
 const a=Core.createStore(),b=Core.createStore();a.state.memory.bay.seenConcerns.push('cash');a.state.learning.quiz.answers.push(2);a.session.scene='hall';
 assert.equal(b.state.memory.bay.seenConcerns.length,0);assert.equal(b.state.learning.quiz.answers.length,0);assert.equal(b.session.scene,'home');
 assert.throws(()=>{a.state=[];},/State must/);
});
test('Rules follow store replacement instead of retaining a stale state reference',()=>{
 const store=Core.createStore(),rules=createRules(store),old=store.state;
 store.state=Core.initialState();store.state.policies.price='premium';
 rules.rememberDecision('policy','price','premium',null,{choice:'Giá cao cố định'});
 assert.equal(old.decisions.length,0);assert.equal(store.state.decisions.length,1);assert(store.state.memory.khoa.seenConcerns.includes('margin'));
 assert.deepEqual(rules.evaluate(),Sim.evaluate(store.state,Data));
});
test('Pre-refactor evaluation, dialogue and migration match 48 saved contracts exactly',()=>{
 const fixture=JSON.parse(fs.readFileSync(path.join(ROOT,'artifacts/modular-baseline/contracts.json')));
 assert.equal(fixture.samples.length,48);
 for(const c of fixture.samples){
  assert.deepEqual(Sim.evaluate(copy(c.state),Data),c.evaluation);
  assert.deepEqual(Sim.ACTORS.map((_,i)=>Sim.dialogue(copy(c.state),i,Data)),c.dialogue);
  assert.deepEqual(Migration.migrate(copy(c.state),Core.initialState(),Data),c.migration);
 }
});
test('NPC memory can be used independently of browser UI and is replayable',()=>{
 const store=Core.createStore(),s=store.state;s.policies.price='premium';
 NPC.record(Sim.evaluate,s,Data,'policy','price','premium',null,{choice:'Giá cao'});
 assert(s.memory.khoa.seenConcerns.includes('margin'));
 assert.equal(NPC.dialogue(Sim.evaluate,s,2,Data).text,Sim.dialogue(s,2,Data).text);
});
test('Save adapter preserves legacy key and full v8 decisions, memory and quiz on resume',()=>{
 const backend=memoryStorage(),store=Core.createStore(),messages=[],adapter=createStorage(store,m=>messages.push(m),backend);
 const legacy=Core.initialState();legacy.saveVersion=7;legacy.policies.price='fair';
 backend.setItem('vcx_v71',JSON.stringify(legacy));store.state=adapter.load();
 store.state.learning.quiz.answers=[0,1,2];store.state.memory.bay.seenConcerns=['cash'];
 createRules(store).rememberDecision('policy','price','fair');store.session.scene='world';adapter.save();
 const loaded=adapter.load();assert.equal(loaded.saveVersion,8);assert.equal(loaded.stage,'world');assert.deepEqual(loaded.learning.quiz.answers,[0,1,2]);assert(loaded.memory.bay.seenConcerns.includes('cash'));assert.equal(loaded.decisions.length,1);
 assert.equal(backend.getItem('vcx_v71'),JSON.stringify(legacy));assert.equal(messages.length,0);
});
test('Home knowledge preview cannot overwrite a pending resume checkpoint',()=>{
 const backend=memoryStorage(),store=Core.createStore(),adapter=createStorage(store,()=>{},backend);
 backend.setItem('vcx_v80','checkpoint');store.session.resumeAvailable=true;adapter.save();assert.equal(backend.getItem('vcx_v80'),'checkpoint');
});
test('Future saves lock writes even after a fresh state replaces the current one',()=>{
 const backend=memoryStorage(),store=Core.createStore(),adapter=createStorage(store,()=>{},backend);
 const future=JSON.stringify({...Core.initialState(),saveVersion:99});backend.setItem('vcx_v80',future);
 assert.equal(adapter.load(),null);assert(adapter.locked);store.state=Core.initialState();adapter.save();assert.equal(backend.getItem('vcx_v80'),future);
});
test('Corrupt newest save falls back without erasing legacy data; storage errors are bounded',()=>{
 const backend=memoryStorage(),store=Core.createStore(),messages=[],adapter=createStorage(store,m=>messages.push(m),backend);
 backend.setItem('vcx_v80','{');backend.setItem('vcx_v71',JSON.stringify(Core.initialState()));assert(adapter.load());assert.equal(backend.getItem('vcx_v80'),'{');
 const errors=[];const bad=createStorage(store,m=>errors.push(m),{getItem(){throw Error('denied');},setItem(){throw Error('quota');}});
 assert.equal(bad.load(),null);const count=errors.length;bad.save();bad.save();assert.equal(errors.length,count+1);
});
test('Assessment model is pure, follows behavior and does not turn ending A into learning credit',()=>{
 const s=Core.initialState();s.result='A';const before=JSON.stringify(s),profile=Assessment.learningProfile(s);
 assert(profile.every(m=>m.score===0));assert.equal(JSON.stringify(s),before);
 s.learning.heard=['bay'];s.learning.links=['price'];s.learning.quiz.answers=[];
 assert.equal(Assessment.learningProfile(s)[0].score,33);assert.equal(Assessment.learningProfile(s)[1].score,33);assert.equal(Assessment.quizScore(s),0);
});
fs.mkdirSync(path.join(ROOT,'artifacts/qa'),{recursive:true});
fs.writeFileSync(path.join(ROOT,'artifacts/qa/modules.json'),JSON.stringify({tests},null,2));
for(const t of tests)console.log(`${t.status} ${t.name}${t.details?'\n'+t.details:''}`);
if(tests.some(t=>t.status!=='PASS'))process.exitCode=1;
