/* Vung Con Xanh: external assets, full game logic restored. */
const SCENE_ASSETS={map:'assets/scene/map.svg',meeting:'assets/scene/meeting.svg',field:'assets/scene/field.svg',coop:'assets/scene/coop.svg',factory:'assets/scene/factory.svg'};
const PORTRAITS={anh_khoa_angry:'assets/portrait/anh_khoa_angry.png',anh_khoa_confused:'assets/portrait/anh_khoa_confused.png',anh_khoa_happy:'assets/portrait/anh_khoa_happy.png',anh_khoa_normal:'assets/portrait/anh_khoa_normal.png',anh_khoa_relieved:'assets/portrait/anh_khoa_relieved.png',anh_khoa_stressed:'assets/portrait/anh_khoa_stressed.png',anh_khoa_thinking:'assets/portrait/anh_khoa_thinking.png',anh_khoa_worried:'assets/portrait/anh_khoa_worried.png',ca_bong_angry:'assets/portrait/ca_bong_angry.png',ca_bong_confused:'assets/portrait/ca_bong_confused.png',ca_bong_happy:'assets/portrait/ca_bong_happy.png',ca_bong_normal:'assets/portrait/ca_bong_normal.png',ca_bong_relieved:'assets/portrait/ca_bong_relieved.png',ca_bong_stressed:'assets/portrait/ca_bong_stressed.png',ca_bong_thinking:'assets/portrait/ca_bong_thinking.png',ca_bong_worried:'assets/portrait/ca_bong_worried.png',chi_sen_angry:'assets/portrait/chi_sen_angry.png',chi_sen_confused:'assets/portrait/chi_sen_confused.png',chi_sen_happy:'assets/portrait/chi_sen_happy.png',chi_sen_normal:'assets/portrait/chi_sen_normal.png',chi_sen_relieved:'assets/portrait/chi_sen_relieved.png',chi_sen_stressed:'assets/portrait/chi_sen_stressed.png',chi_sen_thinking:'assets/portrait/chi_sen_thinking.png',chi_sen_worried:'assets/portrait/chi_sen_worried.png',chu_bay_angry:'assets/portrait/chu_bay_angry.png',chu_bay_confused:'assets/portrait/chu_bay_confused.png',chu_bay_happy:'assets/portrait/chu_bay_happy.png',chu_bay_normal:'assets/portrait/chu_bay_normal.png',chu_bay_relieved:'assets/portrait/chu_bay_relieved.png',chu_bay_stressed:'assets/portrait/chu_bay_stressed.png',chu_bay_thinking:'assets/portrait/chu_bay_thinking.png',chu_bay_worried:'assets/portrait/chu_bay_worried.png',minh_an_angry:'assets/portrait/minh_an_angry.png',minh_an_confused:'assets/portrait/minh_an_confused.png',minh_an_happy:'assets/portrait/minh_an_happy.png',minh_an_normal:'assets/portrait/minh_an_normal.png',minh_an_relieved:'assets/portrait/minh_an_relieved.png',minh_an_stressed:'assets/portrait/minh_an_stressed.png',minh_an_thinking:'assets/portrait/minh_an_thinking.png',minh_an_worried:'assets/portrait/minh_an_worried.png'};
const SPRITES={minh_an_walk_0:'assets/sprites/minh_an_walk_0.png',minh_an_walk_1:'assets/sprites/minh_an_walk_1.png',minh_an_walk_2:'assets/sprites/minh_an_walk_2.png',minh_an_walk_3:'assets/sprites/minh_an_walk_3.png'};
function sceneSrc(name){return SCENE_ASSETS[name]||SCENE_ASSETS.meeting;}

const $ = id=>document.getElementById(id);
const portrait=(name,mood)=>PORTRAITS[name+'_'+mood]||PORTRAITS[name+'_normal'];
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const SCENES={
 field:{name:'Cánh đồng chú Bảy',icon:'🌾',bg:'field',person:'chu_bay',character:'Chú Bảy',job:'Nông dân',line:'“Tui muốn làm lúa chất lượng, nhưng tiền mua cảm biến đã bỏ ra rồi. Giờ giá lại chưa rõ, ai mà không lo?”',hotspots:[
  {id:'field_cost',icon:'🧾',name:'Sổ đầu tư',x:22,y:63,details:'Chú Bảy đã bỏ chi phí mua thiết bị cảm biến và tham gia tập huấn. Đây là khoản chi thực tế, không tự mất đi khi hủy liên kết.',lesson:'Lợi ích nông dân gắn với chi phí và khả năng thu hồi vốn.',mood:'worried'},
  {id:'field_sensor',icon:'📡',name:'Trạm cảm biến',x:69,y:34,details:'Cảm biến giúp theo dõi điều kiện canh tác, đồng thời phát cảnh báo khi nguồn nước có biến động. Dữ liệu này cần được chia sẻ cho các bên.',lesson:'Công nghệ hỗ trợ năng suất và quản lý rủi ro, nhưng cần phối hợp.',mood:'thinking'},
  {id:'field_buyer',icon:'📃',name:'Phiếu thu mua',x:48,y:76,details:'Mức giá dự kiến không kèm quy tắc rõ ràng về thưởng chất lượng và cách điều chỉnh khi điều kiện thay đổi. Chú Bảy sợ bị ép vào thế bị động.',lesson:'Mâu thuẫn về giá xuất phát từ vị thế và lợi ích khác nhau.',mood:'stressed'}]},
 coop:{name:'HTX Cồn Xanh',icon:'🏘️',bg:'coop',person:'chi_sen',character:'Chị Sen',job:'Giám đốc hợp tác xã',line:'“HTX lo kho, kiểm định và truy xuất. Mà những khoản này cứ ghi chung chung là hỗ trợ, biết thu ở đâu?”',hotspots:[
  {id:'coop_fees',icon:'🧮',name:'Sổ phí dịch vụ',x:22,y:66,details:'Các khoản kho bãi, điều phối và lấy mẫu đã phát sinh, nhưng phụ lục hợp đồng chưa xác định rõ bên nào thanh toán từng khoản.',lesson:'HTX cần nguồn lực để thực hiện chức năng liên kết.',mood:'stressed'},
  {id:'coop_contract',icon:'📜',name:'Bản dự thảo',x:73,y:64,details:'Hợp đồng nguyên tắc nói đến sản lượng 100 tấn nhưng bỏ trống nhiều nội dung về tiêu chuẩn cuối cùng, phí dịch vụ và xử lý tranh chấp.',lesson:'Luật chơi minh bạch giúp các chủ thể dự báo và bảo vệ lợi ích.',mood:'confused'},
  {id:'coop_trace',icon:'🔖',name:'Mã truy xuất',x:50,y:31,details:'Hệ thống truy xuất đã được HTX triển khai. Muốn tạo ra hàng hóa đạt chuẩn, cả ba bên phải cung cấp dữ liệu và thực hiện đúng quy trình.',lesson:'Lợi ích chung xuất hiện khi các bên hợp tác trong chuỗi giá trị.',mood:'thinking'}]},
 factory:{name:'Nhà máy anh Khoa',icon:'🏭',bg:'factory',person:'anh_khoa',character:'Anh Khoa',job:'Đại diện doanh nghiệp',line:'“Tôi không nhận được lúa đúng kế hoạch thì dây chuyền chờ. Nếu chất lượng không đạt, tôi còn có thể mất đơn hàng.”',hotspots:[
  {id:'factory_order',icon:'📦',name:'Đơn hàng',x:27,y:69,details:'Doanh nghiệp đã lên lịch chế biến và giao hàng cho đối tác. Thiếu nguyên liệu đúng tiêu chuẩn có thể làm tăng chi phí hoặc chậm tiến độ.',lesson:'Lợi ích doanh nghiệp gắn với nguồn cung, tiêu chuẩn và tiến độ.',mood:'worried'},
  {id:'factory_quality',icon:'🔬',name:'Bảng tiêu chuẩn',x:75,y:32,details:'Quy cách sản phẩm cần kiểm định trước khi thanh toán nhưng chưa thống nhất phương pháp xác định chất lượng và cách xử lý lô không đạt.',lesson:'Minh bạch tiêu chuẩn làm giảm tranh chấp chất lượng.',mood:'confused'},
  {id:'factory_trucks',icon:'🚚',name:'Lịch xe thu mua',x:61,y:76,details:'Xe đã được đặt lịch nhưng không nhận đủ nguyên liệu. Tìm nhà cung cấp thay thế có thể khiến doanh nghiệp phải đổi kế hoạch.',lesson:'Đứt liên kết làm thiệt hại cả phía thu mua và chế biến.',mood:'stressed'}]}
};
const STORY=[
 {time:'TUẦN 1 • HỢP TÁC',bg:'meeting',name:'Người dẫn chuyện',role:'Hồi tưởng',face:'ca_bong',mood:'happy',text:'Ở Vùng Cồn Xanh, ba bên ký thỏa thuận nguyên tắc để cùng làm dự án 100 tấn lúa chất lượng cao. Hôm đó ai cũng cười tươi.'},
 {time:'TUẦN 1 • HỢP TÁC',bg:'field',name:'Chú Bảy',role:'Nông dân',face:'chu_bay',mood:'happy',text:'“Có đầu ra ổn định, bà con mình mạnh dạn đầu tư công nghệ mới. Vụ này mà thành là khỏe rồi!”'},
 {time:'TUẦN 1 • HỢP TÁC',bg:'coop',name:'Chị Sen',role:'Hợp tác xã',face:'chi_sen',mood:'happy',text:'“HTX sẽ đứng ra liên kết sản xuất, lo kiểm định và truy xuất. Mình cùng làm ăn lâu dài nha!”'},
 {time:'TUẦN 1 • HỢP TÁC',bg:'factory',name:'Anh Khoa',role:'Doanh nghiệp',face:'anh_khoa',mood:'happy',text:'“Tôi cần lúa đạt chuẩn, mọi người cần đầu ra. Cả ba cùng hợp tác thì có cơ hội tăng hiệu quả.”'},
 {time:'TUẦN 2–4 • RẠN NỨT',bg:'field',name:'Người dẫn chuyện',role:'Chuyện kể',face:'minh_an',mood:'thinking',text:'Nhưng công nghệ, kho bãi và kiểm định khiến nhiều chi phí mới xuất hiện. Những điều khoản quan trọng vẫn được hẹn “để bàn sau”.'},
 {time:'TUẦN 6 • ĐỔ VỠ',bg:'meeting',name:'Chú Bảy',role:'Nông dân',face:'chu_bay',mood:'angry',text:'“Giá còn chưa chốt, chi phí thì cứ thêm hoài! Tui không thể đem cả vụ mùa ra đánh cược!”'},
 {time:'TUẦN 6 • ĐỔ VỠ',bg:'meeting',name:'Anh Khoa',role:'Doanh nghiệp',face:'anh_khoa',mood:'angry',text:'“Tôi đâu thể cam kết giá cao nếu tiêu chuẩn kiểm định chưa rõ. Doanh nghiệp cũng đâu phải làm không công!”'},
 {time:'TUẦN 6 • ĐỔ VỠ',bg:'meeting',name:'Chị Sen',role:'Hợp tác xã',face:'chi_sen',mood:'stressed',text:'“Hai bên cứ đẩy qua đẩy lại, còn chi phí HTX gánh thì sao? Thôi, ngừng lại cho rõ mọi chuyện!”'},
 {time:'TUẦN 6 • ĐỔ VỠ',bg:'meeting',name:'Cá Bống',role:'Linh vật',face:'ca_bong',mood:'confused',text:'Nhóm chat “Cùng nhau phát tài” thông báo: Chú Bảy đã rời nhóm. Anh Khoa đã rời nhóm. Chị Sen đã tắt thông báo… “Ủa, còn tui với cái sticker lúa thôi hả?”'},
 {time:'TUẦN 7 • NHIỆM VỤ MỚI',bg:'map',name:'Minh An',role:'Người điều phối',face:'minh_an',mood:'thinking',text:'“Không thể ép họ ký lại ngay. Mình phải đi gặp cả ba, nghe từng bên kể chuyện và thu thập chứng cứ trước đã.”'}
];
const KEY_CLUES=[
 {id:'field_buyer',icon:'📃',title:'Phiếu thu mua',info:'Giá và thưởng chất lượng'},
 {id:'coop_fees',icon:'🧮',title:'Sổ phí HTX',info:'Chi phí dịch vụ chưa rõ'},
 {id:'field_sensor',icon:'📡',title:'Trạm cảm biến',info:'Rủi ro độ mặn và nước'}
];
const ISSUES=[
 {id:'price',title:'1. Tranh cãi giá – chất lượng',desc:'Giá mua và cách đánh giá chất lượng chưa minh bạch',clue:'field_buyer'},
 {id:'fees',title:'2. Tranh cãi phí dịch vụ',desc:'Cần xác định rõ khoản phí và trách nhiệm',clue:'coop_fees'},
 {id:'risk',title:'3. Rủi ro chung chưa có cách xử lý',desc:'Điều kiện canh tác thay đổi có thể làm đứt liên kết',clue:'field_sensor'}
];
const POLICIES=[
 {id:'price',title:'GIÁ THU MUA & TIÊU CHUẨN',short:'Giá / chất lượng',explain:'Giá, kiểm định và thời điểm thanh toán tác động khác nhau đến ba bên.',choices:[
  {id:'fair',name:'Giá sàn có căn cứ + thưởng theo chất lượng kiểm định',delta:[19,8,9],accept:'Dễ dự toán cho nông dân nhưng phải có chi phí lấy mẫu và quy tắc kiểm định công khai.',ok:true},
  {id:'phased',name:'Giá tham chiếu thị trường theo từng đợt, chốt sau kiểm định chung',delta:[8,8,18],accept:'Doanh nghiệp linh hoạt hơn; nông dân lo biến động giá, cần phụ lục bảo đảm tối thiểu.',ok:true},
  {id:'premium',name:'Chốt giá cao từ đầu để giúp thu hồi vốn công nghệ',delta:[25,1,-11],accept:'Nông dân an tâm hơn; doanh nghiệp chịu rủi ro nếu chất lượng hoặc giá tiêu thụ biến động.',ok:false}
 ]},
 {id:'fees',title:'CHI PHÍ DỊCH VỤ HỢP TÁC XÃ',short:'Phí HTX',explain:'Ai ứng chi phí, ai trả sau và ai hưởng dịch vụ?',choices:[
  {id:'fair',name:'Công khai hóa đơn; phân phí theo dịch vụ mỗi bên thực dùng',delta:[10,19,9],accept:'Minh bạch nhưng cần thống nhất cách xác nhận từng khoản chi.',ok:true},
  {id:'upfront',name:'Thu phí cố định đầu vụ để HTX chủ động vốn',delta:[-7,23,8],accept:'HTX vận hành chắc hơn nhưng nông dân cần vốn ban đầu.',ok:false},
  {id:'deferred',name:'HTX ứng phí, thu lại sau khi lô lúa bán được',delta:[12,-12,10],accept:'Giảm áp lực tiền mặt cho nông dân nhưng HTX phải gánh rủi ro dòng tiền.',ok:false}
 ]},
 {id:'risk',title:'RỦI RO SẢN XUẤT & MÔI TRƯỜNG',short:'Rủi ro',explain:'Rủi ro không biến mất sau khi ký hợp đồng; phương án ứng phó cần cân bằng tiến độ và an toàn.',choices:[
  {id:'fair',name:'Cùng cảnh báo sớm; kiểm chứng dữ liệu; chia sẻ tổn thất theo trách nhiệm',delta:[18,14,14],accept:'Rõ trách nhiệm nhưng cần đầu tư vào phối hợp và hồ sơ.',ok:true},
  {id:'reserve',name:'Trích quỹ dự phòng chung từ doanh thu vụ mùa',delta:[11,7,12],accept:'Có quỹ xử lý sự cố nhưng lợi nhuận mỗi bên giảm trong ngắn hạn.',ok:true},
  {id:'pause',name:'Tạm hoãn giao toàn bộ lô để ưu tiên tái kiểm định',delta:[6,-6,-16],accept:'Giảm rủi ro chất lượng, nhưng chi phí kho và nguy cơ lỡ đơn hàng tăng.',ok:false}
 ]}
];
const NAMES={field:'Chú Bảy',coop:'Chị Sen',factory:'Anh Khoa'};
const CHARS=[{key:'chu_bay',name:'Chú Bảy',idx:0},{key:'chi_sen',name:'Chị Sen',idx:1},{key:'anh_khoa',name:'Anh Khoa',idx:2}];
let state={};let scene='home';let storyPos=0;let activePlace='field';let selectedEvidence=null;let soundOn=true;let audioCtx=null;let toastId=null;
function initialState(){return{intro:false,found:{field:[],coop:[],factory:[]},done:{field:false,coop:false,factory:false},minis:{field:false,coop:false,factory:false},board:{},policies:{},crisis:null,invited:{bay:false,sen:false,khoa:false},inviteSelection:null,mode:'full',stage:'home',storyPos:0,activePlace:'field',mapPos:{x:50,y:56},sideQuests:{water:false,dock:false},npcTalk:{field:0,coop:0,factory:0},governance:{},govProof:{},preparedDemo:false,demoExpanded:false,decisions:[]};}
function load(){try{const raw=(localStorage.getItem('vcx_v71')||localStorage.getItem('vcx_v7')||localStorage.getItem('vcx_v6')||localStorage.getItem('vcx_v4'));if(!raw)return null;const d=JSON.parse(raw);return d&&d.found&&d.policies?d:null;}catch(e){return null}}
function save(){try{state.stage=scene;state.storyPos=storyPos;state.activePlace=activePlace;localStorage.setItem('vcx_v71',JSON.stringify(state));}catch(e){}}
function notify(text){const t=$('toast');t.textContent=text;t.classList.add('show');clearTimeout(toastId);toastId=setTimeout(()=>t.classList.remove('show'),2800);}
function sound(freq=480,dur=.07){if(!soundOn)return;try{const AC=window.AudioContext||window.webkitAudioContext;audioCtx=audioCtx||new AC();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.type='sine';o.frequency.setValueAtTime(freq,audioCtx.currentTime);g.gain.setValueAtTime(.03,audioCtx.currentTime);g.gain.exponentialRampToValueAtTime(.001,audioCtx.currentTime+dur);o.connect(g);g.connect(audioCtx.destination);o.start();o.stop(audioCtx.currentTime+dur);}catch(e){}}
let ambientOscs=[];let ambientTimer=null;let ambientMode='';
function stopAmbient(){try{ambientOscs.forEach(x=>{x.o.stop();x.g.disconnect();x.o.disconnect();});}catch(e){} ambientOscs=[];if(ambientTimer){clearInterval(ambientTimer);ambientTimer=null;}}
function addDrone(freq=.0,vol=.01,type='sine'){if(!soundOn)return;try{const AC=window.AudioContext||window.webkitAudioContext;audioCtx=audioCtx||new AC();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.type=type;o.frequency.value=freq;g.gain.value=vol;o.connect(g);g.connect(audioCtx.destination);o.start();ambientOscs.push({o,g});}catch(e){}}
function setAmbient(mode='meeting'){ambientMode=mode;stopAmbient();syncBackgroundMusic();}

const SFX_ASSETS={
  click:'assets/audio/sfx/sfx_click.ogg',
  clue:'assets/audio/sfx/sfx_clue.ogg',
  error:'assets/audio/sfx/sfx_error.ogg',
  invite:'assets/audio/sfx/sfx_invite.ogg',
  storm:'assets/audio/sfx/sfx_storm.ogg',
  success:'assets/audio/sfx/sfx_success.ogg',
  turn:'assets/audio/sfx/sfx_turn.ogg'
};
let musicOn=true, musicStarted=false, musicVolume=.45, currentMusic='';
const MUSIC={day:document.getElementById('music_day'),tension:document.getElementById('music_tension')};
for(const m of Object.values(MUSIC)){m.volume=musicVolume*.75;}
function syncBackgroundMusic(){
 const key=ambientMode==='crisis'?'tension':'day';
 if(!musicOn||!musicStarted){for(const m of Object.values(MUSIC))m.pause();return;}
 for(const [k,m] of Object.entries(MUSIC)){if(k!==key){m.pause();m.currentTime=0;}}
 const active=MUSIC[key];active.volume=musicVolume*.75;
 if(active.paused){const p=active.play();if(p&&p.catch)p.catch(()=>{});}
 currentMusic=key;
}
function unlockMusic(){musicStarted=true;syncBackgroundMusic();}
function updateAudioButtons(){
 const music=document.getElementById('musicToggle');const sfx=document.getElementById('soundToggle');
 music.textContent=musicOn?'♫ Nhạc: Bật':'♫ Nhạc: Tắt';music.setAttribute('aria-pressed',String(musicOn));
 sfx.textContent=soundOn?'🔊 Hiệu ứng':'🔇 Hiệu ứng';sfx.setAttribute('aria-pressed',String(soundOn));
}
function playSfx(key, volume=.6){
 if(!soundOn||!SFX_ASSETS[key])return;
 try{const a=new Audio(SFX_ASSETS[key]);a.volume=Math.max(0,Math.min(1,volume));a.play().catch(()=>{});}catch(e){}
}
function initAudioControls(){
 document.getElementById('musicToggle').addEventListener('click',()=>{musicOn=!musicOn;musicStarted=true;syncBackgroundMusic();updateAudioButtons();});
 document.getElementById('musicVol').addEventListener('input',e=>{musicVolume=+e.target.value/100;for(const m of Object.values(MUSIC))m.volume=musicVolume*.75;});
 updateAudioButtons();
 document.addEventListener('visibilitychange',()=>{if(document.hidden){for(const m of Object.values(MUSIC))m.pause();}else syncBackgroundMusic();});
}
initAudioControls();

function pulsePortrait(id,mood='normal'){const el=$(id);if(!el)return;el.classList.remove('talking','blinking','tense');void el.offsetWidth;el.classList.add('talking');if(['thinking','worried','confused'].includes(mood))el.classList.add('blinking');if(['angry','stressed'].includes(mood))el.classList.add('tense');setTimeout(()=>el.classList.remove('talking'),520);setTimeout(()=>el.classList.remove('blinking','tense'),1800);}
function setAtmosphere(mode='meeting'){document.body.dataset.atmo=(mode==='map'?'field':mode);setAmbient(mode==='map'?'field':mode);}
function rememberStage(){document.body.dataset.stage=state.presentMode?'present':'full';}

function show(id){scene=id;document.querySelectorAll('main.screens>section').forEach(e=>e.classList.toggle('active',e.id===id));if(id==='world'){syncAvatar();updateWalkUI();}else{mapWalking.target=null;mapWalking.keys.clear();}const labels={home:'CHƯƠNG 0 · KHỞI ĐẦU',story:'CHƯƠNG 1 · TAN VỠ',world:'CHƯƠNG 2 · KHÁM PHÁ',explore:'CHƯƠNG 2 · ĐIỀU TRA',board:'CHƯƠNG 3 · SỰ THẬT',invite:'CHƯƠNG 3.5 · MỜI HỌP',hall:'CHƯƠNG 4 · ĐÀM PHÁN',ending:'CHƯƠNG 5 · KẾT THÚC'};$('progressBadge').textContent=labels[id];save();scrollTo({top:0,behavior:'instant'});}
function reset(){state=initialState();storyPos=0;$('resumeBtn').hidden=true;show('home');notify('Đã bắt đầu hành trình mới.');}
function begin(){state=initialState();state.mode=$('demoMode').checked?'demo':'full';storyPos=0;renderStory();show('story');}
function resume(){state=load()||initialState();state.mapPos=state.mapPos||{x:50,y:56};state.sideQuests=state.sideQuests||{water:false,dock:false};state.npcTalk=state.npcTalk||{field:0,coop:0,factory:0};if(!state.minis)state.minis={field:false,coop:false,factory:false};if(!state.invited)state.invited={bay:false,sen:false,khoa:false};ensureV7();storyPos=state.storyPos||0;switch(state.stage){case'story':renderStory();show('story');break;case'explore':activePlace=state.activePlace||'field';renderExplore(activePlace);show('explore');break;case'board':renderBoard();show('board');break;case'invite':renderInvitations();show('invite');break;case'hall':renderHall();show('hall');break;case'ending':renderEnding();show('ending');break;case'home':show('home');break;default:renderWorld();show('world');}}
function storySequence(){return state.mode==='demo'?[0,2,4,5,7,8,9]:STORY.map((_,i)=>i);} 
function activeStory(){return STORY[storySequence()[Math.min(storyPos,storySequence().length-1)]];} 
function renderStory(){const s=activeStory();$('storyBg').src=sceneSrc(s.bg);$('storyFace').src=portrait(s.face,s.mood);$('storyTime').textContent=s.time;$('storyName').textContent=s.name;$('storyRole').textContent=s.role;$('storySpeaker').textContent=s.name;$('storyText').textContent=s.text;$('nextStory').textContent=storyPos===storySequence().length-1?'Bắt đầu khám phá →':'Tiếp tục →';$('storyDots').innerHTML=storySequence().map((_,i)=>`<span class="${i<=storyPos?'done':''}"></span>`).join('');setAtmosphere(s.bg==='meeting'&&s.time.includes('ĐỔ VỠ')?'crisis':s.bg);pulsePortrait('storyFace',s.mood);const chat=$('phoneChat');if(chat){const breakup=s.time.includes('ĐỔ VỠ');chat.classList.toggle('show',breakup);chat.innerHTML=breakup?'<b>📱 NHÓM CHAT: CÙNG NHAU PHÁT TÀI</b><div class="chatLine exit">Chú Bảy đã rời nhóm.</div><div class="chatLine exit">Anh Khoa đã rời nhóm.</div><div class="chatLine">Chị Sen đã tắt thông báo.</div><div class="chatLine">Cá Bống: ...ủa?</div>':'';}save();}
function nextStory(){sound(530);playSfx('turn',.55);if(++storyPos>=storySequence().length){state.intro=true;renderWorld();show('world');return;}renderStory();}
function allDone(){return Object.values(state.done).every(Boolean)}
function renderWorld(){let total=Object.values(state.done).filter(Boolean).length;$('mapCount').textContent=`${total} / 3 địa điểm hoàn thành`;$('mapGoal').textContent=allDone()?'Đủ chứng cứ! Phòng đối thoại đã mở. Hãy ghép các manh mối và mời ba bên quay lại.':state.mode==='demo'?'Chế độ trình chiếu: mỗi khu vực đã có sẵn hai chứng cứ nền. Hãy tìm tài liệu chủ chốt và hoàn thành thử thách.':'Đến gần ba địa điểm bằng WASD hoặc nhấp để đi. Tìm chứng cứ và nói chuyện với từng người; nhiệm vụ phụ giúp chuẩn bị ứng phó rủi ro.';document.querySelectorAll('[data-go]').forEach(btn=>{if(btn.dataset.go==='water'||btn.dataset.go==='dock'){btn.classList.toggle('done',!!state.sideQuests?.[btn.dataset.go]);return;}if(btn.dataset.go==='hall'){btn.disabled=!allDone();btn.classList.toggle('lock',!allDone());btn.textContent=allDone()?'🤝 Phòng đối thoại':'🔒 Phòng đối thoại';}else{btn.classList.toggle('done',state.done[btn.dataset.go]);btn.textContent=`${SCENES[btn.dataset.go].icon} ${SCENES[btn.dataset.go].name.split(' ').slice(0,2).join(' ')} ${state.done[btn.dataset.go]?'✓':''}`;}});$('questSummary').textContent=`Nhiệm vụ phụ: ${Object.values(state.sideQuests||{}).filter(Boolean).length} / 2 · ${state.sideQuests?.water?'✓ Trạm nước  ':''}${state.sideQuests?.dock?'✓ Bến giao hàng':''}`;$('inventory').innerHTML=Object.keys(SCENES).flatMap(k=>SCENES[k].hotspots.map(h=>`<div class="docChip ${state.found[k].includes(h.id)?'':'off'}">${state.found[k].includes(h.id)?h.icon:'🔒'}<br>${esc(h.name)}</div>`)).join('');}
function enterPlace(key){activePlace=key;if(state.mode==='demo'&&state.found[key].length===0){const primary={field:'field_buyer',coop:'coop_fees',factory:'factory_quality'}[key];state.found[key]=SCENES[key].hotspots.filter(h=>h.id!==primary).map(h=>h.id);save();}renderExplore(key);show('explore');}

const MINI_LOTS=[{id:'A',quality:'13,5%',qr:'Có',eligible:true},{id:'B',quality:'15,2%',qr:'Có',eligible:false},{id:'C',quality:'13,8%',qr:'Có',eligible:true},{id:'D',quality:'13,1%',qr:'Thiếu',eligible:false}];
function miniMarkup(key){
 const flag=state.minis[key];
 if(flag)return `<div class="miniGame"><div class="miniHead"><h3>🎖️ Mini-game hoàn thành</h3><span class="miniTag">ĐÃ GIẢI</span></div><p>Bạn đã kiểm tra hồ sơ và có căn cứ trao đổi với ${SCENES[key].character}.</p></div>`;
 if(key==='field')return `<div class="miniGame"><div class="miniHead"><h3>🌾 Mini-game: Chốt khoảng giá có thể thương lượng</h3><span class="miniTag">1/3</span></div><p><b>Số liệu giả định:</b> chi phí nông dân 70 điểm, cần ít nhất 10 điểm phần dư; doanh nghiệp có thể trả tối đa 95 điểm. Kéo mức giá mà hai bên có thể tiếp tục bàn bạc.</p><label for="priceSlider">Giá đề xuất: <strong id="priceNum">82</strong> điểm</label><input id="priceSlider" type="range" min="65" max="105" value="82" step="1"><div class="miniFacts"><span>Chi phí: 70</span><span>Mức nông dân mong đợi: ≥80</span><span>Trần doanh nghiệp: 95</span></div><div class="miniResult" id="miniResult">Chú Bảy: cần bù chi phí • Anh Khoa: cần còn biên chế biến.</div><button class="miniButton" id="miniCheck">Gửi mức giá để hai bên xem xét</button></div>`;
 if(key==='coop')return `<div class="miniGame"><div class="miniHead"><h3>🏘️ Mini-game: Đối chiếu phí dịch vụ</h3><span class="miniTag">2/3</span></div><p>Ghép từng dịch vụ với <b>chứng từ xác minh</b>. Không mặc định bên nào phải trả: trách nhiệm thanh toán sẽ được đàm phán sau.</p>${[['Kho bảo quản','warehouse'],['Lấy mẫu kiểm định','test'],['Truy xuất nguồn gốc','trace']].map(([t,k])=>`<div class="miniRow"><label for="match_${k}">${t}</label><select id="match_${k}"><option value="">Chọn chứng từ</option><option value="warehouse">Phiếu nhập/xuất kho</option><option value="test">Biên bản lấy mẫu</option><option value="trace">Nhật ký truy xuất QR</option></select></div>`).join('')}<div class="miniResult" id="miniResult">Minh bạch chi phí là tiền đề để các bên phân chia trách nhiệm.</div><button class="miniButton" id="miniCheck">Kiểm tra bộ chứng từ</button></div>`;
 return `<div class="miniGame"><div class="miniHead"><h3>🏭 Mini-game: Chọn lô nguyên liệu đạt yêu cầu</h3><span class="miniTag">3/3</span></div><p><b>Quy tắc giả định trong hợp đồng:</b> độ ẩm không quá 14,0% và có dữ liệu truy xuất. Nhấn chọn các lô đủ điều kiện, các lô khác cần xử lý/kiểm tra bổ sung.</p><div class="miniRow">${MINI_LOTS.map(l=>`<button type="button" class="miniLot" data-lot="${l.id}" aria-pressed="false"><strong>Lô ${l.id}</strong><small>Ẩm: ${l.quality} · QR: ${l.qr}</small></button>`).join('')}</div><div class="miniResult" id="miniResult">Anh Khoa: “Chất lượng phải được xác minh bằng tiêu chí đã thống nhất.”</div><button class="miniButton" id="miniCheck">Chốt các lô đạt yêu cầu</button></div>`;
}
function setupMini(key){
 const el=$('miniGameArea');el.innerHTML=miniMarkup(key);
 if(state.minis[key])return;
 el.querySelector('#miniCheck').addEventListener('click',()=>checkMini(key));
 if(key==='field'){
   let slider=el.querySelector('#priceSlider');let update=()=>{let v=+slider.value;el.querySelector('#priceNum').textContent=v;el.querySelector('#miniResult').textContent=v<80?'Nông dân: mức này chưa trang trải được chi phí và phần thu nhập tối thiểu theo giả định.':v>95?'Doanh nghiệp: mức này vượt trần ngân sách thu mua giả định.':'Cả hai có thể cân nhắc mức này, nhưng còn phải thỏa thuận chất lượng và rủi ro.';};slider.addEventListener('input',update);update();
 }
 if(key==='factory')el.querySelectorAll('[data-lot]').forEach(b=>b.addEventListener('click',()=>{let active=b.getAttribute('aria-pressed')==='true';b.setAttribute('aria-pressed',String(!active));b.classList.toggle('selected',!active);sound(500,.045);}));
}
function checkMini(key){
 const root=$('miniGameArea');let success=false,why='';
 if(key==='field'){
  let v=+root.querySelector('#priceSlider').value;success=v>=80&&v<=95;
  why=success?'Cả hai thấy mức giá có thể tiếp tục thương lượng. Giá cuối còn cần gắn với chất lượng, phí và rủi ro.':'Giá phải vừa cho người sản xuất có cơ hội bù đắp chi phí, vừa không đẩy bên mua vào một mức không thể thực hiện.';
 }else if(key==='coop'){
   success=['warehouse','test','trace'].every(k=>root.querySelector('#match_'+k).value===k);
   why=success?'Đã có chứng từ chứng minh ba dịch vụ phát sinh. Trách nhiệm thanh toán cần ghi rõ trong phụ lục.':'Cần kiểm tra đúng loại chứng từ cho từng dịch vụ. Không được tự áp toàn bộ chi phí lên một bên.';
 }else{
   let picked=[...root.querySelectorAll('[data-lot][aria-pressed="true"]')].map(x=>x.dataset.lot).sort().join(',');
   success=picked==='A,C';why=success?'Đã tách được các lô đáp ứng tiêu chí hợp đồng giả định. Các lô còn lại phải xử lý/kiểm định lại, không tự động quy lỗi cho một bên.':'Kiểm tra cả độ ẩm và truy xuất nguồn gốc; đủ một tiêu chí vẫn chưa chắc đủ điều kiện.';
 }
 const box=root.querySelector('#miniResult');box.textContent=why;box.className='miniResult '+(success?'good':'bad');
 if(success){state.minis[key]=true;$('finishPlace').disabled=false;$('npcFace').src=portrait(SCENES[key].person,'relieved');$('npcLine').textContent=`“Cảm ơn Minh An. Giờ tôi có bằng chứng rõ ràng hơn để trao đổi với hai bên.”`;$('exploreHint').textContent='✅ Đã hoàn thành thử thách. Bạn có thể kết thúc điều tra tại đây.';root.querySelector('#miniCheck').disabled=true;notify('Đã hoàn thành mini-game • thêm căn cứ thương lượng');soundCue('solve');save();}
 else soundCue('error');
}
function renderExplore(key){const d=SCENES[key],found=state.found[key];const mood=found.length===3?'relieved':found.length===2?'thinking':found.length===0?'stressed':'worried';$('exploreTitle').textContent=`${d.icon} ${d.name.toUpperCase()}`;$('exploreBg').src=sceneSrc(d.bg);$('npcName').textContent=d.character;$('npcJob').textContent=d.job;$('npcFace').src=portrait(d.person,mood);$('npcLine').textContent=found.length===0?d.line:found.length===3?`“Ừ, giờ bạn đã hiểu lý do tôi lo rồi. Mong là mọi người chịu ngồi lại nói chuyện cho rõ.”`:`“Bạn cứ tìm thêm bằng chứng đi. Chuyện này không chỉ là ai muốn có lời nhiều hơn.”`;setAtmosphere(d.bg);pulsePortrait('npcFace',mood);$('hotspots').innerHTML=d.hotspots.map(h=>`<button class="spot ${found.includes(h.id)?'done':''}" data-clue="${h.id}" style="left:${h.x}%;top:${h.y}%" aria-label="${esc(h.name)}">${found.includes(h.id)?'✓':h.icon} ${esc(h.name)}</button>`).join('');$('localClues').innerHTML=d.hotspots.map(h=>`<div class="clueSquare ${found.includes(h.id)?'got':''}"><i>${found.includes(h.id)?h.icon:'🔒'}</i>${esc(h.name)}</div>`).join('');$('exploreHint').textContent=found.length===3?(state.minis[key]?'✅ Có đủ chứng cứ và đã giải thử thách.':'🎲 Đã đủ chứng cứ: hoàn thành mini-game để thuyết phục nhân vật.'):`💡 Đã tìm thấy ${found.length}/3 chứng cứ. Nhấn các điểm sáng trong cảnh.`;$('finishPlace').disabled=found.length!==3||!state.minis[key];$('miniGameArea').innerHTML=found.length===3?'':'<div class="miniGame"><h3>🔒 Thử thách chưa mở</h3><p>Thu thập đủ 3 chứng cứ để được xử lý một vấn đề thực tế tại địa điểm này.</p></div>';if(found.length===3)setupMini(key);document.querySelectorAll('[data-clue]').forEach(el=>el.addEventListener('click',()=>openClue(el.dataset.clue)));}
function openClue(id){const d=SCENES[activePlace],h=d.hotspots.find(x=>x.id===id);$('modalEmoji').innerHTML=`<img class="character-portrait character-portrait--modal" src="${portrait(d.person,h.mood)}" alt="${esc(d.character)}">`;$('modalTitle').textContent=h.name;$('modalText').textContent=h.details;$('modalLesson').textContent=h.lesson;$('clueModal').classList.add('show');$('clueModal').dataset.clue=id;$('npcFace').src=portrait(d.person,h.mood);pulsePortrait('npcFace',h.mood);sound(650);}
function takeClue(){const id=$('clueModal').dataset.clue;const arr=state.found[activePlace];if(!arr.includes(id)){arr.push(id);sound(820,.16);notify('Đã cất chứng cứ vào hồ sơ.');playSfx('clue',.65);}renderExplore(activePlace);save();/* Keep overlay until current click has fully dispatched, avoiding click-through onto hotspots. */setTimeout(closeClue,90);}
function closeClue(){$('clueModal').classList.remove('show')}
function talkToNPC(){const d=SCENES[activePlace];if(!d)return;state.npcTalk=state.npcTalk||{field:0,coop:0,factory:0};const lines={field:[['worried','“Hệ thống cảm biến giúp theo dõi nước, nhưng chi phí đầu tư vẫn phải tính vào vụ mùa.”'],['thinking','“Tui không muốn ai chịu lỗ hết. Chỉ mong có cách xác định giá và chia rủi ro rõ ràng.”'],['relieved','“Có hồ sơ cụ thể rồi, tui chịu ngồi xuống bàn chứ không cần hứa suông.”']],coop:[['stressed','“HTX đã lo kho, kiểm định, truy xuất. Để trống phí dịch vụ thì sau này ai cũng đổ qua tui.”'],['thinking','“Phải có sổ phí và quy trình rõ. Bảo vệ nông dân không có nghĩa là HTX làm việc miễn phí.”'],['relieved','“Nếu nghĩa vụ minh bạch thì HTX mới liên kết lâu dài được.”']],factory:[['worried','“Dây chuyền không có nguyên liệu đạt chuẩn, đơn hàng của công ty có thể bị trễ.”'],['thinking','“Thỏa thuận giá phải đi cùng tiêu chuẩn đo được, và cách xử lý hàng không đạt.”'],['relieved','“Nếu tiêu chuẩn rõ thì doanh nghiệp cũng dễ tính kế hoạch thu mua.”']]};let count=state.npcTalk[activePlace]||0;let msg=lines[activePlace][count%3];state.npcTalk[activePlace]=count+1;$('npcLine').textContent=msg[1];$('npcFace').src=portrait(d.person,msg[0]);pulsePortrait('npcFace',msg[0]);sound(575,.055);save();}
function completePlace(){if(state.found[activePlace].length<3||!state.minis[activePlace])return;state.done[activePlace]=true;sound(750,.15);notify(`${SCENES[activePlace].character} đã chia sẻ đủ thông tin.`);renderWorld();show('world');}
function renderBoard(){selectedEvidence=null;renderEvidence();renderSlots();$('enterHall').disabled=!ISSUES.every(x=>state.board[x.id]===x.clue);$('boardMsg').textContent='Chọn chứng cứ và đặt vào nút thắt tương ứng.';$('boardMsg').className='message';}
function renderEvidence(){$('keyEvidence').innerHTML=KEY_CLUES.map(c=>{let used=Object.values(state.board).includes(c.id);return `<button class="evidenceTile ${selectedEvidence===c.id?'selected':''} ${used?'used':''}" data-evidence="${c.id}" draggable="${!used}" ${used?'disabled':''}><span class="sym">${c.icon}</span><span><b>${esc(c.title)}</b><span class="small muted">${esc(c.info)}</span></span></button>`}).join('');document.querySelectorAll('[data-evidence]').forEach(el=>{el.addEventListener('click',()=>{selectedEvidence=el.dataset.evidence;renderEvidence();notify('Đã chọn chứng cứ. Nhấn vào một nút thắt ở cột bên phải.');});el.addEventListener('dragstart',e=>{selectedEvidence=el.dataset.evidence;e.dataTransfer.setData('text/plain',selectedEvidence);});});}
function renderSlots(){$('issueSlots').innerHTML=ISSUES.map(s=>{let clue=KEY_CLUES.find(k=>k.id===state.board[s.id]);return `<button class="slot ${clue?'filled':''}" data-slot="${s.id}"><strong>${esc(s.title)}</strong><span>${clue?`${clue.icon} ${clue.title} ✓`:esc(s.desc)}</span></button>`}).join('');document.querySelectorAll('[data-slot]').forEach(el=>{el.addEventListener('click',()=>fillSlot(el.dataset.slot));el.addEventListener('dragover',e=>e.preventDefault());el.addEventListener('drop',e=>{e.preventDefault();selectedEvidence=e.dataTransfer.getData('text/plain')||selectedEvidence;fillSlot(el.dataset.slot);});});}
function fillSlot(id){const slot=ISSUES.find(s=>s.id===id);if(!selectedEvidence){notify('Hãy chọn chứng cứ ở bên trái trước.');return;}if(slot.clue!==selectedEvidence){$('boardMsg').className='message danger';$('boardMsg').textContent='Chưa khớp: thử tìm mối liên hệ trực tiếp hơn giữa chứng cứ và nút thắt.';sound(220);return;}state.board[id]=selectedEvidence;selectedEvidence=null;renderEvidence();renderSlots();sound(800,.14);let count=Object.keys(state.board).length;$('boardMsg').className='message success';$('boardMsg').textContent=`Đã làm rõ ${count}/3 nút thắt. ${count===3?'Bạn có thể đưa các bên trở lại bàn đàm phán.':''}`;$('enterHall').disabled=count!==3;save();}

/* V4 invitation chapter: evidence-grounded reasons to resume dialogue. */
const INVITE_PEOPLE=[
 {id:'bay',char:'chu_bay',name:'Chú Bảy',job:'Nông dân',proof:'field_buyer',concern:'“Giá cả chưa rõ, tui có quay lại thì lỡ bị ép giá nữa sao?”',success:'“Có phiếu thu mua làm căn cứ thì mới nói chuyện được. Tui quay lại, nhưng phải bàn rõ giá và thưởng chất lượng!”',wrong:'“Tờ này không giải quyết nỗi lo về giá thu mua của tui. Bạn xem lại hợp đồng đi!”',lesson:'Bảo vệ lợi ích hợp pháp của người sản xuất bằng các điều kiện giao dịch minh bạch.'},
 {id:'sen',char:'chi_sen',name:'Chị Sen',job:'Hợp tác xã',proof:'coop_fees',concern:'“HTX không thể đứng ra điều phối nếu chẳng ai chịu thống nhất phí dịch vụ.”',success:'“Có sổ phí cụ thể thì sẽ phân trách nhiệm được. Tôi đồng ý tới, miễn mọi khoản phải minh bạch!”',wrong:'“Tôi cần bằng chứng về chi phí HTX đang phải gánh. Cái này chưa đúng chỗ.”',lesson:'Tạo môi trường hợp tác công bằng và minh bạch giữa các chủ thể.'},
 {id:'khoa',char:'anh_khoa',name:'Anh Khoa',job:'Doanh nghiệp',proof:'factory_quality',concern:'“Không có chuẩn kiểm định cụ thể thì tôi chưa biết nhận lô hàng nào.”',success:'“Bảng tiêu chuẩn làm rõ điều phải kiểm định. Tôi tới họp, nhưng phải thống nhất quy trình đánh giá chất lượng.”',wrong:'“Cần căn cứ về chất lượng lô hàng chứ không phải một lời hứa chung chung.”',lesson:'Điều hòa lợi ích bằng quy định rõ và cơ chế giải quyết bất đồng chất lượng.'}
];
function inviteReady(){return INVITE_PEOPLE.every(p=>state.invited?.[p.id]);}
function renderInvitations(){
 if(!state.invited)state.invited={bay:false,sen:false,khoa:false};
 const clues=Object.keys(SCENES).flatMap(k=>SCENES[k].hotspots);
 $('inviteDeck').innerHTML=clues.map(h=>{const selected=state.inviteSelection===h.id;return `<button class="inviteDoc ${selected?'selected':''}" data-invite-clue="${h.id}" aria-pressed="${selected}"><span class="ico">${h.icon}</span><b>${esc(h.name)}</b><small>${esc(h.lesson.slice(0,85))}</small></button>`}).join('');
 document.querySelectorAll('[data-invite-clue]').forEach(el=>el.addEventListener('click',()=>{state.inviteSelection=el.dataset.inviteClue;renderInvitations();$('inviteSelected').textContent='Đã chọn: '+clues.find(c=>c.id===state.inviteSelection).name+'. Hãy đưa chứng cứ này tới người phù hợp.';sound(560,.06);save();}));
 $('invitePeople').innerHTML=INVITE_PEOPLE.map(p=>{const accepted=state.invited[p.id],mood=accepted?'relieved':'stressed';return `<div class="invitePerson ${accepted?'accepted':''}"><img class="character-portrait character-portrait--invite" src="${portrait(p.char,mood)}" alt="${p.name} – ${accepted?'nhẹ nhõm':'căng thẳng'}"><h3>${p.name}</h3><div class="heart">${accepted?'✅ Đã nhận lời':'🗣️ Còn băn khoăn'}</div><p>${esc(accepted?p.success:p.concern)}</p><button type="button" data-invite-person="${p.id}" ${accepted?'disabled':''}>${accepted?'✓ Sẽ đến họp':'Đưa chứng cứ & mời họp'}</button></div>`}).join('');
 document.querySelectorAll('[data-invite-person]').forEach(el=>el.addEventListener('click',()=>convincePerson(el.dataset.invitePerson)));
 $('inviteProgress').textContent=INVITE_PEOPLE.filter(p=>state.invited[p.id]).length+' / 3 người đồng ý';
 $('inviteProceed').disabled=!inviteReady();
 $('inviteSelected').textContent=state.inviteSelection?'Đã chọn: '+(clues.find(c=>c.id===state.inviteSelection)?.name||'')+'. Hãy đưa cho nhân vật phù hợp.':'Chọn một chứng cứ bên trái trước khi mời nhân vật.';
}
function convincePerson(personId){
 const p=INVITE_PEOPLE.find(x=>x.id===personId); if(!p||state.invited[p.id])return;
 const target=$('inviteMessage');
 if(!state.inviteSelection){target.className='inviteMessage danger';target.textContent='🐟 Cá Bống: “Định đi mời họp tay không thiệt hả? Chọn một chứng cứ trước!”';soundCue('error');return;}
 if(state.inviteSelection!==p.proof){target.className='inviteMessage danger';target.textContent=p.name+': '+p.wrong;soundCue('error');return;}
 state.invited[p.id]=true;state.inviteSelection=null;renderInvitations();target.className='inviteMessage success';target.textContent=p.name+': '+p.success+' • Kiến thức MLN122: '+p.lesson;soundCue('solve');save();
}
function enterHallFromInvitation(){if(!inviteReady())return;renderHall();show('hall');soundCue('solve');}
/* Interactive case journal and chapter hints */
const JOURNAL_HINTS={home:'Bắt đầu câu chuyện để hiểu vì sao ba bên từ hợp tác trở thành bất đồng.',story:'Đọc hành động của từng bên: mỗi bên đều có lợi ích chính đáng, nhưng điều kiện hợp tác đang thiếu rõ ràng.',world:'Ở mỗi địa điểm hãy tìm ba vật thể và giải một mini-game. Cần đủ ba bộ hồ sơ mới có thể kết nối chứng cứ.',explore:'Quan sát cảnh và bấm vào các điểm có biểu tượng. Chứng cứ được lưu sau khi bạn chọn “Cất vào hồ sơ”.',board:'Dùng Phiếu thu mua cho vấn đề giá; Sổ phí HTX cho trách nhiệm chi phí; Trạm cảm biến cho rủi ro chung.',invite:'Chú Bảy lo về giá; chị Sen lo về phí dịch vụ; anh Khoa lo về tiêu chuẩn. Hãy tìm tài liệu xác thực nỗi lo của từng người.',hall:'Hãy nhìn phản ứng của cả ba, không chỉ xem một bên được lợi. Thỏa thuận có thể điều chỉnh trước biến cố nước mặn.',ending:'Bạn có thể chơi lại để thử cách ứng phó khác, đối chiếu những vấn đề đã được tháo gỡ và những vấn đề còn tồn tại.'};
function renderJournal(){
 const found=state.found||{field:[],coop:[],factory:[]};const total=Object.values(found).reduce((n,v)=>n+(v?.length||0),0);
 const doneCount=Object.values(state.done||{}).filter(Boolean).length;const sideCount=Object.values(state.sideQuests||{}).filter(Boolean).length;
 $('journalMission').innerHTML=`<b>Nhiệm vụ hiện tại:</b> ${esc(JOURNAL_HINTS[scene]||JOURNAL_HINTS.home)}<br><small>Đã thu thập ${total}/9 chứng cứ • Hoàn thành ${doneCount}/3 địa điểm • Mời họp ${INVITE_PEOPLE.filter(p=>state.invited?.[p.id]).length}/3 người • Nhiệm vụ phụ ${sideCount}/2</small>`;
 $('journalProgress').innerHTML=`<div class="journalProgress">${['🌱 Hợp tác rồi tan vỡ','🔎 Khám phá ba địa điểm','🧩 Kết nối 3 nút thắt','💌 Mời ba bên trở lại','🤝 Sửa điều khoản hợp tác','🌊 Thử thách nước mặn','📡 Trạm cảnh báo nước','🚤 Bến giao hàng'].map((x,i)=>{const complete=[state.intro,doneCount===3,Object.keys(state.board||{}).length===3,inviteReady(),Object.keys(state.policies||{}).length===3,!!state.crisis,!!state.sideQuests?.water,!!state.sideQuests?.dock][i];return `<div class="journalItem">${complete?'✅':'○'} ${x}</div>`}).join('')}</div>`;
 const all=Object.keys(SCENES).flatMap(k=>SCENES[k].hotspots.map(h=>({h,k})));
 $('journalClues').innerHTML=all.map(({h,k})=>{const yes=found[k]?.includes(h.id);return `<div class="journalClue ${yes?'':'missing'}">${yes?h.icon:'🔒'} ${yes?esc(h.name):'Chưa tìm thấy'}</div>`}).join('');
 $('journalLearning').innerHTML=`<div class="learnItem">🌾 <b>Lợi ích riêng:</b> giá bán, phí dịch vụ, chất lượng và tiến độ.</div><div class="learnItem">🧩 <b>Lợi ích chung:</b> ba bên cần nhau để duy trì chuỗi sản xuất.</div><div class="learnItem">⚖️ <b>Nhà nước:</b> thiết lập khuôn khổ, điều hòa và hỗ trợ xử lý mâu thuẫn.</div>`;
 $('journalHint').textContent=(JOURNAL_HINTS[scene]||JOURNAL_HINTS.home)+(scene==='world'?' Di chuyển bằng WASD hoặc nhấp bản đồ, đến gần điểm đến rồi nhấn E. Hai nhiệm vụ phụ có ích ở giai đoạn biến cố và đàm phán.':'');
}
function openJournal(){renderJournal();$('journalModal').classList.add('show');sound(630,.05);}
function closeJournal(){$('journalModal').classList.remove('show')}

function initialScores(){return [37,39,38];}
const POLICY_REACTIONS={
  fair:{price:'Chú Bảy: “Có giá sàn và thưởng theo kiểm định thì tui yên tâm tính chi phí hơn.” · Anh Khoa: “Giá gắn chất lượng có thể thương lượng.”',fees:'Chị Sen: “Có chứng từ và phân định nghĩa vụ thì HTX mới vận hành nổi.”',risk:'Cả ba: “Nếu nước mặn tăng, có cảnh báo và cơ chế phối hợp thì đỡ bị động.”'},
  fixed:'Anh Khoa: “Giá cao cố định bất kể chất lượng thì tôi không dám cam kết.”',buyer:'Chú Bảy: “Đợi giao hết lúa rồi mới biết giá thì rủi ro quá!”',coop:'Chị Sen: “HTX phải tự gánh mọi khoản là cách nhanh nhất để HTX cạn vốn.”',farmer:'Chú Bảy: “Tui lại chịu toàn bộ phí? Thế thì liên kết để làm gì?”',ignore:'Chị Sen: “Thiên tai mà ai cũng tự lo thì liên kết còn ý nghĩa gì?”',bailout:'Minh An: “Không thể hứa Nhà nước bồi thường vô điều kiện. Trách nhiệm cần đúng căn cứ pháp lý.”'
};
/* v7.1: các công cụ đều có mặt được-mất; hiệu quả phụ thuộc chứng cứ và lựa chọn liên quan. */
const STATE_TOOLS=[
 {id:'rights',icon:'📜',role:'1',title:'Bảo vệ lợi ích hợp pháp và tạo môi trường thuận lợi',context:'Giá và tiêu chuẩn vẫn có điểm chưa được giải thích; quy trình kiểm chứng quan trọng hơn lời hứa.',clue:'Phiếu thu mua / dự thảo / tiêu chuẩn',proofs:['field_buyer','coop_contract','factory_quality'],choices:[
  {id:'document',title:'Bổ sung phụ lục giá, phương pháp lấy mẫu và quyền khiếu nại',desc:'Rõ trách nhiệm; mất thời gian thống nhất và lập văn bản.',delta:[5,5,5],trust:10,society:3,good:true,reply:'Chú Bảy muốn bảo đảm giá; anh Khoa chấp nhận nếu hai bên cùng ký quy trình lấy mẫu.'},
  {id:'independent',title:'Kiểm định bởi đơn vị độc lập trước khi quyết định thanh toán',desc:'Tăng tính khách quan, đổi lại mất phí và có thể chậm giao hàng.',delta:[3,3,-4],trust:9,society:6,good:true,reply:'Chị Sen tin kết quả hơn, nhưng doanh nghiệp đề nghị làm rõ ai chịu phí và hạn trả kết quả.'},
  {id:'template',title:'Dùng mẫu hợp đồng gọn, kiểm định nội bộ HTX theo hồ sơ chung',desc:'Nhanh hơn, chi phí thấp; cơ chế phản đối kết quả cần bổ sung.',delta:[3,2,5],trust:3,society:1,good:false,reply:'Anh Khoa tiết kiệm thời gian, nhưng chú Bảy muốn biết nếu có sai số thì phản đối thế nào.'}
 ]},
 {id:'harmony',icon:'🌱',role:'2',title:'Điều hòa lợi ích',context:'Đầu tư công nghệ, phí HTX và khả năng tiếp cận dịch vụ không giống nhau.',clue:'Sổ đầu tư / sổ phí / mã truy xuất',proofs:['field_cost','coop_fees','coop_trace'],choices:[
  {id:'training',title:'Kết nối tập huấn sử dụng công nghệ và lịch hỗ trợ kỹ thuật công khai',desc:'Giảm thiếu thông tin và rủi ro vận hành; hiệu quả cần thời gian.',delta:[9,5,3],trust:7,society:6,good:true,reply:'Chú Bảy yên tâm hơn; HTX sẽ phải sắp xếp người hướng dẫn và lịch triển khai.'},
  {id:'credit',title:'Giới thiệu tiếp cận vốn/tín dụng phù hợp điều kiện, không hứa cấp ngay',desc:'Có thể giúp đầu tư sớm; người vay vẫn phải trả nợ và đáp ứng điều kiện.',delta:[12,1,4],trust:4,society:3,good:false,reply:'Chú Bảy thích giải pháp vốn, nhưng muốn biết lãi, thời hạn và rủi ro nợ.'},
  {id:'link',title:'Tổ chức cùng mua đầu vào và chia sẻ dịch vụ kỹ thuật qua HTX',desc:'Hiệu quả lâu dài hơn, cần sự tham gia thực chất của thành viên.',delta:[5,11,7],trust:6,society:5,good:true,reply:'Chị Sen ủng hộ, nhưng đòi cơ chế công khai chi phí vận hành chung.'}
 ]},
 {id:'prevent',icon:'📡',role:'3',title:'Kiểm soát, ngăn ngừa tác động tiêu cực',context:'Trạm nước báo độ mặn tăng; lựa chọn cần cân nhắc độ tin cậy, thời gian và chi phí.',clue:'Cảm biến / mã truy xuất / bảng tiêu chuẩn',proofs:['field_sensor','coop_trace','factory_quality'],choices:[
  {id:'targeted',title:'Cảnh báo sớm, kiểm tra theo mức rủi ro và theo dõi vùng bất thường',desc:'Ít trì hoãn hơn kiểm tra toàn bộ, nhưng đòi hỏi dữ liệu đáng tin.',delta:[5,4,5],trust:6,society:12,good:true,reply:'Doanh nghiệp thấy đỡ chậm, nhưng hỏi cách chứng minh vùng được xếp mức rủi ro cao.'},
  {id:'full',title:'Kiểm tra lại toàn bộ lô trước khi giao',desc:'Tăng mức thận trọng; thời gian giao hàng và chi phí kiểm định tăng.',delta:[1,-6,-11],trust:6,society:17,good:true,reply:'HTX tin kết quả nhưng lo chi phí và lịch xe bị kéo dài.'},
  {id:'pause',title:'Hoãn bàn giao, tập trung kiểm soát nguồn nước rồi kiểm định lại',desc:'Ưu tiên kiểm soát sự cố môi trường; nguy cơ mất đơn hàng tăng.',delta:[4,-7,-15],trust:2,society:14,good:false,reply:'Chú Bảy muốn cứu vụ mùa, anh Khoa lo mất khách hàng nếu hoãn quá lâu.'}
 ]},
 {id:'resolve',icon:'🤝',role:'4',title:'Giải quyết mâu thuẫn lợi ích',context:'Sau khi tan rã, các bên cần một cơ chế đối thoại minh bạch và vẫn được tự quyết.',clue:'Phiếu thu mua / dự thảo / sổ phí HTX',proofs:['field_buyer','coop_contract','coop_fees'],choices:[
  {id:'mediate',title:'Đối thoại ba bên, lập biên bản và mốc giải quyết tồn tại',desc:'Chi phí thấp hơn, nhưng phụ thuộc thiện chí và khả năng thực thi.',delta:[6,7,7],trust:12,society:4,good:true,reply:'Chị Sen chịu ký biên bản; chú Bảy yêu cầu thời hạn xử lý khoản phí rõ ràng.'},
  {id:'neutral',title:'Mời bên trung lập hỗ trợ hòa giải và đối chiếu chứng từ',desc:'Dễ tạo niềm tin khi căng thẳng cao; có thể tốn phí và thời gian.',delta:[4,4,4],trust:11,society:4,good:true,reply:'Anh Khoa chấp nhận bên trung lập, nhưng muốn chốt tiến độ trước vụ giao hàng.'},
  {id:'formal',title:'Chuyển tranh chấp chưa thể thống nhất sang cơ chế pháp lý phù hợp',desc:'Bảo vệ quyền yêu cầu xử lý, nhưng kéo dài thời gian và khó phục hồi quan hệ ngay.',delta:[0,-4,-5],trust:3,society:4,good:false,reply:'Không ai bị ép ký; liên kết có thể tạm ngưng cho tới khi tranh chấp được xử lý.'}
 ]}
];
const PROOF_TITLES=Object.fromEntries(Object.values(SCENES).flatMap(d=>d.hotspots.map(h=>[h.id,h.name])));
let hearingWho=0;
function ensureV7(){if(!state.governance||typeof state.governance!=='object')state.governance={};if(!state.govProof||typeof state.govProof!=='object')state.govProof={};if(!Array.isArray(state.decisions))state.decisions=[];}
function governanceComplete(){ensureV7();return STATE_TOOLS.every(t=>state.governance[t.id]&&t.proofs.includes(state.govProof[t.id]));}
function gainFromTool(t){return t.choices.find(c=>c.id===state.governance?.[t.id]);}
function seedDemoNegotiation(){
 ensureV7();if(state.mode!=='demo'||state.preparedDemo)return;
 // Hai điều khoản & hai vai trò được chuẩn bị dựa trên chứng cứ đã khám phá, không phải do game 'chấm đúng'.
 state.policies.price??='fair';state.policies.fees??='fair';
 state.governance.rights??='document';state.govProof.rights??='coop_contract';
 state.governance.harmony??='training';state.govProof.harmony??='field_cost';
 state.preparedDemo=true;save();
}
function effectiveness(){
 let pol=0,gov=0;
 const p=state.policies,g=state.governance||{},quests=state.sideQuests||{};
 if(p.price==='fair'||(p.price==='phased'&&g.rights!=='template'))pol++;
 if(p.fees==='fair'||(p.fees==='upfront'&&g.harmony==='credit')||(p.fees==='deferred'&&g.harmony==='link'))pol++;
 if(p.risk==='fair'||(p.risk==='reserve'&&g.prevent!=='pause'))pol++;
 if(g.rights==='document'||(g.rights==='independent'&&!!state.govProof?.rights))gov++;
 if(g.harmony==='training'||g.harmony==='link'||(g.harmony==='credit'&&p.price==='fair'))gov++;
 if(g.prevent==='targeted'&&(quests.water||state.govProof?.prevent==='field_sensor'))gov++; else if(g.prevent==='full')gov++;
 if(g.resolve==='mediate'||g.resolve==='neutral')gov++;
 return {pol,gov};
}
function evaluate(){
 ensureV7();let vals=initialScores(),trust=30,society=44;
 for(const p of POLICIES){const c=p.choices.find(x=>x.id===state.policies?.[p.id]);if(!c)continue;c.delta.forEach((d,i)=>vals[i]+=d);trust+=c.ok?6:-3;society+=p.id==='risk'&&c.id==='pause'?3:0;}
 if(state.sideQuests?.dock){[2,4,4].forEach((d,i)=>vals[i]+=d);trust+=4;}
 if(state.sideQuests?.water){trust+=4;society+=4;}
 for(const t of STATE_TOOLS){const c=gainFromTool(t);if(!c||!t.proofs.includes(state.govProof[t.id]))continue;c.delta.forEach((d,i)=>vals[i]+=d);trust+=c.trust;society+=c.society;
  if(t.id==='prevent'&&c.id==='targeted'&&!state.sideQuests?.water&&state.govProof?.prevent!=='field_sensor'){trust-=7;society-=7;} // không có dữ liệu xác minh
  if(t.id==='harmony'&&c.id==='credit'&&state.policies.price!=='fair'){trust-=8;} // khó cam kết hoàn trả vốn
  if(t.id==='resolve'&&c.id==='formal'&&state.policies.risk==='pause'){trust-=6;}
 }
 const eff=effectiveness();trust+=Math.max(0,eff.pol-1)*2;
 vals=vals.map(v=>Math.max(0,Math.min(100,v)));
 return {vals,good:eff.pol,govGood:eff.gov,trust:Math.max(0,Math.min(100,trust)),society:Math.max(0,Math.min(100,society)),min:Math.min(...vals)};
}
function moodFor(n){return n>=75?'relieved':n>=59?'thinking':n>=43?'worried':'angry';}
function renderDemoGuide(){
 const el=$('v71Guide');if(!el)return;
 if(state.mode!=='demo'){el.innerHTML='<span>🧭 Chế độ đầy đủ: thử các lựa chọn, nghe phản biện và sử dụng chứng cứ để xây dựng công cụ điều tiết.</span>';return;}
 el.innerHTML=`<div><b>🎤 Bản trình chiếu – 3 lượt quyết định trực tiếp</b><p>Vụ việc đã chuẩn bị 2 điều khoản (giá, phí) và 2 vai trò (pháp lý, điều hòa). Lớp sẽ quyết định <b>rủi ro sản xuất</b>, <b>kiểm soát tác động tiêu cực</b>, rồi <b>giải quyết mâu thuẫn</b>. Cả 4 vai trò Nhà nước vẫn hiển thị.</p></div><button type="button" class="tinyBtn" id="demoExpand">${state.demoExpanded?'Thu gọn mục đã chuẩn bị':'Xem và sửa toàn bộ phương án'}</button>`;
 $('demoExpand').onclick=()=>{state.demoExpanded=!state.demoExpanded;renderHall();save();};
}
function isPrepared(section,id){return state.mode==='demo'&&!state.demoExpanded&&((section==='policy'&&['price','fees'].includes(id))||(section==='gov'&&['rights','harmony'].includes(id)));}
function renderHall(){
 setAtmosphere('meeting');ensureV7();seedDemoNegotiation();renderDemoGuide();const e=evaluate();
 $('stakeholders').innerHTML=CHARS.map(c=>{let v=e.vals[c.idx],reasons=actorReasons(c.idx);let mood=reasons.some(x=>x.type==='warn')?moodFor(Math.min(v,55)):moodFor(v);return `<div class="stake"><img class="character-portrait character-portrait--stake" src="${portrait(c.key,mood)}" alt="${esc(c.name)}"><b>${esc(c.name)}</b><p>${reasons.length?esc(reasons[0].text):'Đang chờ điều khoản để cân nhắc.'}</p><div class="reaction ${reasons.some(x=>x.type==='warn')?'warn':''}">${reasons.some(x=>x.type==='warn')?'⚠ Vẫn còn băn khoăn':'✓ Đang cân nhắc hợp tác'}</div><small class="scenarioNumber">Chỉ số giả lập: ${v}/100</small></div>`;}).join('');
 $('policies').innerHTML=POLICIES.map(p=>{const chosen=p.choices.find(c=>c.id===state.policies[p.id]),prep=isPrepared('policy',p.id);return `<div class="policy ${prep?'v71Prepared':''}"><h3>📌 ${p.title}</h3><small>${esc(p.explain)}</small>${prep?`<div class="preparedLine">📁 Đã chuẩn bị từ hồ sơ: <b>${esc(chosen?.name||'')}</b><p>${esc(chosen?.accept||'')}</p></div>`:`<div class="choices">${p.choices.map(c=>`<button class="choice ${state.policies[p.id]===c.id?'chosen':''}" data-policy="${p.id}" data-pick="${c.id}">${esc(c.name)}<small class="v71Trade">Đánh đổi: ${esc(c.accept)}</small></button>`).join('')}</div>`}</div>`}).join('');
 document.querySelectorAll('[data-policy]').forEach(el=>el.addEventListener('click',()=>pickPolicy(el.dataset.policy,el.dataset.pick)));
 $('agreementItems').innerHTML=POLICIES.map(p=>{const selected=p.choices.find(c=>c.id===state.policies[p.id]);return `<div class="agItem ${selected?'done':''}">${selected?'✅':'⬜'} <b>${p.short}:</b> ${selected?esc(selected.name):'Chưa thống nhất'}</div>`;}).join('');
 $('governanceSection').hidden=POLICIES.some(p=>!state.policies[p.id]);
 renderGovernance();renderHearing();renderImpact();
 $('checkAgreement').disabled=POLICIES.some(p=>!state.policies[p.id])||!governanceComplete();$('saltNews').hidden=$('checkAgreement').disabled;
 const filled=STATE_TOOLS.filter(t=>state.governance[t.id]&&t.proofs.includes(state.govProof[t.id])).length;
 $('agreementReadiness').textContent=filled===4?'Đủ chứng cứ và công cụ cho 4 vai trò. Thử thách độ mặn sẽ kiểm tra tính khả thi.':`Đã lập ${filled}/4 đề xuất có chứng cứ. Chọn chứng cứ rồi chọn biện pháp cho vai trò còn lại.`;
}
function renderGovernance(){
 const root=$('governanceCards');if(!root)return;ensureV7();
 root.innerHTML=STATE_TOOLS.map(t=>{const chosen=gainFromTool(t),proof=state.govProof[t.id],prep=isPrepared('gov',t.id);return `<article class="governanceRole ${chosen?'complete':''} ${prep?'v71Prepared':''}"><div class="govRoleHead"><div><small>VAI TRÒ ${t.role} · MLN122 TRANG 209</small><h4>${t.icon} ${esc(t.title)}</h4></div><span class="govTick">${chosen&&proof?'✓ Có căn cứ':'○ Chưa xong'}</span></div><p>${esc(t.context)}</p>${prep?`<div class="preparedLine">📁 Hồ sơ đã chuẩn bị: <b>${esc(PROOF_TITLES[proof]||'')}</b><p>${esc(chosen?.title||'')}</p></div>`:`<div class="govClue">📁 Chọn tài liệu làm căn cứ (đã điều tra)</div><div class="proofChoices">${t.proofs.map(id=>`<button type="button" class="proofChoice ${proof===id?'selected':''}" data-proof-tool="${t.id}" data-proof-id="${id}">${esc(PROOF_TITLES[id]||id)}</button>`).join('')}</div><div class="govChoices">${t.choices.map(c=>`<button type="button" class="govChoice ${state.governance[t.id]===c.id?'chosen':''}" data-gov="${t.id}" data-gov-pick="${c.id}"><b>${esc(c.title)}</b><small>${esc(c.desc)}</small></button>`).join('')}</div>`}${chosen?`<div class="govResponse"><b>Góc nhìn khác:</b> ${esc(chosen.reply)}</div>`:''}</article>`;}).join('');
 root.querySelectorAll('[data-proof-tool]').forEach(el=>el.addEventListener('click',()=>{state.govProof[el.dataset.proofTool]=el.dataset.proofId;renderHall();notify('Đã gắn chứng cứ '+(PROOF_TITLES[el.dataset.proofId]||''));save();}));
 root.querySelectorAll('[data-gov]').forEach(el=>el.addEventListener('click',()=>pickGovernance(el.dataset.gov,el.dataset.govPick)));
 $('govProgress').textContent=`${STATE_TOOLS.filter(t=>state.governance[t.id]&&t.proofs.includes(state.govProof[t.id])).length}/4 vai trò đã có căn cứ`;
}
function rememberDecision(kind,key,id){ensureV7();const line={kind,key,id,at:state.decisions.length+1};if(state.decisions.length>60)state.decisions.shift();state.decisions.push(line);}
function pickGovernance(toolId,choiceId){
 const t=STATE_TOOLS.find(x=>x.id===toolId),c=t?.choices.find(x=>x.id===choiceId);if(!c)return;
 if(!t.proofs.includes(state.govProof[toolId])){notify('Hãy chọn chứng cứ liên quan trước khi đề xuất biện pháp.');return;}
 const before=evaluate();state.governance[toolId]=choiceId;rememberDecision('governance',toolId,choiceId);const after=evaluate();
 renderHall();$('debateBubble').innerHTML=`<b>${t.icon} ${esc(t.title)}</b><div>${esc(c.reply)}</div><small>Niềm tin mô phỏng: ${before.trust} → ${after.trust}; lợi ích cộng đồng: ${before.society} → ${after.society}. Mặt được-mất phụ thuộc cả các điều khoản trước đó.</small>`;
 sound(650,.09);save();
}
function actorReasons(idx){
 const p=state.policies||{},g=state.governance||{},out=[];
 const warn=text=>out.push({type:'warn',text});const ok=text=>out.push({type:'ok',text});
 if(idx===0){
  if(!p.price)warn('Giá chưa rõ, tôi chưa thể tính thu nhập vụ này.');
  else if(p.price==='phased')warn('Tôi muốn có mức giá tối thiểu, nếu chốt theo thị trường sau kiểm định sẽ biến động.');
  else if(p.price==='fair')ok('Tôi có giá sàn và thưởng chất lượng, có thể tính đường thu hồi vốn.');
  else ok('Giá cao giúp tôi yên tâm, nhưng tôi hiểu doanh nghiệp đang lo đầu ra.');
  if(p.fees==='upfront')warn('Phí đầu vụ lại cần tiền mặt trong lúc tôi vừa vay để mua thiết bị.');
  if(p.risk==='pause')warn('Ngừng giao toàn bộ thì lúa có thể tồn lâu, tôi lo chất lượng giảm.');
  if(g.harmony==='credit')warn('Vốn vay chỉ có ích nếu lãi và thời hạn trả phù hợp.');
  if(g.harmony==='training')ok('Có tập huấn công nghệ thì tôi tự tin sản xuất hơn.');
 } else if(idx===1){
  if(!p.fees)warn('Chưa rõ phí kho, kiểm định và truy xuất do ai trả.');
  if(p.fees==='deferred')warn('HTX ứng phí trước có thể thiếu tiền vận hành giữa vụ.');
  if(p.fees==='fair')ok('Phí dịch vụ được công khai theo chứng từ, tôi có cơ sở giải thích với thành viên.');
  if(p.risk==='pause')warn('Hoãn giao toàn bộ làm kho và lịch điều phối bị đội chi phí.');
  if(g.prevent==='full')warn('Kiểm tra toàn bộ thì phải xác định thêm ai trả phí và chờ mấy ngày.');
  if(g.resolve==='mediate')ok('Có biên bản và mốc thời hạn thì HTX dễ phối hợp hơn.');
 } else {
  if(!p.price)warn('Chưa có cách xác định giá để tính kế hoạch mua hàng.');
  if(p.price==='premium')warn('Giá mua cao cố định trước kiểm định khiến tôi khó đảm bảo biên lợi nhuận.');
  if(p.price==='phased')ok('Giá tham chiếu theo đợt giúp tôi linh hoạt trước biến động.');
  if(p.risk==='pause')warn('Tạm hoãn toàn bộ có thể khiến tôi lỡ lịch giao hàng.');
  if(g.prevent==='full')warn('Kiểm định toàn bộ tăng độ chắc chắn nhưng có thể trễ đơn hàng.');
  if(g.rights==='independent')ok('Kết quả độc lập đáng tin hơn, miễn hạn trả kết quả được ghi rõ.');
  if(g.resolve==='formal')warn('Giải quyết theo thủ tục pháp lý có cơ sở, nhưng có thể quá chậm để giữ đơn hàng này.');
 }
 return out.slice(0,4);
}
function feedbackForActor(idx){return actorReasons(idx).map(x=>(x.type==='warn'?'⚠ ':'✓ ')+x.text).join(' • ')||'Mỗi bên đang cân nhắc quyền lợi và trách nhiệm.';}
function renderHearing(){
 const root=$('hearingPanel');if(!root)return;const e=evaluate(),c=CHARS[hearingWho];const lines=actorReasons(hearingWho);
 root.innerHTML=`<div class="hearingTabs">${CHARS.map((p,i)=>`<button type="button" data-hear="${i}" class="hearingTab ${i===hearingWho?'active':''}">${esc(p.name)}</button>`).join('')}</div><div class="hearingBody"><img class="character-portrait character-portrait--hearing" src="${portrait(c.key,moodFor(e.vals[hearingWho]))}" alt="Biểu cảm ${esc(c.name)}"><div><b>${esc(c.name)}: Nhiều vấn đề cần xem xét</b><ul class="v71Reasons">${lines.map(r=>`<li class="${r.type}">${r.type==='warn'?'⚠':'✓'} ${esc(r.text)}</li>`).join('')}</ul><small>Nhân vật phản ứng theo nhiều điều khoản, không chỉ theo điểm.</small></div></div>`;
 root.querySelectorAll('[data-hear]').forEach(b=>b.addEventListener('click',()=>{hearingWho=Number(b.dataset.hear);renderHearing();sound(510,.04);}));
}
function renderImpact(){
 const root=$('impactPanel');if(!root)return;const e=evaluate();const items=[{name:'Niềm tin giữa các bên',v:e.trust},{name:'Lợi ích cộng đồng / môi trường',v:e.society}];
 root.innerHTML=`<div class="impactBars">${items.map(x=>`<div class="impactItem"><div><b>${x.name}</b><strong>${x.v}/100</strong></div><div class="impactTrack"><i style="width:${x.v}%"></i></div></div>`).join('')}</div><div class="causalTrail"><strong>Tiến độ mô phỏng:</strong> ${e.good}/3 điều khoản khả thi trong bối cảnh, ${e.govGood}/4 công cụ có điều kiện phù hợp. ${e.min<60?'Một bên còn nhiều rủi ro; nghe phản biện để điều chỉnh.':'Các bên có cơ sở tiếp tục bàn bạc; kết quả còn phụ thuộc biến cố.'}</div>`;
}
function renderPolicyReply(p,c){const box=$('debateBubble');box.innerHTML=`<b>💬 Đánh đổi ở điều khoản ${esc(p.short)}</b><div>${esc(c.accept)}</div><small>${esc(feedbackForActor(0))}</small>`;}
function pickPolicy(key,id){const p=POLICIES.find(x=>x.id===key),c=p?.choices.find(x=>x.id===id);if(!c)return;state.policies[key]=id;rememberDecision('policy',key,id);$('advice').textContent=c.accept;renderHall();renderPolicyReply(p,c);sound(600,.1);save();}


const CRISIS_ACTIONS=[
 {id:'verify',label:'🔍 Xác minh mức độ ảnh hưởng và chất lượng lô lúa',order:2},
 {id:'apply',label:'📜 Đối thoại, thực hiện điều khoản và điều chỉnh kế hoạch',order:3},
 {id:'alert',label:'📡 Thông báo cảnh báo đến nông dân, HTX và doanh nghiệp',order:1}
];
let crisisSteps=[];
function soundCue(kind){if(!soundOn)return;playSfx(kind==='solve'?'success':kind==='storm'?'storm':kind==='error'?'error':'click',.65);}
function openCrisis(){
 if(POLICIES.some(p=>!state.policies[p.id])||!governanceComplete()){notify('Hãy hoàn thành 3 điều khoản và 4 công cụ điều phối trước khi thử biến cố.');return;}
 crisisSteps=state.sideQuests?.water?['alert']:[];$('crisisMessage').textContent=state.sideQuests?.water?'📡 Nhờ nhiệm vụ trạm nước, cảnh báo đã được gửi trước. Hãy xác minh dữ liệu rồi bàn cách xử lý.':'Gợi ý: không thể điều chỉnh hợp đồng dựa trên dữ liệu chưa xác minh.';
 $('crisisModal').classList.add('show');renderCrisis();soundCue('storm');
}
function renderCrisis(){
 $('crisisSequence').innerHTML=crisisSteps.length?crisisSteps.map(id=>`<span class="token">${CRISIS_ACTIONS.find(x=>x.id===id).label}</span>`).join('<span>→</span>'):'Chưa có hành động nào';
 $('crisisChoices').innerHTML=CRISIS_ACTIONS.map(a=>`<button type="button" data-action="${a.id}" ${crisisSteps.includes(a.id)?'disabled':''}>${esc(a.label)}</button>`).join('');
 $('crisisChoices').querySelectorAll('[data-action]').forEach(el=>el.addEventListener('click',()=>{crisisSteps.push(el.dataset.action);renderCrisis();sound(560,.06);if(crisisSteps.length===3){const right=crisisSteps.join(',')==='alert,verify,apply';$('crisisMessage').textContent=right?'✅ Có căn cứ phối hợp: báo sớm → kiểm chứng → thực hiện cam kết. Bạn có thể xem kết thúc.':'⚠️ Các bước chưa đúng trình tự. Hãy thử lại: thông tin phải đến các bên trước, sau đó mới xác minh và điều chỉnh.';}}));
 $('crisisCommit').disabled=crisisSteps.length!==3;
}
function resetCrisis(){crisisSteps=state.sideQuests?.water?['alert']:[];$('crisisMessage').textContent='Đã đặt lại. Hãy suy nghĩ về cách xử lý sớm và bảo vệ quyền lợi hợp pháp.';renderCrisis();}
function commitCrisis(){
 const correct=crisisSteps.join(',')==='alert,verify,apply';
 state.crisis=correct?'prepared':'unprepared';$('crisisModal').classList.remove('show');
 if(correct)soundCue('solve');else soundCue('error');finish();
}
function finish(){const e=evaluate();if(POLICIES.some(p=>!state.policies[p.id])||!governanceComplete()){notify('Cần hoàn thành điều khoản và công cụ điều phối trước khi đánh giá.');return;}
 const hardConcerns=CHARS.map((_,i)=>actorReasons(i).filter(x=>x.type==='warn').length);
 const full=e.good>=3&&e.govGood>=3&&e.trust>=60&&e.society>=55&&e.min>=59&&Math.max(...hardConcerns)<=1&&state.crisis==='prepared';
 const partial=e.good>=2&&e.govGood>=2&&e.trust>=39&&e.society>=42&&e.min>=43&&Math.max(...hardConcerns)<=2;
 state.result=full?'A':(partial?'B':'C');renderEnding();show('ending');}
function renderEnding(){setAtmosphere(state.result==='C'?'crisis':'meeting');const result=state.result||'C';const d={A:{badge:'🌱 CÁC BÊN TÌM LẠI TIẾNG NÓI CHUNG',heading:'Cồn Xanh hồi sinh',text:'Ba bên tự nguyện đồng ý với điều khoản minh bạch hơn về giá, chi phí và trách nhiệm khi gặp rủi ro. Họ chưa chắc có lợi nhuận cao nhất, nhưng có thể cùng duy trì chuỗi sản xuất.',mood:'happy'},B:{badge:'🌤️ THỎA THUẬN TỪNG PHẦN',heading:'Một cơ hội mới',text:'Nhiều nút thắt đã được tháo gỡ, nhưng vẫn còn nội dung khiến một bên muốn kiểm tra thêm trước khi ký trọn vẹn. Đối thoại được duy trì, chưa thể coi liên kết đã phục hồi hoàn toàn.',mood:'thinking'},C:{badge:'🌧️ LIÊN KẾT CHƯA THỂ PHỤC HỒI',heading:'Còn đường nào khác?',text:'Một hoặc nhiều bên vẫn thấy mình chịu phần chi phí hoặc rủi ro bất hợp lý. Nhà nước có thể tiếp tục hỗ trợ khuôn khổ và hòa giải, nhưng không thể thay quyền tự quyết của các chủ thể.',mood:'worried'}}[result];$('endingBadge').textContent=d.badge;$('endingHeading').textContent=d.heading;$('endingNarrative').textContent=d.text;$('endFaces').innerHTML=CHARS.map(c=>`<img class="character-portrait character-portrait--ending" src="${portrait(c.key,d.mood)}" alt="${esc(c.name)}">`).join('');const e=evaluate();$('endingReport').innerHTML=`<p><b>Đã thu thập:</b> 9/9 chứng cứ và xác định 3 nút thắt.</p><p><b>Đã mời trở lại:</b> ${INVITE_PEOPLE.filter(p=>state.invited?.[p.id]).length}/3 người.</p><p><b>Điều khoản khả thi theo bối cảnh:</b> ${e.good}/3; <b>công cụ điều tiết phù hợp:</b> ${e.govGood}/4.</p><p><b>Niềm tin:</b> ${e.trust}/100; <b>cộng đồng/môi trường:</b> ${e.society}/100.</p><p><b>Nhiệm vụ phụ:</b> ${state.sideQuests?.water?'✓ Trạm nước':'Chưa làm trạm nước'}; ${state.sideQuests?.dock?'✓ Bến giao hàng':'Chưa làm bến giao hàng'}. ${state.sideQuests?.dock?'Lịch giao nhận rõ ràng hỗ trợ thỏa thuận nếu giá và phí được minh bạch.':''}</p><p><b>Ứng phó biến cố:</b> ${state.crisis==='prepared'?'Đã sắp xếp đúng các bước phối hợp':'Chưa có quy trình phối hợp phù hợp'}.</p><p><b>Phản hồi cuối:</b> ${CHARS.map((c,i)=>c.name+': '+(e.vals[i]>=60?'có thể đồng thuận':e.vals[i]>=48?'cần xem lại':'chưa chấp thuận')).join(' • ')}.</p><p><b>Vấn đề cần tiếp tục xử lý:</b> ${CHARS.map((c,i)=>{const concerns=actorReasons(i).filter(r=>r.type==='warn');return esc(c.name)+': '+(concerns.length?concerns.length+' băn khoăn còn lại':'chưa có phản đối lớn');}).join(' • ')}.</p><p><b>Điều kiện kết thúc:</b> ${state.result==='A'?'Thỏa thuận có căn cứ và phương án ứng phó đủ điều kiện trong mô phỏng.':state.result==='B'?'Còn điều khoản hoặc công cụ cần rà soát; chưa khôi phục hoàn toàn.':'Rủi ro và lo ngại chưa được giải quyết đủ để ba bên tiếp tục.'}</p><p class="small muted">Các trạng thái phản hồi là quy tắc mô phỏng được xây dựng cho game, không phải dự báo hành vi thực tế.</p>`;
 const lines=STATE_TOOLS.map(t=>{const c=gainFromTool(t);return `<li><b>${t.role}. ${esc(t.title)}:</b> ${esc(c?.title||'Chưa chọn')}<br><span class="small muted">${esc(c?.reply||'')}</span></li>`;}).join('');
 $('endingReport').innerHTML+=`<hr><p><b>Vai trò Nhà nước được vận dụng:</b> ${e.govGood}/4 phương án có cơ sở trong kịch bản.</p><ul>${lines}</ul><p><b>Niềm tin:</b> ${e.trust}/100 · <b>Lợi ích cộng đồng và môi trường:</b> ${e.society}/100.</p><p><b>Bài học:</b> Hài hòa lợi ích không đồng nghĩa chia đều lợi nhuận hay ép tất cả ký; cần bảo vệ quyền lợi hợp pháp, bảo đảm điều kiện hợp tác, giám sát rủi ro và xử lý tranh chấp có căn cứ.</p><p class="small muted">Mọi chỉ số và phản ứng trong trò chơi là mô phỏng sư phạm, không phải kết quả nghiên cứu hoặc dự đoán tác động chính sách.</p>`;
}

/* Phase 6 - WASD walking, clickable destinations, optional quests */
const MAP_SITES={field:{x:25,y:43,name:'Ruộng lúa Chú Bảy'},coop:{x:55,y:20,name:'Hợp tác xã Chị Sen'},factory:{x:75,y:43,name:'Nhà máy Anh Khoa'},hall:{x:50,y:72,name:'Phòng đối thoại'},water:{x:28,y:77,name:'Trạm cảnh báo nước'},dock:{x:77,y:77,name:'Bến giao hàng'}};
const mapWalking={target:null,keys:new Set(),frame:0,last:0,prevSave:0,near:null,faceLeft:false};
function clampWalk(v,min,max){return Math.max(min,Math.min(max,v));}
function worldPos(){state.mapPos=state.mapPos||{x:50,y:56};return state.mapPos;}
function distWalk(a,b){return Math.hypot((a.x-b.x), (a.y-b.y)*1.6);}
function nearbySite(){const p=worldPos();let nearest=null,dist=Infinity;for(const [id,loc] of Object.entries(MAP_SITES)){const d=distWalk(p,loc);if(d<dist){dist=d;nearest=id;}}return dist<=10?nearest:null;}
function syncAvatar(){let p=worldPos();const a=$('worldAvatar');if(!a)return;a.style.left=p.x+'%';a.style.top=p.y+'%';a.classList.toggle('facingLeft',mapWalking.faceLeft);a.classList.toggle('walking',!!mapWalking.target||mapWalking.keys.size>0);const i=$('worldAvatarImg');const frame=String(mapWalking.frame%4);if(i&&i.dataset.frame!==frame){i.dataset.frame=frame;i.src=SPRITES['minh_an_walk_'+frame];}const dot=$('mapDestination');if(mapWalking.target){dot.hidden=false;dot.style.left=mapWalking.target.x+'%';dot.style.top=mapWalking.target.y+'%';}else dot.hidden=true;}
function updateWalkUI(){if(scene!=='world')return;let near=nearbySite();mapWalking.near=near;const b=$('walkInteract'),status=$('walkStatus');if(near){let loc=MAP_SITES[near];let locked=near==='hall'&&!allDone();b.disabled=locked;b.textContent=locked?'🔒 Cần 3 hồ sơ':`✋ Tương tác: ${loc.name}`;status.textContent=locked?'Phòng họp chưa mở: hoàn thành 3 cuộc điều tra trước.':`Đã đến gần ${loc.name}. Nhấn E hoặc nút Tương tác.`;}else{b.disabled=true;b.textContent='🖐️ Đến gần địa điểm';status.textContent=mapWalking.target?'Minh An đang đi tới điểm đã chọn…':'Nhấp vào điểm đến hoặc di chuyển bằng WASD / phím mũi tên.';}}
function travelTo(x,y){const pos=worldPos();mapWalking.target={x:clampWalk(x,7,94),y:clampWalk(y,12,88)};mapWalking.faceLeft=mapWalking.target.x<pos.x;syncAvatar();updateWalkUI();}
function routeTo(site){if(scene!=='world')return;const loc=MAP_SITES[site];if(!loc)return;if(site==='hall'&&!allDone()){notify('Cần điều tra xong 3 địa điểm trước khi vào phòng đối thoại.');return;}if(state.mode==='demo'){interactSite(site);return;}if(nearbySite()===site){interactSite(site);return;}travelTo(loc.x,loc.y);notify(`Minh An đang tới ${loc.name}. Khi đến gần, nhấn E để tương tác.`);}
function interactSite(site){if(!site)return;if(site==='hall'){if(!allDone()){notify('Phòng đối thoại còn khóa.');return;}renderBoard();show('board');return;}if(site==='water'||site==='dock'){openSideQuest(site);return;}enterPlace(site);}
function tryInteract(){if(scene!=='world'||!$('questOverlay').hidden)return;const site=nearbySite();if(!site){notify('Hãy đến gần nhân vật hoặc địa điểm trước.');return;}interactSite(site);}
function tickWalking(now){requestAnimationFrame(tickWalking);if(scene!=='world'||!$('questOverlay').hidden){mapWalking.last=now;return;}const dt=Math.min((now-(mapWalking.last||now))/1000,.06);mapWalking.last=now;let p=worldPos(),dx=0,dy=0;const k=mapWalking.keys;if(k.has('arrowleft')||k.has('a'))dx-=1;if(k.has('arrowright')||k.has('d'))dx+=1;if(k.has('arrowup')||k.has('w'))dy-=1;if(k.has('arrowdown')||k.has('s'))dy+=1;let active=false;if(dx||dy){let norm=Math.hypot(dx,dy);dx/=norm;dy/=norm;p.x=clampWalk(p.x+dx*31*dt,7,94);p.y=clampWalk(p.y+dy*31*.75*dt,12,88);mapWalking.target=null;active=true;mapWalking.faceLeft=dx<0;}else if(mapWalking.target){const t=mapWalking.target;let vx=t.x-p.x,vy=t.y-p.y;let d=Math.hypot(vx,vy);const step=32*dt;if(d<=step||d<.8){p.x=t.x;p.y=t.y;mapWalking.target=null;save();sound(700,.055);}else{p.x=clampWalk(p.x+vx/d*step,7,94);p.y=clampWalk(p.y+vy/d*step,12,88);active=true;mapWalking.faceLeft=vx<0;}}if(active){if((Math.floor(now/160))!==mapWalking.frame)mapWalking.frame=Math.floor(now/160);if(now-mapWalking.prevSave>1800){save();mapWalking.prevSave=now;}}syncAvatar();if(active||mapWalking.near!==nearbySite())updateWalkUI();}
function worldKeyDown(e){const key=e.key.toLowerCase();if(scene!=='world'||!$('questOverlay').hidden)return;if(['arrowup','arrowdown','arrowleft','arrowright','w','a','s','d','e'].includes(key)){if(e.target instanceof HTMLElement&&['INPUT','TEXTAREA','SELECT'].includes(e.target.tagName))return;e.preventDefault();if(key==='e'&&!e.repeat){tryInteract();return;}mapWalking.keys.add(key);}}
function worldKeyUp(e){const k=e.key.toLowerCase();if(mapWalking.keys.delete(k))save();}
function bindMapWalking(){const map=$('walkMap');map.addEventListener('click',e=>{if(scene!=='world'||e.target.closest('button'))return;const r=map.getBoundingClientRect();travelTo((e.clientX-r.left)/r.width*100,(e.clientY-r.top)/r.height*100);});$('walkInteract').addEventListener('click',tryInteract);$('walkCenter').addEventListener('click',()=>travelTo(50,56));document.querySelectorAll('[data-walk]').forEach(el=>{const dir=el.dataset.walk;const k={up:'w',down:'s',left:'a',right:'d'}[dir];const start=e=>{e.preventDefault();mapWalking.keys.add(k);mapWalking.target=null;};const end=e=>{mapWalking.keys.delete(k);save();};el.addEventListener('pointerdown',start);['pointerup','pointercancel','pointerleave'].forEach(name=>el.addEventListener(name,end));});document.addEventListener('keydown',worldKeyDown);document.addEventListener('keyup',worldKeyUp);window.addEventListener('blur',()=>mapWalking.keys.clear());document.querySelectorAll('[data-go]').forEach(el=>{el.addEventListener('click',e=>{if(scene!=='world')return;e.stopImmediatePropagation();if(el.disabled)return;routeTo(el.dataset.go);},true);});requestAnimationFrame(tickWalking);}
const SIDE_QUESTS={water:{title:'Trạm nước – Cảnh báo sớm',intro:'Một trạm nước có ba bản ghi theo thời gian. Độ mặn đo trong mô phỏng tăng dần. Sắp xếp các dữ liệu theo thứ tự thời điểm để xác minh xu hướng và gửi cảnh báo tới các bên.',steps:[{id:'noon',title:'12:00',detail:'Độ mặn 3,5‰'},{id:'morning',title:'06:00',detail:'Độ mặn 0,8‰'},{id:'mid',title:'09:00',detail:'Độ mặn 1,6‰'}],correct:['morning','mid','noon'],reward:'Bạn đã giúp gửi cảnh báo sớm. Ở thử thách độ mặn cuối game, bước thông báo sẽ được hoàn thành trước.'},dock:{title:'Bến ghe – Nối lại đường giao hàng',intro:'Ngừng liên kết khiến việc giao hàng bị gián đoạn. Hãy xây lại quy trình giao nhận có trách nhiệm, từ tập hợp lúa đến kiểm định và bàn giao.',steps:[{id:'receive',title:'Bước nhận',detail:'Nhà máy xác nhận nhận hàng'},{id:'gather',title:'Bước tập hợp',detail:'HTX tập hợp lúa từ nông dân'},{id:'check',title:'Bước kiểm định',detail:'Kiểm tra chất lượng theo thỏa thuận'}],correct:['gather','check','receive'],reward:'Đã có lịch phối hợp giao hàng. Khi chọn điều khoản giá và phí minh bạch, sự phối hợp này giúp các bên yên tâm hơn.'}};
let questCurrent=null,questChoices=[];
function openSideQuest(id){questCurrent=id;questChoices=[];renderSideQuest();$('questOverlay').hidden=false;mapWalking.keys.clear();mapWalking.target=null;syncAvatar();sound(660,.07);}
function closeSideQuest(){questCurrent=null;questChoices=[];$('questOverlay').hidden=true;updateWalkUI();save();}
function renderSideQuest(){const q=SIDE_QUESTS[questCurrent];if(!q)return;$('questTitle').textContent=q.title;let complete=!!state.sideQuests?.[questCurrent];$('questContent').innerHTML=`<p>${q.intro}</p>`+(complete?`<div class="questSequence">✅ Đã hoàn thành: ${q.reward}</div>`:`<div class="questCards">${q.steps.map(item=>`<button type="button" class="questCard" data-step="${item.id}">${item.title}<span>${item.detail}</span></button>`).join('')}</div><div class="questSequence" id="sideSequence">Chưa chọn bước nào. Nhấp theo thứ tự đúng.</div>`);$('questFeedback').className='questFeedback';$('questFeedback').textContent=complete?'Đã ghi vào hồ sơ nhiệm vụ.':'Mỗi lần nhấn sẽ xếp thêm một bước; có thể thử lại nếu sai.';document.querySelectorAll('#questContent [data-step]').forEach(b=>b.addEventListener('click',()=>chooseQuestStep(b.dataset.step)));}
function chooseQuestStep(id){const q=SIDE_QUESTS[questCurrent];if(!q||questChoices.includes(id))return;questChoices.push(id);let chosen=q.steps.filter(s=>questChoices.includes(s.id));const seq=$('sideSequence');seq.textContent='Thứ tự đã chọn: '+questChoices.map((c,i)=>(i+1)+'. '+q.steps.find(s=>s.id===c).title).join(' → ');document.querySelectorAll('#questContent [data-step]').forEach(b=>{b.disabled=questChoices.includes(b.dataset.step);b.classList.toggle('chosen',questChoices.includes(b.dataset.step));});if(questChoices.length===3){if(questChoices.every((v,i)=>v===q.correct[i])){state.sideQuests[questCurrent]=true;$('questFeedback').textContent='🎉 '+q.reward;$('questFeedback').className='questFeedback';notify('Đã hoàn thành nhiệm vụ phụ!');soundCue('solve');renderWorld();save();renderSideQuest();}else{$('questFeedback').textContent='Chưa đúng thứ tự. Bạn thử lại với quy trình và mốc thời gian phù hợp nhé.';$('questFeedback').className='questFeedback bad';soundCue('error');const wrongQuest=questCurrent;setTimeout(()=>{if(questCurrent!==wrongQuest)return;questChoices=[];renderSideQuest();$('questFeedback').textContent='Thử lại: chú ý thời điểm hoặc thứ tự phối hợp.';},850);}}}

function notes(){alert('KIẾN THỨC MLN122\n\n1. Lợi ích kinh tế thúc đẩy mỗi chủ thể hoạt động.\n2. Lợi ích các bên có sự thống nhất (cần hợp tác) và mâu thuẫn (giá, chi phí, rủi ro).\n3. Nhà nước tạo môi trường thuận lợi, bảo vệ lợi ích hợp pháp, điều hòa lợi ích, kiểm soát tác động tiêu cực và hỗ trợ giải quyết mâu thuẫn.\n\nGame dùng một tình huống giả định, không phải số liệu thực tế.');}

function createDecisionReport(){
 const e=evaluate();const lines=[
 'VÙNG CỒN XANH – NHẬT KÝ ĐIỀU PHỐI (GIẢ LẬP)',
 'MLN122 Group 2 | Câu chuyện về quan hệ lợi ích và vai trò Nhà nước','',
 `Kết thúc: ${state.result||'Chưa hoàn thành'}`,
 `Điều khoản khả thi trong bối cảnh: ${e.good}/3; công cụ Nhà nước: ${e.govGood}/4`,
 `Niềm tin: ${e.trust}/100; lợi ích cộng đồng / môi trường: ${e.society}/100`,
 ...POLICIES.map(p=>{let c=p.choices.find(x=>x.id===state.policies[p.id]);return `THỎA THUẬN: ${p.title}: ${c?.name||'Chưa chọn'}`;}),
 '',...STATE_TOOLS.map(t=>{const c=gainFromTool(t);return `VAI TRÒ ${t.role} – ${t.title}: ${c?.title||'Chưa chọn'}
  Chứng cứ: ${PROOF_TITLES[state.govProof?.[t.id]]||'Chưa gắn'}
  Đánh đổi: ${c?.desc||''}
  Phản hồi: ${c?.reply||''}`;}),
 '',`Cảnh báo và ứng phó: ${state.crisis||'Chưa thực hiện'}`,
 `Trạm nước: ${state.sideQuests?.water?'Đã làm':'Chưa làm'}; bến giao hàng: ${state.sideQuests?.dock?'Đã làm':'Chưa làm'}`,
 '', 'Nguồn lý luận: Slides_MLN122.pdf, trang 201–209 (đặc biệt trang 205–206, 209).',
 'Các quyết định và điểm số là tình huống giả lập, không phải dữ liệu thực tế.'
 ];
 const blob=new Blob([lines.join('\n')],{type:'text/plain;charset=utf-8'});
 const a=document.createElement('a');const url=URL.createObjectURL(blob);a.href=url;a.download='Vung_Con_Xanh_Nhat_Ky_Dieu_Phoi.txt';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1500);
}

$('downloadDecisionReport').addEventListener('click',createDecisionReport);
$('startBtn').addEventListener('click',()=>{unlockMusic();begin();playSfx('invite',.65)});$('resumeBtn').addEventListener('click',()=>{unlockMusic();resume();});$('nextStory').addEventListener('click',nextStory);$('skipStory').addEventListener('click',()=>{state.intro=true;renderWorld();show('world')});$('backWorld').addEventListener('click',()=>{renderWorld();show('world')});$('finishPlace').addEventListener('click',completePlace);$('modalOkay').addEventListener('click',takeClue);$('closeModal').addEventListener('click',closeClue);$('clueModal').addEventListener('click',e=>{if(e.target===$('clueModal'))closeClue()});$('boardBack').addEventListener('click',()=>{renderWorld();show('world')});$('enterHall').addEventListener('click',()=>{renderInvitations();show('invite')});$('checkAgreement').addEventListener('click',openCrisis);$('crisisReset').addEventListener('click',resetCrisis);$('crisisCommit').addEventListener('click',commitCrisis);$('replay').addEventListener('click',reset);$('openNotes').addEventListener('click',notes);$('inviteBack').addEventListener('click',()=>{renderBoard();show('board')});$('inviteProceed').addEventListener('click',enterHallFromInvitation);$('journalBtn').addEventListener('click',openJournal);$('journalClose').addEventListener('click',closeJournal);$('journalModal').addEventListener('click',e=>{if(e.target===$('journalModal'))closeJournal()});$('restartBtn').addEventListener('click',()=>{if(confirm('Bắt đầu lại từ đầu? Tiến độ hiện tại sẽ được thay thế.'))reset()});$('soundToggle').addEventListener('click',()=>{soundOn=!soundOn;updateAudioButtons();if(soundOn)playSfx('click',.5);});$('fullToggle').addEventListener('click',()=>{if(document.fullscreenElement)document.exitFullscreen?.();else document.documentElement.requestFullscreen?.()});document.addEventListener('keydown',e=>{if(e.key==='Escape'){if(!$('questOverlay').hidden)closeSideQuest();closeClue();closeJournal();$('crisisModal').classList.remove('show');}if(e.key==='Enter'&&scene==='story'){e.preventDefault();nextStory();}});
$('talkNPC').addEventListener('click',talkToNPC);$('questClose').addEventListener('click',closeSideQuest);$('questExit').addEventListener('click',closeSideQuest);$('questOverlay').addEventListener('click',e=>{if(e.target===$('questOverlay'))closeSideQuest();});bindMapWalking();const previous=load();if(previous&&previous.stage!=='home'){$('resumeBtn').hidden=false;}state=initialState();