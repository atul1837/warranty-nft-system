import axios from "axios";
import { useEffect, useState } from "react";
import { Layout, Typography, Row, Col } from "antd";

import NFTCard from "./NFTCard";
import NFTModal from "./NFTModal";

const API_KEY = "hEa8GnheHPkSwVBrdefHTKO0JiXgSYqLeTW7CKPRm9tziCeStJ46dYyfx32BnKVn";

const CONTRACT_ADDRESS = "0x8Bc9453EBA87969Bf29c9B8832185aA5F734a14C";
const WALLET_ADDRESS = "0x07e52895813C87E4004Eca26f5ba9cA086E10A25";
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
