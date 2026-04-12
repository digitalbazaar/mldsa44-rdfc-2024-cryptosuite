/*!
 * Copyright (c) 2023-2026 Digital Bazaar, Inc. All rights reserved.
 */
import * as MldsaMultikey from '@digitalbazaar/mldsa-multikey';
import {createSigner, cryptosuite} from '../lib/index.js';
import {DataIntegrityProof} from '@digitalbazaar/data-integrity';
import {expect} from 'chai';
import jsigs from 'jsonld-signatures';
import {loader} from './documentLoader.js';

import * as testVectors from './test-vectors.js';

const {purposes: {AssertionProofPurpose}} = jsigs;

const documentLoader = loader.build();

describe('test vectors', () => {
  const {mldsaFixtures} = testVectors;
  for(const mldsaFixture of mldsaFixtures) {
    addTests(mldsaFixture);
  }
});

function addTests({nistSecurityLevel, keyMaterial, signedFixture}) {
  const label = `ML-DSA-44 (NIST Security Level ${nistSecurityLevel})`;
  let keyPair;
  before(async () => {
    keyPair = await MldsaMultikey.from(keyMaterial);
    keyPair.controller = `did:key:${keyPair.publicKeyMultibase}`;
    keyPair.id = `${keyPair.controller}#public-key`;
  });

  it.skip(`should create ${label} proof`, async () => {
    const unsigned = {...signedFixture};
    delete unsigned.proof;

    const signer = await createSigner({keyPair});
    const date = new Date(signedFixture.proof.created);

    let error;
    let signed;
    try {
      signed = await jsigs.sign(unsigned, {
        suite: new DataIntegrityProof({cryptosuite, signer, date}),
        purpose: new AssertionProofPurpose(),
        documentLoader
      });
    } catch(e) {
      error = e;
    }

    expect(error).to.not.exist;
    // ML-DSA is deterministic, so proof value must match exactly
    expect(signed).to.deep.equal(signedFixture);

    // ensure generated signed document verifies
    const result = await jsigs.verify(signed, {
      suite: new DataIntegrityProof({cryptosuite}),
      purpose: new AssertionProofPurpose(),
      documentLoader
    });

    expect(result.verified).to.be.true;
  });

  it.skip(`should verify ${label} signed fixture`, async () => {
    const result = await jsigs.verify(signedFixture, {
      suite: new DataIntegrityProof({cryptosuite}),
      purpose: new AssertionProofPurpose(),
      documentLoader
    });

    expect(result.verified).to.be.true;
  });
}
