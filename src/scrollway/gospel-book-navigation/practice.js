(() => {
  'use strict';
  const root = document.getElementById('practice');
  const books = ['Matthew','Mark','Luke','John','Acts'];
  const trips = [[3,2],[1,3],[4,0],[2,4],[0,1]];
  const get = key => root.querySelector('[data-'+key+']');
  const shelf = get('shelf'), earlier = get('earlier'), later = get('later'), found = get('found'), next = get('next');
  let trip = 0, position, route, completed = false, shortest = 0;
  function present() {
    get('book').textContent = books[position];
    get('route').textContent = route.join(' → ');
    earlier.disabled = completed || position === 0;
    later.disabled = completed || position === books.length-1;
    found.disabled = completed;
  }
  function start(focus) {
    completed = false;
    position = trips[trip][0];
    route = [books[position]];
    get('heading').textContent = 'Trip '+(trip+1)+' of '+trips.length+' · Find '+books[trips[trip][1]];
    get('hint').textContent = 'Start at '+books[position]+'. Move one book at a time, then choose “Check this book.”';
    get('answer').textContent = '';
    next.hidden = true;
    shelf.open = false;
    present();
    if (focus) get('heading').focus();
  }
  function move(delta) {
    if (completed || position+delta<0 || position+delta>=books.length) return;
    position+=delta;
    route.push(books[position]);
    get('answer').textContent = 'Now at '+books[position]+'.';
    present();
  }
  earlier.addEventListener('click',()=>move(-1));
  later.addEventListener('click',()=>move(1));
  found.addEventListener('click',()=>{
    if(completed) return;
    const [origin,target]=trips[trip];
    if (position!==target) {
      get('answer').textContent = 'You are at '+books[position]+'. '+books[target]+' is '+(position>target?'earlier':'later')+' on this shelf.';
      return;
    }
    completed=true;
    const minimum=Math.abs(origin-target),moves=route.length-1;
    if(moves===minimum)shortest++;
    get('answer').textContent = 'Found '+books[target]+' in '+moves+(moves===1?' move':' moves')+'. The shortest route takes '+minimum+(minimum===1?' move.':' moves.');
    present();
    next.hidden=false;
    next.textContent=trip===trips.length-1?'Finish practice':'Next trip';
    next.focus();
  });
  next.addEventListener('click',()=>{
    if (trip<trips.length-1) {trip++;start(true);return;}
    get('work').hidden=true;
    get('summary').hidden=false;
    get('result').textContent='You completed all five trips and took the shortest route on '+shortest+' of them.';
    get('finish').focus();
  });
  get('restart').addEventListener('click',()=>{trip=0;shortest=0;get('work').hidden=false;get('summary').hidden=true;start(true)});
  const printButton = document.querySelector('[data-print-sheet]');
  const printStatus = document.querySelector('[data-print-status]');
  if (printButton && printStatus) {
    printButton.addEventListener('click', () => {
      printStatus.textContent = 'Opening the print dialog for the practice sheet and answer key.';
      window.print();
      window.setTimeout(() => {
        printStatus.textContent = 'Prints two pages. The answer key starts on page two.';
      }, 500);
    });
  }
  get('work').hidden=false;
  start(false);
})();
