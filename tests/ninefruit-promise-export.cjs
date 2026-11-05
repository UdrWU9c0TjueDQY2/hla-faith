const fs=require('fs');
const vm=require('vm');
const assert=require('assert');
const source=fs.readFileSync(process.argv[2]||'src/ninefruit/keep-or-renegotiate-a-promise/app.js','utf8');
class El{
  constructor(tag='div'){this.tagName=tag;this.value='';this.textContent='';this.children=[];this.listeners={};this.disabled=false;this.parentNode=null;this.attributes={};}
  addEventListener(type,fn){this.listeners[type]=fn;}
  setAttribute(name,value){this.attributes[name]=value;}
  append(...items){for(const item of items){item.parentNode=this;this.children.push(item);}}
  replaceChildren(...items){this.children=[];this.append(...items);}
  insertBefore(item,before){item.parentNode=this;const index=this.children.indexOf(before);this.children.splice(index<0?this.children.length:index,0,item);}
  remove(){if(this.parentNode)this.parentNode.children=this.parentNode.children.filter(x=>x!==this);}
  click(){this.clicked=true;return this.listeners.click&&this.listeners.click();}
  fire(type){return this.listeners[type]&&this.listeners[type]();}
}
const tool=new El('section');
const ids={progress:new El('p'),sceneTitle:new El('h3'),scene:new El('p'),choices:new El(),result:new El(),back:new El('button'),next:new El('button'),reset:new El('button'),note:new El('textarea')};
tool.append(ids.note);
const created=[];
const body=new El('body');
const document={getElementById:id=>ids[id],createElement:tag=>{const el=new El(tag);created.push(el);return el;},body};
let clipboard='',confirmCalls=0,confirmResult=true,revokeCalls=0;
const navigator={clipboard:{writeText:async text=>{clipboard=text;}}};
const window={confirm:()=>{confirmCalls++;return confirmResult;}};
const URL={createObjectURL:()=> 'blob:test',revokeObjectURL:()=>{revokeCalls++;}};
class Blob{constructor(parts,opts){this.parts=parts;this.type=opts.type;}}
const context={document,navigator,window,URL,Blob,setTimeout:fn=>fn()};
vm.runInNewContext(source,context);
const copy=created.find(el=>el.textContent==='Copy my reflection');
const download=created.find(el=>el.textContent==='Download my reflection');
const status=created.find(el=>el.attributes.role==='status');
assert(copy&&download&&status);
assert.equal(copy.disabled,true);
assert.equal(download.disabled,true);
ids.choices.children[1].click();
assert.equal(copy.disabled,false);
assert.match(ids.result.textContent,/specific limit/);
(async()=>{
  await copy.click();
  assert.match(clipboard,/The Saturday favour/);
  assert.match(clipboard,/Offer a smaller commitment/);
  assert.match(clipboard,/not a faith score/);
  assert.match(status.textContent,/not uploaded/);
  ids.note.value='I can bring six cards by Friday.';
  ids.note.fire('input');
  await copy.click();
  assert.match(clipboard,/My optional commitment note/);
  assert.match(clipboard,/six cards/);
  confirmResult=false;
  ids.reset.click();
  assert.equal(confirmCalls,1);
  assert.equal(ids.note.value,'I can bring six cards by Friday.');
  assert.equal(copy.disabled,false);
  confirmResult=true;
  ids.reset.click();
  assert.equal(confirmCalls,2);
  assert.equal(ids.note.value,'');
  assert.equal(copy.disabled,true);
  assert.equal(download.disabled,true);
  ids.note.value='Short note';
  ids.note.fire('input');
  download.click();
  const anchor=created.find(el=>el.tagName==='a');
  assert(anchor.clicked);
  assert.equal(anchor.download,'ninefruit-promise-reflection.txt');
  assert.equal(revokeCalls,1);
  assert.match(status.textContent,/downloaded locally/);
  console.log('Ninefruit promise export checks passed: 15 assertions');
})().catch(error=>{console.error(error);process.exit(1);});
