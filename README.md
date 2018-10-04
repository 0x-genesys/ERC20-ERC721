# ERC20

Time lock , easy HODL contract. Built on Solidity Contracts and Node.js

Account holder can lock tokens at HodlContract.sol; Only one lock per user is maintained.
User have two options after locking:

A) Retrieve the tokens before lock expires. In this case contract will consume a fine.

B) Retrieve the tokens after lock expires. In this case reward will be given.


## Structure of Project:

- api
      - env
          - env_var.js : for environment global vars.

      - helper
          -  web3-helper.js : basic layer between controller and web3.js lib

      - controller.js : All APIs

      - index.js  : all routes

- contracts
    - erc20_project : For ERC20
      - math 



Future Improvements:

1. Minimum lock period.

2. Gas on demand prices.
