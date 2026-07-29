export type DnsAnswer = {
  name: string;
  type: string;
  ttl: number;
  data: string;
  /** Resolver that answered, e.g. `https://cloudflare-dns.com/dns-query`. */
  server: string;
}
