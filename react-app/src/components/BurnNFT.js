import { Button, Typography } from "antd";

const BurnNFT = ({ setShowBurnForm, burnNft }) => (
  <Typography style={{ marginTop: "1rem" }}>
    <Typography.Text strong style={{ marginRight: ".5rem" }}>
      Are you sure you want to burn NFT?
    </Typography.Text>
    <Button type="primary" style={{ marginRight: ".5rem" }} onClick={burnNft}>
      Yes
    </Button>
    <Button type="danger" onClick={() => setShowBurnForm(false)}>
      Cancel
    </Button>
  </Typography>
);

export default BurnNFT;
