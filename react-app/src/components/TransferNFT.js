import { Button, Form, Input } from "antd";
import React, { useState } from "react";
import { transferNft } from "../services/contracts/warranty";

const TransferNFT = ({
  tokenId,
  walletAddress,
  nftContract,
  setShowTransferForm,
}) => {
  const [toWalletAddress, setToWalletAddress] = useState("");
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
          onClick={() =>
            transferNft(nftContract, walletAddress, toWalletAddress, tokenId)
          }
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
