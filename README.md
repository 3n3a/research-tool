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
