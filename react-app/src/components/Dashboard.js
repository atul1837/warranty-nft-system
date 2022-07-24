import axios from "axios";
import { useEffect, useState } from "react";
import { Layout, Typography, Row, Col } from "antd";

import NFTCard from "./NFTCard";
import NFTModal from "./NFTModal";

const API_KEY = "";

const CONTRACT_ADDRESS = "0x0b432135f5D34B43DBF0BA48dcD8241781EBfED2";
const WALLET_ADDRESS = "0x9e6A054D09dA219c9c4F3cefCF4C9640763487b7";
const CHAIN = "goerli";
const TOKEN_ID_FORMAT = "decimal";
const BASE_URL = "https://deep-index.moralis.io/api/v2/";
const config = {
  headers: {
    "Content-Type": "application/json",
    "X-API-Key": API_KEY,
  },
};

const Dashboard = () => {
  const [warrantyNFTs, setWarrantyNFTs] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedNFT, setSelectedNFT] = useState({});

  useEffect(() => {
    const url = `${BASE_URL}${WALLET_ADDRESS}/nft/${CONTRACT_ADDRESS}?chain=${CHAIN}&format=${TOKEN_ID_FORMAT}`;

    axios
      .get(url, config)
      .then((res) => {
        console.log(res.data);
        if (res && res.data && res.data.result && res.data.result.length) {
          setWarrantyNFTs(res.data.result);
        }
      })
      .catch((err) => {
        console.log("err", err);
      });
  }, []);

  useEffect(() => {
    if (!isModalVisible) {
      setSelectedNFT({});
    }
  }, [isModalVisible]);

  const tokens = [1, 2, 3, 4, 5];

  return (
    <Layout.Content>
      {selectedNFT && selectedNFT.token_id && (
        <NFTModal
          selectedNFT={selectedNFT}
          isModalVisible={isModalVisible}
          setIsModalVisible={setIsModalVisible}
        />
      )}
      <Typography.Title
        style={{
          textAlign: "center",
          marginTop: "2rem",
          fontFamily: "Inter",
          fontWeight: "900",
        }}
      >
        Warranty Card NFTs
      </Typography.Title>
      <Row style={{ margin: "0 1rem" }}>
        {warrantyNFTs.map((nft) => (
          <Col
            key={nft.token_id}
            style={{ margin: ".5rem 2rem" }}
            onClick={() => {
              setIsModalVisible(true);
              setSelectedNFT(nft);
            }}
          >
            <NFTCard nftData={JSON.parse(nft.metadata)} />
          </Col>
        ))}
      </Row>
    </Layout.Content>
  );
};

export default Dashboard;
