import axios from "axios";
import { useEffect, useState } from "react";
import { Layout, Typography, Row, Col } from "antd";

import NFTCard from "./NFTCard";
import NFTModal from "./NFTModal";

// const API_KEY = "";
// const CONTRACT_ADDRESS = "0x0b432135f5D34B43DBF0BA48dcD8241781EBfED2";
// const WALLET_ADDRESS = "0x9e6A054D09dA219c9c4F3cefCF4C9640763487b7";

const Dashboard = () => {
  //   useEffect(() => {
  //     const url = `https://api.etherscan.io/api?module=account&action=tokennfttx&startblock=0&endblock=27025780&contractaddress=${CONTRACT_ADDRESS}&address=${WALLET_ADDRESS}&apikey=${API_KEY}`;

  //     axios
  //       .get(url)
  //       .then((res) => console.log(res))
  //       .catch((err) => {
  //         console.log("err", err);
  //       });
  //   }, []);

  const [isModalVisible, setIsModalVisible] = useState(false);
  //   const [selectedToken, setSelectedToken] = useState("");
  const tokens = [1, 2, 3, 4, 5];

  return (
    <Layout.Content>
      <NFTModal
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
      />
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
        {tokens.map((token) => (
          <Col
            key={token}
            style={{ margin: ".5rem 2rem" }}
            onClick={() => setIsModalVisible(true)}
          >
            <NFTCard />
          </Col>
        ))}
      </Row>
    </Layout.Content>
  );
};

export default Dashboard;
