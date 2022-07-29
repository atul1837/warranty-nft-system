import axios from "axios";
import { useEffect, useState } from "react";
import { Layout, Typography, Row, Col } from "antd";

import NFTCard from "./NFTCard";
import NFTModal from "./NFTModal";
import {
  getTokenIds,
  getTokenUri,
  getTotalSupply,
} from "../services/contracts/warranty";
import Loader from "./Loader";

const NFTList = ({ nftContract }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [warrantyNFTs, setWarrantyNFTs] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedNFT, setSelectedNFT] = useState({});
  const [totalNFTs, setTotalNFTS] = useState(0);

  useEffect(() => {
    const fetchTotalSupply = async () => {
      const totalSupply = await getTotalSupply(nftContract);
      setTotalNFTS(totalSupply);
    };
    if (nftContract) {
      setIsLoading(true);
      fetchTotalSupply();
    }
  }, [nftContract]);

  useEffect(() => {
    const nfts = [];

    const fetchTokens = async () => {
      const tokenIds = await getTokenIds(nftContract, totalNFTs);

      for (const tokenId of tokenIds) {
        try {
          const tokenURI = await getTokenUri(nftContract, tokenId);
          console.log(tokenURI);

          const getDataFromTokenUriResponse = await axios.get(
            `https://ipfs.io/ipfs/${tokenURI.split("//")[1]}`
          );

          nfts.push({ token_id: tokenId, ...getDataFromTokenUriResponse.data });
        } catch (err) {
          console.log("err", err);
        }
      }

      setWarrantyNFTs([...nfts]);
    };

    if (nftContract && warrantyNFTs.length !== totalNFTs) {
      fetchTokens();
      setIsLoading(false);
    }
    setIsLoading(false);
  }, [totalNFTs]);

  useEffect(() => {
    if (!isModalVisible) {
      setSelectedNFT({});
    }
  }, [isModalVisible]);

  if (isLoading) return <Loader />;

  return (
    <Layout.Content>
      {selectedNFT?.token_id >= 0 && (
        <NFTModal
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
              console.log("selected nft:", selectedNFT);
            }}
          >
            <NFTCard nftData={nft} />
          </Col>
        ))}
      </Row>
    </Layout.Content>
  );
};

export default NFTList;
