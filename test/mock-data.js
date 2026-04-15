/*!
 * Copyright (c) 2023-2026 Digital Bazaar, Inc.
 */
export const controller = 'https://example.edu/issuers/565049';
/* eslint-disable max-len */
const publicKeyMultibase = 'ukCTVqTw8MmpCy0cyg_gdrrCc1SihRFInzHHRdpD7OuE2GoteuGqkLvNzZBIrhB39aCGKkgpJFA9TECV-KbdbTsxDVhNzrCep-S9fKmJSh3ZoigoY7FUsuHDTt2qVZBk_RZZDF735dG8F_whpxorHHalgXl5BGI7tKxyQ05vKRwX1T_DSIaRyVKvRNij8AQZZS46J6Ay2WhyptlolNs9bjPG2RpN_fnwwX-AmpM_J2JLbLZsKqF9gJmNXu7iDti7AtC-OEZudLzMpRBMd9cO_nTGvi4_I0F8r2jl8Hv-7d3cUVaqCv9XfkkiJZxuGcztrZbyiTeZ1PJ67TbmraMEt6otg6JM5HWqcLsgAHd47aap9XiGbGeODPU0BEmRWb5zPc-EuMHu1KasuF9LsBgIgx3ITiDZGN8K3JPo3Xnfbwyzi8atmXW6isS4r44pkTS3elkM8a-18Jao-7fba9o9KQAQDacKHpDCa3EPtFv_0Pu8PMYiG36eXUSjpspmEEMcFjGzFZz3Oz1-xETpKiTQpr4g2Z1kbj8XSn7QmVaoxsrxNeLEKyUigFR5kF-92BwGiPDbhHA2m58x4wMZcY1A557y4hkUpTVbToxJ40w_pqYcBP_y2wnTjKdgBEtnRdbgQHQJDwOUYAgG2xIb3zgIEBoizrjl7wyfP4Wqrb0mxI3SoHvb1eSolckMTLKnCk76KHsgMca2pm-Mamleot1AG3tAjnTtWHt9PFy24C-fd6_JzDa-P6UczhoBFoMQLWmflzrDBTq4c3GwcqW-aCSSax4cvg0hUEc_vyNeV8EPg401SFDeJ71MrY17KHjMMnnBgQ_q50CzSSfm9klwhlC_hGX6afN2nOI4JVl56mA689hqstQC6YRLrgdCMoukgHPocX06rce9WFDWP2aj3mIxUh7krSsCbtb56TZPTb9Rh1GkgDkWmljQKY6tKxKNoiFJLBxii9lNAGT3rwDAp1Bl303MubANGx88zNqpO25hkFMLwwO4YnNOCGYiyN57F4ZzmOknRtJxMMZ0FCsMDhTfoig4UvvPEku48gVY90kcNAlqWL9RwDfOL6baKcERVcgDtzUmEbDjMBDDKYLf6DA6tA6Wb1u9_I1V9KxTw-v-4LohUUU8b1ZyaqQ5n7zv9iYqgY5NTZFNcz0CPHQHlXzlolSCNJxMHDLqbS9Q6iivTbNonc-_jdYiiMViDW6l5371NCYrnBnWawnnBur5DBEdDFmF6I34wCrNbaOIZfRIpoJemm0X2F_edX6ZONBHt2LtWsvKP-ovE72s_-gM7u2XePl9TjgCEuTJqO-Ixok1mCqXLP3fHR72hXcSKmST95AQIYwcfPK0b4kbk6N6o6X3HP6Ut2b3HudP71o5YzTwKnugXqw6WXjx6gC2Ctrpn3O01nS-9u8PJQzKyaVn6A4rgFq08Jj0DR0YjV5lakYvYSaI3Fz-Nzzot9JgCPXrOBzqRxkuEjdap0lnOinPSjozYKLZsX_Q0S2jUGbTcF5B0YOxowwIbdauT0wZ3L3RL5FEzc0rtU63p_6ZxB_MXSnxJsBOv0ONdSNlxmJrSXQRDZHtiB0UKKPHtCucOKf4cYtHnH1SLTxpq854WI1MXtHZbCMCSbyDJBKCaV0fRk7OnIu1KyqfplQ5vbCsf54440GL_Gv-0vtfjiIZqIAtFC6a3BBEyyjshczqP7rTTuy3pJzKtsCenrrPi_lhgzi-8ww1gEQGBIkHoogoPRArPZGGh1mo7';
const secretKeyMultibase = 'umiYgr1lhXtNROU7_wgoyaVc3nqkO5pF78hBBLrwoZBdLbQ';
/* eslint-enable max-len */
const id = 'https://example.edu/issuers/565049#zQmawLbWnRPXEYtgjsXW3QCuvkLeSTB6egTNe4B58oiFMTN';

export const mockPublicMldsaMultikey = {
  '@context': 'https://w3id.org/security/multikey/v1',
  type: 'Multikey',
  controller,
  id,
  publicKeyMultibase
};

export const mldsaMultikeyKeyPair = {
  '@context': 'https://w3id.org/security/multikey/v1',
  type: 'Multikey',
  controller,
  id,
  publicKeyMultibase,
  secretKeyMultibase
};

export const controllerDocMldsaMultikey = {
  '@context': [
    'https://www.w3.org/ns/did/v1',
    'https://w3id.org/security/multikey/v1'
  ],
  id: 'https://example.edu/issuers/565049',
  assertionMethod: [mockPublicMldsaMultikey]
};

export const credential = {
  '@context': [
    'https://www.w3.org/2018/credentials/v1',
    {
      AlumniCredential: 'https://schema.org#AlumniCredential',
      alumniOf: 'https://schema.org#alumniOf'
    },
    'https://w3id.org/security/data-integrity/v2'
  ],
  id: 'http://example.edu/credentials/1872',
  type: ['VerifiableCredential', 'AlumniCredential'],
  issuer: 'https://example.edu/issuers/565049',
  issuanceDate: '2010-01-01T19:23:24Z',
  credentialSubject: {
    id: 'https://example.edu/students/alice',
    alumniOf: 'Example University'
  }
};
