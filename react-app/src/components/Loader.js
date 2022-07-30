import { Spin } from "antd";

const Loader = () => (
  <div
    style={{
      height: "100vh",
      width: "100%",
      backgroundColor: "#fff8",
      zIndex: 9999,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <Spin size="large" />
  </div>
);

export default Loader;
