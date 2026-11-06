const $=id=>document.getElementById(id);let built=false,revealed=false;
function updateSave(){const ready=built&&revealed&&$('reflection').value.trim();$('save-actions').hidden=!ready;$('save-status').textContent='';}
function invalidate(){$('editor').hidden=false;built=false;revealed=false;$('card').hidden=true;$('result').textContent='';$('copy').value='';$('reflection').value='';$('save-actions').hidden=true;$('save-status').textContent='';}
function combined(){return $('copy').value+'\n\nRECALL AND FOLLOW-THROUGH NOTES\n'+$('reflection').value.trim()+'\n\nPersonal summary and reflection; not a scripture quotation.';}
['reference','takeaway','action','revisit'].forEach(k=>$(k).addEventListener('input',invalidate));
$('reflection').addEventListener('input',updateSave);
$('build').addEventListener('click',()=>{const t=$('takeaway').value.trim(),a=$('action').value.trim(),r=$('revisit').value.trim();if(!t||!a||!r){$('result').textContent='Add a takeaway, a concrete action and a time to revisit it.';return;}built=true;revealed=false;$('copy').value='SERMON REVIEW CARD\nPassage reference: '+($('reference').value.trim()||'Not recorded')+'\nMy takeaway (not a quotation): '+t+'\nAction to try: '+a+'\nRevisit: '+r;$('card').hidden=false;$('copy').hidden=false;document.querySelector('label[for="copy"]').hidden=false;$('review').hidden=false;$('reveal').hidden=true;$('recall').hidden=true;$('reflection').value='';updateSave();$('result').textContent='Your card is ready. Copy it to keep it, or hide it to practise recall.';});
$('review').addEventListener('click',()=>{if(!built)return;revealed=false;$('editor').hidden=true;$('copy').hidden=true;document.querySelector('label[for="copy"]').hidden=true;$('review').hidden=true;$('reveal').hidden=false;$('recall').hidden=false;updateSave();$('result').textContent='Notes hidden. Recall the takeaway and chosen action before revealing them.';});
$('reveal').addEventListener('click',()=>{if(!built)return;revealed=true;$('editor').hidden=false;$('copy').hidden=false;document.querySelector('label[for="copy"]').hidden=false;$('reveal').hidden=true;$('review').hidden=false;updateSave();$('result').textContent='Compare your recall with your original notes. When your reflection is ready, copy or download both parts below.';});
$('copy-combined').addEventListener('click',async()=>{if(!built||!revealed||!$('reflection').value.trim())return;try{await navigator.clipboard.writeText(combined());$('save-status').textContent='Card and reflection copied.';}catch{$('save-status').textContent='Copy was unavailable. Use the download instead.';}});
$('download-combined').addEventListener('click',()=>{if(!built||!revealed||!$('reflection').value.trim())return;const u=URL.createObjectURL(new Blob([combined()+'\n'],{type:'text/plain;charset=utf-8'})),a=document.createElement('a');a.href=u;a.download='sermon-review-card-and-reflection.txt';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),1500);$('save-status').textContent='Card and reflection downloaded to your device.';});
const example = {
  takeaway: 'Fictional example: listening can be a practical form of care.',
  action: 'At dinner, let the other person finish before I reply.',
  revisit: 'Thursday after breakfast'
};
$('sample').addEventListener('click', () => {
  const hasDraft = ['reference', 'takeaway', 'action', 'revisit', 'reflection'].some(id => $(id).value.length > 0);
  if (hasDraft) {
    $('result').textContent = example.takeaway + ' Action: ' + example.action + ' Revisit: ' + example.revisit + '. Your notes are still in the form.';
    return;
  }
  for (const [id, value] of Object.entries(example)) $(id).value = value;
  $('result').textContent = 'Example loaded. Build the card to try the recall exercise.';
});
$('reset').addEventListener('click',()=>{['reference','takeaway','action','revisit'].forEach(k=>$(k).value='');invalidate();});
