async function loadSchedule() {
  const content = document.getElementById('content');
  let data;
  try {
    // fetch the schedule JSON from the same directory as the page
    const response = await fetch('./opensauce_schedule.json');
    if (!response.ok) throw new Error('Request failed');
    data = await response.json();
  } catch (err) {
    content.innerHTML = '<p class="error">Failed to load schedule.</p>';
    console.error(err);
    return;
  }
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

document.addEventListener('DOMContentLoaded', loadSchedule);
