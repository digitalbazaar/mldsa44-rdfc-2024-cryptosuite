/*!
 * Copyright (c) 2023-2026 Digital Bazaar, Inc.
*/
import * as base64url from 'base64url-universal';
import {canonize} from './canonize.js';
import {createSigner} from './createSigner.js';
import {createVerifier} from './createVerifier.js';
import {name} from './name.js';
import {requiredAlgorithm} from './requiredAlgorithm.js';

export {createSigner};

export const cryptosuite = {
  canonize,
  createSigner,
  createVerifier,
  createVerifyData: _createVerifyData,
  createProofValue: _createProofValue,
  name,
  requiredAlgorithm
};

async function _createVerifyData({
  cryptosuite, document, proof, documentLoader, dataIntegrityProof,
  verificationMethod
} = {}) {
  // determine digest algorithm from key algorithm
  let keyAlgorithmName;
  if(verificationMethod) {
    const verifier = await createVerifier({verificationMethod});
    keyAlgorithmName = verifier.algorithm;
  } else if(dataIntegrityProof.signer?.algorithm) {
    keyAlgorithmName = dataIntegrityProof.signer.algorithm;
  }
  if(!keyAlgorithmName) {
    throw new Error(
      'Either "verificationMethod" or "signer" with "algorithm" must be ' +
      'passed to cryptosuite to determine hash algorithm.');
  }
  const c14nOptions = {
    documentLoader,
    safe: true,
    base: null,
    skipExpansion: false,
    messageDigestAlgorithm: 'SHA-256'
  };

  // await both c14n proof hash and c14n document hash
  const [proofHash, docHash] = await Promise.all([
    // canonize and hash proof
    _canonizeProof(proof, {
      document, cryptosuite, dataIntegrityProof, c14nOptions
    }).then(c14nProofOptions => _sha256(c14nProofOptions)),
    // canonize and hash document
    cryptosuite.canonize(document, c14nOptions).then(
      c14nDocument => _sha256(c14nDocument))
  ]);

  // concatenate hash of c14n proof options and hash of c14n document
  return _concat(proofHash, docHash);
}

async function _createProofValue({verifyData, dataIntegrityProof}) {
  const {signer} = dataIntegrityProof;
  const signatureBytes = await signer.sign({data: verifyData});
  return 'u' + base64url.encode(signatureBytes);
}

async function _canonizeProof(proof, {
  document, cryptosuite, dataIntegrityProof, c14nOptions
}) {
  // `proofValue` must not be included in the proof options
  proof = {
    '@context': document['@context'],
    ...proof
  };
  dataIntegrityProof.ensureSuiteContext({
    document: proof, addSuiteContext: true
  });
  delete proof.proofValue;
  return cryptosuite.canonize(proof, c14nOptions);
}

async function _sha256(string) {
  const bytes = new TextEncoder().encode(string);
  return new Uint8Array(
    await globalThis.crypto.subtle.digest('SHA-256', bytes));
}

function _concat(b1, b2) {
  const rval = new Uint8Array(b1.length + b2.length);
  rval.set(b1, 0);
  rval.set(b2, b1.length);
  return rval;
}

