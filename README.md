# ML-DSA RDFC 2024 Data Integrity Cryptosuite _(@digitalbazaar/mldsa44-rdfc-2024-cryptosuite)_

[![Build status](https://img.shields.io/github/actions/workflow/status/digitalbazaar/mldsa44-rdfc-2024-cryptosuite/main.yml)](https://github.com/digitalbazaar/mldsa44-rdfc-2024-cryptosuite/actions?query=workflow%3A%22Node.js+CI%22)
[![Coverage status](https://img.shields.io/codecov/c/github/digitalbazaar/mldsa44-rdfc-2024-cryptosuite)](https://codecov.io/gh/digitalbazaar/mldsa44-rdfc-2024-cryptosuite)
[![NPM Version](https://img.shields.io/npm/v/@digitalbazaar/mldsa44-rdfc-2024-cryptosuite.svg)](https://npm.im/@digitalbazaar/mldsa44-rdfc-2024-cryptosuite)

> ML-DSA RDFC 2024 Data Integrity Cryptosuite for use with jsonld-signatures.

## Table of Contents

- [ML-DSA RDFC 2024 Data Integrity Cryptosuite _(@digitalbazaar/mldsa44-rdfc-2024-cryptosuite)_](#ml-dsa-rdfc-2024-data-integrity-cryptosuite-digitalbazaarmldsa44-rdfc-2024-cryptosuite)
  - [Table of Contents](#table-of-contents)
  - [Background](#background)
  - [Security](#security)
  - [Install](#install)
  - [Usage](#usage)
  - [Contribute](#contribute)
  - [Commercial Support](#commercial-support)
  - [License](#license)

## Background

For use with https://github.com/digitalbazaar/jsonld-signatures v11.0 and above.

See also related specs:

* [Verifiable Credential Data Integrity](https://w3c.github.io/vc-data-integrity/)

## Security

TBD

## Install

- Browsers and Node.js 22+ are supported.

To install from NPM:

```
npm install @digitalbazaar/mldsa44-rdfc-2024-cryptosuite
```

To install locally (for development):

```
git clone https://github.com/digitalbazaar/mldsa44-rdfc-2024-cryptosuite.git
cd mldsa44-rdfc-2024-cryptosuite
npm install
```

## Usage

The following code snippet provides a complete example of digitally signing
a verifiable credential using this library:

```javascript
import * as MldsaMultikey from '@digitalbazaar/mldsa-multikey';
import {DataIntegrityProof} from '@digitalbazaar/data-integrity';
import {cryptosuite as mldsa44Rdfc2024Cryptosuite} from
  '@digitalbazaar/mldsa44-rdfc-2024-cryptosuite';
import jsigs from 'jsonld-signatures';
const {purposes: {AssertionProofPurpose}} = jsigs;


// create the unsigned credential
const unsignedCredential = {
  '@context': [
    'https://www.w3.org/ns/credentials/v2',
    'https://www.w3.org/ns/credentials/examples/v2'
  ],
  id: 'http://university.example/credentials/58473',
  type: ['VerifiableCredential', 'ExampleAlumniCredential'],
  issuer: 'did:example:2g55q912ec3476eba2l9812ecbfe',
  validFrom: '2010-01-01T00:00:00Z',
  credentialSubject: {
    id: 'did:example:ebfeb1f712ebc6f1c276e12ec21',
    alumniOf: {
      id: 'did:example:c276e12ec21ebfeb1f712ebc6f1',
      name: 'Example University'
    }
  }
};

// create the keypair to use when signing
const controller = 'https://example.edu/issuers/565049';
const keyPair = await EcdsaMultikey.from({
  '@context': 'https://w3id.org/security/multikey/v1',
  id: 'https://example.edu/issuers/565049#TBD',
  type: 'Multikey',
  controller: 'https://example.edu/issuers/565049',
  publicKeyMultibase: 'TBD',
  secretKeyMultibase: 'TBD'
});

// export public key and add to document loader
const publicKey = await keyPair.export({publicKey: true, includeContext: true});
addDocumentToLoader({url: publicKey.id, document: publicKey});

// create key's controller document
const controllerDoc = {
  '@context': [
    'https://www.w3.org/ns/did/v1',
    'https://w3id.org/security/multikey/v1'
  ],
  id: controller,
  assertionMethod: [publicKey]
};
addDocumentToLoader({url: controllerDoc.id, document: controllerDoc});

// create suite
const suite = new DataIntegrityProof({
  signer: keyPair.signer(), cryptosuite: mldsa44Rdfc2024Cryptosuite
});

// create signed credential
const signedCredential = await jsigs.sign(unsignedCredential, {
  suite,
  purpose: new AssertionProofPurpose(),
  documentLoader
});

// results in the following signed VC
TBD
```

## Contribute

See [the contribute file](https://github.com/digitalbazaar/bedrock/blob/master/CONTRIBUTING.md)!

PRs accepted.

If editing the Readme, please conform to the
[standard-readme](https://github.com/RichardLitt/standard-readme) specification.

## Commercial Support

Commercial support for this library is available upon request from
Digital Bazaar: support@digitalbazaar.com

## License

[New BSD License (3-clause)](LICENSE) © 2026 Digital Bazaar
