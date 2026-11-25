import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseIcal } from '../worker/disponibilita.js';

const cal = (body) => `BEGIN:VCALENDAR\r\nVERSION:2.0\r\n${body}END:VCALENDAR\r\n`;

test('evento Booking con date semplici', () => {
  const ics = cal('BEGIN:VEVENT\r\nDTSTART;VALUE=DATE:20261210\r\nDTEND;VALUE=DATE:20261213\r\nSUMMARY:CLOSED - Not available\r\nEND:VEVENT\r\n');
  assert.deepEqual(parseIcal(ics), [['2026-12-10', '2026-12-13']]);
});

test('evento Google con TZID e righe spezzate', () => {
  const ics = cal('BEGIN:VEVENT\r\nDTSTART;TZID=Europe/Rome:20270102T150000\r\nDTEND;TZID=Europe/Rome:2027\r\n 0105T100000\r\nEND:VEVENT\r\n');
  assert.deepEqual(parseIcal(ics), [['2027-01-02', '2027-01-05']]);
});

test('eventi cancellati ignorati, evento senza fine = una notte', () => {
  const ics = cal(
    'BEGIN:VEVENT\r\nDTSTART;VALUE=DATE:20261201\r\nDTEND;VALUE=DATE:20261203\r\nSTATUS:CANCELLED\r\nEND:VEVENT\r\n' +
    'BEGIN:VEVENT\r\nDTSTART;VALUE=DATE:20261231\r\nEND:VEVENT\r\n'
  );
  assert.deepEqual(parseIcal(ics), [['2026-12-31', '2027-01-01']]);
});

test('calendario vuoto', () => {
  assert.deepEqual(parseIcal(cal('')), []);
});
