/*!
 * Copyright (c) 2023-2026 Digital Bazaar, Inc. All rights reserved.
 */
import {expect} from 'chai';

import jsigs from 'jsonld-signatures';
const {purposes: {AssertionProofPurpose}} = jsigs;

import * as MldsaMultikey from '@digitalbazaar/mldsa-multikey';
import {
  credential,
  mldsaMultikeyKeyPair
} from './mock-data.js';
import {DataIntegrityProof} from '@digitalbazaar/data-integrity';
import {
  createSigner,
  cryptosuite as mldsa44RdfcCryptosuite
} from '../lib/index.js';

import {loader} from './documentLoader.js';

const documentLoader = loader.build();

describe('Mldsa44RdfcCryptosuite', () => {
  describe('exports', () => {
    it('it should have proper exports', async () => {
      should.exist(mldsa44RdfcCryptosuite);
      mldsa44RdfcCryptosuite.name.should.equal('mldsa44-rdfc-2024');
      mldsa44RdfcCryptosuite.requiredAlgorithm.should.eql(['ML-DSA-44']);
      mldsa44RdfcCryptosuite.canonize.should.be.a('function');
      mldsa44RdfcCryptosuite.createVerifier.should.be.a('function');
    });
  });

  describe('canonize()', () => {
    it('should canonize using RDFC-1.0 w/ n-quads', async () => {
      const unsignedCredential = JSON.parse(JSON.stringify(credential));

      let result;
      let error;
      try {
        result = await mldsa44RdfcCryptosuite.canonize(
          unsignedCredential, {documentLoader});
      } catch(e) {
        error = e;
      }

      expect(error).to.not.exist;
      expect(result).to.exist;
      /* eslint-disable max-len */
      const expectedResult =
        `<http://example.edu/credentials/1872> ` +
        `<http://www.w3.org/1999/02/22-rdf-syntax-ns#type> ` +
        `<https://schema.org#AlumniCredential> .\n` +
        `<http://example.edu/credentials/1872> ` +
        `<http://www.w3.org/1999/02/22-rdf-syntax-ns#type> ` +
        `<https://www.w3.org/2018/credentials#VerifiableCredential> .\n` +
        `<http://example.edu/credentials/1872> ` +
        `<https://www.w3.org/2018/credentials#credentialSubject> ` +
        `<https://example.edu/students/alice> .\n` +
        `<http://example.edu/credentials/1872> ` +
        `<https://www.w3.org/2018/credentials#issuanceDate> ` +
        `"2010-01-01T19:23:24Z"^^` +
        `<http://www.w3.org/2001/XMLSchema#dateTime> .\n` +
        `<http://example.edu/credentials/1872> ` +
        `<https://www.w3.org/2018/credentials#issuer> ` +
        `<https://example.edu/issuers/565049> .\n` +
        `<https://example.edu/students/alice> ` +
        `<https://schema.org#alumniOf> "Example University" .\n`;
      /* eslint-enable max-len */
      result.should.equal(expectedResult);
    });
  });

  describe('createVerifier()', () => {
    it('should create a verifier with ML-DSA Multikey', async () => {
      let verifier;
      let error;
      try {
        verifier = await mldsa44RdfcCryptosuite.createVerifier({
          verificationMethod: {...mldsaMultikeyKeyPair}
        });
      } catch(e) {
        error = e;
      }

      expect(error).to.not.exist;
      expect(verifier).to.exist;
      verifier.algorithm.should.equal('ML-DSA-44');
      verifier.id.should.equal(mldsaMultikeyKeyPair.id);
      verifier.verify.should.be.a('function');
    });

    it('should fail to create a verifier w/ unsupported key type', async () => {
      let verifier;
      let error;
      const keyPair = await MldsaMultikey.from({...mldsaMultikeyKeyPair});
      keyPair.type = 'BadKeyType';
      try {
        verifier = await mldsa44RdfcCryptosuite.createVerifier({
          verificationMethod: keyPair
        });
      } catch(e) {
        error = e;
      }

      expect(error).to.exist;
      expect(verifier).to.not.exist;
      error.message.should.include('BadKeyType');
    });
  });

  describe('sign()', () => {
    it('should sign a document', async () => {
      const unsignedCredential = JSON.parse(JSON.stringify(credential));
      const keyPair = await MldsaMultikey.from({...mldsaMultikeyKeyPair});
      const date = '2026-04-12T21:29:24Z';
      const suite = new DataIntegrityProof({
        signer: await createSigner({keyPair}), date,
        cryptosuite: mldsa44RdfcCryptosuite
      });

      let error;
      try {
        await jsigs.sign(unsignedCredential, {
          suite,
          purpose: new AssertionProofPurpose(),
          documentLoader
        });
      } catch(e) {
        error = e;
      }

      expect(error).to.not.exist;
    });

    it('should fail to sign with undefined term', async () => {
      const unsignedCredential = JSON.parse(JSON.stringify(credential));
      unsignedCredential.undefinedTerm = 'foo';

      const keyPair = await MldsaMultikey.from({...mldsaMultikeyKeyPair});
      const date = '2026-04-12T21:29:24Z';
      const suite = new DataIntegrityProof({
        signer: await createSigner({keyPair}), date,
        cryptosuite: mldsa44RdfcCryptosuite
      });

      let error;
      try {
        await jsigs.sign(unsignedCredential, {
          suite,
          purpose: new AssertionProofPurpose(),
          documentLoader
        });
      } catch(e) {
        error = e;
      }

      expect(error).to.exist;
      expect(error.name).to.equal('jsonld.ValidationError');
    });

    it('should fail to sign with relative type URL', async () => {
      const unsignedCredential = JSON.parse(JSON.stringify(credential));
      unsignedCredential.type.push('UndefinedType');

      const keyPair = await MldsaMultikey.from({...mldsaMultikeyKeyPair});
      const date = '2026-04-12T21:29:24Z';
      const suite = new DataIntegrityProof({
        signer: await createSigner({keyPair}), date,
        cryptosuite: mldsa44RdfcCryptosuite
      });

      let error;
      try {
        await jsigs.sign(unsignedCredential, {
          suite,
          purpose: new AssertionProofPurpose(),
          documentLoader
        });
      } catch(e) {
        error = e;
      }

      expect(error).to.exist;
      expect(error.name).to.equal('jsonld.ValidationError');
    });

    it('should fail to sign with incorrect signer algorithm', async () => {
      const keyPair = await MldsaMultikey.from({...mldsaMultikeyKeyPair});
      const date = '2026-04-12T21:29:24Z';
      const signer = keyPair.signer();
      signer.algorithm = 'wrong-algorithm';

      let error;
      try {
        new DataIntegrityProof({
          signer, date, cryptosuite: mldsa44RdfcCryptosuite
        });
      } catch(e) {
        error = e;
      }

      const errorMessage = `The signer's algorithm "${signer.algorithm}" ` +
        `is not a supported algorithm for the cryptosuite. The supported ` +
        `algorithms are: ` +
        `"${mldsa44RdfcCryptosuite.requiredAlgorithm.join(', ')}".`;

      expect(error).to.exist;
      expect(error.message).to.equal(errorMessage);
    });
  });

  describe('verify()', () => {
    let signedCredential;

    before(async () => {
      const unsignedCredential = JSON.parse(JSON.stringify(credential));

      const keyPair = await MldsaMultikey.from({...mldsaMultikeyKeyPair});
      const date = '2026-04-12T21:29:24Z';
      const suite = new DataIntegrityProof({
        signer: await createSigner({keyPair}), date,
        cryptosuite: mldsa44RdfcCryptosuite
      });

      signedCredential = await jsigs.sign(unsignedCredential, {
        suite,
        purpose: new AssertionProofPurpose(),
        documentLoader
      });
    });

    it('should verify a document', async () => {
      const suite = new DataIntegrityProof({
        cryptosuite: mldsa44RdfcCryptosuite
      });
      const result = await jsigs.verify(signedCredential, {
        suite,
        purpose: new AssertionProofPurpose(),
        documentLoader
      });

      expect(result.verified).to.be.true;
    });

    it('should fail verification if "proofValue" is not string', async () => {
      const suite = new DataIntegrityProof({
        cryptosuite: mldsa44RdfcCryptosuite
      });
      const signedCredentialCopy =
        JSON.parse(JSON.stringify(signedCredential));
      signedCredentialCopy.proof.proofValue = {};

      const result = await jsigs.verify(signedCredentialCopy, {
        suite,
        purpose: new AssertionProofPurpose(),
        documentLoader
      });

      const {error} = result.results[0];

      expect(result.verified).to.be.false;
      expect(error.name).to.equal('TypeError');
      expect(error.message).to.equal(
        'The proof does not include a valid "proofValue" property.'
      );
    });

    it('should fail verification if "proofValue" is not given', async () => {
      const suite = new DataIntegrityProof({
        cryptosuite: mldsa44RdfcCryptosuite
      });
      const signedCredentialCopy =
        JSON.parse(JSON.stringify(signedCredential));
      signedCredentialCopy.proof.proofValue = undefined;

      const result = await jsigs.verify(signedCredentialCopy, {
        suite,
        purpose: new AssertionProofPurpose(),
        documentLoader
      });

      const {error} = result.results[0];

      expect(result.verified).to.be.false;
      expect(error.name).to.equal('TypeError');
      expect(error.message).to.equal(
        'The proof does not include a valid "proofValue" property.'
      );
    });

    it('should fail verification if proofValue string does not start with "u"',
      async () => {
        const suite = new DataIntegrityProof({
          cryptosuite: mldsa44RdfcCryptosuite
        });
        const signedCredentialCopy =
          JSON.parse(JSON.stringify(signedCredential));
        signedCredentialCopy.proof.proofValue = 'a';

        const result = await jsigs.verify(signedCredentialCopy, {
          suite,
          purpose: new AssertionProofPurpose(),
          documentLoader
        });

        const {errors} = result.error;

        expect(result.verified).to.be.false;
        expect(errors[0].name).to.equal('Error');
      }
    );

    it('should fail verification if proof type is not DataIntegrityProof',
      async () => {
        const suite = new DataIntegrityProof({
          cryptosuite: mldsa44RdfcCryptosuite
        });
        const signedCredentialCopy =
          JSON.parse(JSON.stringify(signedCredential));
        signedCredentialCopy.proof.type = 'InvalidSignature2100';

        const result = await jsigs.verify(signedCredentialCopy, {
          suite,
          purpose: new AssertionProofPurpose(),
          documentLoader
        });

        const {errors} = result.error;

        expect(result.verified).to.be.false;
        expect(errors[0].name).to.equal('NotFoundError');
      });
  });
});
