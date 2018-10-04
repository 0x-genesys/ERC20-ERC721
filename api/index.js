var express = require('express');
var router = express.Router();

controller = require('./controller.js');

router.post('/generateNewHodlContract', controller.generateNewHodlContract);
router.post('/transferERC20Tokens', controller.transferERC20Tokens);
router.post('/preReleaseTokens', controller.preReleaseTokens);
router.post('/transferEth', controller.transferEth);
router.post('/postReleaseTokens', controller.postReleaseTokens);
router.get('/getHodlContractAddress', controller.getHodlContractAddress);
router.get('/getEthBalance', controller.getEthBalance);
router.get('/getErc20Balance', controller.getErc20Balance);

module.exports = router;
