# ERC20

## Description

Love Hodling? Don't trust yourself to not sell? This contract can help you.

Time lock, easy HODL contract. Built on Solidity Contracts and Node.js

Account holder can lock tokens at HodlContract.sol; Only one lock per user is maintained.
User have two options after locking:

A) Retrieve the tokens before lock expires. In this case contract will consume a fine.

B) Retrieve the tokens after lock expires. In this case reward will be given.

Only locking party can unlock their tokens.

## How to run:

### Server:

```
npm i
```

```
npm start
```

by default server connects to Ropsten network.
To connect to local network make changes in  env_var.js


### Deploy contracts:

Ropsten :

```
truffle migrate --network ropsten
```

Local :

```
truffle migrate
```


## Ropsten

DummyErc20.sol : https://ropsten.etherscan.io/address/0xaa6a79362bdba736ab933e0db5377e661ff4da6a
CreateHodlContract.sol : https://ropsten.etherscan.io/address/0xaa6a79362bdba736ab933e0db5377e661ff4da6a
HodlContract.sol one instance : https://ropsten.etherscan.io/address/0x73A562eF3adE362887c69f21BfC1DCd1b74CD411

Many such instance of HodlContract can exist depending on how many users are creating hodl locks on their tokens


## Future Improvements:

1. Minimum lock period.

2. Dynamic gas prices.
