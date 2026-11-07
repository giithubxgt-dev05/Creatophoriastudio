import test from 'node:test';
import assert from 'node:assert/strict';
import {
  validateLeadInput,
  generateLeadId,
  escapeCSV,
  leadsToCSV,
  filterLeads,
  calculateLeadStats,
  Lead
} from './leads';

test('validateLeadInput catches missing required fields', () => {
  assert.equal(validateLeadInput({}).valid, false);
  assert.equal(validateLeadInput({ name: 'Alex' }).valid, false);
  assert.equal(validateLeadInput({ name: 'Alex', email: 'alex@example.com' }).valid, false);
  assert.equal(validateLeadInput({ name: 'Alex', email: 'alex@example.com', service: 'Brand Identity' }).valid, false);
  assert.equal(
    validateLeadInput({
      name: 'Alex',
      email: 'alex@example.com',
      service: 'Brand Identity',
      message: 'Need a rebrand'
    }).valid,
    true
  );
});

test('generateLeadId generates unique string starting with lead_', () => {
  const id1 = generateLeadId();
  const id2 = generateLeadId();
  assert.match(id1, /^lead_\d+_[a-z0-9]+$/);
  assert.notEqual(id1, id2);
});

test('escapeCSV handles commas, quotes, and newlines', () => {
  assert.equal(escapeCSV('simple'), '"simple"');
  assert.equal(escapeCSV('quote "here"'), '"quote ""here"""');
  assert.equal(escapeCSV('line 1\nline 2'), '"line 1 line 2"');
  assert.equal(escapeCSV(null), '""');
});

test('calculateLeadStats calculates metrics correctly', () => {
  const sampleLeads: Lead[] = [
    {
      id: '1',
      name: 'Lead 1',
      contact: '123',
      email: 'l1@test.com',
      service: 'Brand Identity',
      budget: 'Flexible',
      timeline: 'Flexible',
      message: 'Hi',
      status: 'new',
      createdAt: '2026-01-01'
    },
    {
      id: '2',
      name: 'Lead 2',
      contact: '456',
      email: 'l2@test.com',
      service: 'Brand Identity',
      budget: 'Flexible',
      timeline: 'Flexible',
      message: 'Hi',
      status: 'in_discussion',
      createdAt: '2026-01-02'
    },
    {
      id: '3',
      name: 'Lead 3',
      contact: '789',
      email: 'l3@test.com',
      service: 'Motion Graphics',
      budget: 'Flexible',
      timeline: 'Flexible',
      message: 'Hi',
      status: 'booked',
      createdAt: '2026-01-03'
    }
  ];

  const stats = calculateLeadStats(sampleLeads);
  assert.equal(stats.total, 3);
  assert.equal(stats.new, 1);
  assert.equal(stats.inDiscussion, 1);
  assert.equal(stats.booked, 1);
  assert.equal(stats.topService, 'Brand Identity');
});

test('filterLeads filters by status, service, and search', () => {
  const sampleLeads: Lead[] = [
    {
      id: '1',
      name: 'Alice Springs',
      contact: '123',
      email: 'alice@test.com',
      service: 'Motion Graphics',
      budget: 'Flexible',
      timeline: 'Flexible',
      message: 'Need 3D intro',
      status: 'new',
      createdAt: '2026-01-01'
    },
    {
      id: '2',
      name: 'Bob Builder',
      contact: '456',
      email: 'bob@test.com',
      service: 'Brand Identity',
      budget: 'Flexible',
      timeline: 'Flexible',
      message: 'Need logo',
      status: 'booked',
      createdAt: '2026-01-02'
    }
  ];

  assert.equal(filterLeads(sampleLeads, 'new').length, 1);
  assert.equal(filterLeads(sampleLeads, 'all', 'Brand Identity').length, 1);
  assert.equal(filterLeads(sampleLeads, 'all', 'all', '3D').length, 1);
  assert.equal(filterLeads(sampleLeads, 'all', 'all', 'Alice').length, 1);
});
