import test from 'node:test';
import assert from 'node:assert/strict';
import { add, aptState, dayState, split } from '../src/calendario.js';

const data = { venere: [['2026-12-06', '2026-12-09']], elimo: [['2026-12-08', '2026-12-10']], balio: null };

test('un giorno per più appartamenti: libero, in parte, occupato, da verificare', () => {
  assert.equal(dayState(data, ['venere', 'elimo'], '2026-12-05'), 'free');
  assert.equal(dayState(data, ['venere', 'elimo'], '2026-12-06'), 'partial');
  assert.equal(dayState(data, ['venere', 'elimo'], '2026-12-08'), 'booked');
  assert.equal(dayState(data, ['venere'], '2026-12-08'), 'booked');
  assert.equal(dayState(data, ['venere', 'balio'], '2026-12-05'), 'unknown');
  assert.equal(dayState(data, ['venere', 'balio'], '2026-12-06'), 'partial');
});

test('un calendario mancante non è mai libero', () => {
  for (const d of [null, undefined, {}, { balio: null }]) {
    assert.equal(aptState(d, 'balio', '2026-12-01', '2026-12-02'), 'unknown');
    assert.equal(dayState(d, ['balio'], '2026-12-01'), 'unknown');
  }
  assert.equal(dayState({ balio: [] }, ['balio'], '2026-12-01'), 'free'); // collegato e senza prenotazioni
});

test('la notte della partenza è libera, e si può partire il giorno in cui arriva un altro', () => {
  assert.equal(dayState(data, ['venere'], '2026-12-09'), 'free');
  assert.equal(aptState(data, 'venere', '2026-12-04', '2026-12-06'), 'free');
  assert.equal(aptState(data, 'venere', '2026-12-04', '2026-12-07'), 'busy');
  assert.equal(aptState(data, 'venere', '2026-12-01', '2026-12-31'), 'busy'); // prenotazione tutta dentro il periodo
});

test('un periodo diviso tra chi è libero, occupato e da verificare', () => {
  assert.deepEqual(split(data, ['venere', 'elimo', 'balio'], '2026-12-09', '2026-12-11'), { free: ['venere'], busy: ['elimo'], unknown: ['balio'] });
});

test('i giorni passano bene mesi, anni e cambio dell’ora', () => {
  assert.equal(add('2026-12-31', 1), '2027-01-01'); assert.equal(add('2027-03-28', 1), '2027-03-29'); assert.equal(add('2028-02-28', 1), '2028-02-29');
});
