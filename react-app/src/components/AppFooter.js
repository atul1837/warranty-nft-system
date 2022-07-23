import { Typography, Layout } from "antd";

const AppHeader = () => {
  const copyright = `Copyright @${new Date().getFullYear()}`;

  return (
    <Layout.Footer
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Typography.Title level={5}>{copyright}</Typography.Title>
    </Layout.Footer>
  );
};

export default AppHeader;
