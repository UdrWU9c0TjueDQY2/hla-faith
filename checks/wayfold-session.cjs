const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');
for(const reduced of [false,true]){
 const els={};const make=()=>({textContent:'',children:[],listeners:{},attrs:{},addEventListener(k,v){this.listeners[k]=v},setAttribute(k,v){this.attrs[k]=v},replaceChildren(){this.children=[]},append(...x){this.children.push(...x)}});
 const buttons=['read','study'].map(mode=>({...make(),dataset:{mode}}));let printed=0,tick;
 const context={document:{hidden:false,getElementById:id=>els[id]??=make(),querySelectorAll:()=>buttons,createElement:make},window:{print:()=>printed++,matchMedia:()=>({matches:reduced})},setInterval:fn=>tick=fn};vm.createContext(context);vm.runInContext(fs.readFileSync(__dirname+'/../src/wayfold/bible-reading-vs-study/session.js','utf8'),context);
 assert.equal(els.timeline.children.length,4);assert.equal(buttons[0].attrs['aria-pressed'],'true');
 buttons[1].listeners.click();assert.equal(els['session-title'].textContent,'Follow one question carefully.');assert.equal(els['print-list'].children.length,4);assert.equal(buttons[0].attrs['aria-pressed'],'false');
 buttons[0].listeners.click();assert.equal(els['session-title'].textContent,'Keep the passage moving.');
 els.print.listeners.click();assert.equal(printed,1);
 assert.equal(els.pause.textContent,reduced?'Play preview':'Pause preview');
 els['next-screen'].listeners.click();assert.ok(els['phone-image'].src.includes('screen-2'));assert.equal(els.pause.textContent,'Play preview');const prior=els['phone-image'].src;tick();assert.equal(els['phone-image'].src,prior);
 els.pause.listeners.click();tick();assert.ok(els['phone-image'].src.includes('screen-1'));
}
const html=fs.readFileSync(__dirname+'/../src/wayfold/bible-reading-vs-study/index.html','utf8');assert.equal((html.match(/<h1>/g)||[]).length,1);assert.ok(!/[\uFFFD\x00-\x08\x0e-\x1f]/.test(html));console.log('Reading/study timelines, print payload, pause/manual advance and reduced-motion defaults passed.');

