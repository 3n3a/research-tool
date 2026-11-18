# ResearchTool

> Do Research Online. Simply.

Angular 21 frontend for [research-tool-api](https://github.com/3n3a/research-tool-api). Built with
PrimeNG 21 (Aura preset, customised in `src/app/themes/aura-standard.ts`) and Tailwind 3 utilities —
there is no hand-written CSS in this project, and every `*.component.scss` is intentionally empty.

## Researching a domain

Every page is deep-linkable and reruns its query straight from the url, so results can be shared and
one lookup leads into the next:

| Page | Query parameters |
|---|---|
| `/app/subdomains` | `domain`, `source` |
| `/app/dns` | `domain`, `dns_type`, `dns_source`, `dns_proto` |
| `/app/ip` | `query` |
| `/app/whois` | `domain` |

The drill-down paths:

- **Subdomains → DNS.** Expand any row in the subdomains table to load that hostname's records
  inline. The record type select above the table controls which type is fetched (`A` by default) and
  reloads any row that is already open.
- **DNS → IP.** `A` and `AAAA` values open an ip-information drawer in place. Everything that ends in
  a hostname — `CNAME`, `DNAME`, `NS`, `PTR`, `MX`, `SRV` — links on to a dns lookup or a subdomain
  search for that target.
- **Subdomain liveness.** The DNS column tags each result as resolving (has an `A`/`AAAA` answer) or
  not. Only the page being shown is resolved, through the api's `/dns/resolve`, which caches answers
  per resolver; the All / Resolving / Not resolving toggle filters the rows of that page.
- **Whois.** Registration data (registrar, dates, status, nameservers, contacts and the raw rdap
  answer) from [whois-lookup](https://github.com/3n3a/whois-lookup), proxied by the api. A
  subdomain is looked up as its registered domain.
- **Between pages.** Subdomains, dns and whois each link to the other two views of the current domain,
  and the ip page links to the dns records and whois of the reverse-dns name.

The backend drives every dropdown from its option endpoints, so new subdomain sources appear here
without a frontend change. Subdomain searches default to the `all` preset.

The version in the top bar is `version` from `package.json`.

## Development server

The api base url comes from `src/environments/environment.development.ts` and defaults to
`http://localhost:8000`, which is where `uv run fastapi dev` serves the backend. Start it first, then:

```bash
npm start
```

Open `http://localhost:4200/`. The app reloads on every source change.

## Building

```bash
npm run build
```

Build artifacts land in `dist/`. The production configuration is the default.

## Running unit tests

Tests run on [Vitest](https://vitest.dev) through the `@angular/build:unit-test` builder:

```bash
npm test
```

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the
[Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
