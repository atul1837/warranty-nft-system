import { Card } from "antd";

const BrandCard = ({ brandData }) => {
  return (
    <Card
      hoverable
      style={{ borderRadius: "1rem", padding: 25 }}
      cover={
        <img
          height={200}
          style={{ borderTopLeftRadius: "1rem", borderTopRightRadius: "1rem" }}
          alt={brandData?.name}
          src={brandData?.image}
        />
      }
    >
      <Card.Meta title={brandData?.name} description={brandData?.symbol} />
    </Card>
  );
};

export default BrandCard;
