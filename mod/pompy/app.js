(function(){var E=window.Engine,DB=null,st={};var $=function(s){return document.querySelector(s)};
var UL={'ug/kg/min':'µg/kg/min','ug/min':'µg/min','mg/h':'mg/h','mg/kg/h':'mg/kg/h','j/h':'j./h','j/kg/h':'j./kg/h','ug/h':'µg/h'};
function cu(u){return u==='ug'?'µg':u==='j'?'j.':u;}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function num(v){v=String(v).replace(',','.').trim();return v===''?NaN:parseFloat(v);}
function srcs(l){return (l||[]).map(function(k){var s=DB.sources[k];if(!s)return esc(k);return s.url?'<a href="'+esc(s.url)+'">'+esc(s.label)+'</a>':esc(s.label);}).join('; ');}
function home(){$('#title').textContent='Pompy SOR';$('#back').hidden=true;
 $('#main').innerHTML='<input class="search" id="q" placeholder="Szukaj leku…"><div class="list" id="l"></div>';
 function draw(){var q=$('#q').value.toLowerCase();$('#l').innerHTML=DB.drugs.filter(function(d){return d.name.toLowerCase().indexOf(q)>=0}).map(function(d){return'<button class="dbtn" data-id="'+d.id+'">'+esc(d.name)+'</button>'}).join('');}
 $('#q').oninput=draw;draw();$('#l').onclick=function(e){var b=e.target.closest('.dbtn');if(b)location.hash='d/'+b.dataset.id;};}
function drug(d){$('#title').textContent=d.name;$('#back').hidden=false;
 var s=st[d.id]||(st[d.id]={syr:(function(){try{return parent.SKS.S.syr||50}catch(e){return 50}})(),amps:{50:d.defaults['50'],20:d.defaults['20']},w:'',dose:d.start!=null?String(d.start).replace('.',','):'',mlh:'',last:'dose'});
 if(d.doseUnits&&!s.unit)s.unit=d.doseUnits[0];var D=d.doseUnits?Object.assign({},d,{doseUnit:s.unit,weight:E.isPerKg(s.unit)}):d;var u=UL[D.doseUnit],c=cu(d.amp.unit),ST=d.stepper;
 $('#main').innerHTML=(d.header?'<p class="amp"><b>'+esc(d.header)+'</b></p>':'<p class="amp">Ampułka: <b>'+esc(d.amp.label)+'</b></p>')+
 '<div class="tog"><button data-s="20">POMPA 20 ml</button><button data-s="50">POMPA 50 ml</button></div>'+
 '<div class="row"><label>'+(ST?esc(ST.label):'Liczba ampułek')+'</label><div class="step"><button id="m">−</button>'+(ST&&ST.free?'<input id="a" inputmode="numeric" style="width:80px;text-align:center">':'<b id="a"></b>')+'<button id="p">+</button></div></div>'+
 '<div id="pr"></div>'+
 (d.doseUnits?'<div class="tog" id="ut">'+d.doseUnits.map(function(x){return'<button data-u="'+x+'" style="font-size:16px">'+UL[x]+'</button>'}).join('')+'</div>':'')+(D.weight?'<div class="row"><label>Masa ciała [kg]</label><input id="w" inputmode="decimal"></div>':'')+
 '<div class="row"><label>Dawka ['+u+']</label><input id="ds" inputmode="decimal"></div>'+
 '<div class="row"><label>lub szybkość [ml/h]</label><input id="ml" inputmode="decimal"></div>'+
 '<div class="out" id="o"></div><p class="rng" id="r"></p>'+(d.note?'<div class="warn">'+esc(d.note)+'</div>':'')+
 '<p class="src">Źródła: '+srcs(d.range.src.concat(d.defaults.src))+'</p><button id="recordCalc" style="padding:12px 16px;border:0;border-radius:8px;background:#16556b;color:#fff;font-size:15px">Przenieś do rejestru leczenia</button><p id="recordStatus" role="status"></p><div class="row"><button id="savePump" style="padding:10px 14px;border:1px solid #16556b;border-radius:8px;background:#fff;color:#16556b;font-size:15px">Zapisz nastawę do raportu</button> <button id="printPump" style="padding:10px 14px;border:1px solid #16556b;border-radius:8px;background:#fff;color:#16556b;font-size:15px">🖨 Drukuj nastawy</button></div><p id="saveStatus" role="status"></p>';
 if(D.weight)$('#w').value=s.w;if(d.doseUnits)document.querySelectorAll('#ut button').forEach(function(b){b.classList.toggle('on',b.dataset.u===s.unit)});$('#ds').value=s.dose;$('#ml').value=s.mlh;
 function upd(){document.querySelectorAll('.tog button[data-s]').forEach(function(b){b.classList.toggle('on',+b.dataset.s===s.syr)});
  var n=s.amps[s.syr];if(ST&&ST.free){if(document.activeElement!==$('#a'))$('#a').value=n;}else $('#a').textContent=n;var p=E.prep(D,s.syr,n),o=$('#o'),pr=$('#pr');o.classList.remove('bad');$('#ds').classList.remove('bad');
  if(p.error){pr.innerHTML='<div class="err">'+esc(p.error)+'</div>';o.innerHTML='';$('#r').textContent=d.range.text;return;}
  var how=d.diluted?(E.fmt(p.drugVol)+' ml '+(ST?'z pena':'leku')+' + '+E.fmt(p.diluent)+' ml NaCl 0,9% (rozcieńczalnik) = '+s.syr+' ml'):(E.fmt(p.drugVol)+' ml nierozcieńczonego leku');
  var cw=d.maxConc&&p.conc>d.maxConc.value+1e-9?'<div class="err">Stężenie powyżej limitu — '+esc(d.maxConc.text)+'</div>':'';
  pr.innerHTML='<div class="conc">Stężenie: <b>'+E.fmt(p.conc)+' '+c+'/ml</b> <small>('+E.fmt(p.amount)+' '+c+'; '+how+')</small></div>'+cw;
  var w=D.weight?num(s.w):1,ww=D.weight?E.checkWeight(w):null,wmsg='';
  if(D.weight){$('#w').classList.toggle('bad',ww==='red');if(ww==='red')wmsg='<div class="err">Nieprawidłowa masa ciała (30–250 kg) — nie liczę.</div>';else if(ww)wmsg='<div class="warn">Nietypowa masa ciała — sprawdź.</div>';}
  var dose,mlh;
  if(D.weight&&(!(w>0)||ww==='red')){o.innerHTML=wmsg||'<div class="s">Podaj masę ciała</div>';$('#r').textContent=d.range.text;return;}
  if(s.last==='dose'){dose=num(s.dose);mlh=dose>=0?E.rate(D,p,dose,w):NaN;$('#ml').value=isFinite(mlh)?E.fmt(mlh):'';}
  else{mlh=num(s.mlh);dose=mlh>=0?E.dose(D,p,mlh,w):NaN;$('#ds').value=isFinite(dose)?E.fmt(dose):'';}
  if(!isFinite(mlh)||!isFinite(dose)){o.innerHTML=wmsg+'<div class="s">Wpisz dawkę lub ml/h</div>';$('#r').textContent=d.range.text;return;}
  var aph=E.amountPerHour(d,p,mlh),extra=c+'/h';var line=E.fmt(aph)+' '+extra;
  if(D.doseUnit.indexOf('/min')>0)line+=' = '+E.fmt(aph/60*(d.amp.unit==='mg'?1000:1))+' '+(d.amp.unit==='mg'?'µg':c)+'/min';
  if(d.id==='amiodaron')line+=' = '+E.fmt(aph*24)+' mg/24 h';
  var hrs=p.finalVol/mlh;
  o.innerHTML=wmsg+'<div class="v">'+E.fmt(mlh)+' ml/h</div><div class="s">'+E.fmt(dose)+' '+u+(u===c+'/h'?'':' · '+line)+'</div><div class="s">strzykawka wystarczy na '+(isFinite(hrs)?E.fmt(hrs)+' h':'—')+'</div>';
  var bad=E.outOfRange(d,dose);o.classList.toggle('bad',bad);$('#ds').classList.toggle('bad',bad);var r=$('#r');r.textContent=(bad?'POZA ZAKRESEM — ':'')+d.range.text;r.classList.toggle('bad',bad);}
 document.querySelector('.tog').onclick=function(e){var b=e.target.closest('button');if(b){s.syr=+b.dataset.s;upd();}};
 var stp=ST?ST.step:1;$('#m').onclick=function(){var v=s.amps[s.syr]-stp;if(v>=stp||(!ST&&v>=1)){s.amps[s.syr]=v;upd();}};$('#p').onclick=function(){s.amps[s.syr]+=stp;upd();};if(ST&&ST.free)$('#a').oninput=function(){var v=num(this.value);s.amps[s.syr]=v>0?v:0;upd();};if(d.doseUnits)$('#ut').onclick=function(e){var b=e.target.closest('button');if(b&&b.dataset.u!==s.unit){s.unit=b.dataset.u;s.last='dose';s.dose='';drug(d);}};
 if(D.weight)$('#w').oninput=function(){s.w=this.value;upd();};
 $('#ds').oninput=function(){s.dose=this.value;s.last='dose';upd();};$('#ml').oninput=function(){s.mlh=this.value;s.last='ml';upd();};upd();
 $('#savePump').onclick=function(){try{
  if(parent===window||!parent.SORReport)throw Error('Otwórz kalkulator we wspólnym Asystencie SOR.');
  if($('#o').classList.contains('bad')||$('#pr .err')||$('#w')&&$('#w').classList.contains('bad'))throw Error('Najpierw wyjaśnij ostrzeżenia kalkulatora.');
  var ds=num($('#ds').value),ml=num($('#ml').value);if(!(ds>0)||!(ml>0)||(D.weight&&!(num($('#w').value)>0)))throw Error('Uzupełnij dawkę, szybkość ml/h i masę (jeśli dotyczy).');
  var pp=E.prep(D,s.syr,s.amps[s.syr]);if(pp.error)throw Error(pp.error);
  var txt=d.name+' — strzykawka '+s.syr+' ml: '+E.fmt(pp.amount)+' '+c+' leku ('+(d.diluted?E.fmt(pp.drugVol)+' ml leku + '+E.fmt(pp.diluent)+' ml NaCl 0,9%':E.fmt(pp.drugVol)+' ml bez rozcieńczania')+'), stężenie '+E.fmt(pp.conc)+' '+c+'/ml; dawka '+$('#ds').value+' '+u+' = '+$('#ml').value+' ml/h'+(D.weight?' (masa '+$('#w').value+' kg)':'');
  parent.SORReport.addPump(txt);$('#saveStatus').textContent='Zapisano nastawę do raportu.';
 }catch(err){$('#saveStatus').textContent=err.message;}};
 $('#printPump').onclick=function(){try{if(parent===window||!parent.SORReport)throw Error('Otwórz kalkulator we wspólnym Asystencie SOR.');parent.SORReport.print(['pumps']);}catch(err){$('#saveStatus').textContent=err.message;}};
 $('#recordCalc').onclick=function(){try{
  if(parent===window||!parent.SORTreatment)throw Error('Otwórz kalkulator we wspólnym Asystencie SOR.');
  var strict=function(v){var t=String(v).trim();return /^(?:\d+(?:[.,]\d*)?|[.,]\d+)$/.test(t)&&Number(t.replace(',','.'))>0;};
  if(!strict($('#ds').value)||!strict($('#ml').value)||(D.weight&&!strict($('#w').value))||$('#o').classList.contains('bad')||$('#pr .err')||$('#w')&&$('#w').classList.contains('bad'))throw Error('Uzupełnij poprawne dane i wyjaśnij ostrzeżenia kalkulatora przed przeniesieniem.');
  var pp=E.prep(D,s.syr,s.amps[s.syr]);if(pp.error)throw Error(pp.error);
  parent.SORTreatment.seed({kind:'infusion',name:d.name,dose:$('#ds').value+' '+u,route:'',amount:E.fmt(pp.amount)+' '+c,diluent:d.diluted?'NaCl 0,9%':'bez rozcieńczania',volume:String(pp.finalVol).replace('.',','),concentration:E.fmt(pp.conc)+' '+c+'/ml',rate:$('#ml').value,note:''});
 }catch(err){$('#recordStatus').textContent=err.message;}};
}
function route(){var h=location.hash.replace('#','');if(h.indexOf('d/')===0){var d=DB.drugs.find(function(x){return x.id===h.slice(2)});if(d)return drug(d);}home();}
$('#back').onclick=function(){location.hash='';};window.onhashchange=route;
Promise.resolve({json:function(){return window.DRUGS_DB}}).then(function(r){return r.json()}).then(function(j){DB=j;route();});})();
