import { useAccount, useDisconnect } from "wagmi";
import { Button, Typography, Layout } from "antd";
import { Link } from "react-router-dom";

const HeaderButtons = ({ isConnected, connector, disconnect }) => {
  if (!isConnected) return <></>;
  return (
    <div
      style={{
        marginLeft: "auto",
      }}
    >
      <Link to="/">
        <Button type="primary" onClick={disconnect} style={{ margin: "1rem" }}>
          Disconnect {connector && connector.name}
        </Button>
      </Link>

      <Link to="/mint">
        <Button type="ghost" style={{ color: "#fff" }}>
          Mint NFT
        </Button>
      </Link>
    </div>
  );
};

const AppHeader = () => {
  const { connector, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  return (
    <Layout.Header style={{ display: "flex", alignItems: "center" }}>
      <Link to="/">
        <Typography.Title
          style={{ display: "inline-block", color: "#fff", fontWeight: "bold" }}
          level={3}
        >
          Warranty NFT
        </Typography.Title>
      </Link>

      <HeaderButtons
        isConnected={isConnected}
        disconnect={disconnect}
        connector={connector}
      />
    </Layout.Header>
  );
};

export default AppHeader;
