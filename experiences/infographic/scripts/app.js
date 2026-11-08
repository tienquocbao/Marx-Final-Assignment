/* Vùng Cồn Xanh — Poster infographic v6. No bundler and no network dependency. */
(()=>{
  'use strict';
  const content=window.VCX_CONTENT;
  const sources=window.VCX_SOURCES||[];
  if(!content){console.error('Missing local data/content.js');return;}
  const $=id=>document.getElementById(id);
  const order=['context','actors','conflicts','governance','solutions','summary'];
  const names={context:'Bối cảnh và công nghệ',actors:'Chuỗi chủ thể',conflicts:'Mâu thuẫn lợi ích',governance:'Vai trò Nhà nước',solutions:'Giải pháp',summary:'Thông điệp kết luận'};
  const descriptions={context:'Mở rộng những con số và điều kiện công nghệ được nhóm đề cập trong slide.',actors:'Nông dân, hợp tác xã và doanh nghiệp cùng tạo giá trị, nhưng không đồng nhất lợi ích.',conflicts:'Nhận diện điểm đứt gãy và cách tác động của nó đến từng chủ thể.',governance:'Bốn cơ chế Nhà nước dùng để bảo vệ và điều hòa quan hệ lợi ích.',solutions:'Ba trụ cột đề xuất, đi kèm chỉ tiêu có thể theo dõi.',summary:'Tổng hợp toàn bộ mạch tư duy: hợp tác – mâu thuẫn – điều tiết – phát triển bền vững.'};
  const conclusion={
    title:'Lợi ích kinh tế và điều kiện của liên kết bền vững',lead:'Công nghệ tạo giá trị; thể chế, minh bạch và sự đồng thuận giúp quan hệ hợp tác tồn tại dài hạn.',
    note:'Tổng hợp từ slide nhóm 31 và lý luận về sự thống nhất – mâu thuẫn của lợi ích kinh tế (slide giảng viên 201–209).',
    items:[
      {id:'summary',label:'Thông điệp chung',eyebrow:'CÔNG NGHỆ × HỢP TÁC',headline:'Không có phát triển dài hạn nếu một bên gánh hết chi phí.',image:'assets/vector/delta-landscape.svg',bullets:['Nông dân, HTX và doanh nghiệp có mục tiêu riêng nhưng cần phối hợp tạo giá trị.','Giá, phí, thông tin, chất lượng, điều kiện thị trường và môi trường có thể gây mâu thuẫn.','Nhà nước tạo khuôn khổ, điều hòa, giám sát và giúp xử lý tranh chấp; không quyết định thay mọi giao dịch.'],takeaway:'Hài hòa lợi ích là cơ sở để hợp tác tự nguyện, minh bạch và bền vững.',source:'Slide nhóm 31; slide giảng viên 201–209.'},
      {id:'checklist',label:'4 câu hỏi kiểm tra',eyebrow:'DÙNG ĐỂ THẢO LUẬN TRÊN LỚP',headline:'Một liên kết có thực sự bền vững?',image:'assets/vector/state.svg',bullets:['Giá, chất lượng, phí và thời hạn thanh toán đã rõ chưa?','Nông dân có quyền tham gia; HTX có minh bạch; doanh nghiệp có đầu ra và tiêu chuẩn khả thi không?','Chi phí môi trường và rủi ro đã được dự phòng hay dồn sang cộng đồng?','Khi phát sinh tranh chấp, có chứng cứ và cơ chế xử lý công bằng không?'],takeaway:'Cần đánh giá bằng dữ liệu và cam kết thực thi, không chỉ bằng một thỏa thuận trên giấy.',source:'Vận dụng từ nội dung slide nhóm 26–31, không phải một bộ tiêu chuẩn được giáo trình quy định.'}
    ]
  };
  const state={zone:null,item:null,trigger:null,originalScroll:0,motion:true,sound:false,closing:false};
  const overlay=$('detailOverlay'),sheet=overlay.querySelector('.detail-sheet');
  const safe=t=>String(t??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const useMotion=()=>state.motion&&!matchMedia('(prefers-reduced-motion: reduce)').matches;
  function contentOf(zone){return zone==='summary'?conclusion:content[zone];}
  function findItem(zone,id){const z=contentOf(zone);return (z?.items||[]).find(i=>i.id===id)||z?.items?.[0]||null;}
  function setActiveZone(key){
    document.querySelectorAll('.side-index a').forEach(el=>{const active=el.dataset.jump===key;el.classList.toggle('active',active);if(active)el.setAttribute('aria-current','location');else el.removeAttribute('aria-current');});
    const paper=$('poster');if(paper)paper.dataset.currentZone=key;
    document.querySelectorAll('.route-junction').forEach(el=>el.classList.toggle('is-current',el.dataset.zone===key));
  }
  function renderDetail(){
    const z=contentOf(state.zone),item=findItem(state.zone,state.item);if(!z||!item)return;
    state.item=item.id;
    $('detailEyebrow').textContent='BẢN ĐỒ TRI THỨC · '+String(order.indexOf(state.zone)+1).padStart(2,'0')+' / 06';
    $('detailTitle').textContent=z.title||names[state.zone];
    $('detailLead').textContent=z.lead||descriptions[state.zone];
    const img=$('detailImage');img.src=item.image||'assets/vector/delta-landscape.svg';img.alt='Minh họa: '+item.label;
    $('detailFigureTag').textContent=item.label.toUpperCase()+' · ĐỒ HỌA GIẢI THÍCH';
    $('detailNote').textContent=z.note||'Nội dung được đối chiếu từ slide thuyết trình nhóm.';
    $('detailTabs').innerHTML=z.items.map(x=>`<button type="button" class="detail-tab ${x.id===state.item?'active':''}" data-item-tab="${safe(x.id)}" role="tab" aria-selected="${x.id===state.item}">${safe(x.label)}</button>`).join('');
    $('itemOverline').textContent=item.eyebrow||'';$('itemHeadline').textContent=item.headline||'';
    $('itemPoints').innerHTML=(item.bullets||[]).map((x,i)=>`<div class="detail-point"><span>${i+1}</span><div>${safe(x)}</div></div>`).join('');
    const metrics=$('detailMetrics');if(item.metrics?.length){metrics.hidden=false;metrics.innerHTML=item.metrics.map(m=>`<div class="detail-metric"><b>${safe(m[0])}</b><span>${safe(m[1])}</span></div>`).join('')}else{metrics.hidden=true;metrics.innerHTML=''}
    $('itemTakeaway').textContent=item.takeaway||'';
    $('itemSource').textContent='Nguồn nội dung: '+(item.source||z.note||'Slide nhóm MLN122.');
    $('detailProgress').textContent=String(order.indexOf(state.zone)+1).padStart(2,'0')+' / 06';
    $('detailPrev').disabled=order.indexOf(state.zone)===0;$('detailNext').disabled=order.indexOf(state.zone)===order.length-1;
    $('detailTabs').querySelectorAll('[data-item-tab]').forEach(button=>button.addEventListener('click',()=>{state.item=button.dataset.itemTab;renderDetail();}));
  }
  function visualOf(trigger){return trigger?.querySelector('.click-icon')||trigger?.querySelector('img')||trigger||null;}
  function animateTravel(fromElement,toElement,imgSrc,reverse=false){
    if(!useMotion()||!fromElement||!toElement)return;
    const a=fromElement.getBoundingClientRect(),b=toElement.getBoundingClientRect();
    if(!a.width||!b.width)return;
    let first=reverse?b:a,last=reverse?a:b;
    const ghost=document.createElement('div');ghost.className='shared-ghost';
    const im=document.createElement('img');im.src=imgSrc;im.alt='';im.style.cssText='width:100%;height:100%;object-fit:contain;border-radius:16px';ghost.appendChild(im);
    ghost.style.cssText+=`;left:${first.left}px;top:${first.top}px;width:${Math.max(1,first.width)}px;height:${Math.max(1,first.height)}px;`;
    document.body.appendChild(ghost);
    const dx=last.left-first.left,dy=last.top-first.top;
    const sx=Math.max(.1,last.width/first.width),sy=Math.max(.1,last.height/first.height);
    const frames=[{transform:'translate3d(0,0,0) scale(1)',opacity:.95,borderRadius:'18px'},
                  {transform:`translate3d(${dx}px,${dy}px,0) scale(${sx},${sy})`,opacity:.18,borderRadius:'26px'}];
    const anim=ghost.animate(frames,{duration:570,easing:'cubic-bezier(.21,.74,.18,1)',fill:'forwards'});
    anim.finished.catch(()=>{}).finally(()=>ghost.remove());
  }
  function openDetail(zone,item,trigger=null){
    if(!order.includes(zone))return;
    if(!overlay.hidden){state.zone=zone;state.item=item||contentOf(zone).items[0]?.id;renderDetail();return;}
    state.originalScroll=window.scrollY;state.trigger=trigger;state.zone=zone;state.item=item||contentOf(zone).items[0]?.id;
    renderDetail();if(trigger){const r=trigger.getBoundingClientRect();sheet.style.setProperty('--detail-pivot-x',`${Math.round(r.left+r.width/2-window.innerWidth/2)}px`);sheet.style.setProperty('--detail-pivot-y',`${Math.round(r.top+r.height/2-window.innerHeight/2)}px`)}document.querySelectorAll('.poster-zone').forEach(el=>el.classList.toggle('zone-in-focus',el.dataset.zone===zone));overlay.hidden=false;overlay.setAttribute('aria-hidden','false');overlay.classList.remove('closing');document.body.classList.add('modal-open');
    if(trigger)animateTravel(visualOf(trigger),$('detailImage'),$('detailImage').src);
    requestAnimationFrame(()=>sheet.focus({preventScroll:true}));
  }
  function finalizeClose(){overlay.hidden=true;overlay.setAttribute('aria-hidden','true');overlay.classList.remove('closing');document.body.classList.remove('modal-open');window.scrollTo({top:state.originalScroll,behavior:'instant'});const focus=state.trigger;document.querySelectorAll('.poster-zone').forEach(el=>el.classList.remove('zone-in-focus'));state.zone=null;state.item=null;state.trigger=null;state.closing=false;if(focus?.isConnected)focus.focus({preventScroll:true});}
  function closeDetail(){if(overlay.hidden||state.closing)return;state.closing=true;if(useMotion()&&state.trigger?.isConnected){animateTravel(visualOf(state.trigger),$('detailImage'),$('detailImage').src,true);overlay.classList.add('closing');setTimeout(finalizeClose,250);}else finalizeClose();}
  function changeZone(step){const idx=order.indexOf(state.zone),next=order[idx+step];if(!next)return;state.zone=next;state.item=contentOf(next).items[0]?.id;renderDetail();$('detailTitle').focus?.();}
  // Clicks on the poster are delegated to avoid thousands of handlers.
  document.addEventListener('click',event=>{
    const target=event.target.closest('[data-detail]');
    if(target){event.preventDefault();openDetail(target.dataset.detail,target.dataset.item||null,target);return;}
    if(event.target.closest('[data-close-detail]'))closeDetail();
  });
  $('detailClose').addEventListener('click',closeDetail);
  $('detailPrev').addEventListener('click',()=>changeZone(-1));
  $('detailNext').addEventListener('click',()=>changeZone(1));
  $('simulateButton').addEventListener('click',()=>{
    const live=$('conflictLive'),broken=!live.classList.contains('is-disrupted');live.classList.toggle('is-disrupted',broken);
    $('simulateButton').setAttribute('aria-pressed',String(broken));
    $('simulateButton').innerHTML=broken?'Khôi phục liên kết <span>↺</span>':'Ngừng hợp tác <span>↯</span>';
    $('liveTitle').textContent=broken?'LIÊN KẾT BỊ GIÁN ĐOẠN':'LIÊN KẾT ĐANG VẬN HÀNH';
    $('liveText').textContent=broken?'Nông dân thiếu đầu ra ổn định; HTX giảm khả năng điều phối; doanh nghiệp khó bảo đảm nguồn nguyên liệu. Đây là sơ đồ minh họa.':'Ba bên còn hợp tác: thông tin, hàng hóa và thanh toán được phối hợp theo thỏa thuận.';
  });
  $('backToTop').addEventListener('click',()=>{document.querySelector('#zone-context').scrollIntoView({behavior:useMotion()?'smooth':'instant'})});
  $('motionButton').addEventListener('click',()=>{state.motion=!state.motion;document.documentElement.classList.toggle('reduce-custom-motion',!state.motion);$('motionButton').setAttribute('aria-pressed',String(state.motion));$('motionButton').textContent=state.motion?'◉ Chuyển động':'⊘ Chuyển động';});
  $('soundButton').addEventListener('click',()=>{const a=$('ambientAudio');state.sound=!state.sound;a.volume=.18;if(state.sound){a.play().catch(()=>{state.sound=false;updateSound();});}else a.pause();updateSound();});
  function updateSound(){$('soundButton').textContent=state.sound?'♫ Nhạc: Bật':'♫ Nhạc: Tắt';$('soundButton').setAttribute('aria-pressed',String(state.sound));}
  document.addEventListener('visibilitychange',()=>{const a=$('ambientAudio');if(document.hidden){a.pause();}else if(state.sound)a.play().catch(()=>{});});
  function openSources(){const d=$('sourcesDialog');if(d.open)return;$('sourcesList').innerHTML=sources.map(s=>`<section class="source-record"><h3>${safe(s.name)}</h3><p>${safe(s.detail)}</p><small>${safe(s.ref)}</small></section>`).join('');d.showModal();}
  $('sourceButton').addEventListener('click',openSources);$('detailSourceButton').addEventListener('click',openSources);$('sourcesClose').addEventListener('click',()=>$('sourcesDialog').close());
  document.addEventListener('keydown',e=>{
    if(e.key==='Escape'){if($('sourcesDialog').open)return;if(!overlay.hidden){e.preventDefault();closeDetail();}}
    if(!overlay.hidden&&!$('sourcesDialog').open&&(e.key==='ArrowRight'||e.key==='ArrowLeft')){const el=document.activeElement;if(el.tagName==='BUTTON'&&el.closest('#detailTabs'))return;e.preventDefault();changeZone(e.key==='ArrowRight'?1:-1);}
  });
  if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting)setActiveZone(entry.target.dataset.zone)},{rootMargin:'-30% 0px -50% 0px'});document.querySelectorAll('.poster-zone').forEach(el=>observer.observe(el));}
  /* V8: route occupies its own protected gutter; never runs through the number badges.
     Branches end BEFORE the badge, and visual text remains in a different column. */
  function drawNarrativeRoute(){
    const paper=$('poster'),svg=$('narrativeRoute');if(!paper||!svg)return;
    const pr=paper.getBoundingClientRect();
    const markers=[...paper.querySelectorAll('.zone-number')].map(el=>{
      const r=el.getBoundingClientRect();return {left:r.left-pr.left,centerX:r.left-pr.left+r.width/2,y:r.top-pr.top+r.height/2};
    });
    if(markers.length!==6)return;
    const width=paper.clientWidth,height=paper.scrollHeight;
    svg.setAttribute('viewBox',`0 0 ${width} ${height}`);
    // At desktop this is ~62px instead of intersecting the badge at ~145px.
    // At projector size it is ~29px, still clear of all text/number markers.
    const railX=Math.max(25,Math.min(70,markers[0].left-(width>=1550?51:27)));
    let d=`M ${railX} ${Math.max(99,markers[0].y-76).toFixed(1)}`;
    d+=` L ${railX} ${markers[0].y.toFixed(1)}`;
    for(let i=1;i<markers.length;i++){
      const a=markers[i-1],b=markers[i],dy=b.y-a.y;
      const wiggle=i%2===0?7:-7;
      d+=` C ${(railX+wiggle).toFixed(1)} ${(a.y+dy*.32).toFixed(1)}, ${(railX+wiggle).toFixed(1)} ${(a.y+dy*.68).toFixed(1)}, ${railX} ${b.y.toFixed(1)}`;
    }
    $('routeBase').setAttribute('d',d);$('routeTrace').setAttribute('d',d);
    const pinGroup=$('routeJunctions');
    if(pinGroup){
      pinGroup.replaceChildren();
      markers.forEach((m,i)=>{
        // 12px of air before the first pixel of the numbered circle.
        const branchEnd=m.left-13;
        if(branchEnd<=railX+6)return;
        const ns='http://www.w3.org/2000/svg';
        const line=document.createElementNS(ns,'path');
        line.setAttribute('class','route-branch');line.setAttribute('d',`M ${railX} ${m.y.toFixed(1)} L ${branchEnd.toFixed(1)} ${m.y.toFixed(1)}`);
        pinGroup.appendChild(line);
        const pin=document.createElementNS(ns,'circle');
        pin.setAttribute('class','route-junction');pin.setAttribute('data-zone',order[i]);
        pin.setAttribute('cx',String(railX));pin.setAttribute('cy',m.y.toFixed(1));pin.setAttribute('r','6');
        pinGroup.appendChild(pin);
      });
      const current=$('poster').dataset.currentZone||'context';
      pinGroup.querySelectorAll('.route-junction').forEach(el=>el.classList.toggle('is-current',el.dataset.zone===current));
    }
    paper.querySelectorAll('.concept-bridge').forEach(bridge=>{
      const bead=bridge.querySelector('.bridge-bead');if(!bead)return;
      const r=bridge.getBoundingClientRect(),b=bead.getBoundingClientRect();
      bead.style.setProperty('--spine-x',`${Math.round(railX-(r.left-pr.left)-b.width/2)}px`);
    });
  }
  const redraw=()=>window.requestAnimationFrame(drawNarrativeRoute);
  window.addEventListener('resize',redraw,{passive:true});
  if(document.fonts?.ready)document.fonts.ready.then(redraw);
  if('ResizeObserver' in window){const routeObserver=new ResizeObserver(redraw);routeObserver.observe($('poster'));}
  redraw();setActiveZone('context');
  const legendTop=$('legendTop');if(legendTop)legendTop.addEventListener('click',()=>{$('zone-context').scrollIntoView({behavior:useMotion()?'smooth':'instant'});});
  if('IntersectionObserver' in window){
    const revealObserver=new IntersectionObserver(entries=>{for(const e of entries)if(e.isIntersecting){e.target.classList.add('reveal-visible');revealObserver.unobserve(e.target)}},{threshold:.05});
    document.querySelectorAll('.concept-bridge, .crosswalk-row, .outcome-stitch, .poster-zone').forEach(el=>revealObserver.observe(el));
  }
  // Probe to support quick smoke/regression verification without a global state dependency.
  window.VCX_APP={openDetail,closeDetail,changeZone,getState:()=>({zone:state.zone,item:state.item,motion:state.motion,scroll:state.originalScroll})};
})();
