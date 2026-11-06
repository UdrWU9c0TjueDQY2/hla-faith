'use strict';
function tokenize(text){return text.match(/[\p{L}\p{M}\p{N}]+(?:['\u2019][\p{L}\p{M}\p{N}]+)*|[^\p{L}\p{M}\p{N}]+/gu)||[]}
function isWord(t){return /^[\p{L}\p{M}\p{N}]/u.test(t)}
function display(t,i,mode){if(mode==='full'||mode==='alternate'&&i%2===0)return t;return mode==='initials'?Array.from(t)[0]+'...':'____'}
function practiceSheet(text,label){
  const tokens=tokenize(text), count=tokens.filter(isWord).length;
  if(count<1||count>120)throw new Error('Enter between 1 and 120 words.');
  const modes=[['full','1. READ AND CHECK'],['alternate','2. ALTERNATE GAPS'],['initials','3. FIRST-LETTER PROMPTS'],['blank','4. RECALL WITHOUT WORDS']];
  const sections=modes.map(([mode,title])=>{let i=0;return title+'\n'+tokens.map(t=>isWord(t)?display(t,i++,mode):t).join('')});
  return ['PERSONAL SCRIPTURE MEMORY PRACTICE',label||'Your practice passage','Prepared locally with the Honest Little Apps browser companion.','Check the reference, translation and wording against your own Bible. Cover the full-text answer while using later stages.',...sections,'NEXT REVIEW','Date: ____________________','Words to check: ____________________','One surrounding detail to remember: ____________________','No score or memorization claim. Keep your own copy private. This sheet does not sync to FORGED.','Return to the free tool: https://udrwu9c0tjuedqy2.github.io/hla-faith/forged/scripture-memory-ladder/'].join('\n\n')+'\n';
}
if(typeof module!=='undefined')module.exports={tokenize,isWord,display,practiceSheet};
if(typeof document!=='undefined'){
const $ = id => document.getElementById(id);
let tokens = [], reveals = 0, activeText = '', activeLabel = '';
function render() {
  reveals = 0;
  $('reveal-count').textContent = 'Words revealed in this mode: 0';
  const passage = $('passage');
  passage.replaceChildren();
  let n = 0;
  for (const token of tokens) {
    if (!isWord(token)) {
      passage.append(document.createTextNode(token));
      continue;
    }
    const index = n++;
    const mode = $('mode').value;
    const shown = display(token, index, mode);
    if (shown === token) {
      passage.append(document.createTextNode(token));
      continue;
    }
    const button = document.createElement('button');
    button.className = 'word';
    button.textContent = shown;
    const clue = mode === 'initials' ? ', starts with ' + Array.from(token)[0] : '';
    button.setAttribute('aria-label', 'Reveal word ' + (index + 1) + clue);
    button.addEventListener('click', () => {
      button.textContent = token;
      button.setAttribute('aria-label', 'Word ' + (index + 1) + ': ' + token);
      button.setAttribute('aria-disabled', 'true');
      reveals++;
      $('reveal-count').textContent = 'Word ' + (index + 1) + ': ' + token + '. Words revealed in this mode: ' + reveals;
    }, {once: true});
    passage.append(button);
  }
}
$('start').addEventListener('click', () => {
  tokens = tokenize($('text').value);
  const n = tokens.filter(isWord).length;
  if (n < 1 || n > 120) {
    $('error').textContent = 'Enter between 1 and 120 words.';
    $('text').focus();
    return;
  }
  activeText = $('text').value;
  activeLabel = $('label').value;
  $('sheet-status').textContent = '';
  $('error').textContent = '';
  $('example-note').textContent = '';
  $('editor').hidden = true;
  $('practice').hidden = false;
  $('mode').value = 'full';
  $('reference').textContent = $('label').value || 'Your practice passage';
  render();
  $('mode').focus();
});
const exampleText = 'Pause before you answer. Choose one patient action today.';
const exampleLabel = 'Original practice sentence - not Scripture';
$('example').addEventListener('click', () => {
  $('error').textContent = '';
  if ($('text').value.length || $('label').value.length) {
    $('example-note').textContent = exampleLabel + ': ' + exampleText + ' Your entries are still in the form.';
    return;
  }
  $('text').value = exampleText;
  $('label').value = exampleLabel;
  $('example-note').textContent = 'Example loaded. Start practice to use it.';
});
$('download-sheet').addEventListener('click',()=>{
  const sheet=practiceSheet(activeText,activeLabel);
  const blob=new Blob([sheet],{type:'text/plain;charset=utf-8'});
  const url=URL.createObjectURL(blob),a=document.createElement('a');
  a.href=url;a.download='my-scripture-memory-practice.txt';document.body.append(a);a.click();a.remove();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
  $('sheet-status').textContent='Practice sheet downloaded. It includes the full passage and all three prompt stages. Keep this personal copy somewhere private.';
});
$('mode').addEventListener('change',render);$('reset-mode').addEventListener('click',render);$('edit').addEventListener('click',()=>{$('practice').hidden=true;$('editor').hidden=false;$('text').focus()});}
