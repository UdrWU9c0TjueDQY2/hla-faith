const fs=require('fs'),vm=require('vm'),assert=require('assert');
const html=fs.readFileSync(process.argv[2]||'src/ninefruit/kindness-without-spending/index.html','utf8');
const match=html.match(/<script>(const cards=[\s\S]*?)<\/script><script src="help-replies\.js"/);
assert(match,'inline kindness deck script found');
assert(html.includes('rel="canonical" href="https://udrwu9c0tjuedqy2.github.io/hla-faith/ninefruit/kindness-without-spending/"'));
assert(html.includes('https://apps.apple.com/us/app/ninefruit-fruit-of-the-spirit/id6820778195?ct=faith-no-cost-kindness&mt=8'));
assert.equal((html.match(/id6820778195/g)||[]).length,1,'one exact Apple CTA');
assert(!/(localStorage|sessionStorage|fetch\(|XMLHttpRequest)/.test(match[1]),'no persistence or network API');

class El{
  constructor(value=''){this.value=value;this.textContent='';this.hidden=false;this.disabled=false;this.listeners={};this.clicked=0;}
  addEventListener(type,fn){this.listeners[type]=fn;}
  fire(type){return this.listeners[type]?.();}
  click(){this.clicked++;return this.fire('click');}
  focus(){this.focused=true;}
  select(){this.selected=true;}
  remove(){this.removed=true;}
}
const ids=Object.fromEntries(['where','effort','number','title','action','detail','chosen','message','plan','cue','copy','download','clear','portable-wrap','portable','choose','another'].map(id=>[id,new El()]));
ids.where.value='home';ids.effort.value='small';ids.chosen.hidden=true;ids['portable-wrap'].hidden=true;
const anchors=[];
const document={getElementById:id=>ids[id],createElement:()=>{const a=new El();anchors.push(a);return a;},body:{append:a=>{a.appended=true;}}};
let clipboard='',copyFails=false,downloadFails=false,blobText='',revoked='';
const navigator={clipboard:{writeText:async text=>{if(copyFails)throw new Error('denied');clipboard=text;}}};
class Blob{constructor(parts){blobText=parts.join('');}}
const URL={createObjectURL:()=>{if(downloadFails)throw new Error('denied');return'blob:test';},revokeObjectURL:url=>{revoked=url;}};
vm.runInNewContext(match[1],{document,navigator,Blob,URL,setTimeout:fn=>fn()});

assert.match(ids.title.textContent,/Leave one thing ready/);
ids.choose.click();
assert.equal(ids.chosen.hidden,false);
ids.cue.value='after I clear my plate';ids.cue.fire('input');
(async()=>{
  await ids.copy.click();
  assert.match(clipboard,/ONE SMALL KINDNESS/);
  assert.match(clipboard,/When: after I clear my plate/);
  assert.match(clipboard,/does not sync to Ninefruit/);
  copyFails=true;await ids.copy.click();
  assert.equal(ids['portable-wrap'].hidden,false);
  assert.equal(ids.portable.selected,true);
  assert.equal(ids.portable.value,clipboard);
  ids.download.click();
  assert.equal(anchors[0].download,'ninefruit-small-kindness-action.txt');
  assert.equal(anchors[0].clicked,1);
  assert.equal(blobText,clipboard);
  assert.equal(revoked,'blob:test');
  downloadFails=true;ids.download.click();
  assert.match(ids.message.textContent,/complete action card is selected/);
  ids.clear.click();
  assert.equal(ids.chosen.hidden,true);
  assert.equal(ids['portable-wrap'].hidden,true);
  assert.equal(ids.portable.value,'');
  console.log('Ninefruit kindness portable action checks passed: 20 assertions');
})().catch(error=>{console.error(error);process.exit(1);});
