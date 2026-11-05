const fs=require('fs'),vm=require('vm'),assert=require('assert');
const source=fs.readFileSync(process.argv[2]||'src/forged/sermon-follow-through-card/app.js','utf8');
class El{constructor(v=''){this.value=v;this.hidden=false;this.textContent='';this.listeners={};this.clicked=0;this.href='';this.download='';}addEventListener(t,f){this.listeners[t]=f;}fire(t){return this.listeners[t]?.();}click(){this.clicked++;}remove(){this.removed=true;}focus(){this.focused=true;}}
const ids=['reference','takeaway','action','revisit','editor','card','result','copy','reflection','review','reveal','recall','save-actions','save-status','copy-combined','download-combined','build','sample','reset'];
const els=Object.fromEntries(ids.map(id=>[id,new El()]));els.card.hidden=true;els.reveal.hidden=true;els.recall.hidden=true;els['save-actions'].hidden=true;
const label=new El(),anchors=[];
const document={getElementById:id=>els[id],querySelector:s=>s==='label[for="copy"]'?label:null,createElement:t=>{const x=new El();anchors.push(x);return x;},body:{append:x=>{x.appended=true;}}};
let clip='',blobText='',revoked='';
const navigator={clipboard:{writeText:async s=>{clip=s;}}};
class Blob{constructor(parts){blobText=parts.join('');}}
const URL={createObjectURL:()=> 'blob:test',revokeObjectURL:u=>{revoked=u;}};
const setTimeout=f=>{f();};
vm.runInNewContext(source,{document,navigator,Blob,URL,setTimeout});
els.takeaway.value='Listen first';els.action.value='Pause before replying';els.revisit.value='Thursday';els.build.fire('click');
assert.equal(els.card.hidden,false);assert.match(els.copy.value,/My takeaway \(not a quotation\): Listen first/);assert.equal(els['save-actions'].hidden,true);
els.review.fire('click');assert.equal(els.recall.hidden,false);assert.equal(els.copy.hidden,true);
els.reflection.value='I paused once and want to try again.';els.reflection.fire('input');assert.equal(els['save-actions'].hidden,true,'export remains unavailable before reveal');
els.reveal.fire('click');assert.equal(els['save-actions'].hidden,false);
Promise.resolve(els['copy-combined'].fire('click')).then(()=>{
  assert.match(clip,/SERMON REVIEW CARD/);assert.match(clip,/RECALL AND FOLLOW-THROUGH NOTES/);assert.match(clip,/not a scripture quotation/);assert.match(els['save-status'].textContent,/copied/);
  els['download-combined'].fire('click');assert.match(blobText,/I paused once/);assert.equal(anchors[0].download,'sermon-review-card-and-reflection.txt');assert.equal(anchors[0].clicked,1);assert.equal(revoked,'blob:test');
  els.takeaway.fire('input');assert.equal(els.card.hidden,true);assert.equal(els['save-actions'].hidden,true);assert.equal(els.reflection.value,'');assert.equal(els.copy.value,'');
  els.takeaway.value='';els.action.value='';els.revisit.value='';els.build.fire('click');assert.match(els.result.textContent,/Add a takeaway/);
  console.log('FORGED sermon reflection export checks passed: 14 lifecycle assertions');
}).catch(e=>{console.error(e);process.exit(1);});
