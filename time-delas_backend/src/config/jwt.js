const path = require('path')
const fs = require('fs-extra')

const path_to_keys = path.resolve(__dirname, '..', '..', 'keys', 'jwt')
const PUB_KEY = fs.readFileSync(path.resolve(path_to_keys, 'id_rsa_pub.pem'), 'utf8')
const PRIV_KEY = fs.readFileSync(path.resolve(path_to_keys, 'id_rsa_priv.pem'), 'utf8')

module.exports = {
    publicKey: PUB_KEY,
    privateKey: PRIV_KEY,
    jwtExpiration: 60*60*24,
    jwtRefreshExpiration: 60*60*24*30
}