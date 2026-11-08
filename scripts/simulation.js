/* Pure simulation: no DOM, random values, storage or network. Rules are pedagogical. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.VCXSim=api;})(globalThis,()=>{
'use strict';
const VERSION=8;
const ACTORS=[
 {id:'bay',place:'field',name:'Chú Bảy',interests:['Thu nhập','Đầu ra','Chi phí','Rủi ro sản xuất'],minimum:59},
 {id:'sen',place:'coop',name:'Chị Sen',interests:['Minh bạch phí','Dòng tiền HTX','Năng lực vận hành','Quyền lợi xã viên'],minimum:57},
 {id:'khoa',place:'factory',name:'Anh Khoa',interests:['Chất lượng','Nguồn cung','Tiến độ','Biên chi phí'],minimum:57}
];
const clamp=n=>Math.max(0,Math.min(100,Math.round(n)));
const object=x=>x&&typeof x==='object'&&!Array.isArray(x);
const owned=(s,id)=>Object.values(s.found||{}).some(a=>Array.isArray(a)&&a.includes(id));
const validTool=(s,t)=>t.choices.some(c=>c.id===s.governance?.[t.id])&&t.proofs.includes(s.govProof?.[t.id])&&owned(s,s.govProof[t.id]);
function freshLearning(){return {viewed:[],heard:[],debates:{},quiz:{answers:[],submitted:false},miniAttempts:{},links:[],invitations:[]};}
function freshMemory(){return Object.fromEntries(ACTORS.map(a=>[a.id,{seenConcerns:[],history:[],lastDialogue:''}]));}
function migrate(raw,base,data){
 if(!object(raw)||!object(raw.found)||!object(raw.policies))return null;
 if(Number(raw.saveVersion)>VERSION)throw Error('Bản lưu thuộc phiên bản mới hơn.');
 const s=JSON.parse(JSON.stringify(base));
 for(const place of Object.keys(data.SCENES)){
  const list=raw.found[place];if(list!==undefined&&!Array.isArray(list))return null;
  s.found[place]=[...new Set((list||[]).filter(id=>data.SCENES[place].hotspots.some(h=>h.id===id)))];
  s.minis[place]=raw.minis?.[place]===true;
  s.done[place]=raw.done?.[place]===true&&s.found[place].length===3&&s.minis[place];
  s.npcTalk[place]=Number.isInteger(raw.npcTalk?.[place])?Math.max(0,raw.npcTalk[place]):0;
 }
 for(const p of data.POLICIES)if(p.choices.some(c=>c.id===raw.policies[p.id]))s.policies[p.id]=raw.policies[p.id];
 for(const t of data.STATE_TOOLS){
  if(t.proofs.includes(raw.govProof?.[t.id])&&owned(s,raw.govProof[t.id]))s.govProof[t.id]=raw.govProof[t.id];
  if(t.choices.some(c=>c.id===raw.governance?.[t.id]))s.governance[t.id]=raw.governance[t.id];
 }
 for(const [id,clue] of Object.entries({price:'field_buyer',fees:'coop_fees',risk:'field_sensor'}))if(raw.board?.[id]===clue&&owned(s,clue))s.board[id]=clue;
 for(const a of ACTORS)s.invited[a.id]=raw.invited?.[a.id]===true;
 for(const id of ['water','dock'])s.sideQuests[id]=raw.sideQuests?.[id]===true;
 s.mode=raw.mode==='demo'?'demo':'full';s.intro=raw.intro===true;
 for(const k of ['preparedDemo','demoExpanded'])s[k]=raw[k]===true;
 s.storyPos=Number.isInteger(raw.storyPos)?Math.max(0,Math.min(raw.storyPos,s.mode==='demo'?6:9)):0;
 s.activePlace=Object.hasOwn(data.SCENES,raw.activePlace)?raw.activePlace:'field';
 s.mapPos={x:Number.isFinite(raw.mapPos?.x)?Math.max(7,Math.min(94,raw.mapPos.x)):50,y:Number.isFinite(raw.mapPos?.y)?Math.max(12,Math.min(88,raw.mapPos.y)):56};
 s.stage=['home','story','world','explore','board','invite','hall','ending'].includes(raw.stage)?raw.stage:'world';
 if(['board','invite','hall','ending'].includes(s.stage)&&!Object.values(s.done).every(Boolean))s.stage='world';
 if(['hall','ending'].includes(s.stage)&&!ACTORS.every(a=>s.invited[a.id]))s.stage='invite';
 s.crisis=['prepared','unprepared'].includes(raw.crisis)?raw.crisis:null;
 s.crisisSequence=Array.isArray(raw.crisisSequence)?raw.crisisSequence.filter(x=>['alert','verify','apply'].includes(x)).slice(0,3):[];
 s.result=['A','B','C'].includes(raw.result)?raw.result:null;
 s.legacyResult=['A','B','C'].includes(raw.legacyResult)?raw.legacyResult:raw.saveVersion!==8&&s.result?s.result:null;
 if(s.stage==='ending'&&!s.result)s.stage='hall';
 // Legacy decisions remain auditable; no invented behavioral evidence for old saves.
 const cleanText=(value,max=2000)=>typeof value==='string'?value.slice(0,max):'';
 s.decisions=Array.isArray(raw.decisions)?raw.decisions.filter(object).slice(-500).map(d=>{
  const entry={kind:cleanText(d.kind,40),key:cleanText(d.key,80),id:cleanText(d.id,80),at:typeof d.at==='number'?d.at:cleanText(d.at,50)};
  if(Number.isSafeInteger(d.serial)&&d.serial>0)entry.serial=d.serial;
  for(const key of ['choice','benefits','costs'])if(typeof d[key]==='string')entry[key]=cleanText(d[key]);
  if(d.source)entry.source=['player','prepared'].includes(d.source)?d.source:'legacy';
  if(Array.isArray(d.evidence))entry.evidence=d.evidence.filter(id=>typeof id==='string'&&owned(s,id)).slice(0,9);
  if(Array.isArray(d.consequences))entry.consequences=d.consequences.filter(x=>typeof x==='string').map(x=>cleanText(x)).slice(0,20);
  if(Array.isArray(d.effects))entry.effects=d.effects.filter(x=>object(x)&&ACTORS.some(a=>a.id===x.actor)).slice(0,3).map(x=>({actor:x.actor,delta:Number.isFinite(x.delta)?x.delta:0,trust:Number.isFinite(x.trust)?clamp(x.trust):0,concerns:Array.isArray(x.concerns)?x.concerns.filter(c=>typeof c==='string').map(c=>cleanText(c)).slice(0,20):[]}));
  if(object(d.snapshot))entry.snapshot={policies:object(d.snapshot.policies)?d.snapshot.policies:{},governance:object(d.snapshot.governance)?d.snapshot.governance:{}};
  return entry;
 }):[];
 s.decisionSerial=Math.max(Number.isSafeInteger(raw.decisionSerial)?raw.decisionSerial:0,s.decisions.length);
 s.memory=freshMemory();
 for(const a of ACTORS){const m=raw.memory?.[a.id];if(!object(m))continue;
  s.memory[a.id]={seenConcerns:Array.isArray(m.seenConcerns)?[...new Set(m.seenConcerns.filter(x=>typeof x==='string'))].slice(-30):[],history:Array.isArray(m.history)?m.history.filter(object).slice(-60):[],lastDialogue:typeof m.lastDialogue==='string'?m.lastDialogue.slice(0,800):''};
 }
 s.learning=freshLearning();const l=object(raw.learning)?raw.learning:{};
 const allowed={viewed:Object.values(data.SCENES).flatMap(v=>v.hotspots.map(h=>h.id)),heard:ACTORS.map(a=>a.id),links:['price','fees','risk'],invitations:ACTORS.map(a=>a.id)};
 for(const k of ['viewed','heard','links','invitations'])s.learning[k]=Array.isArray(l[k])?[...new Set(l[k].filter(x=>allowed[k].includes(x)))]:[];
 if(object(l.miniAttempts))for(const [k,n] of Object.entries(l.miniAttempts))if(Number.isSafeInteger(n)&&n>=0)s.learning.miniAttempts[k]=n;
 if(object(l.debates))for(const a of ACTORS){const d=l.debates[a.id];if(object(d)&&Array.isArray(d.rubric)&&d.rubric.length===4&&d.rubric.every(n=>Number.isInteger(n)&&n>=0&&n<=2))s.learning.debates[a.id]=d;}
 if(object(l.quiz)&&Array.isArray(l.quiz.answers)){s.learning.quiz.answers=l.quiz.answers.slice(0,10).map(n=>Number.isInteger(n)&&n>=0&&n<4?n:null);s.learning.quiz.submitted=l.quiz.submitted===true&&s.learning.quiz.answers.length===10&&s.learning.quiz.answers.every(n=>n!==null);}
 s.saveVersion=VERSION;return s;
}
function effective(s,data){const p=s.policies||{},g=s.governance||{};const active=id=>{const t=data.STATE_TOOLS.find(x=>x.id===id);return validTool(s,t)?g[id]:null;};
 let pol=0,gov=0;
 if(p.price==='fair'||(p.price==='phased'&&active('rights')==='document'))pol++;
 if(p.fees==='fair'||(p.fees==='upfront'&&active('harmony')==='credit'&&active('rights')==='document')||(p.fees==='deferred'&&active('harmony')==='link'&&active('rights')==='document'))pol++;
 if(p.risk==='fair'||(p.risk==='reserve'&&['targeted','full'].includes(active('prevent'))))pol++;
 if(['document','independent'].includes(active('rights')))gov++;
 if(['training','link'].includes(active('harmony'))||(active('harmony')==='credit'&&p.price==='fair'&&active('rights')==='document'))gov++;
 if(active('prevent')==='full'||(active('prevent')==='targeted'&&(s.sideQuests?.water||s.govProof.prevent==='field_sensor')))gov++;
 if(['mediate','neutral'].includes(active('resolve')))gov++;
 return {pol,gov,active};
}
function concerns(s,idx,data){
 const p=s.policies||{},eff=effective(s,data),g=Object.fromEntries(data.STATE_TOOLS.map(t=>[t.id,eff.active(t.id)])),out=[];
 const add=(id,text,critical=true)=>out.push({id,text,type:'warn',critical});
 if(!p.risk)add('risk_missing','Chưa phân chia trách nhiệm và tổn thất khi rủi ro xảy ra.');
 if(p.risk==='pause')add('delivery_pause','Hoãn toàn bộ lô chưa có thời hạn hay nguồn lực bù chi phí, không thể hứa duy trì chuỗi.');
 if(g.resolve==='formal')add('open_dispute','Tranh chấp đang chờ cơ chế pháp lý; quyền yêu cầu được bảo vệ nhưng chưa thể ký lại.');
 if(idx===0){
  if(!p.price)add('income','Chưa có quy tắc xác định giá để dự toán thu nhập.');
  if(p.price==='phased'&&g.rights!=='document')add('price_floor','Giá theo đợt cần phụ lục bảo đảm tối thiểu và quy tắc điều chỉnh.');
  if(p.fees==='upfront'&&!(g.harmony==='credit'&&g.rights==='document'))add('cash','Phí đầu vụ vượt dòng tiền; chưa có phương án vốn và nghĩa vụ rõ ràng.');
  if(g.harmony==='credit')add('debt','Tiếp cận tín dụng vẫn cần đối chiếu điều kiện vay và khả năng trả nợ.',false);
  if(g.rights==='template')add('appeal','Mẫu gọn chưa bảo đảm cách phản đối kết quả kiểm định.');
 }else if(idx===1){
  if(!p.fees)add('fees','Chưa xác định chi phí dịch vụ và trách nhiệm thanh toán.');
  if(p.fees==='deferred'&&!(g.harmony==='link'&&g.rights==='document'))add('coop_cash','HTX ứng phí chưa có nguồn lực chia sẻ và lịch thu hồi, vượt khả năng vận hành.');
  if(g.prevent==='full'&&p.fees!=='fair')add('sampling_cost','Kiểm tra toàn bộ còn cần làm rõ chi phí và lịch trả kết quả.',false);
 }else{
  if(!p.price)add('pricing','Chưa có quy tắc mua hàng và kế hoạch thanh toán.');
  if(p.price==='premium')add('margin','Giá cao cố định trước kiểm định chưa có cơ sở bảo đảm khả năng thực hiện đơn hàng.');
  if(g.rights==='template'&&p.price==='phased')add('quality','Chốt giá sau kiểm định nhưng thiếu quyền đối chiếu kết quả.');
  if(g.prevent==='full')add('deadline','Kiểm tra toàn bộ tăng thời gian; cần phối hợp lịch giao nhận.',false);
 }
 if(!out.length)out.push({id:'balanced',type:'ok',critical:false,text:['Có căn cứ dự toán thu nhập và cơ chế chia sẻ rủi ro; tôi có thể cân nhắc ký.','Có phương án chi phí và vận hành; quyền lợi xã viên được giải thích rõ.','Tiêu chuẩn và trách nhiệm khả thi giúp doanh nghiệp chủ động nguồn cung.'][idx]});
 return out;
}
function evaluate(s,data){
 const eff=effective(s,data);let vals=[37,39,38],trust=30,society=44;
 for(const p of data.POLICIES){const c=p.choices.find(c=>c.id===s.policies?.[p.id]);if(!c)continue;c.delta.forEach((d,i)=>vals[i]+=d);trust+=c.ok?6:-3;if(p.id==='risk'&&c.id==='pause')society+=3;}
 if(s.sideQuests?.dock){[2,4,4].forEach((v,i)=>vals[i]+=v);trust+=4;}
 if(s.sideQuests?.water){trust+=4;society+=4;}
 for(const t of data.STATE_TOOLS){if(!validTool(s,t))continue;const c=t.choices.find(c=>c.id===s.governance[t.id]);c.delta.forEach((v,i)=>vals[i]+=v);trust+=c.trust;society+=c.society;
  if(t.id==='prevent'&&c.id==='targeted'&&!s.sideQuests?.water&&s.govProof.prevent!=='field_sensor'){trust-=7;society-=7;}
  if(t.id==='harmony'&&c.id==='credit'&&s.policies.price!=='fair')trust-=8;
 }
 trust+=Math.max(0,eff.pol-1)*2;vals=vals.map(clamp);
 const actors=ACTORS.map((a,i)=>{
  const reasons=concerns(s,i,data),critical=reasons.filter(r=>r.critical),cautions=reasons.filter(r=>r.type==='warn'&&!r.critical);
  const seen=s.memory?.[a.id]?.seenConcerns||[];
  // Once a harmful proposal is withdrawn it leaves a small bounded trace. Repeating clicks earns nothing.
  const scar=Math.min(6,seen.filter(id=>!critical.some(r=>r.id===id)).length*2);
  const evidence=(s.found?.[a.place]||[]).length;
  let personal=38+evidence*3+(s.invited?.[a.id]?5:0)+eff.pol*3-critical.length*12-cautions.length*3-scar;
  if(eff.active('rights')==='document')personal+=i===0?9:6;
  if(eff.active('rights')==='independent')personal+=i===2?10:6;
  if(eff.active('resolve')==='mediate')personal+=i===1?10:7;
  if(eff.active('resolve')==='neutral')personal+=i===2?10:8;
  if((i===0&&eff.active('harmony')==='training')||(i===1&&eff.active('harmony')==='link'))personal+=5;
  personal=clamp(personal);
  return {...a,score:vals[i],trust:personal,concerns:reasons,critical:critical.map(r=>r.id),accepted:vals[i]>=a.minimum&&personal>=55&&critical.length===0,scar};
 });
 const complete=data.POLICIES.every(p=>p.choices.some(c=>c.id===s.policies?.[p.id]))&&data.STATE_TOOLS.every(t=>validTool(s,t));
 const feasibility=eff.pol===3&&eff.gov>=3;
 const community={score:clamp(society),safe:clamp(society)>=60&&eff.active('prevent')!==null&&s.policies?.risk!=='pause'};
 const checks={complete,participation:ACTORS.every(a=>s.invited?.[a.id]),minimums:actors.every(a=>a.score>=a.minimum),consent:actors.every(a=>a.critical.length===0),trust:actors.every(a=>a.trust>=55)&&trust>=60,feasibility,community:community.safe,crisis:s.crisis==='prepared'};
 const full=Object.values(checks).every(Boolean);
 const partial=complete&&checks.participation&&eff.pol>=2&&eff.gov>=2&&actors.every(a=>a.score>=43&&a.trust>=35&&a.critical.length<=1)&&trust>=39&&society>=42;
 return {vals,good:eff.pol,govGood:eff.gov,trust:clamp(trust),society:clamp(society),min:Math.min(...vals),actors,community,checks,result:full?'A':partial?'B':'C'};
}
function record(s,data,kind,key,id,before,meta={}){
 s.memory??=freshMemory();s.decisions??=[];const after=evaluate(s,data);
 const item={serial:(s.decisionSerial||0)+1,kind,key,id,at:new Date().toISOString(),source:meta.source||'player',evidence:meta.evidence||[],choice:meta.choice||id,benefits:meta.benefits||'',costs:meta.costs||'',effects:ACTORS.map((a,i)=>({actor:a.id,delta:after.vals[i]-(before?.vals[i]??after.vals[i]),trust:after.actors[i].trust,concerns:after.actors[i].concerns.filter(r=>r.type==='warn').map(r=>r.text)})),consequences:after.actors.flatMap(a=>a.critical.map(id=>a.name+': '+a.concerns.find(r=>r.id===id).text)),snapshot:{policies:{...s.policies},governance:{...s.governance}},...meta};
 s.decisionSerial=item.serial;s.decisions.push(item);if(s.decisions.length>500)s.decisions.shift();
 // Incomplete drafts do not create a breach of trust. Only actual proposals create memory.
 for(const a of after.actors){const m=s.memory[a.id];const ids=a.critical.filter(id=>!['risk_missing','income','fees','pricing'].includes(id));
  m.seenConcerns=[...new Set([...m.seenConcerns,...ids])];
  m.history.push({serial:item.serial,choice:item.choice,critical:ids,evidence:item.evidence});if(m.history.length>60)m.history.shift();
 }
 return item;
}
function mood(s,idx,data,event=''){
 const a=evaluate(s,data).actors[idx];
 if(event==='crisis')return a.critical.length?'stressed':'worried';
 if(a.critical.length>=2||a.trust<30)return 'angry';
 if(a.critical.length)return 'stressed';
 if(a.accepted)return s.memory?.[a.id]?.seenConcerns.length?'relieved':'happy';
 if(!(s.found?.[a.place]||[]).length)return 'confused';
 if(a.concerns.some(r=>r.type==='warn'))return 'worried';
 return a.trust>=50?'thinking':'normal';
}
function dialogue(s,idx,data){
 const a=evaluate(s,data).actors[idx],m=s.memory?.[a.id],found=s.found?.[a.place]||[],p=s.policies||{};
 const past=m?.history?.find(h=>h.critical?.length);
 const intro=past?(a.critical.length?'Tôi vẫn nhớ đề xuất trước: '+past.choice+'. ':'Đề xuất '+past.choice+' trước đây từng làm tôi lo. Bản sửa đã giải quyết được điểm chính. '):'';
 const proof=found.length?'Bạn đã đối chiếu '+data.SCENES[a.place].hotspots.filter(h=>found.includes(h.id)).map(h=>h.name).join(', ')+'. ':'Hãy kiểm tra hồ sơ của tôi trước khi đưa lời hứa. ';
 const chosen=Object.keys(p).length?'Điều khoản hiện tại: '+data.POLICIES.filter(x=>p[x.id]).map(x=>x.choices.find(c=>c.id===p[x.id])?.name).join('; ')+'. ':'';
 return {text:intro+proof+chosen+a.concerns.map(r=>r.text).join(' ')+' Mức tin tưởng hiện tại: '+a.trust+'/100 (giả lập).',mood:mood(s,idx,data)};
}
return {VERSION,ACTORS,owned,validTool,migrate,freshLearning,freshMemory,effective,evaluate,concerns,record,mood,dialogue};
});
