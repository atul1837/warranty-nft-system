import { useAccount } from "wagmi";

import Dashboard from "./Dashboard";
import WalletProfile from "./WalletProfile";

const HomeWrapper = ({ contractAddress, nftContract, factoryContract }) => {
  const { isConnected } = useAccount();

  return isConnected ? (
    <Dashboard nftContract={nftContract} factoryContract={factoryContract} contractAddress={contractAddress} />
  ) : (
    <WalletProfile />
  );
};

export default HomeWrapper;
