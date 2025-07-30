async function loadSchedule() {
  // Fetch the schedule JSON from the same directory as the webpage
  const response = await fetch('opensauce_schedule.json');
  const data = await response.json();
  const content = document.getElementById('content');
  const tabs = document.querySelectorAll('#tabs button');

  function render(day) {
    content.innerHTML = '';
    data[day].forEach(ev => {
      const div = document.createElement('div');
      div.className = 'event';
      div.innerHTML = `
        <div class="time">${ev.time} ${ev.duration}</div>
        <h3>${ev.title}</h3>
        <div class="stage">${ev.stage}</div>
        <p>${ev.description}</p>
        <div class="speakers">${ev.speakers.join(', ')}</div>
      `;
      content.appendChild(div);
    });
  }

  tabs.forEach(btn => {
    btn.addEventListener('click', () => {
      tabs.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      render(btn.dataset.day);
    });
  });

  render('Friday');
}

loadSchedule();
