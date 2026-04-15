/*!
 * Copyright (c) 2023-2026 Digital Bazaar, Inc.
 */
import * as MldsaMultikey from '@digitalbazaar/mldsa-multikey';

export async function createSigner({keyPair} = {}) {
  if(!keyPair) {
    throw new TypeError('"keyPair" is required.');
  }
  const key = keyPair['@context'] ?
    await MldsaMultikey.from({key: keyPair}) : keyPair;
  return key.signer();
}
