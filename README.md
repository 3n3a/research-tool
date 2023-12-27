# research tool

tbd


It's using [gofiber/template](https://github.com/gofiber/template), [Tailwind CSS](https://tailwindcss.com) and [Parcel](https://parceljs.org).

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

## Data Sources

All the sources where the data comes from

### Subdomains

ARP Syndicate has an API to get subdomains. It uses tls certificate logs to get this info. 

**Source**: [subdomain.center](https://subdomain.center) / [crt.sh](https://crt.sh)

### DNS Lookup

DNS over HTTPS Lookup via Cloudflare DNS

**Source**: [one.one.one.one](https://1.1.1.1)