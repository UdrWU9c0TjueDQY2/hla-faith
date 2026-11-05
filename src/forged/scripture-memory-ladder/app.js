'use strict';
function tokenize(text){return text.match(/[\p{L}\p{M}\p{N}]+(?:['\u2019][\p{L}\p{M}\p{N}]+)*|[^\p{L}\p{M}\p{N}]+/gu)||[]}
function isWord(t){return /^[\p{L}\p{M}\p{N}]/u.test(t)}
function display(t,i,mode){if(mode==='full'||mode==='alternate'&&i%2===0)return t;return mode==='initials'?Array.from(t)[0]+'...':'____'}
if(typeof module!=='undefined')module.exports={tokenize,isWord,display};
if(typeof document!=='undefined'){
const $ = id => document.getElementById(id);
let tokens = [], reveals = 0;
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
$('mode').addEventListener('change',render);$('reset-mode').addEventListener('click',render);$('edit').addEventListener('click',()=>{$('practice').hidden=true;$('editor').hidden=false;$('text').focus()});}
