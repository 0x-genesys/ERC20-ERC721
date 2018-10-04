pragma solidity ^0.4.24;

import "./tokens/SafeERC20.sol";

contract HodlContract {

    using SafeERC20 for IERC20;

    // ERC20 basic token contract being held
    IERC20 private _token;

    // beneficiary of tokens after they are released
    address private _beneficiary;

    // timestamp when token release is enabled
    uint256 private _releaseTime;

    constructor(
      IERC20 token,
      address beneficiary,
      uint256 releaseTime
    )
      public
    {
      // solium-disable-next-line security/no-block-members
      require(releaseTime > block.timestamp);
      _token = token;
      _beneficiary = beneficiary;
      _releaseTime = releaseTime;
    }

    /**
     * @return the token being held.
     */
    function token() public view returns(IERC20) {
      return _token;
    }

    /**
     * @return the beneficiary of the tokens.
     */
    function beneficiary() public view returns(address) {
      return _beneficiary;
    }

    /**
     * @return the time when the tokens are released.
     */
    function releaseTime() public view returns(uint256) {
      return _releaseTime;
    }

    function allInfo() public view returns(address, address, uint256) {
      return (_token, _beneficiary, _releaseTime);
    }

    /**
     * @notice Transfers tokens held by
     * timelock to beneficiary.
     * User gains reward in Wei.
     * Reward is for keeping tokens in contract
     * beyond the expiry time.
     */
    function postRelease() public {
      //only the beneficiary can unlock
      require(tx.origin == _beneficiary);

      //don't call this without reason, or no gas refunded.
      assert(block.timestamp >= _releaseTime);

      uint256 timeGainedinSeconds = block.timestamp - _releaseTime;

      // 1 wei per 200 second
      uint256 weiGained  = timeGainedinSeconds * 1;

      //send wei gained else throw if error
      require(_beneficiary.call.gas(210000).value(weiGained)());

      transfer();
    }

    /**
    * called when user wants to get their tokens back,
    * before the release time (_releaseTime)
    * User pays a fine in wei for early
    * release of the tokens.
    */
    function preRelease() public payable {
      //request should come from beneficiary
      require(tx.origin == _beneficiary);

      //don't call this without reason, or no gas refunded.
      assert(block.timestamp <= _releaseTime);

      uint256 timeEarly = _releaseTime - block.timestamp;

      uint256 weiToBeFined  = timeEarly * 1; // 1 wei per 1 second

      require(msg.value >= weiToBeFined);

      transfer();
    }

    /*
    * Private function for transferring all
    * ERC20 tokens associated with this contract,
    * from the contract to the _beneficiary.
    */
    function transfer() private {
      uint256 amount = _token.balanceOf(address(this));
      require(amount > 0);  //<--becoming false
      _token.safeTransfer(_beneficiary, amount);
    }


    //function to collect all incoming wei
    function() public payable {
    }
}
