import MintContract from "./MintContract";
import MintNFT from "./MintNFT";
import NFTList from "./NFTList";

const Brands = ({ hasContract, factoryContract, nftContract, ipfsClient }) => {
  return hasContract ? (
    <>
      <NFTList nftContract={nftContract} />
      <MintNFT ipfsClient={ipfsClient} nftContract={nftContract} />
    </>
  ) : (
    <MintContract factoryContract={factoryContract} />
  );
};

export default Brands;
