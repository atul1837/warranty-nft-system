import { Card } from "antd";

const BrandCard = ({ brandData }) => {
  return (
    <Card
      hoverable
      style={{ borderRadius: "1rem" }}
    >
      <Card.Meta title={brandData?.name} description={brandData?.symbol} />
    </Card>
  );
};

export default BrandCard;
