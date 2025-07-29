import json
from datetime import datetime, timedelta

with open('opensauce_schedule.json', 'r') as f:
    schedule = json.load(f)

DATE_MAP = {
    'Friday': '20250725',
    'Saturday': '20250726',
    'Sunday': '20250727'
}

ics_lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//OpenSauce Schedule//EN',
    'CALSCALE:GREGORIAN'
]

for day, date_str in DATE_MAP.items():
    for event in schedule.get(day, []):
        start_dt = datetime.strptime(f"{date_str} {event['time']}", "%Y%m%d %I:%M %p")
        dur_minutes = 0
        dur_token = event.get('duration', '').strip('()')
        if dur_token:
            try:
                dur_minutes = int(dur_token.split()[0])
            except (ValueError, IndexError):
                dur_minutes = 0
        end_dt = start_dt + timedelta(minutes=dur_minutes)
        fmt = "%Y%m%dT%H%M%S"
        ics_lines.append('BEGIN:VEVENT')
        ics_lines.append(f"UID:{start_dt.strftime(fmt)}-{event['stage'].replace(' ', '')}@opensauce")
        ics_lines.append(f"DTSTAMP:{datetime.utcnow().strftime(fmt)}")
        ics_lines.append(f"DTSTART:{start_dt.strftime(fmt)}")
        ics_lines.append(f"DTEND:{end_dt.strftime(fmt)}")
        ics_lines.append(f"SUMMARY:{event['title']}")
        ics_lines.append(f"DESCRIPTION:{event['description']}")
        ics_lines.append(f"LOCATION:{event['stage']}")
        ics_lines.append('END:VEVENT')

ics_lines.append('END:VCALENDAR')

with open('docs/opensauce_schedule.ics', 'w') as f:
    f.write("\n".join(ics_lines))
