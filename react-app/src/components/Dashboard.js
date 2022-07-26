import { useEffect, useState } from "react";
import { Layout, Typography, Row, Col } from "antd";

import BrandCard from "./BrandCard";

const Dashboard = ({ factoryContract }) => {
  const [contracts, setContracts] = useState([]);
  const [selectedContract, setSelectedContract] = useState(null);
  const [totalContracts, setTotalContracts] = useState(0);

  useEffect(() => {
    const getTokenCount = async () => {
      const nftTxn = await factoryContract.totalSupply();

      const totalSupply = parseInt(nftTxn._hex, 16);
      setTotalContracts(totalSupply);
    };

    if (factoryContract) getTokenCount();
  }, [factoryContract]);

  useEffect(() => {
    const tokenIds = [];
    const brands = [];
    const getTokenId = async (tokenIndex) => {
      const nftTxn = await factoryContract.tokenByIndex(tokenIndex);

      return nftTxn;
    };

    const getTokenIds = async () => {
      for (let i = 0; i < totalContracts; i++) {
        const tokenId = await getTokenId(i);
        tokenIds.push(parseInt(tokenId._hex, 16));
      }
    };

    const getBrandDetails = async (tokenId) => {
      const nftTxn = await factoryContract.getContractDetails(tokenId);

      return nftTxn;
    };

    const fetchContracts = async () => {
      await getTokenIds();
      for (const tokenId of tokenIds) {
        const nftDetails = await getBrandDetails(tokenId);

        brands.push(nftDetails);
      }

      setContracts([...brands]);
    };

    if (factoryContract && contracts.length !== totalContracts) {
      fetchContracts();
    }
  }, [totalContracts]);

  return (
    <Layout.Content>
      <Typography.Title
        style={{
          textAlign: "center",
          marginTop: "2rem",
          fontFamily: "Inter",
          fontWeight: "900",
        }}
      >
        Brands
      </Typography.Title>
      <Row style={{ margin: "0 1rem" }}>
        {contracts.map((contract) => (
          <Col
            key={contract.token_id}
            style={{ margin: ".5rem 2rem" }}
            onClick={() => setSelectedContract(contract)}
          >
            <BrandCard brandData={contract} />
          </Col>
        ))}
      </Row>
    </Layout.Content>
  );
};

export default Dashboard;
