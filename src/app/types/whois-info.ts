export type WhoisContact = {
  roles: string[];
  name: string | null;
  organization: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  url: string | null;
};

/** `POST /whois/`. Only rdap answers are parsed, legacy whois comes back in `raw`. */
export type WhoisInfo = {
  domain: string;
  protocol: 'rdap' | 'whois';
  handle: string | null;
  registrar: string | null;
  registrar_url: string | null;
  status: string[];
  created: string | null;
  updated: string | null;
  expires: string | null;
  nameservers: string[];
  dnssec: boolean | null;
  contacts: WhoisContact[];
  raw: unknown;
};
