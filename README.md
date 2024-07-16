NFT market (ERC1155) for ThirdHero (https://market.thirdhero.net)

# Setup
  - ```cd nft_market```
  - ```npm install (or bun install)```
  - ```make .env copy with name .env.local```
  - ```edit VITE_PUBLIC_WALLET_CONNECT_PROJECT_ID inside .env.local``` - Get Wallet Connect ID here: https://cloud.walletconnect.com/
  - ```npm run dev```
  - it's should run on http://localhost:5173/ (by default)

# Solidity ERC1155 Contract
This NFT market use custom smart contract, you can find it here:

https://github.com/thirdheronet/solidity_contracts/blob/main/contracts/ThirdHeroTokens.sol
