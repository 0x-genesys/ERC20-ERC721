var helper = {};           //mongodb
var Web3 = require('web3');
var fs = require("fs");
var config = require('../env/env_var.js');

//INIT WEB3
if (typeof web3 !== 'undefined') {
  //check if web 3 is setup (like in mist)
  web3 = new Web3(web3.currentProvider);
} else {
  // set the provider you want from Web3.providers
  web3 = new Web3(new Web3.providers.HttpProvider(config['node_address']));
}

var web3Socket = new Web3(new Web3.providers.WebsocketProvider(config['node_socket']));

//INIT ABI
var file = config["file"];
var resultJson = JSON.parse(fs.readFileSync(file+"CreateHodlContract.json"));
var erc20ABI = JSON.parse(fs.readFileSync(file+"DummyERC20.json")).abi;
var abi = resultJson.abi;
var address = config['hodl_contract_address'];
var erc20Address = config['dummy_erc20_address'];
var contractHttp;
var ERC20DummyContract;
var ERC20DummyContractSocket;
var contractSocket;

//FUNCTIONS:---->
//get web3 provider: metamask , local or Mist
helper.getCurrentProvider = function() {
    return web3.currentProvider;
}

//Get getHodlContract
helper.getHodlContract = function() {
    if(!contractHttp) {
        //Params : ABI, Address where deployed, default tx object values used in methods
        contractHttp = new web3.eth.Contract(abi, address);
        contractSocket = new web3Socket.eth.Contract(abi, address);
        helper.subscribeToEvents(contractSocket);
    }
    return contractHttp;
}

//Get get erc20
helper.getERC20DummyContract = function() {
    if(!ERC20DummyContract) {
      //Params : ABI, Address where deployed, default tx object values used in methods
      ERC20DummyContract = new web3.eth.Contract(erc20ABI, erc20Address);
      ERC20DummyContractSocket = new web3Socket.eth.Contract(erc20ABI, erc20Address);
      helper.subscribeToEventsErc20(ERC20DummyContractSocket);
    }
    return ERC20DummyContract;
}

helper.subscribeToEventsErc20 = function(contract) {
  contract
    .events
    .Transfer({}, {}, function(error, event) {
      if(!error) console.log(event)
      else console.log(error)
    })
    .on('data',function(event) {
          console.log(">>>>>EVENT>>>>>>>>>");
          console.log(event.returnValues);
    })
    .on('changed',function(event) {
        console.log(event.returnValues);
    })
    .on('error', function(error) {
      console.log(error);
    });
}

//listen to events
helper.subscribeToEvents = function(contractSocket) {

  contractSocket
    .events
    .Hodl({}, {}, function(error, event) {})
    .on('data',function(event) {
          console.log(">>>>>EVENT>>>>>>>>>");
          console.log(event.returnValues);
    })
    .on('changed',function(event) {
        console.log(event.returnValues);
    })
    .on('error', function(error) {
      console.log(error);
    });
    
}

/*
These are default value, Gas should be estimated by estimateGas() function before calling
 */
helper.getGasPrice = function() {
    return web3.eth.getGasPrice()
        .then(function(gasprice) {
            return gasprice// default gas price in wei, 20 gwei in this case
        });
};

helper.getPrimaryAccountUnlocked = function() {
    var account = web3.personal.listAccounts[0];
    web3.personal.unlockAccount(account,"password",15000); // unlock for a long time
    return account;
}


helper.getAccountAtIndex = function(index) {
    return web3.eth.getAccounts().then(function(account) {
        return account[index];
    });
};

helper.getAccountBalance = function(address) {
    return web3.eth.getBalance(address);
}

helper.checkIsConnected = function() {
    web3.eth.getAccounts().then(console.log);
    return web3.currentProvider;
}


helper.createTx = function(tx, privateKey) {
    return  web3.eth.accounts.signTransaction(tx, privateKey);
}

helper.sendTx = function(rawTx) {
    return web3.eth.sendSignedTransaction(rawTx);
}


helper.makeSendTx = function(tx, privateKey, successEvent, failureEvent) {
  return helper.createTx(tx, privateKey)
    .then(signed => {
        console.log("signed "+signed.toString());
        var tran = helper.sendTx(signed.rawTransaction);

            tran.on('confirmation', (confirmationNumber, receipt) => {
              console.log('confirmation: ' + confirmationNumber);
            });

            tran.on('transactionHash', hash => {
              console.log('hash');
              console.log(hash);
              successEvent(hash);
            });

            tran.on('receipt', receipt => {
              console.log('receipt');
              console.log(receipt);
            });

            tran.on('error', error => {
                console.log(error.toString());
                failureEvent(error);
            });
    });
}


helper.makeTransactionObject = function(to, encodedABI,
                                        gas, gasPrice, amountToSend) {

     console.log("amountToSend "+amountToSend);
     var tx = {
               "to": to,
               "data": encodedABI,
               "gasPrice": web3.utils.toWei(gasPrice.toString(), 'gwei'),
               "gas": gas.toString()
              }

     if(amountToSend) tx["value"] = amountToSend;
     return tx;
}

helper.convertToWei = function(value) {
  return web3.utils.toWei(value, "ether");
}


module.exports = helper;
