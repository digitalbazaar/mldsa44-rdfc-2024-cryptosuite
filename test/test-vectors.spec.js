/*!
 * Copyright (c) 2023-2026 Digital Bazaar, Inc.
 */
import {cryptosuite} from '../lib/index.js';
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

function addTests({nistSecurityLevel, signedFixture}) {
  const label = `ML-DSA-44 (NIST Security Level ${nistSecurityLevel})`;

  it(`should verify ${label} signed fixture`, async () => {
    const result = await jsigs.verify(signedFixture, {
      suite: new DataIntegrityProof({cryptosuite}),
      purpose: new AssertionProofPurpose(),
      documentLoader
    });

    expect(result.verified).to.be.true;
  });
}
