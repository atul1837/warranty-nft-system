import axios from "axios";
import { useEffect, useState } from "react";
import { Layout, Typography, Row, Col } from "antd";

import NFTCard from "./NFTCard";
import NFTModal from "./NFTModal";

const NFTList = ({ nftContract }) => {
  const [warrantyNFTs, setWarrantyNFTs] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedNFT, setSelectedNFT] = useState({});
  const [totalNFTs, setTotalNFTS] = useState(0);

  console.log(totalNFTs, warrantyNFTs);

  useEffect(() => {
    const getTokenCount = async () => {
      const nftTxn = await nftContract.totalSupply();

      const totalSupply = parseInt(nftTxn._hex, 16);
      setTotalNFTS(totalSupply);
    };

    if (nftContract) getTokenCount();
  }, [nftContract]);

  useEffect(() => {
    const tokenIds = [];
    const nfts = [];
    const getTokenId = async (tokenIndex) => {
      const nftTxn = await nftContract.tokenByIndex(tokenIndex);

      return nftTxn;
    };

    const getTokenIds = async () => {
      for (let i = 0; i < totalNFTs; i++) {
        const tokenId = await getTokenId(i);
        tokenIds.push(parseInt(tokenId._hex, 16));
      }
    };

    const getNftDetails = async (tokenId) => {
      const nftTxn = await nftContract.getWarrantyCardDetails(tokenId);

      return nftTxn;
    };

    const getTokenUri = async (tokenId) => {
      const nftTxn = await nftContract.tokenURI(tokenId);

      return nftTxn;
    };

    const fetchTokens = async () => {
      await getTokenIds();
      console.log(tokenIds);

      for (const tokenId of tokenIds) {
        try {
          const nftDetails = await getNftDetails(tokenId);
          const tokenURI = await getTokenUri(tokenId);
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
    }
  }, [totalNFTs]);

  useEffect(() => {
    console.log("is modal visible", isModalVisible);
    if (!isModalVisible) {
      setSelectedNFT({});
    }
  }, [isModalVisible]);

  return (
    <Layout.Content>
      {selectedNFT?.token_id>=0 && (
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
