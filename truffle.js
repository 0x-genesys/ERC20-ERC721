/*
 * NB: since truffle-hdwallet-provider 0.0.5 you must wrap HDWallet providers in a
 * function when declaring them. Failure to do so will cause commands to hang. ex:
 * ```
 * mainnet: {
 *     provider: function() {
 *       return new HDWalletProvider(mnemonic, 'https://mainnet.infura.io/<infura-key>')
 *     },
 *     network_id: '1',
 *     gas: 4500000,
 *     gasPrice: 10000000000,
 *   },
 */

 var HDWalletProvider = require("truffle-hdwallet-provider-privkey");
 var privKeys = ["4f06db4d5bce4ccf807d2a6e933294bf8296e69499291b7732c4bf25c83f2669"];

 module.exports = {
   networks: {
     development: {
       host: "localhost",
       port: 8545,
       network_id: "*" // Match any network id
     },
     ropsten:  {
       provider: function() {
            return new HDWalletProvider(privKeys,
                  "https://ropsten.infura.io/BbBlRVGSUuAagrvyIjdr")
          },
    network_id: 3,
    gas: 4600000
   }
 }
 };
