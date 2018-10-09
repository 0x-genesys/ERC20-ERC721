/**
Made by Karan Ahuja
**/

var demurrage = {};

var Promise = require("bluebird");
var helper = require('../web3/web3-helper.js');
var config = require('../env/env_var.js');

demurrage.setDemurrageCollector = function(req, res) {
  var ERC721DemurrageContract = helper.getERC721DemurrageContract();
  var privateKey = req.body.private_key; //private key of the account
  var demurrageCollector = req.body.demurrage_collector;

  var ERC721DemurrageMint = ERC721DemurrageContract.methods
        ._setDemurrageColllector(demurrageCollector);
  var encodedABI = ERC721DemurrageMint.encodeABI();

  var tx = helper.makeTransactionObject(
                  config['demurrage_contract_address'],
                  encodedABI,
                  config['default_gas'],
                  config['default_gas_price']
                );

  console.log(tx);
  var successEvent = function (receipt) {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).send(JSON.stringify(receipt));
  }

  var failureEvent = function (error) {
     res.setHeader('Content-Type', 'application/json');
     res.status(500).send(JSON.stringify({message: "Something went wrong"}));
  }

  helper.makeSendTx(tx, privateKey, successEvent, failureEvent);
}

/**
function to mint new ERC721 tokens and asssign to an ethereum address
**/
demurrage.mintNewToken = function(req, res) {
  var ERC721DemurrageContract = helper.getERC721DemurrageContract();
  var privateKey = req.body.private_key; //private key of the account
  var value = req.body.value;
  var to = req.body.to;
  var tokenId = req.body.token_id;

  var ERC721DemurrageMint = ERC721DemurrageContract.methods._mint(to, tokenId,
     helper.convertToCents(value));
  var encodedABI = ERC721DemurrageMint.encodeABI();

  var tx = helper.makeTransactionObject(
                  config['demurrage_contract_address'],
                  encodedABI,
                  config['default_gas'],
                  config['default_gas_price']
                );

  console.log(tx);
  var successEvent = function (receipt) {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).send(JSON.stringify(receipt));
  }

  var failureEvent = function (error) {
     res.setHeader('Content-Type', 'application/json');
     res.status(500).send(JSON.stringify({message: "Something went wrong"}));
  }

  helper.makeSendTx(tx, privateKey, successEvent, failureEvent);
}

/**
calculate demurrage fees till given day. If day is not provided
calculate till today.
**/
demurrage.calculateFeesTillDate = function(req, res) {
  var tokenId = req.query.token_id;
  var days = req.query.days;
  var ERC721DemurrageContract = helper.getERC721DemurrageContract();

  var ERC721DemurrageMint;

  if(!days) {
    ERC721DemurrageMint = ERC721DemurrageContract.methods
    ._calculateDemurrageFeesTillToday(tokenId);
  }else {
    ERC721DemurrageMint = ERC721DemurrageContract.methods
    ._calculateDemurrageFeesTillDate(tokenId, days);
  }

  ERC721DemurrageMint
  .call(
  function(error, amount) {

      if(error) {
        res.status(500).send({"error": error});
        return;
      }

      console.log(amount)

      var ERC721GetMultiple = ERC721DemurrageContract.methods
      ._getMultiple()
      .call(
      function(error, multiple) {

        if(error) {
          res.status(500).send({"error": error});
          return;
        }

        console.log(multiple);

        res.setHeader('Content-Type', 'application/json');
        var response = parseInt(amount)/parseInt(multiple);
        response = response.toString() +" USD";
        res.status(200).send(JSON.stringify(response));
      });
  });
}

/*
Send Ether amounting to usd fees for holding GBAR for N days.
User musst calculateFeesTillDate before proceeding with paying,
any extra fees paid will not be returned, for now.
*/
demurrage.payDemurrageForNDays = function(req, res) {
    res.setHeader('Content-Type', 'application/json');

    var privateKey = req.body.private_key;
    var demurrage_value = req.body.demurrage; //in eth, will be converted to usd in contract
    var tokenId = req.body.token_id;
    var days = req.body.days;

    var ERC721DemurrageContract = helper.getERC721DemurrageContract();

    var demurrageEntry = ERC721DemurrageContract
                                    .methods._payDemurrageForNDays(tokenId, days);
    var encodedABI = demurrageEntry.encodeABI();

    var tx = helper.makeTransactionObject(
            config['demurrage_contract_address'],
            encodedABI,
            config['default_gas'],
            config['default_gas_price'],
            helper.convertToWei(demurrage_value.toString())
          );

    console.log(tx);

    var successEvent = function (receipt) {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).send(JSON.stringify(receipt));
    }

    var failureEvent = function (error) {
       res.setHeader('Content-Type', 'application/json');
       res.status(500).send(JSON.stringify({message: "Something went wrong"}));
    }

    helper.makeSendTx(tx, privateKey, successEvent, failureEvent);
}

/*
User can query their payment history.
One copy of history is maintained per user.
The same gets deleted on successful transfer of token.
*/
demurrage.getDemurragePaymentHistory = function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    var tokenInfo = req.query.token_info;
    var ERC721DemurrageContract = helper.getERC721DemurrageContract();
    ERC721DemurrageContract
        .methods
        ._getDemurragePaymentHistory(tokenInfo)
        .call(
        function(error, result) {
             res.setHeader('Content-Type', 'application/json');
             if(error) {
               res.status(500).send({"error": "No payment entry for token id found"});
               return;
             }
             console.log(">>>")
             res.status(200).send(JSON.stringify(result));
        });
};

/*
Get the address which is collecting all DEMurrage.
*/
demurrage.getDemurrageCollector = function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    var ERC721DemurrageContract = helper.getERC721DemurrageContract();
    ERC721DemurrageContract
        .methods
        ._getDemurrageCollector()
        .call(
        function(error, result) {
             res.setHeader('Content-Type', 'application/json');
             if(error) {
               res.status(500).send({"error": error});
               return;
             }
             console.log(">>>")
             res.status(200).send(JSON.stringify(result));
        });
};

/*
Get owner for given GBAR token id
*/
demurrage.getGbarOwner = function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    var tokenId = req.query.token_id;
    var ERC721DemurrageContract = helper.getERC721DemurrageContract();
    ERC721DemurrageContract
        .methods
        .ownerOf(tokenId)
        .call(
        function(error, result) {
             res.setHeader('Content-Type', 'application/json');
             if(error) {
               res.status(500).send({"error": error});
               return;
             }
             console.log(">>>")
             res.status(200).send(JSON.stringify(result));
        });
};

/*
  if fees has been paid, user can transfer the token to anotther user.
  Private key should be of holder OR approved user's pvt key
  otherwise call fails.
  from should be holder pub address.
*/
demurrage.safeTransferGBAR = function(req, res) {
    res.setHeader('Content-Type', 'application/json');

    var privateKey = req.body.private_key;
    var from = req.body.from;
    var to = req.body.to; //in eth, will be converted to usd in contract
    var tokenId = req.body.token_id;

    var ERC721DemurrageContract = helper.getERC721DemurrageContract();

    var demurrageEntry = ERC721DemurrageContract
                        .methods.safeTransferFrom(from, to, tokenId);
    var encodedABI = demurrageEntry.encodeABI();

    var tx = helper.makeTransactionObject (
            config['demurrage_contract_address'],
            encodedABI,
            config['default_gas'],
            config['default_gas_price']
          );


    var successEvent = function (receipt) {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).send(JSON.stringify(receipt));
    }

    var failureEvent = function (error) {
       res.setHeader('Content-Type', 'application/json');
       res.status(500).send(JSON.stringify({ message: "Can't transfer. Non existant or not payed for." }));
    }

    helper.makeSendTx(tx, privateKey, successEvent, failureEvent);
}

module.exports = demurrage;
