/* eslint-env mocha */
'use strict'

const { expect } = require('chai')
const sinon = require('sinon')

const OciVaultBackend = require('./oci-vault-backend')

describe('OciVaultBackend', () => {
  let loggerMock
  let clientMock
  let ociVaultBackend
  const secretResp = {
      secretBundle: {
          secretBundleContent: {
              contentType: "BASE64",
              content: "dGVzdAo=" // "test"
          }
      }
  }

  const secret = 'test'

  beforeEach(() => {
    loggerMock = sinon.mock()
    loggerMock.info = sinon.stub()
    clientMock = sinon.mock()
    clientMock.getSecretBundle = sinon.stub().returns(secretResp)

    ociVaultBackend = new OciVaultBackend({
      logger: loggerMock,
      client: clientMock
    })

  })

  describe('_get BASE64', () => {
    it('returns secret property value', async () => {
      const secretPropertyValue = await ociVaultBackend._get({
        key: key,
        version: 1
      })
      expect(secretPropertyValue).equals(secret)
    })
  })
})
