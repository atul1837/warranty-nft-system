import { useEffect, useState } from "react";
import { Layout, Typography, Row, Col } from "antd";
import { Link } from "react-router-dom";
import Loader from "./Loader";
import BrandCard from "./BrandCard";

const Dashboard = ({ factoryContract }) => {
  const [contracts, setContracts] = useState([]);
  const [selectedContract, setSelectedContract] = useState(null);
  const [totalContracts, setTotalContracts] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getTokenCount = async () => {
      const nftTxn = await factoryContract.getTotalContracts();

      const totalSupply = parseInt(nftTxn._hex, 16);
      setTotalContracts(totalSupply);
    };

    if (factoryContract) {
      setIsLoading(true);
      getTokenCount();
    }
  }, [factoryContract]);

  useEffect(() => {
    const getOwnerAddressByIndex = async (tokenIndex) => {
      const nftTxn = await factoryContract.ownersAddress(tokenIndex);

      return nftTxn;
    };

    const getOwnerAddressesByIndex = async () => {
      let ownersAddresses = [];
      for (let i = 0; i < totalContracts; i++) {
        const owners_address = await getOwnerAddressByIndex(i);
        ownersAddresses.push(owners_address);
      }
      return ownersAddresses;
    };

    const getBrandDetails = async (ownerAddress) => {
      let contract_detail = await factoryContract.getDeployedContractDetails(
        ownerAddress
      );
      let contract_detail_json = {
        address: contract_detail[0],
        name: contract_detail[1],
        symbol: contract_detail[2],
        image: `https://ipfs.io/ipfs/${contract_detail[3].split("//")[1]}`,
      };
      return contract_detail_json;
    };

    const fetchContracts = async () => {
      let ownersAddresses = await getOwnerAddressesByIndex();
      let brands = [];
      for (let ownerAddress of ownersAddresses) {
        let brandDetails = await getBrandDetails(ownerAddress);

        brands.push(brandDetails);
      }
      setContracts([...brands]);
    };

    if (factoryContract && contracts.length !== totalContracts) {
      fetchContracts().then((res) => {
        setIsLoading(false);
      });
    }
  }, [totalContracts]);

  if (isLoading) {
    return <Loader />;
  }

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
        All Brands
      </Typography.Title>
      <Row style={{ margin: "0 1rem" }}>
        {contracts.map((contract) => (
          <Col span={4} key={contract.address} style={{ margin: ".5rem 2rem" }}>
            <Link
              to={{
                pathname: `/brand/${contract.address}/`,
                state: { contract },
              }}
            >
              <BrandCard brandData={contract} />
            </Link>
          </Col>
        ))}
      </Row>
    </Layout.Content>
  );
};

export default Dashboard;
