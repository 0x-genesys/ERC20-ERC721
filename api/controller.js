var hodl = {};

var Promise = require("bluebird");
var helper = require('./helper/web3-helper.js');
var config = require('./env/env_var.js');

hodl.generateNewHodlContract = function (req, res) {
    var hodlContract = helper.getHodlContract();
    var privateKey = req.body.private_key; //private key of the account
    var beneficiary = req.body.beneficiary;
    // var erc20Address = req.body.erc20Address;
    var time = req.body.time;
    var erc20Address = config['dummy_erc20_address'];

    var createNewHodlContractEntry = hodlContract.methods.createNewHodlContractEntry(beneficiary, erc20Address, time);
    var encodedABI = createNewHodlContractEntry.encodeABI();

    var tx = helper.makeTransactionObject(config['hodl_contract_address'],
            encodedABI, config['default_gas'], config['default_gas_price']);

    console.log("tx "+tx);
    console.log("privateKey "+privateKey);

    var successEvent = function (receipt) {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).send(JSON.stringify(receipt));
    }

    var failureEvent = function (error) {
       res.setHeader('Content-Type', 'application/json');
       res.status(500).send(JSON.stringify({ message: "timestamp can't be less than now" }));
    }

    helper.makeSendTx(tx, privateKey, successEvent, failureEvent);
};

hodl.getHodlContractAddress = function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    var beneficiaryAddress = req.query.beneficiary;
    console.log(beneficiaryAddress)
    var hodlContract = helper.getHodlContract();
    hodlContract
        .methods
        .getHodlContractAddress(beneficiaryAddress)
        .call(
        function(error, result) {
             res.setHeader('Content-Type', 'application/json');
             if(error) {
               res.status(500).send({"error": error});
               return;
             }
             res.setHeader('Content-Type', 'application/json');
             var erc20Address = result["0"];
             var beneficiary = result["1"];
             var hodlContractAddress = result["2"];
             var expiring = result["3"];
             var blockTimestamp = result["4"];
             var response = {
               "erc20Address": erc20Address,
               "beneficiary": beneficiary,
               "hodlContractAddress": hodlContractAddress,
               "expiring": expiring,
               "blockTimestamp": blockTimestamp,
               "time_left": parseInt(expiring) - parseInt(blockTimestamp)
             }
             console.log(">>>")
             res.status(200).send(JSON.stringify(response));
        });
};

hodl.preReleaseTokens = function(req, res) {
    res.setHeader('Content-Type', 'application/json');

    var privateKey = req.body.beneficiary_private_key; //private key of the beneficiary
    var fineInWei = req.body.fine_in_wei;

    var hodlContract = helper.getHodlContract();

    var createNewHodlContractEntry = hodlContract.methods.preReleaseContract();
    var encodedABI = createNewHodlContractEntry.encodeABI();

    var tx = helper.makeTransactionObject(
            config['hodl_contract_address'],
            encodedABI,
            config['default_gas'],
            config['default_gas_price'],
            fineInWei.toString()
          );

    console.log(tx);

    var successEvent = function (receipt) {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).send(JSON.stringify(receipt));
    }

    var failureEvent = function (error) {
       res.setHeader('Content-Type', 'application/json');
       res.status(500).send(JSON.stringify({message: "timestamp can't be less than now"}));
    }

    helper.makeSendTx(tx, privateKey, successEvent, failureEvent);
}

hodl.postReleaseTokens = function(req, res) {
    res.setHeader('Content-Type', 'application/json');

    var privateKey = req.body.beneficiary_private_key; //private key of the beneficiary

    var hodlContract = helper.getHodlContract();

    var createNewHodlContractEntry = hodlContract.methods.postReleaseContract();
    var encodedABI = createNewHodlContractEntry.encodeABI();

    var tx = helper.makeTransactionObject(
            config['hodl_contract_address'],
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
       res.status(500).send(JSON.stringify({message: "timestamp can't be less than now"}));
    }

    helper.makeSendTx(tx, privateKey, successEvent, failureEvent);
}

hodl.transferERC20Tokens = function(req, res) {
  var ERC20DummyContract = helper.getERC20DummyContract();
  var privateKey = req.body.private_key; //private key of the account
  var value = req.body.value;
  var to = req.body.to

  console.log(to)
  console.log(privateKey)
  console.log(value)

  var ERC20DummyContractTransfer = ERC20DummyContract.methods.transfer(to, helper.convertToWei(value));
  var encodedABI = ERC20DummyContractTransfer.encodeABI();

  var tx = helper.makeTransactionObject(
                  config['dummy_erc20_address'],
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

hodl.transferEth = function(req, res) {
  var to = req.body.to;
  var from = req.body.from;
  var amount = req.body.amount_in_wei;
  var privateKey = req.body.private_key_of_sender;

  var tx = {
            "from": from,
            "to": to,
            "gasPrice": web3.utils.toWei(config['default_gas_price'].toString(), 'gwei'),
            "gas": config['default_gas'],
            "value": amount
           }

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

hodl.getErc20Balance = function(req, res) {
    res.setHeader('Content-Type', 'application/json');
    var userAddress = req.query.user_address;
    var ERC20DummyContract = helper.getERC20DummyContract();
    ERC20DummyContract
        .methods
        .balanceOf(userAddress)
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

/**
Get Ethereum Balance
**/
hodl.getEthBalance = function(req, res) {
	var address_from_api = req.query.address;

	helper.getAccountBalance(address_from_api)
		.then(function(balance) {
			response = { "balance": balance }
			res.status(200).send(response);
		})
		.catch(function(error) {
	 		res.status(500).send({message: JSON.stringify(error)});
		});
}

module.exports = hodl;
