# `@jordanforeman/jwt-authentication`

[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![Renovate enabled](https://img.shields.io/badge/renovate-enabled-brightgreen.svg)](https://renovatebot.com/)

An authentication strategy middleware for accessing APIs via [JsonWebTokens](https://jwt.io/) using [`@jordanforeman/api-framework`](https://github.com/jordanforeman/api-framework)

## Installation

```bash
$ npm i --save @jordanforeman/{api-framework,jwt-authentication} --save-exact
```

## Usage

Use this module when defining a new controller (endpoint) that requires authentication. Like so:

```js
import {auth as jwt} from '@jordanforeman/jwt-authentication';

const myController = {
    path: '/my/protected/path',
    method: 'GET',
    config: {
        auth: jwt(secretOrPublicKey, options),
        handler: getMyProtectedPath
    }
};
```

If authentication is successful, the current `request` will be hydrated with an `auth` property containing the contents of the JWT's payload. 

If authentication is unsuccessful, the current `request` will be rejected with a `403 Forbidden` error with the following error message:

> Must be authorized to view this resource

### `secretOrPublicKey`

From the [`jsonwebtoken` docs](https://www.npmjs.com/package/jsonwebtoken#jwtverifytoken-secretorpublickey-options-callback):

> `secretOrPublicKey` is a string or buffer containing either the secret for HMAC algorithms, or the PEM encoded public key for RSA and ECDSA. [..] `secretOrPublicKey` can be a function that should fetch the secret or public key.

### `options`

This authentication strategy is largely a pass through to the [`jsonwebtoken` module](https://www.npmjs.com/package/jsonwebtoken), and as such exposes the same `options` that it does in `verify`. For more information, see [`jsonwebtoken.verify` docs](https://www.npmjs.com/package/jsonwebtoken#jwtverifytoken-secretorpublickey-options-callback).

## Additional Reading

For more information about using JsonWebTokens, see [jwt.io](https://jwt.io)
