var CreateHodlContract = artifacts.require("./contracts/erc20_project/CreateHodlContract.sol");
var DummyERC20 = artifacts.require("./contracts/erc20_project/DummyERC20.sol");
var Demurrage = artifacts.require("./contracts/erc721_project/Demurrage.sol");

module.exports = function(deployer) {
  deployer.deploy(CreateHodlContract);
  deployer.deploy(Demurrage, "GBAR", "GBR");
  deployer.deploy(DummyERC20);
};
