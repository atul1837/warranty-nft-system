import { Button, Form, Input } from "antd";
import React, { useState } from "react";
import { transferNft } from "../services/contracts/warranty";
import showNotification from "../utilities/notifications";

const TransferNFT = ({
  setIsLoading,
  tokenIdHex,
  walletAddress,
  nftContract,
  setShowTransferForm,
}) => {
  let tokenId = null;
  console.log(tokenIdHex, parseInt(tokenIdHex._hex, 16));
  if (tokenIdHex) tokenId = parseInt(tokenIdHex._hex, 16);
  const [toWalletAddress, setToWalletAddress] = useState("");

  const handleTransferNft = () => {
    setIsLoading(true);
    transferNft(nftContract, walletAddress, toWalletAddress, tokenId)
      .then((res) => res.wait())
      .then((res) => {
        console.log(res);
        showNotification("NFT Transferred Successfully!", "success");
        setIsLoading(false);
      })
      .catch((err) => {
        showNotification("NFT Transfer Failed!", "error", err);
        console.log(err);
        setIsLoading(false);
      });
  };

  return (
    <Form layout="inline" style={{ marginTop: "1rem" }}>
      <Form.Item label="Transfer To Wallet">
        <Input
          value={toWalletAddress}
          onChange={(e) => setToWalletAddress(e.target.value)}
          placeholder="Enter wallet address"
        />
      </Form.Item>
      <Form.Item>
        <Button
          type="primary"
          style={{ marginRight: ".5rem" }}
          onClick={handleTransferNft}
        >
          Transfer
        </Button>
        <Button type="danger" onClick={() => setShowTransferForm(false)}>
          Cancel
        </Button>
      </Form.Item>
    </Form>
  );
};

export default TransferNFT;
