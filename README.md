# Solana NFT drop bundlr

This project demonstrates how you can create and deploy your own NFT drop on the Solana blockchain using thirdweb's Solana SDK and use Bundlr to store your images of the NFTs permanently and in a decentralised way.

## Tools:

- [Solana SDK](https://portal.thirdweb.com/solana): To deploy the token with metadata.
- [Bundlr](https://bundlr.network/): To store the images of the NFTs permanently.

## Using This Template

Create a project using this example:

```bash
npx thirdweb create --template thirdweb-bundlr
```

Install dependencies:

```bash
npm install # npm

yarn # yarn
```

- Export your wallet private key from phantom wallet and add it to the .env file.

```env
PRIVATE_KEY=your_private_key
```

- Run the project:

```bash
npx ts-node mint.ts
```

## How It Works

Using the thirdweb SDK, you can create and deploy your own nft drop on the Solana blockchain. We use the `.fromPrivateKey` function to connect to the wallet using the private key and then use the `.deployer.createNftDrop` function from the sdk initialized to deploy the program.

```js
const sdk = ThirdwebSDK.fromPrivateKey("devnet", walletPrivateKey!);

  // Metadata for the program
  const programMetadata = {
    name: "My NFT Drop",
    symbol: "MND",
    description: "This is my NFT Drop",
    totalSupply: 3,
  };

  // Deploying the program
  const address = await sdk.deployer.createNftDrop(programMetadata);
  console.log("Program Address: ", address);
```

Next, we use bundlr to upload the images folder:

```js
// Initializing the bundlr client
const bundlr = new Bundlr(
  "https://node2.bundlr.network",
  "solana",
  walletPrivateKey
);

// Uploading the folder
const uploadedFolder = await bundlr.uploadFolder("./images");
console.log("Uploaded folder: ", uploadedFolder?.id);
```

Now, we use this to create metadata for our NFTs:

```ts // Metadata for the NFTs
const metadata = [
  {
    name: "NFT #1",
    description: "My first NFT!",
    image: `https://arweave.net/${uploadedFolder?.id}/0.jpg`,
    properties: [
      {
        name: "kitten",
        value: "very cute!",
      },
    ],
  },
  {
    name: "NFT #2",
    description: "My second NFT!",
    image: `https://arweave.net/${uploadedFolder?.id}/1.jpg`,
    properties: [
      {
        name: "grumpy cat",
        value: "grumpy!",
      },
    ],
  },
  {
    name: "NFT #2",
    description: "My third NFT!",
    image: `https://arweave.net/${uploadedFolder?.id}/2.jpg`,
    properties: [
      {
        name: "Ninja Cat",
        value: "warrior!",
      },
    ],
  },
];
```

Finally, we get the drop we just deployed and lazyMint the NFTs using the metadata:

```ts
// Getting the program
const program = await sdk.getNFTDrop(address);
// Minting the NFTs
const tx = await program.lazyMint(metadata);
console.log("signature: ", tx[0].signature);
```

## Join our Discord!

For any questions or suggestions, join our discord at [https://discord.gg/thirdweb](https://discord.gg/thirdweb).
