# Alliance
Solidity smart contracts of Alliance, a web3 clone of [Calendly](https://calendly.com/).

## Usage
```shell
npx hardhat accounts
npx hardhat compile
npx hardhat clean
npx hardhat test  // runs tests, also reports contract bytecode size
npx hardhat node  // start Hardhat localhost server
npx hardhat help
npx hardhat coverage  // reports test coverage, gas usage
npx hardhat run scripts/deploy.ts
node scripts/deploy.ts
npx eslint '**/*.ts'
npx eslint '**/*.ts' --fix
npx prettier '**/*.{json,sol,md}' --check
npx prettier '**/*.{json,sol,md}' --write
npx solhint 'contracts/**/*.sol'
npx solhint 'contracts/**/*.sol' --fix
```

## Etherscan verification

To try out Etherscan verification, you first need to deploy a contract to an Ethereum network that's supported by Etherscan, such as Ropsten.

In this project, copy the .env.template file to a file named .env, and then edit it to fill in the details. Enter your Etherscan API key, your Ropsten node URL (eg from Alchemy), and the private key of the account which will send the deployment transaction. With a valid .env file in place, first deploy your contract:

```shell
npx hardhat run --network ropsten scripts/deploy.ts
```

Then, copy the deployment address and paste it in to replace `DEPLOYED_CONTRACT_ADDRESS` in this command:

```shell
npx hardhat verify --network ropsten DEPLOYED_CONTRACT_ADDRESS "Hello, Hardhat!"
```
