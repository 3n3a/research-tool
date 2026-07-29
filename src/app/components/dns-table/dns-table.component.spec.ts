import { describe, expect, it } from 'vitest';

import { dnsTarget } from './dns-table.component';

describe('dnsTarget', () => {
  it('offers ip inspection for address records', () => {
    expect(dnsTarget({ type: 'A', data: '93.184.216.34' })).toEqual({
      kind: 'ip',
      value: '93.184.216.34',
    });
    expect(dnsTarget({ type: 'AAAA', data: '2606:2800:220:1:248:1893:25c8:1946' })).toEqual({
      kind: 'ip',
      value: '2606:2800:220:1:248:1893:25c8:1946',
    });
  });

  it('strips the trailing dot from a single-name target', () => {
    expect(dnsTarget({ type: 'CNAME', data: 'Www.Example.com.' })).toEqual({
      kind: 'host',
      value: 'www.example.com',
    });
  });

  it('takes the name out of the priority and port prefixed types', () => {
    expect(dnsTarget({ type: 'MX', data: '10 mx.example.com.' })).toEqual({
      kind: 'host',
      value: 'mx.example.com',
    });
    expect(dnsTarget({ type: 'SRV', data: '0 5 5060 sip.example.com.' })).toEqual({
      kind: 'host',
      value: 'sip.example.com',
    });
  });

  it('does not offer to follow a root target', () => {
    // A null MX (RFC 7505) has nowhere to drill down to.
    expect(dnsTarget({ type: 'MX', data: '0 .' })).toEqual({ kind: 'text', value: '0 .' });
  });

  it('leaves other record types as plain text', () => {
    const spf = { type: 'TXT', data: 'v=spf1 include:example.com ~all' };
    expect(dnsTarget(spf)).toEqual({ kind: 'text', value: spf.data });
    expect(dnsTarget({ type: 'SOA', data: 'ns.example.com. hostmaster.example.com. 1 2 3 4 5' }))
      .toEqual({
        kind: 'text',
        value: 'ns.example.com. hostmaster.example.com. 1 2 3 4 5',
      });
  });
});
