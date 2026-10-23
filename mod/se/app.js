(function(){var E=window.SE,S=E.S,f=E.fmt,$=function(s){return document.querySelector(s)};
var KEY='se4state:'+document.title,st={w:NaN,zrmDoses:0,crcl:NaN,co:{},sel:null,ed:{},log:[]};
try{var sv=JSON.parse(localStorage.getItem(KEY)||'null');if(sv)Object.assign(st,sv);}catch(e){}
function save(){try{localStorage.setItem(KEY,JSON.stringify(st));}catch(e){}}
function num(v){v=String(v==null?'':v).replace(',','.').trim();return v===''?NaN:parseFloat(v);}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]});}
var SH={dzp:'Relanium amp. 10 mg/2 ml',midim:'Midanium 5 mg/ml',midiv:'Midanium 5 mg/ml',czp:'Klonazepam amp. 1 mg/1 ml',lzp:'Lorabex amp. 2 mg/1 ml',lev:'Keppra fiol. 500 mg/5 ml',vpa:'Depakine fiol. 400 mg (100 mg/ml)',pht:'Epanutin fiol. 250 mg/5 ml',lcm:'Lakozamid fiol. 200 mg/20 ml',mid3:'Midanium 5 mg/ml, strzykawka 50 ml',pro:'Propofol 1% (10 mg/ml), 50 ml',tpn:'Tiopental 25 mg/ml (1 g w 40 ml)',ket:'Ketalar 50 mg/ml, 50 ml'};
var LINES=[['1. rzut',[['dzp','Relanium','i.v.'],['midim','Midanium','i.m.'],['midiv','Midanium','i.v.'],['czp','Klonazepam','i.v.'],['lzp','Lorazepam','i.v.']]],
 ['2. rzut',[['lev','Keppra','i.v.'],['vpa','Depakine','i.v.'],['pht','Epanutin','i.v.'],['lcm','Lakozamid','i.v.']]],
 ['3. rzut',[['mid3','Midazolam','wlew'],['pro','Propofol','wlew'],['tpn','Tiopental','wlew'],['ket','Ketamina','wlew']]]];
function given(){var g={dzpMg:0};st.log.forEach(function(e){g[e.k]=(g[e.k]||0)+1;if(e.k==='dzp')g.dzpMg+=e.mg||0;});return g;}
function R(){return E.compute({w:st.w,zrmDoses:st.zrmDoses,zrmDzp:0,crcl:st.crcl,co:st.co,given:given()});}
function vals(k,r){var d=E.defaults(k,r),u=st.ed[k]||{},o={};Object.keys(d).forEach(function(x){o[x]=u[x]!=null?u[x]:d[x];});return o;}
function tagLine(x){var n=[],c=false;x.src.forEach(function(s){if(s.t==='C')c=true;else if(s.t==='W'&&n.indexOf(S[s.k].n)<0)n.push(S[s.k].n);});
 return(n.length?'<b>Wytyczne (off-label):</b> '+n.join(', '):'')+(c?(n.length?' · ':'')+'<b>ChPL</b>':'');}
function grid(r){var h='';LINES.forEach(function(L){h+='<div class="ln">'+L[0]+'</div><div class="bt'+(L[1].length===5?' c5':'')+'">'+L[1].map(function(b){var x=r.drugs[b[0]];
 return'<button class="d '+(x.cls||'')+(st.sel===b[0]?' sel':'')+'" data-k="'+b[0]+'">'+b[1]+'<small>'+b[2]+'</small></button>'}).join('')+'</div>';});$('#grid').innerHTML=h;}
function out(k,r){var x=r.drugs[k],v=vals(k,r),o=E.edit(k,v,r.W,r),h='';
 if(!o.lines.length)return'<div class="mx">'+esc(o.warn[0]||'Wpisz masę ciała')+'</div>';
 var p=o.lines[0].split(' = ');h+='<div class="mk">'+esc(o.lines[0])+'</div>';
 o.lines.slice(1).forEach(function(l){h+='<div class="ln2">'+esc(l)+'</div>';});
 if(o.bad)o.warn.forEach(function(w){h+='<div class="mx">⚠ '+esc(w)+'</div>';});
 var fz=x.flags.filter(function(z){return z[0]!=='ok'})[0];if(fz)h+='<div class="rr '+fz[0]+'">'+esc(fz[1].split(';')[0].split(' — ')[0])+'</div>';return h;}
function result(){var r=R(),k=st.sel,h='';
 if(!(r.W>0)){$('#res').innerHTML='<div class="hint">'+(r.weight==='red'?'Masa poza zakresem 30–250 kg':'Wpisz masę ciała')+'</div>';return;}
 if(!k){$('#res').innerHTML='<div class="hint">Wybierz lek ↑</div>';return;}
 var x=r.drugs[k],e=E.ED[k],v=vals(k,r);
 h+='<div class="rn">'+esc(SH[k])+'</div>';
 if(x.line===1&&r.benzoTotal>=2)h+='<div class="mx">Już 2 dawki BZD → 2. rzut</div>';
 h+='<div class="fr">'+e.f.map(function(fl){return'<label>'+esc(fl[1])+'<input type="text" inputmode="decimal" autocomplete="off" data-ef="'+fl[0]+'" value="'+f(v[fl[0]])+'"></label>'}).join('')+'<button class="rs" id="rs">↺</button></div>';
 h+='<div id="o">'+out(k,r)+'</div><div class="st">'+tagLine(x)+'</div>';
 h+='<div class="pg"><button class="give" id="give">✔ Podano</button><span class="lg" id="lg"></span></div>';
 $('#res').innerHTML=h;logLine();}
function hhmm(t){var d=new Date(t);return('0'+d.getHours()).slice(-2)+':'+('0'+d.getMinutes()).slice(-2);}
function logLine(){var l=$('#lg');if(!l)return;l.innerHTML=st.log.length?st.log.slice(-4).map(function(e){return'<b>'+hhmm(e.t)+'</b> '+esc(e.txt)}).join('<br>')+(st.log.length?' <a href="#" id="clr">wyczyść</a>':''):'brak podań';}
function render(){var r=R();$('#w').classList.toggle('bad',r.weight==='red');grid(r);result();
 document.querySelectorAll('.tg').forEach(function(b){b.classList.toggle('on',!!st.co[b.dataset.c])});$('#crr').hidden=!st.co.renal;$('#zn').textContent=st.zrmDoses;}
function info(){var h='<button class="rs" id="ix" style="float:right">✕</button><h2>Stan padaczkowy</h2><p>Napad ≥5 min lub ≥2 napady bez powrotu świadomości (ILAE 2015; PTE 2018).</p><p><b>OIOM:</b> napad trwa mimo benzodiazepiny + leku 2. rzutu (SE oporny) → wlew anestetyku z ciągłym EEG, cel: ustąpienie napadów / burst-suppression, 24–48 h (PTE 2018; NCS 2012).</p><p>Benzodiazepina maks. 2 dawki łącznie z ZRM. Glukoza &lt;60 mg/dl (3,3 mmol/l): tiamina 100 mg, potem 50 ml glukozy 50% (AES 2016).</p><p>Kolory: zielony = preferowany, pomarańczowy = ostrożnie, czerwony = unikać.</p><h2>Źródła</h2>'+Object.keys(S).map(function(k){return'<div><a href="'+S[k].url+'" target="_blank" rel="noopener">'+esc(S[k].label)+'</a></div>'}).join('');
 var b=$('#infoBox');b.innerHTML=h;b.hidden=false;$('#ix').onclick=function(){b.hidden=true;};}
$('#w').value=isFinite(st.w)?String(st.w).replace('.',','):'';$('#crcl').value=isFinite(st.crcl)?st.crcl:'';
$('#w').oninput=function(){st.w=num(this.value);st.ed={};save();render();};
$('#crcl').oninput=function(){st.crcl=num(this.value);save();render();};
$('#zm').onclick=function(){st.zrmDoses=Math.max(0,st.zrmDoses-1);save();render();};$('#zp').onclick=function(){st.zrmDoses=Math.min(3,st.zrmDoses+1);save();render();};
document.querySelectorAll('.tg').forEach(function(b){b.onclick=function(){st.co[b.dataset.c]=!st.co[b.dataset.c];save();render();}});
$('#info').onclick=info;
$('#grid').addEventListener('click',function(e){var b=e.target.closest('[data-k]');if(!b)return;st.sel=b.dataset.k;save();render();$('#res').scrollIntoView({behavior:'smooth',block:'nearest'});});
$('#res').addEventListener('input',function(e){var t=e.target;if(!t.dataset.ef)return;var k=st.sel;st.ed[k]=st.ed[k]||{};st.ed[k][t.dataset.ef]=num(t.value);save();$('#o').innerHTML=out(k,R());});
$('#res').addEventListener('click',function(e){if(e.target.id==='rs'){delete st.ed[st.sel];save();render();return;}
 if(e.target.id==='clr'){e.preventDefault();if(confirm('Wyczyścić dziennik podań?')){st.log=[];save();render();}return;}
 if(e.target.id==='give'){var r=R(),k=st.sel,v=vals(k,r),o=E.edit(k,v,r.W,r);if(!o.lines.length)return;
  if(o.bad&&!confirm('Uwaga: '+o.warn.join('; ')+'. Zapisać mimo to?'))return;
  st.log.push({t:Date.now(),k:k,txt:E.logText(k,v,r.W,r),mg:(v.dose!=null?v.dose:v.bolus)});save();render();}});
render();})();
