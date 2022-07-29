import { useAccount } from "wagmi";
import { Image, List, Button, Modal, Typography, Table } from "antd";
import { useState } from "react";
import { burnNft } from "../services/contracts/warranty";
import BurnNFT from "./BurnNFT";
import TransferNFT from "./TransferNFT";

const NFTModal = ({
  nftContract,
  isModalVisible,
  setIsModalVisible,
  nftData,
}) => {
  const { address } = useAccount();
  const [showTransferForm, setShowTransferForm] = useState(false);
  const [showBurnForm, setShowBurnForm] = useState(false);
  const imageIpfsId = nftData?.image.split("//")[1];
  const imageSrc = `https://ipfs.io/ipfs/${imageIpfsId}`;

  return (
    <Modal
      closable={false}
      centered
      width={"70vw"}
      visible={isModalVisible}
      footer={[
        <div style={{ width: "100%", textAlign: "center" }}>
          <Button
            size="large"
            type="primary"
            onClick={() => setIsModalVisible(false)}
          >
            Go Back
          </Button>
        </div>,
      ]}
    >
      <List
        itemLayout="vertical"
        size="large"
        dataSource={[nftData]}
        renderItem={(nft) => (
          <List.Item
            key={nft}
            extra={<Image height={500} alt={nft?.name} src={imageSrc} />}
          >
            <List.Item.Meta
              title={
                <Typography.Title style={{ fontFamily: "Inter" }} level={2}>
                  {nft?.name}
                </Typography.Title>
              }
              description={nft?.description}
            />
            <Table
              dataSource={nftData?.attributes}
              columns={[
                {
                  title: "Trait Type",
                  dataIndex: "trait_type",
                  key: "trait_type",
                },
                {
                  title: "Value",
                  dataIndex: "value",
                  key: "value",
                },
              ]}
            />
            {showTransferForm && (
              <TransferNFT
                tokenId={nftData.token_id}
                walletAddress={address}
                nftContract={nftContract}
                setShowTransferForm={setShowTransferForm}
              />
            )}
            {showBurnForm && (
              <BurnNFT
                burnNft={() => burnNft(nftContract, nftData.token_id)}
                setShowBurnForm={setShowBurnForm}
              />
            )}
            {!showBurnForm && !showTransferForm && (
              <>
                <Button
                  type="danger"
                  style={{ marginRight: "1rem" }}
                  onClick={() => setShowTransferForm(true)}
                >
                  Transfer NFT
                </Button>
                <Button type="danger" onClick={() => setShowBurnForm(true)}>
                  Burn NFT
                </Button>
              </>
            )}
          </List.Item>
        )}
      />
    </Modal>
  );
};

export default NFTModal;
