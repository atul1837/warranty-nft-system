import { Card } from "antd";

const NFTCard = () => (
  <Card
    hoverable
    style={{ borderRadius: "1rem" }}
    cover={
      <img
        style={{ borderTopLeftRadius: "1rem", borderTopRightRadius: "1rem" }}
        alt="example"
        src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
      />
    }
  >
    <Card.Meta title="Card title" description="This is the description" />
  </Card>
);

export default NFTCard;
