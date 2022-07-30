import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { Layout, Typography, Row, Col } from "antd";
import NFTCard from "./NFTCard";
import NFTModal from "./NFTModal";
import { getTokenUri } from "../services/contracts/warranty";
import Loader from "./Loader";

const BrandDetails = ({ setBrandContractAddress, brandContract, signer }) => {
  const location = useLocation();
  let { contract } = useParams();
  const [userAddress, setUserAddress] = useState(null);
  const [warrantyCards, setWarrantyCards] = useState(null);
  const [selectedNFT, setSelectedNFT] = useState({});
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [balanceOfUser, setBalanceOfUser] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (contract != null) {
      setBrandContractAddress(contract);
    }
    console.log("contract", contract);
  }, [contract]);

  useEffect(() => {
    const getAddressOfUser = async () => {
      const address = await signer?.getAddress();
      return address;
    };

    const addressOfUser = getAddressOfUser();
    setUserAddress(addressOfUser);
  }, [signer]);

  useEffect(() => {
    if (brandContract && userAddress) {
      const getBalanceOfUser = async () => {
        console.log("brand contract", brandContract);
        const nftTxn = await brandContract?.balanceOf(userAddress);
        const balance = parseInt(nftTxn?._hex, 16);
        console.log("balance of user inside function", balance);
        setBalanceOfUser(balance);
      };
      setIsLoading(true);
      getBalanceOfUser();
    }
  }, [brandContract, userAddress]);

  useEffect(() => {
    let warrantyCardList = [];

    const fetchWarrantyCard = async (idx) => {
      const tokenId = await brandContract?.tokenOfOwnerByIndex(
        userAddress,
        idx
      );
      try {
        const tokenURI = await getTokenUri(brandContract, tokenId);

        const getDataFromTokenUriResponse = await axios.get(
          `https://ipfs.io/ipfs/${tokenURI.split("//")[1]}`
        );

        let warrantyCard = {
          token_id: tokenId,
          ...getDataFromTokenUriResponse.data,
        };
        console.log("warranty card inside function", warrantyCard);
        warrantyCardList.push(warrantyCard);
        console.log("warranty card list", warrantyCardList);
        setWarrantyCards([...warrantyCardList]);
      } catch (err) {
        console.log("err", err);
      }
    };

    const getTokenIdByIdx = async (idx) => {
      const tokenId = await brandContract?.tokenOfOwnerByIndex(
        userAddress,
        idx
      );
      return tokenId;
    };

    console.log("balance of user ", balanceOfUser);
    if (balanceOfUser > 0) {
      for (let idx = 0; idx < balanceOfUser; idx++) {
        fetchWarrantyCard(idx).then((res) => setIsLoading(false));
      }
    }
  }, [balanceOfUser]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <Layout.Content>
      {selectedNFT?.token_id >= 0 && (
        <NFTModal
          nftContract={brandContract}
          nftData={selectedNFT}
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
        {`${
          location.state.contract && location.state.contract.name
            ? location.state.contract.name
            : "Warranty Cards"
        } Warranty Cards`}
      </Typography.Title>
      <Row style={{ margin: "0 1rem" }}>
        {console.log("warranty cards", warrantyCards)}
        {warrantyCards?.map((warrantyCard) => (
          <Col
            key={warrantyCard.token_id}
            style={{ margin: ".5rem 2rem" }}
            onClick={() => {
              setIsModalVisible(true);
              setSelectedNFT(warrantyCard);
              console.log("selected nft:", selectedNFT);
            }}
          >
            <NFTCard nftData={warrantyCard} />
          </Col>
        ))}
      </Row>
    </Layout.Content>
  );
};

export default BrandDetails;
