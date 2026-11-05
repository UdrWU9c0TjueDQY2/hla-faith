'use strict';
function tokenize(text){return text.match(/[\p{L}\p{M}\p{N}]+(?:['\u2019][\p{L}\p{M}\p{N}]+)*|[^\p{L}\p{M}\p{N}]+/gu)||[]}
function isWord(t){return /^[\p{L}\p{M}\p{N}]/u.test(t)}
function display(t,i,mode){if(mode==='full'||mode==='alternate'&&i%2===0)return t;return mode==='initials'?Array.from(t)[0]+'...':'____'}
if(typeof module!=='undefined')module.exports={tokenize,isWord,display};
if(typeof document!=='undefined'){const $=id=>document.getElementById(id);let tokens=[],reveals=0;function render(){reveals=0;$('reveal-count').textContent='Words revealed in this mode: 0';$('passage').replaceChildren();let n=0;for(const t of tokens){if(!isWord(t)){$('passage').append(document.createTextNode(t));continue}const i=n++,shown=display(t,i,$('mode').value);if(shown===t){$('passage').append(document.createTextNode(t));continue}const b=document.createElement('button');b.className='word';b.textContent=shown;b.setAttribute('aria-label',`Reveal word ${i+1}`);b.addEventListener('click',()=>{b.textContent=t;b.setAttribute('aria-label',`Word ${i+1}: ${t}`);b.disabled=true;reveals++;$('reveal-count').textContent='Words revealed in this mode: '+reveals});$('passage').append(b)}}
$('start').addEventListener('click',()=>{tokens=tokenize($('text').value);const n=tokens.filter(isWord).length;if(n<1||n>120){$('error').textContent='Enter between 1 and 120 words.';return}$('error').textContent='';$('example-note').textContent='';$('editor').hidden=true;$('practice').hidden=false;$('mode').value='full';$('reference').textContent=$('label').value||'Your practice passage';render()});
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
$('mode').addEventListener('change',render);$('reset-mode').addEventListener('click',render);$('edit').addEventListener('click',()=>{$('practice').hidden=true;$('editor').hidden=false});}
