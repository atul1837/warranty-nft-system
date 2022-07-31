import axios from "axios";
import { Input, Button, Col, Form, Row, Typography } from "antd";
import { useState } from "react";
import { getOwnerAddress, getTokenUri } from "../services/contracts/warranty";
import NFTCard from "./NFTCard";
import NFTModal from "./NFTModal";
import showNotification from "../utilities/notifications";

const FindNFT = ({ nftContract }) => {
  const [warrantyCard, setWarrantyCard] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedNFT, setSelectedNFT] = useState({});
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const tokenURI = await getTokenUri(nftContract, values.tokenId);
      console.log(tokenURI);
      const ownerAddress = await getOwnerAddress(nftContract, values.tokenId);
      const getDataFromTokenUriResponse = await axios.get(
        `https://ipfs.io/ipfs/${tokenURI.split("//")[1]}`
      );

      setWarrantyCard({
        token_id: values.tokenId,
        ownerAddress: ownerAddress,
        ...getDataFromTokenUriResponse.data,
      });
      setLoading(false);
    } catch (err) {
      showNotification("Invalid Token ID", "error");
      setLoading(false);
    }
  };

  return (
    <Row>
      <Col span={10} offset={7}>
        {selectedNFT?.token_id >= 0 && (
          <NFTModal
            nftData={selectedNFT}
            isModalVisible={isModalVisible}
            setIsModalVisible={setIsModalVisible}
            nftContract={nftContract}
            admin
          />
        )}
        {!warrantyCard ? (
          <Form
            style={{
              margin: "2rem",
              padding: "2rem",
              background: "#fff",
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
              borderRadius: "2rem",
              boxShadow: "1px 1px 2px rgba(0,0,0,0.1)",
            }}
            name="mint warranty nft"
            onFinish={onFinish}
          >
            <Form.Item style={{ textAlign: "center" }}>
              <Typography.Title
                className="ant-form-text"
                level={4}
                style={{
                  textTransform: "uppercase",
                  fontFamily: "Roboto",
                }}
              >
                Warranty Card Details
              </Typography.Title>
            </Form.Item>

            <Form.Item name="tokenId" label="Token ID" required>
              <Input
                placeholder="Please input warranty card's token id"
                required
              />
            </Form.Item>

            <Button type="primary" htmlType="submit" loading={loading}>
              Get Warranty Card
            </Button>
          </Form>
        ) : (
          <div>
            <div
              onClick={() => {
                setIsModalVisible(true);
                setSelectedNFT(warrantyCard);
                console.log("selected nft:", selectedNFT);
              }}
            >
              <NFTCard nftData={warrantyCard} />
            </div>

            <Button
              onClick={() => {
                setWarrantyCard(null);
              }}
              type={"primary"}
              style={{ width: "100%", marginTop: 20 }}
            >
              Search another
            </Button>
          </div>
        )}
      </Col>
    </Row>
  );
};

export default FindNFT;
