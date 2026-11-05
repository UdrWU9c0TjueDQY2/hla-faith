(() => {
  const root = document.getElementById('advent-plan');
  const form = root.querySelector('form');
  const start = form.elements.start;
  const group = root.querySelector('[data-plan]');
  const notice = root.querySelector('[role=status]');
  const print = root.querySelector('[data-print]');
  const dayMs = 86400000;
  const readings = [...root.querySelectorAll('[data-reading]')];
  const fmt = new Intl.DateTimeFormat('en-US', {weekday:'short',month:'short',day:'numeric',year:'numeric',timeZone:'UTC'});
  const today = new Date();
  start.value = [today.getFullYear(), String(today.getMonth()+1).padStart(2,'0'), String(today.getDate()).padStart(2,'0')].join('-');

  function build(announce) {
    group.replaceChildren();
    print.disabled = true;
    if (!start.value || !start.validity.valid) {
      notice.textContent = 'Choose a start date between 1900 and 2100 to see the reading dates.';
      return;
    }
    const count = Number(form.elements.sessions.value);
    const step = Number(form.elements.spacing.value);
    const first = start.valueAsNumber;
    const size = readings.length / count;
    for (let i=0;i<count;i++) {
      const section = document.createElement('article');
      const heading = document.createElement('h3');
      heading.textContent = 'Meeting ' + (i+1) + ' · ' + fmt.format(new Date(first + i*step*dayMs));
      section.append(heading);
      for (const reading of readings.slice(i*size,(i+1)*size)) {
        const title = document.createElement('h4');
        title.textContent = reading.querySelector('strong').textContent;
        section.append(title);
        const text = reading.querySelector('[data-assignment]').cloneNode(true);
        section.append(text);
        const question = reading.querySelector('[data-question]').cloneNode(true);
        section.append(question);
      }
      group.append(section);
    }
    print.disabled = false;
    notice.textContent = announce ? 'Plan updated. '+count+' meetings, with four paired readings in total.' : '';
  }
  form.addEventListener('change',()=>build(true));
  form.addEventListener('submit',e=>{e.preventDefault();build(true);});
  print.addEventListener('click',()=>window.print());
  root.querySelector('[data-controls]').hidden = false;
  build(false);
})();
