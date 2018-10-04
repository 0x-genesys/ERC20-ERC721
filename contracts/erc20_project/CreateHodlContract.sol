pragma solidity ^0.4.24;

import './HodlContract.sol';
import './tokens/IERC20.sol';

contract CreateHodlContract {

  /*
  * Aim:
  * HodlContractEntryEvent EVENT

  * Params:
  * @_beneficiary: beneficiary of the hodl hodlContract
  * @_erc20Address: address of ERC20 tokens for which Hodl Contract is created

  */
   event Hodl (
       address _beneficiary,
       address _erc20TokenAddress,
       address _hodlContractAddress
   );

  /*
  * beneficiary address to HodlContractMapping
  */
  mapping (address => address) beneficiaryToERC20Mapping;

  /*
  *
  */
  function createNewHodlContractEntry(address _beneficiary, address _erc20TokenAddress, uint _releaseTime) public {

      address _hodlContractAddress = beneficiaryToERC20Mapping[_beneficiary];

      if(_hodlContractAddress == 0) {
        //Create NEW HodlContract instance
        HodlContract hodlContract = new HodlContract(IERC20(_erc20TokenAddress), _beneficiary, _releaseTime); //address
        beneficiaryToERC20Mapping[_beneficiary] = hodlContract;
        //Send an event to subscribers for new
      }
        //Pre-existing contract
        emit Hodl(_beneficiary, _erc20TokenAddress, _hodlContractAddress);
  }

  /**
    get ethereum address of existing hodl contract for _beneficiary
    One can assign erc20 tokens to hodlContract addresses
    to redeem later
  **/
  function getHodlContractAddress(address _beneficiary) public view returns(address, address, address, uint256, uint256) {
    address hodlContractAddress = beneficiaryToERC20Mapping[_beneficiary];
    HodlContract hodlContract = HodlContract(hodlContractAddress);
    address beneficiary;
    address erc20Address;
    uint256 releaseTime;
    (erc20Address, beneficiary, releaseTime) = hodlContract.allInfo();
    return (erc20Address, beneficiary, hodlContractAddress, releaseTime, block.timestamp);
  }

  /*
  * checks for time and calls preRelease function of HodlContract
  * passes the sent value, which is fine for early unlock of tokens
  */
  function preReleaseContract() public payable {
    address beneficiary = msg.sender;
    address erc20Address;
    uint256 releaseTime;
    uint256 currentTime = block.timestamp;

    address hodlContractAddress = beneficiaryToERC20Mapping[beneficiary];
    HodlContract hodlContract = HodlContract(hodlContractAddress);
    (erc20Address, beneficiary, releaseTime) = hodlContract.allInfo();

    require(currentTime <= releaseTime);

    hodlContract.preRelease.value(msg.value)();
    delete beneficiaryToERC20Mapping[beneficiary];
  }

  /*
  * checks for time and calls postRelease function of HodlContract
  */
  function postReleaseContract() {
    address beneficiary = msg.sender;
    address erc20Address;
    uint256 releaseTime;
    uint256 currentTime = block.timestamp;

    address hodlContractAddress = beneficiaryToERC20Mapping[beneficiary];
    HodlContract hodlContract = HodlContract(hodlContractAddress);
    (erc20Address, beneficiary, releaseTime) = hodlContract.allInfo();

    require(currentTime >= releaseTime);

    hodlContract.postRelease();
    delete beneficiaryToERC20Mapping[beneficiary];
  }

}
