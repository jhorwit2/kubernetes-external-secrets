'use strict'
const KVBackend = require('./kv-backend')

/** OCI Vault Secrets Manager backend class. */
class OciVaultBackend extends KVBackend {
  /**
   * Create OCI Vault backend.
   * @param {Object} clientFactory - clients for calling OCI Vault.
   * @param {Object} logger - Logger for logging stuff.
   */
  constructor ({ clientFactory, logger }) {
    super({ logger })
    this._clientFactory = clientFactory
  }

  /**
   * Get secret property value from OCI Vault Secrets Manager.
   * @param {string} key - Key used to store secret property value in OCI Vault Secrets Manager.
   * @param {string} keyOptions.version - If version is passed then fetch that version, else fetch the latest version
   * @returns {Promise} Promise object representing secret property value.
   */
  async _get ({ key, keyOptions, specOptions: { keyVaultName } }) {
    const client = this._clientFactory()
    this._logger.info(`calling oci vault provider for key: ${key}`)

    let secretVersion = null
    if (keyOptions && keyOptions.version) {
      secretVersion = keyOptions.version
    }

    const secretResp = await client.getSecretBundle({
      secretId: key,
      versionNumber: secretVersion
    })

    const secretBundle = secretResp.secretBundle.secretBundleContent
    if (secretBundle.contentType === 'BASE64') {
      // avoid making folks add isBinary true for base type
      return Buffer.from(secretBundle.content, 'base64')
    }

    return secretBundle.content
  }
}

module.exports = OciVaultBackend
