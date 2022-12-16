import { ThirdwebSDK } from "@thirdweb-dev/sdk/solana";
import { config } from "dotenv";
import Bundlr from "@bundlr-network/client";

config();

const mint = async () => {
  // fetching the key from the environment variable
  const walletPrivateKey = process.env.PRIVATE_KEY as string;
  if (!walletPrivateKey) {
    console.log("Please set the PRIVATE_KEY environment variable");
    return process.exit(1);
  }
  // Instantiate the SDK and pass in the private key
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

  // Initializing the bundlr client
  const bundlr = new Bundlr(
    "https://node2.bundlr.network",
    "solana",
    walletPrivateKey
  );

  // Uploading the folder
  const uploadedFolder = await bundlr.uploadFolder("./images");
  console.log("Uploaded folder: ", uploadedFolder?.id);

  // Metadata for the NFTs
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

  // Getting the program
  const program = await sdk.getNFTDrop(address);
  // Minting the NFTs
  const tx = await program.lazyMint(metadata);
  console.log("signature: ", tx[0].signature);
};

mint();
