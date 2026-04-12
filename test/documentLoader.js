/*!
 * Copyright (c) 2023-2026 Digital Bazaar, Inc. All rights reserved.
 */
import * as didMethodKey from '@digitalbazaar/did-method-key';
import * as MldsaMultikey from '@digitalbazaar/mldsa-multikey';
import {
  controllerDocMldsaMultikey,
  mldsaMultikeyKeyPair,
  mockPublicMldsaMultikey
} from './mock-data.js';
import {CachedResolver} from '@digitalbazaar/did-io';
import dataIntegrityContext from '@digitalbazaar/data-integrity-context';
import multikeyContext from '@digitalbazaar/multikey-context';
import {securityLoader} from '@digitalbazaar/security-document-loader';

export const loader = securityLoader();

const resolver = new CachedResolver();
const didKeyDriver = didMethodKey.driver();
// ML-DSA-44 public keys are base64url-encoded with the 'u' multibase prefix;
// the first 3 chars are 'ukC' for this key set (determined by the multicodec
// header 0x9024 combined with the first public key byte)
didKeyDriver.use({
  multibaseMultikeyHeader: 'ukC',
  fromMultibase: MldsaMultikey.from
});
resolver.use(didKeyDriver);
loader.setDidResolver(resolver);

loader.addStatic(
  mldsaMultikeyKeyPair.controller,
  controllerDocMldsaMultikey
);
loader.addStatic(
  mockPublicMldsaMultikey.id,
  mockPublicMldsaMultikey
);

loader.addStatic(
  dataIntegrityContext.constants.CONTEXT_URL,
  dataIntegrityContext.contexts.get(dataIntegrityContext.constants.CONTEXT_URL)
);

loader.addStatic(
  multikeyContext.constants.CONTEXT_URL,
  multikeyContext.contexts.get(multikeyContext.constants.CONTEXT_URL)
);

loader.addStatic(
  'https://www.w3.org/ns/credentials/examples/v2',
  {
    '@context': {
      '@vocab': 'https://www.w3.org/ns/credentials/examples#'
    }
  });
