/*!
 * Copyright (c) 2023-2026 Digital Bazaar, Inc. All rights reserved.
 */
import * as MldsaMultikey from '@digitalbazaar/mldsa-multikey';

export async function createVerifier({verificationMethod}) {
  const key = await MldsaMultikey.from(verificationMethod);
  const verifier = key.verifier();
  // normalize algorithm to its name string for data-integrity compatibility
  verifier.algorithm = verifier.algorithm.name;
  return verifier;
}
