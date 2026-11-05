const $=id=>document.getElementById(id);
const cases=[
  {"title":"The Saturday favour","scene":"You agreed to help a friend sort boxes for two hours. A work shift is added, leaving you only thirty minutes.","choices":[["Say nothing and hope they forget.","Your friend may still plan around two hours of help. Silence leaves the mismatch unresolved.","Try: “My shift changed. I can help for thirty minutes, or we can choose another day. Would either help?”"],["Offer a smaller commitment before Saturday.","You name the change and offer a specific limit. Your friend can decide whether that still meets their need.","Keep the thirty-minute offer only if it is realistic. A proposed change is not agreed until they reply."],["Promise four hours next week to make up for it.","A bigger promise can feel generous, but it creates another obligation you have not checked.","Before offering more time, check what you can actually give. Repair does not require an oversized promise."]]},
  {"title":"The unanswered check-in","scene":"You said you would call your cousin this week. It is Friday evening and you have not called.","choices":[["Send a brief message and suggest an exact time.","You acknowledge the missed intention and make the next step concrete.","Try: “I haven’t called yet. Would Sunday at four work? If not, what suits you?”"],["Tell yourself that meaning well is enough.","The intention matters to you, but your cousin cannot see it. Nothing has changed in the shared plan.","Choose one action you can take now: a message, a call if welcome, or an honest apology."],["Call repeatedly until they answer.","Following through does not require ignoring someone else’s availability.","Try once at a reasonable time, then leave a low-pressure invitation. They can choose when to reply."]]},
  {"title":"The group task","scene":"You volunteered to make twelve name cards. You have made six and realise you cannot finish the rest before the event.","choices":[["Mark the task done because half is finished.","That hides unfinished work and makes it harder for the group to adjust.","Separate completed work from remaining work: six finished, six still needed."],["Ask the group to read your mind.","Other people may not know the task is behind. Waiting removes their chance to help plan.","Send a concrete update early enough for them to respond."],["Report six finished and ask how to handle the remaining six.","You preserve the work already done while making the gap visible.","Try: “Six are ready. I can’t finish the other six in time. Can someone take those, or should we simplify?”"]]},
  {"title":"The borrowed book","scene":"You promised to return a book on Monday. On Sunday you notice a torn page you caused.","choices":[["Return it without mentioning the damage.","The object comes back, but the other person lacks information about what happened.","An honest return includes the damage, not only the handoff."],["Explain the damage and ask what repair would be useful.","You take responsibility without deciding for the owner what they should accept.","Try: “I tore a page. I’m sorry. Would you prefer a replacement or another solution?”"],["Buy an expensive replacement without asking.","You may solve the problem, but this copy could have personal value that a new one does not replace.","Ask first. A helpful offer leaves room for the owner’s preference."]]},
  {"title":"The recurring commitment","scene":"You agreed to help every Tuesday. Your schedule has changed for the next month, so Tuesdays no longer work.","choices":[["Renegotiate the recurring plan explicitly.","You address the whole month instead of cancelling separately every week.","Name what you can offer, when the change starts, and when to review it. The other person can decline."],["Invent a new excuse every Tuesday.","Repeated last-minute explanations hide the underlying schedule problem.","One honest conversation gives both people more useful information."],["Keep saying yes and become resentful.","An agreement you cannot sustainably keep may create avoidable strain.","A clear limit can be more dependable than repeated reluctant promises."]]},
  {"title":"The unsafe request","scene":"Someone asks you to keep a promise that would require entering a situation where you feel unsafe.","choices":[["Keep it at any cost.","A promise is not a reason to ignore safety or coercion.","Pause the commitment. Seek appropriate trusted support; you do not owe someone access to an unsafe situation."],["Treat discomfort and danger as the same thing.","They are not always the same, but this short exercise cannot assess your situation.","If safety is uncertain, get suitable support rather than using a practice card to decide."],["Put safety first and change or end the commitment.","You can state a boundary without proving your faithfulness through risk.","Try a brief boundary if safe to communicate: “I can’t do that.” This exercise is not counselling."]]}
];
let index=0,selected=Array(6).fill(-1);
const note=$('note');
const exportRow=document.createElement('div');
exportRow.className='actions';
const copyButton=document.createElement('button');
copyButton.type='button';
copyButton.className='secondary';
copyButton.textContent='Copy my reflection';
const downloadButton=document.createElement('button');
downloadButton.type='button';
downloadButton.textContent='Download my reflection';
const exportStatus=document.createElement('p');
exportStatus.className='fine';
exportStatus.setAttribute('role','status');
exportStatus.setAttribute('aria-live','polite');
exportRow.append(copyButton,downloadButton);
note.parentNode.insertBefore(exportRow,note.nextSibling);
exportRow.parentNode.insertBefore(exportStatus,exportRow.nextSibling);

function exportText(){
  const lines=['Ninefruit promise-practice reflection','Companion by Honest Little Apps',''];
  selected.forEach((choice,caseIndex)=>{
    if(choice<0)return;
    const item=cases[caseIndex],answer=item.choices[choice];
    lines.push(item.title);
    lines.push('Selected response: '+answer[0]);
    lines.push('Tradeoff: '+answer[1]);
    lines.push('Possible next step: '+answer[2]);
    lines.push('');
  });
  const written=note.value.trim();
  if(written){
    lines.push('My optional commitment note:');
    lines.push(written);
    lines.push('');
  }
  lines.push('Reflection practice only — not a faith score, scripture quotation or counselling.');
  return lines.join('\n');
}
function refreshExport(){
  const hasContent=selected.some(value=>value>=0)||note.value.trim().length>0;
  copyButton.disabled=!hasContent;
  downloadButton.disabled=!hasContent;
  exportStatus.textContent='';
}
function render(){
  const c=cases[index];
  $('progress').textContent='Scenario '+(index+1)+' of '+cases.length;
  $('sceneTitle').textContent=c.title;
  $('scene').textContent=c.scene;
  $('choices').replaceChildren();
  c.choices.forEach((v,i)=>{
    const b=document.createElement('button');
    b.textContent=v[0];
    b.setAttribute('aria-pressed',String(selected[index]===i));
    b.addEventListener('click',()=>{selected[index]=i;render();refreshExport();});
    $('choices').append(b);
  });
  $('result').textContent=selected[index]<0?'':c.choices[selected[index]][1]+'\n\n'+c.choices[selected[index]][2];
  $('back').disabled=index===0;
  $('next').disabled=index===cases.length-1;
}
$('back').addEventListener('click',()=>{if(index>0){index--;render();}});
$('next').addEventListener('click',()=>{if(index<5){index++;render();}});
note.addEventListener('input',refreshExport);
$('reset').addEventListener('click',()=>{
  const hasWork=selected.some(value=>value>=0)||note.value.trim().length>0;
  if(hasWork&&!window.confirm('Restart and clear your selected responses and optional note?'))return;
  index=0;
  selected.fill(-1);
  note.value='';
  render();
  refreshExport();
});
copyButton.addEventListener('click',async()=>{
  try{
    await navigator.clipboard.writeText(exportText());
    exportStatus.textContent='Reflection copied. It was not uploaded or saved by this page.';
  }catch{
    exportStatus.textContent='Copy was unavailable. Use Download my reflection instead.';
  }
});
downloadButton.addEventListener('click',()=>{
  const url=URL.createObjectURL(new Blob([exportText()+'\n'],{type:'text/plain;charset=utf-8'}));
  const anchor=document.createElement('a');
  anchor.href=url;
  anchor.download='ninefruit-promise-reflection.txt';
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(()=>URL.revokeObjectURL(url),1500);
  exportStatus.textContent='Reflection downloaded locally. It was not uploaded or saved by this page.';
});
render();
refreshExport();
