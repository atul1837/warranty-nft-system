import { useAccount } from "wagmi";

import Dashboard from "./Dashboard";
import WalletProfile from "./WalletProfile";

const HomeWrapper = ({ contractAddress, nftContract }) => {
  const { isConnected } = useAccount();

  return isConnected ? (
    <Dashboard nftContract={nftContract} contractAddress={contractAddress} />
  ) : (
    <WalletProfile />
  );
};

export default HomeWrapper;
