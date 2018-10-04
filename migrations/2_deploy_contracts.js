var CreateHodlContract = artifacts.require("./contracts/erc20_project/CreateHodlContract.sol");
// var DummyERC20 = artifacts.require("./contracts/erc20_project/DummyERC20.sol");
module.exports = function(deployer) {
  deployer.deploy(CreateHodlContract);
  // deployer.deploy(DummyERC20);
};
