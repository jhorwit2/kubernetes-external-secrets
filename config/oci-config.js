'use strict'

const secrets = require('oci-secrets')
const common = require('oci-common')

const OCI_AUTH_PROVIDER = process.env.OCI_AUTH_PROVIDER || 0
module.exports = {
  vaultClient: () => {
    if (OCI_AUTH_PROVIDER === 'user') {
      const authenticationProvider = new common.ConfigFileAuthenticationDetailsProvider()
      return new secrets.SecretsClient({ authenticationDetailsProvider: authenticationProvider })
    }

    // default to instance principal
    const authenticationProvider = new common.InstancePrincipalsAuthenticationDetailsProviderBuilder().build()
    return new secrets.SecretsClient({ authenticationDetailsProvider: authenticationProvider })
  }
}
