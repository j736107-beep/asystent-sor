(function(r,f){if(typeof module==='object'&&module.exports)module.exports=f();else r.Engine=f();})(this,function(){
var MASS={ug:0.001,mg:1,g:1000};
// factor converting dose in doseUnit to amount/h in contentUnit (excluding weight)
function perHourFactor(doseUnit,cu){var p=doseUnit.split('/'),amt=p[0],t=p[p.length-1],f=t==='min'?60:1;
 if(amt==='j'){if(cu!=='j')throw Error('unit');return f;} if(cu==='j')throw Error('unit');return f*MASS[amt]/MASS[cu];}
function isPerKg(u){return u.indexOf('/kg/')>0;}
function prep(d,syr,amps){var vol=amps*d.amp.volume,amount=amps*d.amp.content;
 if(!(amps>0))return{error:d.stepper?'Podaj liczbę jednostek.':'Podaj liczbę ampułek.'};
 if(vol>syr+1e-9)return{error:'Objętość leku ('+fmt(vol)+' ml) przekracza strzykawkę '+syr+' ml.'};
 var fin=d.diluted?syr:vol;return{amount:amount,drugVol:vol,diluent:d.diluted?syr-vol:0,finalVol:fin,conc:amount/fin};}
function rate(d,p,dose,w){if(isPerKg(d.doseUnit)){if(!(w>0))return null;}else w=1;return dose*w*perHourFactor(d.doseUnit,d.amp.unit)/p.conc;}
function dose(d,p,mlh,w){if(isPerKg(d.doseUnit)){if(!(w>0))return null;}else w=1;return mlh*p.conc/(w*perHourFactor(d.doseUnit,d.amp.unit));}
function amountPerHour(d,p,mlh){return mlh*p.conc;}
function outOfRange(d,x){var r=d.range;return (r.lo!=null&&x<r.lo-1e-9)||(r.hi!=null&&x>r.hi+1e-9);}
function checkWeight(w){if(!(w>0))return null;if(w<30||w>250)return'red';if(w<40||w>180)return'amber';return null;}
function fmt(x){if(x==null||!isFinite(x))return'—';var a=Math.abs(x),s=a>=100?x.toFixed(0):a>=10?x.toFixed(1):a>=1?x.toFixed(2):x.toFixed(3);s=s.indexOf('.')>=0?s.replace(/0+$/,'').replace(/\.$/,''):s;return s.replace('.',',');}
return{perHourFactor:perHourFactor,isPerKg:isPerKg,prep:prep,rate:rate,dose:dose,amountPerHour:amountPerHour,outOfRange:outOfRange,checkWeight:checkWeight,fmt:fmt};});
