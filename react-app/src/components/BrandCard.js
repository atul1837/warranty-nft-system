import { Card } from "antd";

const BrandCard = ({ brandData }) => {
  return (
    <Card
      hoverable
      style={{ borderRadius: "1rem" }}
      cover={
        <img
          height={300}
          style={{ borderTopLeftRadius: "1rem", borderTopRightRadius: "1rem" }}
          alt={brandData?.name}
          src={""}
        />
      }
    >
      <Card.Meta title={brandData?.name} description={brandData?.symbol} />
    </Card>
  );
};

export default BrandCard;
