# research tool

tbd


It's using [wapp](3n3a/wapp).

## Additional requirements
- node.js
- npm
- go
- air

## Usage

First build the assets
```bash
# Install dependencies
npm install

# Build assets
npm run build

# Watch assets for changes
npm run dev
```

Install the [air cli](https://github.com/cosmtrek/air)

```bash
go install github.com/cosmtrek/air@latest
```

Then run the fiber app

```bash
air
```

## Versions of Frontend Libraries

Libraries such as htmx that are included in the html directly and retrieved from cdn. The versions of those can be configured in `versions.json` file.

## Data Sources

All the sources where the data comes from

### Subdomains

ARP Syndicate has an API to get subdomains. It uses tls certificate logs to get this info. 

**Source**: [subdomain.center](https://subdomain.center) / [crt.sh](https://crt.sh)

### DNS Lookup

DNS over HTTPS Lookup via Cloudflare DNS

**Source**: [one.one.one.one](https://1.1.1.1)