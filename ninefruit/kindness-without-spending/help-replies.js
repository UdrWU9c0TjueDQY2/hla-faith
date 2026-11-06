(() => {
  'use strict';
  const scenes = [
    { title: 'After the potluck', moment: 'Someone is packing leftovers into their own containers. You have ten minutes before your ride comes.',
      openings: [
        ['“Would an extra pair of hands help for ten minutes?”', '“Thanks, I have the food sorted. You could stack those empty chairs.”', [
          ['“I can stack chairs until my ride comes.”', 'You agreed to a specific task with a clear stopping point.'],
          ['“I should check the food first.”', 'They already have the food sorted. Return to the task they actually named.']]],
        ['“I’ll pack those containers for you.”', '“Please leave them there. I need to label them first.”', [
          ['“Got it. I’ll leave them where they are.”', 'You heard the boundary and changed what you were about to do.'],
          ['“It’ll be quicker if I just do it.”', 'Speed is your goal here. The labels matter to the person doing the packing.']]]
      ] },
    { title: 'A quiet group chat', moment: 'A friend mentions a difficult week in a private conversation. You are tempted to organize support in the group chat.',
      openings: [
        ['“Would you like me to mention it to the group?”', '“Please keep it between us.”', [
          ['“I will. Would you like company, or some space?”', 'You kept their confidence and gave them a choice about what happens next.'],
          ['“I’ll just say someone needs prayer.”', 'Even without a name, details may identify them. Keep the conversation private.']]],
        ['“I can listen for a few minutes if you’d like.”', '“Listening would help. I’m not looking for advice.”', [
          ['“What part of the week has felt hardest?”', 'You made room for the kind of help they requested.'],
          ['“Here’s what I would do.”', 'Advice answers a different request. Start again by asking what they want you to hear.']]]
      ] },
    { title: 'A borrowed Saturday', moment: 'A neighbor asks for a hand moving boxes. You have half an hour, and you need to leave on time.',
      openings: [
        ['“I can help from ten until ten-thirty.”', '“Could you stay until noon instead?”', [
          ['“Ten-thirty is when I need to go. Does half an hour still help?”', 'They can decide whether your actual offer fits their plan.'],
          ['“I’ll try,” even though you already know you must leave.', 'They may plan around two hours you cannot give. State the time you can promise.']]],
        ['“Which part of the move would help most?”', '“Just marking the boxes before the van arrives.”', [
          ['“I can label boxes for half an hour. Where should the labels go?”', 'You checked the job and the time before starting.'],
          ['“I’ll rearrange the boxes first.”', 'They named a job they need. Ask before changing their arrangement.']]]
      ] }
  ];
  const root = document.getElementById('reply-practice');
  if (!root) return;
  const panel = root.querySelector('[data-panel]');
  const title = root.querySelector('[data-stage]');
  const prompt = root.querySelector('[data-prompt]');
  const choices = root.querySelector('[data-choices]');
  const log = root.querySelector('[data-log]');
  function render(heading, line, options, focus) {
    title.textContent = heading;
    prompt.textContent = line;
    choices.replaceChildren();
    for (const [label, onChoose] of options) {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = label;
      button.addEventListener('click', onChoose);
      choices.append(button);
    }
    if (focus) title.focus();
  }
  function menu(focus=true) {
    log.textContent = '';
    render('Choose a situation', 'Try one conversation, then replay it to see how another opening changes the reply.', scenes.map(scene => [scene.title, () => open(scene)]), focus);
  }
  function open(scene) {
    log.textContent = '';
    render(scene.title, scene.moment, scene.openings.map(branch => [branch[0], () => answer(scene, branch)]), true);
  }
  function answer(scene, branch) {
    log.textContent = 'Your opening: ' + branch[0];
    render('Their reply', branch[1], branch[2].map(end => [end[0], () => {
      log.textContent = 'You said: ' + end[0];
      render('What your reply did', end[1], [['Replay this situation', () => open(scene)], ['Choose another situation', () => menu()]], true);
    }]), true);
  }
  panel.hidden = false;
  menu(false);
})();
