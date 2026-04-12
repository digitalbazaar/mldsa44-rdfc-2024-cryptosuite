/*!
 * Copyright (c) 2023-2026 Digital Bazaar, Inc. All rights reserved.
 */
import * as MldsaMultikey from '@digitalbazaar/mldsa-multikey';

export async function createSigner({keyPair} = {}) {
  if(!keyPair) {
    throw new TypeError('"keyPair" is required.');
  }
  const key = keyPair['@context']
    ? await MldsaMultikey.from(keyPair) : keyPair;
  const signer = key.signer();
  // normalize algorithm to its name string for data-integrity compatibility
  signer.algorithm = signer.algorithm.name;
  return signer;
}
