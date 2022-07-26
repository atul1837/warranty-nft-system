import moment from "moment";

import { useEffect, useState } from "react";
import { UploadOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { create } from "ipfs-http-client";
import { ethers } from "ethers";

import Loader from "./Loader";
import contractJSON from "../contracts/warranty.sol/WarrantyCardContract.json";
import factoryContractJSON from "../contracts/factory.sol/WarrantyFactory.json";

const CONTRACT_ADDRESS = "0x74Cfa3693386FE80D3a322cC8350544a2f0B6376";

const CreateContract = () => {
  const [buffer, setBuffer] = useState("");
  const [imageIPFS, setImageIPFS] = useState("");
  const [isTransferable, setIsTransferable] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [wcadd, setWcAdd] = useState(null);
  const ipfsClient = create({
    url: "https://ipfs.infura.io:5001/api/v0",
  });

  const mintWarrantyNFT = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();

        const nftContract = new ethers.Contract(
          CONTRACT_ADDRESS,
          factoryContractJSON.abi,
          signer
        );

        console.log("Initialise payment");

        const nftTxn = await nftContract.createNewWarrantyContract(
          "hola",
          "HL"
        );

        console.log("mining pls wait");
        await nftTxn.wait();

        console.log("Transaction hash: ", nftTxn.hash);
      } else {
        throw new Error("Ethereum object is not present!");
      }
    } catch (err) {
      console.log("Error", err);
    }
  };

  const mintRealWarrantyNFT = async (
    productSerialNumber,
    warrantyDuration,
    warrantyTransfers,
    walletAddress,
    tokenUri
  ) => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();

        const nftContract = new ethers.Contract(
          wcadd,
          contractJSON.abi,
          signer
        );

        console.log("Initialise payment");

        const nftTxn = await nftContract.mintWarrantyCard(
          productSerialNumber,
          warrantyDuration,
          warrantyTransfers,
          walletAddress,
          tokenUri,
          {
            gasLimit: 2000000
          }
        );

        console.log("mining pls wait");
        await nftTxn.wait();

        console.log("Transaction hash: ", nftTxn.hash);
      } else {
        throw new Error("Ethereum object is not present!");
      }
    } catch (err) {
      console.log("Error", err);
    }
  };

  const showContract = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();

        const nftContract = new ethers.Contract(
          CONTRACT_ADDRESS,
          factoryContractJSON.abi,
          signer
        );

        console.log("getting contracts");

        const nftTxn = await nftContract.getcontractofowner();

        console.log("getting plz wait");
        // await nftTxn.wait();

        console.log("value: ", nftTxn);
        setWcAdd(nftTxn);
      } else {
        throw new Error("Ethereum object is not present!");
      }
    } catch (err) {
      console.log("Error", err);
    }
  };

  const mintCustomWarranty = async () => {
    await mintRealWarrantyNFT(
        1010,
        2,
        2 || 0,
        "0x9e6A054D09dA219c9c4F3cefCF4C9640763487b7",
        "https://ipfs.moralis.io:2053/ipfs/QmSgf3EekfCxkHfVfpHpr2m2Saok7ZD84kQTtRuTn7oGna"
    );
  }

  useEffect(() => {
    try {
      const upload = async () => {
        if (ipfsClient && buffer) {
          console.log("inside buf", buffer);
          const result = await ipfsClient.add(buffer);

          if (result && result.path) {
            console.log(result, result.path);
            setImageIPFS(result.path);
          }
        }
      };

      upload();
    } catch (err) {
      console.log("err", err);
    }
  }, [ipfsClient, buffer]);

  const handleImageUpload = (file) => {
    try {
      const reader = new window.FileReader();
      reader.readAsArrayBuffer(file);
      reader.onload = (e) => {
        setBuffer(e.target.result);
      };

      return true;
    } catch (err) {
      console.log("Err", err);
      return false;
    }
  };

  const normFile = (e) => {
    console.log("Upload event:", e);
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  const onFinish = async (values) => {
    setIsLoading(true);
    // "walletAddress": "0x11",
    const warrantyJSON = {
      attributes: [
        {
          trait_type: "warranty_duration",
          value: values.warrantyDuration,
        },
        {
          trait_type: "product_serial_number",
          value: values.productSerialNumber,
        },
        {
          trait_type: "product_price",
          value: values.values.productPrice,
        },
        {
          trait_type: "date_of_purchase",
          value: moment(values.dateOfPurchase).unix(),
        },
      ],
      description: values.productDescription,
      image: `ipfs://${imageIPFS}`,
      name: values.productName,
    };

    const result = await ipfsClient.add(JSON.stringify(warrantyJSON));
    if (result && result.path) {
      const tokenUri = `ipfs://${result.path}`;
      console.log(tokenUri);

      await mintWarrantyNFT(
        values.productSerialNumber,
        values.warrantyDuration,
        values.warrantyTransfers || 0,
        values.walletAddress,
        tokenUri
      );
    }

    setIsLoading(false);
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      <Button type="primary" onClick={mintWarrantyNFT}>
        Generate Contract
      </Button>

      <Button type="primary" onClick={showContract}>
        Show Contract
      </Button>

      <div>{wcadd? wcadd : "haha nothing"}</div>

      <Button type="primary" onClick={mintCustomWarranty}>
        Mint NFT
      </Button>

    </>
  );
};

export default CreateContract;
