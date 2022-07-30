import { useConnect } from "wagmi";

import { Button, Typography, Layout } from "antd";

const WalletProfile = () => {
  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect();

  return (
    <Layout.Content
      style={{
        height: "auto",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Typography.Title level={3}>
        Welcome to NFT Warranty System
      </Typography.Title>
      <Typography.Title
        style={{
          fontFamily: "Inter",
          fontWeight: "900",
          fontSize: "xxx-large",
        }}
      >
        Connect Your Wallet to Get Started.
      </Typography.Title>
      {connectors.map((connector) => (
        <Button
          size="large"
          type="primary"
          disabled={!connector.ready}
          key={connector.id}
          onClick={() => connect({ connector })}
        >
          {connector.name}
          {!connector.ready && " (unsupported)"}
          {isLoading &&
            connector.id === pendingConnector?.id &&
            " (connecting)"}
        </Button>
      ))}

      {error && <div>{error.message}</div>}
    </Layout.Content>
  );
};

export default WalletProfile;
