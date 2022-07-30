API_URL =
  "https://eth-goerli.alchemyapi.io/v2/5p2Q3UIHAd4cpdcgoDLOX71xRhee3Tgp";
const PUBLIC_KEY = "0x9e6A054D09dA219c9c4F3cefCF4C9640763487b7";
const PRIVATE_KEY =
  "f68f478fee7dec62a51059284f0ac08ffe863e3da5dc5d04c47809c3752fd80f";

const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(API_URL);

const factoryContract = require("../artifacts/contracts/factory.sol/WarrantyFactory.json");

async function deployNewContract() {
  const contractAddress = "0x1188D2E9122A8444E3F5669CfFeA155027BAaDD5";
  console.log(PRIVATE_KEY);
  const fcontract = new web3.eth.Contract(factoryContract.abi, contractAddress);

  const nonce = await web3.eth.getTransactionCount(PUBLIC_KEY, "latest"); //get latest nonce

  const tx = {
    from: PUBLIC_KEY,
    to: contractAddress,
    nonce: nonce,
    gas: 500000,
    data: fcontract.methods.createNewWarrantyContract("HOLA", "HL").encodeABI(),
  };

  const signPromise = web3.eth.accounts.signTransaction(tx, PRIVATE_KEY);
  signPromise
    .then((signedTx) => {
      web3.eth.sendSignedTransaction(
        signedTx.rawTransaction,
        function (err, hash) {
          if (!err) {
            console.log(
              "The hash of your transaction is: ",
              hash,
              "\nCheck Alchemy's Mempool to view the status of your transaction!"
            );
          } else {
            console.log(
              "Something went wrong when submitting your transaction:",
              err
            );
          }
        }
      );
    })
    .catch((err) => {
      console.log(" Promise failed:", err);
    });
}

// deployNewContract()

async function createContract() {
  const contractAddress = "0x1188D2E9122A8444E3F5669CfFeA155027BAaDD5";
  const fcontract = new web3.eth.Contract(factoryContract.abi, contractAddress);

  const nonce = await web3.eth.getTransactionCount(PUBLIC_KEY, "latest"); //get latest nonce

  const tx = {
    from: PUBLIC_KEY,
    to: contractAddress,
    nonce: nonce,
    gas: 500000,
    data: fcontract.methods.createNewWarrantyContract("hola", "hl").encodeABI(),
  };

  const signPromise = web3.eth.accounts.signTransaction(tx, PRIVATE_KEY);
  signPromise
    .then((signedTx) => {
      web3.eth.sendSignedTransaction(
        signedTx.rawTransaction,
        function (err, hash) {
          if (!err) {
            console.log(
              "The hash of your transaction is: ",
              hash,
              "\nCheck Alchemy's Mempool to view the status of your transaction!"
            );
          } else {
            console.log(
              "Something went wrong when submitting your transaction:",
              err
            );
          }
        }
      );
    })
    .catch((err) => {
      console.log(" Promise failed:", err);
    });
}

createContract();

async function getSomething() {
  const contractAddress = "0x1188D2E9122A8444E3F5669CfFeA155027BAaDD5";
  console.log(contractAddress);
  const fcontract = new web3.eth.Contract(factoryContract.abi, contractAddress);

  fcontract.methods
    .getcontractofowner()
    .call()
    .then((result) => {
      console.log(result);
    })
    .catch((error) => {
      console.log(error);
    });
}

//   getSomething()
