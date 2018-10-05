var DummyERC20 = artifacts.require("./contracts/erc20_project/DummyERC20.sol");
module.exports = function(deployer) {
  deployer.deploy(DummyERC20);
};
