async function loadSchedule() {
  // Fetch the schedule JSON from the same directory as the webpage
  const response = await fetch('opensauce_schedule.json');
  const data = await response.json();
  const content = document.getElementById('content');
  const calendar = document.getElementById('calendar');
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
  renderCalendar(data);
}

function parseTo24h(t) {
  const [time, mer] = t.split(' ');
  let [h, m] = time.split(':');
  h = parseInt(h, 10);
  if (mer === 'PM' && h !== 12) h += 12;
  if (mer === 'AM' && h === 12) h = 0;
  return `${h.toString().padStart(2, '0')}:${m}`;
}

function renderCalendar(data) {
  const days = ['Friday', 'Saturday', 'Sunday'];
  const slots = [];
  for (let h = 9; h <= 17; h++) {
    slots.push(`${h.toString().padStart(2, '0')}:00`);
    slots.push(`${h.toString().padStart(2, '0')}:30`);
  }
  slots.push('18:00');

  const map = {};
  days.forEach(d => (map[d] = {}));
  days.forEach(day => {
    data[day].forEach(ev => {
      const slot = parseTo24h(ev.time);
      if (!map[day][slot]) map[day][slot] = [];
      map[day][slot].push(ev);
    });
  });

  const table = document.createElement('table');
  table.id = 'calendar-table';
  const thead = document.createElement('thead');
  thead.innerHTML = '<tr><th>Time</th><th>Friday</th><th>Saturday</th><th>Sunday</th></tr>';
  table.appendChild(thead);
  const tbody = document.createElement('tbody');

  slots.forEach(slot => {
    const tr = document.createElement('tr');
    const th = document.createElement('th');
    th.textContent = slot;
    tr.appendChild(th);
    days.forEach(day => {
      const td = document.createElement('td');
      const events = map[day][slot];
      if (events) {
        events.forEach(e => {
          const div = document.createElement('div');
          div.className = 'cal-event';
          div.textContent = `${e.title} (${e.stage})`;
          td.appendChild(div);
        });
      }
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);

  calendar.innerHTML = '';
  calendar.appendChild(table);
}

loadSchedule();
