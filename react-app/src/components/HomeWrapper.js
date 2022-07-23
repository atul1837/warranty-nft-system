import { useAccount } from "wagmi";

import Dashboard from "./Dashboard";
import WalletProfile from "./WalletProfile";

const HomeWrapper = () => {
  const { isConnected } = useAccount();

  return isConnected ? <Dashboard /> : <WalletProfile />;
};

export default HomeWrapper;
