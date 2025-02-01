# HELP

## Generate Page

```bash
ng g component -p pages pages/<name>
```

## Components

```bash
ng g component -p comp components/<name>
```

## Services

```bash
ng g service services/<name>/<name>
```

## Install Node.js

Make sure the same version that is specified in `.tool-versions`

or when using `asdf`:

```bash
asdf install
```

## Examples

### Toast

```js
constructor (private messageService: MessageService) {
    this.messageService.add({
        severity: 'info',
        summary: 'Successful',
        detail: 'Successfully retrieved ping from backend.',
        life: 2000,
    })
}
```