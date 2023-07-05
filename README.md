# Demo

-   [PROD](https://avatar-prod.vercel.app/)
-   [QA](https://avatar-prod-git-qa-kristian-io.vercel.app/)
-   [DEV](https://avatar-prod-git-dev-kristian-io.vercel.app/)

## Environments

Requires a 'environments' directory in the root.

-   `.dev.env`
-   `.qa.env`
-   `.prod.env`

with the following definitions

```js
REACT_APP_API_END_POINT=http://127.0.0.1:8090
PORT=3003
```

## Available commands

### `npm start[dev|qa|prod]`
