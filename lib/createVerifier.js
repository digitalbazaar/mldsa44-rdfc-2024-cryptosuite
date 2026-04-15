/*!
 * Copyright (c) 2023-2026 Digital Bazaar, Inc. All rights reserved.
 */
import * as MldsaMultikey from '@digitalbazaar/mldsa-multikey';

export async function createVerifier({verificationMethod}) {
  const key = await MldsaMultikey.from(verificationMethod);
  return key.verifier();
}
