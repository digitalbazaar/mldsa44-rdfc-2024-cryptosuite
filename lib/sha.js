/*
 * Copyright (c) 2022-2024 Digital Bazaar, Inc. All rights reserved.
 */
import crypto from 'node:crypto';

/**
 * Hashes a string of data using SHA-256.
 *
 * @param {object} options - The options to use.
 * @param {string} options.algorithm - The algorithm to use.
 * @param {string} options.string - The string to hash.
 *
 * @returns {Uint8Array} The hash digest.
 */
export async function sha({algorithm, string}) {
  if(algorithm !== 'SHA-256') {
    throw new Error(
      `Unsupported hash algorithm "${algorithm}"; expected "SHA-256".`);
  }
  return new Uint8Array(crypto.createHash('sha256').update(string).digest());
}
