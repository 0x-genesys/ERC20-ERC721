# HODL ERC20

## Description

Love Hodling your ERC20 tokens? Don't trust yourself to not sell?

Time lock, easy HODL contracts. Built on Ethereum and Node.js

Account holder can lock tokens in HodlContract.sol; Only one lock per user is
maintained.

Everything is automated. Just use the HTTP APIs below to
Time-lock/ early-release/ post-release your tokens.

You are free to deploy on your servers and any blockchain (mainnet, ropsten local etc).


User have two options after locking:

A) Retrieve the tokens before lock expires. In this case contract will consume
a fine.

B) Retrieve the tokens after lock expires. In this case reward will be given.

Only locking party can unlock their tokens.

> Fine / Reward algo is: (Number of erc20 tokens contract holds) * timediff * 1 wei

## Ropsten

DummyErc20.sol : https://ropsten.etherscan.io/address/0xaa6a79362bdba736ab933e0db5377e661ff4da6a
CreateHodlContract.sol : https://ropsten.etherscan.io/address/0xc42837cd64bdd1f9c3ff1df09b86ccdc2bb697fd
HodlContract.sol one instance : https://ropsten.etherscan.io/address/0x73A562eF3adE362887c69f21BfC1DCd1b74CD411

Many such instance of HodlContract can exist depending on how many users are
creating hodl locks on their tokens.


## API DOCUMENTATION (IMP):

https://documenter.getpostman.com/view/3718257/RWgp2f1b





# DEMURRAGE ERC721

Demurrage.sol is erc721 standard contract. it supports all (necessary and optional)
functions of erc721. It also extends the Ownable.sol.

For simplicity sake  I have copied Zeppelin files to the project folder.

Owner of the contract can mint new GBAR token and assign it to a user. It also
assigns the token a USD value equal to value of the physical entity it demonstrates.

Holding the GBAR token incurs a daily fees depending on an algo:

> demurrage fees = 0.001 * value * time_period_in_days

Holder of the GBAR token can calculate fees incurred for N days or till today.

Once such fees is paid till N day, user can transfer the token anytime before Nth
day.

## Ropsten

Demurrage.sol :

https://ropsten.etherscan.io/address/0x3a2f923e8d93572599a35070c6a07d082b1958e3

## API DOCUMENTATION (IMP):

https://documenter.getpostman.com/view/3718257/RWgp2f1f




# How to run:

### Server:

```
npm i -g

```

```
truffle compile

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

*My test keys are left unchanged in Repo. Request you to change them if deploying your own instance.*

*API that write on blockchain wait for network confirmation and hence can take
upto 10 seconds to respond. Please keep ttl above 15 sec.*



## Future Improvements:

1. Implement better socket and events.

2. Dynamic gas prices.

3. Bug Bounty
