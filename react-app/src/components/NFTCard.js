import { Card } from "antd";

const NFTCard = ({ nftData }) => {
  const imageIpfsId = nftData?.image.split("//")[1];
  const imageSrc = `https://ipfs.io/ipfs/${imageIpfsId}`;
  return (
    <Card
      hoverable
      style={{ borderRadius: "1rem" }}
      cover={
        <img
          height={300}
          style={{ borderTopLeftRadius: "1rem", borderTopRightRadius: "1rem" }}
          alt={nftData?.name}
          src={imageSrc}
        />
      }
    >
      <Card.Meta title={nftData?.name} description={nftData?.description} />
    </Card>
  );
};

export default NFTCard;
