import { useAccount } from "wagmi";
import { Image, List, Button, Modal, Typography, Table } from "antd";
import { useState } from "react";
import { burnNft } from "../services/contracts/warranty";
import BurnNFT from "./BurnNFT";
import TransferNFT from "./TransferNFT";
import showNotification from "../utilities/notifications";
import Loader from "./Loader";
import moment from "moment";
import { isWarrantyValid } from "../services/contracts/warranty";

const NFTModal = ({
  nftContract,
  isModalVisible,
  setIsModalVisible,
  nftData,
}) => {
  const { address } = useAccount();
  const [isLoading, setIsLoading] = useState(false);
  const [showTransferForm, setShowTransferForm] = useState(false);
  const [showBurnForm, setShowBurnForm] = useState(false);
  const [warrantyStatusLoading, setWarrantyStatusLoading] = useState(false);
  const imageIpfsId = nftData?.image.split("//")[1];
  const imageSrc = `https://ipfs.io/ipfs/${imageIpfsId}`;

  const checkWarranty = async () => {
    setWarrantyStatusLoading(true);
    const nftTxn = await isWarrantyValid(
      nftContract,
      parseInt(nftData.token_id._hex, 16)
    );
    console.log(nftTxn);
    if (nftTxn)
      showNotification("Hurray! Your warranty is still valid!", "success");
    else showNotification("Oops! Your warranty has expired!", "error");
    setWarrantyStatusLoading(false);
  };

  let attributes = [];
  if (nftData && nftData.attributes && nftData.attributes.length) {
    attributes = nftData.attributes.map((atr) => ({
      trait_type: atr.trait_type
        .split("_")
        .map((val) => val[0].toUpperCase() + val.substring(1).toLowerCase())
        .join(" "),
      value:
        atr.trait_type === "warranty_duration"
          ? `${atr.value} days`
          : atr.trait_type === "date_of_purchase"
          ? moment.unix(atr.value).format("DD/MM/YYYY")
          : atr.value,
    }));
  }

  if (nftData && nftData.token_id) {
    attributes = [
      {
        trait_type: "Token ID",
        value: parseInt(nftData.token_id._hex, 16),
      },
      ...attributes,
    ];
  }

  if (nftData && nftData.attributes && nftData.attributes.length) {
    let buyDate = null;
    let expiryDate = null;

    nftData.attributes.forEach((atr) => {
      if (atr.trait_type === "date_of_purchase") {
        buyDate = moment(
          moment.unix(atr.value).format("DD/MM/YYYY"),
          "DD/MM/YYYY"
        );
      }
    });

    if (buyDate) {
      nftData.attributes.forEach((atr) => {
        if (atr.trait_type === "warranty_duration") {
          expiryDate = moment(buyDate.add(atr.value, "days"));
        }
      });
    }

    if (buyDate && expiryDate) {
      attributes.push({
        trait_type:
          expiryDate.format("YYYY/MM/DD") > moment().format("YYYY/MM/DD")
            ? "Expires On"
            : "Expired On",
        value: expiryDate.format("DD/MM/YYYY"),
      });
    }
  }

  const handleBurnNft = () => {
    setIsLoading(true);
    burnNft(nftContract, nftData.token_id)
      .then((res) => res.wait())
      .then((res) => {
        console.log(res);
        showNotification("NFT Burnt Successfully!", "success");
        setIsLoading(false);
      })
      .catch((err) => {
        showNotification("NFT Burn Failed!", "error", err);
        console.log(err);
        setIsLoading(false);
      });
  };

  if (isLoading) return <Loader />;

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
            extra={<Image height={400} alt={nft?.name} src={imageSrc} />}
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
              style={{ marginBottom: "1rem" }}
              dataSource={attributes}
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
              pagination={false}
            />

            {nftContract && (
              <>
                {showTransferForm && (
                  <TransferNFT
                    setIsLoading={setIsLoading}
                    tokenIdHex={nftData.token_id}
                    walletAddress={address}
                    nftContract={nftContract}
                    setShowTransferForm={setShowTransferForm}
                  />
                )}
                {showBurnForm && (
                  <BurnNFT
                    setShowBurnForm={setShowBurnForm}
                    burnNft={handleBurnNft}
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
                    <Button
                      style={{ marginRight: "1rem" }}
                      type="danger"
                      onClick={() => setShowBurnForm(true)}
                    >
                      Burn NFT
                    </Button>
                    <Button
                      type="primary"
                      onClick={checkWarranty}
                      loading={warrantyStatusLoading}
                    >
                      Verify Validity
                    </Button>
                  </>
                )}
              </>
            )}
          </List.Item>
        )}
      />
    </Modal>
  );
};

export default NFTModal;
