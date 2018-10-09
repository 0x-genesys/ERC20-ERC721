pragma solidity ^0.4.24;


import "./tokens/ERC721.sol";
import "./tokens/ERC721Enumerable.sol";
import "./tokens/ERC721Metadata.sol";
import "./ownership/Ownable.sol";

/*
 * @title Full ERC721 Token
 * This implementation includes all the required and some optional functionality of the ERC721 standard
 * Moreover, it includes approve all functionality using operator terminology
 * @dev see https://github.com/ethereum/EIPs/blob/master/EIPS/eip-721.md
 */
contract Demurrage is ERC721, ERC721Enumerable, ERC721Metadata, Ownable {

  mapping(uint256 => uint256) private _tokenIdToTimestamp;
  mapping(uint256 => uint32) private _tokenIdToValue;

  struct DemurragePayment {
    uint256 _days;
    uint256 value;
    uint256 payedOn;
    address owner;
  }

  mapping(uint256 => DemurragePayment) _paymentInfo;

  uint256 private _minimumUnitDemurrage = 10000;
  uint256 private _minimumUnitDollar = 100;
  uint256 private _demurragePerDay = 10; //10/10000 = .001
  address private DEMURRAGE_COLLECTOR = 0;

  constructor(string name, string symbol) ERC721Metadata(name, symbol)
    public
  {
  }

  /*
  *   @dev calls parent contract mint function.
  stores value and current timestamp in the mappings.

  value is dollar value multiplied by 100. if value is 1.34$ value sent should
  be 134
  */
  function _mint(address to, uint256 tokenId, uint32 value)
   public onlyOwner {
    super._mint(to, tokenId);
    require(to != address(0));
    require(_tokenIdToTimestamp[tokenId] == 0);
    _tokenIdToValue[tokenId] = value;
    _tokenIdToTimestamp[tokenId] = block.timestamp;
  }

  /*
  @dev
  make sure _tokenIdToTimestamp has entry
  make sure _tokenIdToValue has entry
  make sure owner of erc721 token is the sender
  calculate the feess
  multiply value by 1000000
  make sure value ssent is more than to be payed
  make sure DEMURRAGE_COLLECTOR is set
  make sure entry does not preexist
  send the wei to collectorAddress
  make new payment struct entry
  update _paymentInfo

  @params :
  tokenId - is the token id value
  _days - is the time for which Demurrage needs to be payed
  */
  function _payDemurrageForNDays(uint256 tokenId, uint256 _days) payable public {
    require(_tokenIdToTimestamp[tokenId] != 0);
    require(_tokenIdToValue[tokenId] != 0);
    require(ownerOf(tokenId) == msg.sender);
    //this value is  usd * 1000000
    uint256 valueToBePayed = _calculateDemurrageFeesTillDate(tokenId, _days);
    //this value is eth * OneEthUsdValue * 1000000
    uint256 valueSent = msg.value * _getMultiple() * _getEthereumValueInUsd();
    require(valueSent >= valueToBePayed);
    require(DEMURRAGE_COLLECTOR != address(0));
    require(_paymentInfo[tokenId].payedOn == 0);
    require(DEMURRAGE_COLLECTOR.call.gas(210000).value(msg.value)());
    DemurragePayment memory payment = DemurragePayment({
      _days: _days,
      value: msg.value,
      owner: msg.sender,
      payedOn: block.timestamp
    });
    _paymentInfo[tokenId] = payment;
  }

  /**
    Get payment info for a erc721 token
  **/
  function _getDemurragePaymentHistory(uint256 tokenId)
    public view returns(uint256, uint256, uint256, address)
  {
    require(_paymentInfo[tokenId].payedOn != 0);
    DemurragePayment memory demurragePayment =  _paymentInfo[tokenId];
    return(demurragePayment._days, demurragePayment.value,
       demurragePayment.payedOn, demurragePayment.owner);
  }

  /*
    returns in epoch timestamp
  */
  function _getDaysTillDemurragePayedFor(uint256 tokenId) public view returns(uint256) {
    require(_paymentInfo[tokenId].payedOn != 0);
    DemurragePayment memory payment = _paymentInfo[tokenId];
    uint256 payedOnDate = payment.payedOn;
    uint256 payedFor = payment._days * 24 * 60 * 60; //in seconds
    return payedOnDate + payedFor;
  }

  /*
    0.001 * value * time_period_in_days
  */
  function _calculateDemurrageFeesTillDate(uint256 tokenId, uint256 _days)
    public  view returns(uint256) {
    uint256 netValue = _days * _tokenIdToValue[tokenId] * _demurragePerDay;
    return netValue;
  }

  /*
  calculate days diff and call _calculateDemurrageFeesTillDate
  The hence calculated demurrage needs to be divided by 10000 * 100 by front end
  */
  function _calculateDemurrageFeesTillToday(uint256 tokenId)
   public view returns(uint256) {
    require(_tokenIdToTimestamp[tokenId]!=0);
    uint256 daysDiff = (block.timestamp - _tokenIdToTimestamp[tokenId]) / 60 / 60 / 24; // 40 days
    return _calculateDemurrageFeesTillDate(tokenId, daysDiff);
  }

  /*
    three tranfer functions are supported by erc721 standard
  */
  function transferFrom(
    address from,
    address to,
    uint256 tokenId
  )
  public
  {
    require(_getDaysTillDemurragePayedFor(tokenId) >= block.timestamp);
    super.transferFrom(from, to, tokenId);
    delete _paymentInfo[tokenId];
  }

  function safeTransferFrom(
    address from,
    address to,
    uint256 tokenId
  )
  public
  {
    require(_getDaysTillDemurragePayedFor(tokenId) >= block.timestamp);
    super.safeTransferFrom(from, to, tokenId);
    delete _paymentInfo[tokenId];
  }

  function safeTransferFrom(
    address from,
    address to,
    uint256 tokenId,
    bytes _data
  )
  public
  {
    require(_getDaysTillDemurragePayedFor(tokenId) >= block.timestamp);
    super.safeTransferFrom(from, to, tokenId, _data);
    delete _paymentInfo[tokenId];
  }


  function _setDemurrageColllector(address collectorAddress) public onlyOwner {
    require(collectorAddress != 0);
    DEMURRAGE_COLLECTOR = collectorAddress;
  }

  function _getDemurrageCollector() public view returns(address) {
    return DEMURRAGE_COLLECTOR;
  }

  function _getMultiple() public pure returns (uint256) {
    return 1000000; //_minimumUnitDemurrage * _minimumUnitDollar
  }

  function _getEthereumValueInUsd() public pure returns (uint256) {
    return 200; //hardcoded for now
  }

}
