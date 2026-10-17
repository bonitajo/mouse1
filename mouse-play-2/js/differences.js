'use strict';
(()=>{const M=MousePlay;M.games.differences=({host,scope,level,award,active})=>{
  const canvas=document.createElement('canvas'),ctx=canvas.getContext('2d');host.append(canvas);canvas.setAttribute('aria-label','왼쪽과 오른쪽 그림에서 다른 곳을 클릭하세요');
  const toolbar=document.createElement('div');toolbar.className='difference-tools';
  const progress=document.createElement('strong');progress.setAttribute('role','status');
  const zoom=document.createElement('button');zoom.textContent='그림 크게';zoom.setAttribute('aria-pressed','false');toolbar.append(progress,zoom);host.before(toolbar);
  const needed=level==='easy'?3:5;let viewWidth=1200,viewHeight=600;let round=-1,changes=[],found=new Set(),complete=false,large=false,stacked=false,panels=[],message='';
  const spots=[{id:'sun',x:458,y:65,r:49},{id:'roof',x:165,y:142,r:70},{id:'window',x:167,y:258,r:46},{id:'fruit',x:420,y:230,r:65},{id:'flowers',x:88,y:352,r:47},{id:'pot',x:266,y:355,r:43}];
  const themes=[{name:'햇살 가득한 정원',sky:'#e5f3fc',grass:'#cbe4ac',roof:'#b65335',wall:'#fff1cf',leaves:'#437d51'}, {name:'가을날의 작은 집',sky:'#edf4ff',grass:'#e6d9ac',roof:'#315f89',wall:'#fff6df',leaves:'#aa6433'}, {name:'바닷가 꽃집',sky:'#dff3fb',grass:'#f1e3bb',roof:'#754d88',wall:'#fff8ee',leaves:'#477b69'}];
  function layout(){stacked=large||host.clientWidth<760;viewWidth=stacked?600:1200;viewHeight=stacked?1120:600;const density=Math.max(1,Math.min(3,(window.devicePixelRatio||1)*host.clientWidth/viewWidth));canvas.width=Math.round(viewWidth*density);canvas.height=Math.round(viewHeight*density);canvas.dataset.logicalWidth=String(viewWidth);ctx.setTransform(density,0,0,density,0,0);host.classList.add('difference-arena');host.classList.toggle('difference-stacked',stacked);panels=stacked?[{x:25,y:75},{x:25,y:635}]:[{x:25,y:95},{x:625,y:95}];draw()}
  function status(){progress.textContent=`찾은 곳 ${found.size} / ${needed} · ${themes[round%themes.length].name}`}
  function next(){if(!active())return;round++;found=new Set();complete=false;message='';const candidates=[...spots];for(let i=candidates.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[candidates[i],candidates[j]]=[candidates[j],candidates[i]]}changes=candidates.slice(0,needed).map(s=>s.id);status();draw()}
  function ellipse(x,y,rx,ry,fill,stroke=true){ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2);ctx.fillStyle=fill;ctx.fill();if(stroke)ctx.stroke()}
  function rect(x,y,w,h,fill,r=0){ctx.fillStyle=fill;ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.fill();ctx.stroke()}
  function line(x1,y1,x2,y2,color='#284b50',width=4){ctx.strokeStyle=color;ctx.lineWidth=width;ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();ctx.strokeStyle='#284b50';ctx.lineWidth=4}
  function scene(panel,right){const theme=themes[round%themes.length];ctx.save();ctx.translate(panel.x,panel.y);ctx.strokeStyle='#284b50';ctx.lineWidth=4;ctx.lineJoin='round';ctx.lineCap='round';
    ctx.fillStyle=theme.sky;ctx.fillRect(0,0,550,430);ctx.fillStyle=theme.grass;ctx.fillRect(0,290,550,140);
    if(round%3===2){ctx.fillStyle='#84cbdc';ctx.fillRect(0,283,550,44);line(0,310,550,310,'#5095aa',4)}
    const different=id=>right&&changes.includes(id);
    // 크고 명확한 모양 차이: 해/달, 굴뚝 유무, 창문 모양, 사과 개수, 꽃 개수, 물뿌리개 주둥이.
    if(different('sun')){ellipse(458,65,34,34,'#ffe19a');ctx.fillStyle=theme.sky;ctx.beginPath();ctx.arc(475,52,31,0,Math.PI*2);ctx.fill()}else{for(let i=0;i<8;i++){const a=i*Math.PI/4;line(458+Math.cos(a)*39,65+Math.sin(a)*39,458+Math.cos(a)*48,65+Math.sin(a)*48,'#ad6b16',5)}ellipse(458,65,30,30,'#ffcf58')}
    // 집은 그림마다 같은 큰 윤곽을 유지해 비교하기 쉽게 한다.
    rect(65,190,180,125,theme.wall,5);rect(86,263,36,52,'#8b614a',3);ellipse(114,291,3,3,'#ffe8a3',false);
    if(!different('roof'))rect(198,92,36,70,'#a56851',2);
    ctx.fillStyle=theme.roof;ctx.beginPath();ctx.moveTo(42,195);ctx.lineTo(155,112);ctx.lineTo(268,195);ctx.closePath();ctx.fill();ctx.stroke();
    if(different('window')){ellipse(167,258,38,38,'#96cfec');line(129,258,205,258);line(167,220,167,296)}else{rect(129,220,76,76,'#96cfec',2);line(129,258,205,258);line(167,220,167,296)}
    rect(405,218,27,104,'#946044',4);ellipse(420,203,74,68,theme.leaves);ellipse(383,180,39,35,theme.leaves);ellipse(454,176,38,37,theme.leaves);
    const apples=different('fruit')?[[420,223]]:[[386,208],[450,208],[420,250]];for(const [x,y]of apples){ellipse(x,y,20,21,'#ef7655');line(x,y-19,x+3,y-29,'#543a26',3)}
    function flower(x,y){line(x,y,x,y+42,'#315f42',5);for(let i=0;i<5;i++){const a=i*Math.PI*2/5;ellipse(x+Math.cos(a)*12,y+Math.sin(a)*12,10,10,'#eb8eb5')}ellipse(x,y,7,7,'#ffdc65')}
    if(different('flowers'))flower(88,348);else{flower(62,350);flower(88,334);flower(114,350)}
    // 주둥이는 없을 때와 있을 때의 실루엣 차이를 크게 준다.
    ctx.strokeStyle='#284b50';ctx.lineWidth=4;ctx.beginPath();ctx.ellipse(280,337,20,23,0,0,Math.PI*2);ctx.stroke();
    rect(235,336,55,46,'#65b9c4',7);if(!different('pot')){ctx.fillStyle='#65b9c4';ctx.beginPath();ctx.moveTo(236,351);ctx.lineTo(210,329);ctx.lineTo(204,338);ctx.lineTo(237,375);ctx.closePath();ctx.fill();ctx.stroke()}
    for(const id of found){const spot=spots.find(s=>s.id===id);ctx.strokeStyle='#fff';ctx.lineWidth=9;ctx.beginPath();ctx.arc(spot.x,spot.y,spot.r,0,Math.PI*2);ctx.stroke();ctx.strokeStyle='#146c4d';ctx.lineWidth=5;ctx.stroke();M.text(ctx,'✓',spot.x+spot.r*.65,spot.y-spot.r*.65,32,'#125e43')}
    ctx.restore();ctx.strokeStyle='#6a929b';ctx.lineWidth=3;ctx.strokeRect(panel.x,panel.y,550,430)
  }
  function draw(){if(round<0)return;ctx.fillStyle='#f7fbfc';ctx.fillRect(0,0,viewWidth,viewHeight);panels.forEach((p,i)=>{M.text(ctx,i?'오른쪽 그림':'왼쪽 그림',p.x+275,p.y-30,30);scene(p,i===1)});if(message){const y=stacked?1100:560;M.text(ctx,message,viewWidth/2,y,28,complete?'#176653':'#73502a')}}
  scope.on(canvas,'click',e=>{if(!active()||complete)return;const bounds=canvas.getBoundingClientRect(),x=(e.clientX-bounds.left)*viewWidth/bounds.width,y=(e.clientY-bounds.top)*viewHeight/bounds.height;const panel=panels.find(p=>x>=p.x&&x<=p.x+550&&y>=p.y&&y<=p.y+430);if(!panel)return;const px=x-panel.x,py=y-panel.y;const hit=spots.find(s=>changes.includes(s.id)&&Math.hypot(px-s.x,py-s.y)<=s.r);if(!hit){message='괜찮아요. 다른 곳을 천천히 찾아보세요.';draw();return}if(found.has(hit.id))return;found.add(hit.id);award(10);M.audio.tone(740);complete=found.size===needed;message=complete?'모두 찾았어요! 다음 그림을 준비해요.':'잘 찾으셨어요! +10점';status();draw();if(complete)scope.later(next,1600)});
  scope.on(zoom,'click',()=>{large=!large;zoom.textContent=large?'그림 보통':'그림 크게';zoom.setAttribute('aria-pressed',String(large));layout()});scope.on(window,'resize',layout);next();layout();
};})();
