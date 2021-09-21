# node-onlykey

Get a Onlykey USB: [https://onlykey.io/sea](https://onlykey.io/sea)

Live Demo for 3rd Party: [https://docs.crp.to/node-onlykey/docs/](https://docs.crp.to/node-onlykey/docs/)

------

3rd Party Support
---

Supports
* ECDH and ECDSA (NIST256P1)
* ECDH and EDDSA (ED25519)
* NACL


API
----

```js
require("./dist/onlykey3rd-party.js")(function(ONLYKEY) {

  var ok = ONLYKEY();

})
```


Events
-----

```js
ok.on(event,function() {})
```

List of events

* `"status"`  outputs current operation in english
* `"error"`   emits any errors during operations


Methods
-----

```js
ok.connect(function() {})
```
`connect()` does ECDH for secure session using NACL and informs hardware of current time, OS, and browser.


```js
ok.derive_public_key(AdditionalData, keyType, press_required, function(error, ok_jwk_epub, ok_jwk_spub) {})
```

`derive_public_key()` does `connect()` and returns a hardware generated public key from OnlyKey

```js
ok.derive_shared_secret(AdditionalData, input_jwk_epub, keyType, press_required, function(error, shared_secret, ok_jwk_epub) {})
```

`derive_shared_secret()` does `connect()` and returns a hardware generated shared secret from OnlyKey that can be used as private key for encryption/decryption


```js
ok.derive_signature(AdditionalData, signing_hash, keyType, press_required, function(error, signature, ok_jwk_spub) {})
```

`derive_signature()` does `connect()` and returns a hardware generated signature from OnlyKey that can be used to verify data

*   `AdditionalData` = `string` or `buffer` to point to a derived key
*   `input_jwk_epub` = input public key in jwk format
*   `ok_jwk_epub` = onlykey output public encryption key in jwk format
*   `ok_jwk_spub` = onlykey output public signing key in jwk format
*   `keyType` = key generation type
*   `shared_secret`  = shared AES-GCM key

`KEYTYPE`
*   KEYTYPE_NACL = `0`
*   KEYTYPE_P256R1 = `1`
*   KEYTYPE_P256K1 = `2`
*   KEYTYPE_CURVE25519 = `3`

How It Works
-----------

OnlyKey uses the RPID provided from FIDO2 (the origin url), the input public key `jwk_epub`, and any additional data `AdditionalData` such as a username to generate a public/private keypair. OnlyKey returns the public key with `derive_public_key()` and returns the shared secret of "input public/generated private" with `derive_shared_secret()`. 

Single-User Application - This shared secret can be used for encryption and signing purposes. Given the same inputs and the same web site origin the same shared secret can be recreated. 

Multi-User Application - Like a typical ECDH key exchange, both USERA and USERB obtain hardware generated public keys with `derive_public_key()`, these public keys are exchanged and used as input public key for `derive_shared_secret()`. Each user generates the same shared secret which can be used for encryption and signing purposes between USERA and USERB.

API Authors
-----------
* Tim ~  onlykey.io
* Brad ~  bmatusiak.us