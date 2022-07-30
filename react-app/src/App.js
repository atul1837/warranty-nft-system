import {
  WagmiConfig,
  createClient,
  defaultChains,
  configureChains,
} from "wagmi";

import { BrowserRouter, Switch, Route } from "react-router-dom";

import { Layout } from "antd";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { create } from "ipfs-http-client";
import { ethers } from "ethers";

import AppHeader from "./components/AppHeader";
import AppFooter from "./components/AppFooter";
import HomeWrapper from "./components/HomeWrapper";
import BrandDetails from "./components/BrandDetails";

import contractJSON from "./contracts/warranty.sol/WarrantyCardContract.json";
import factoryContractJSON from "./contracts/factory.sol/WarrantyFactory.json";

import "./App.css";
import { useEffect, useState } from "react";
import Brands from "./components/Brands";

const { chains, provider, webSocketProvider } = configureChains(defaultChains, [
  // alchemyProvider({ alchemyId }),
  alchemyProvider(),
  publicProvider(),
]);

// Set up client
const client = createClient({
  autoConnect: true,
  connectors: [new MetaMaskConnector({ chains })],
  provider,
  webSocketProvider,
});

function App() {
  const [contractAddress, setContractAddress] = useState(null);
  const [hasContract, setHasContract] = useState(false);
  const [ipfsClient, setIpfsClient] = useState(null);
  const [factoryContract, setFactoryContract] = useState(null);
  const [nftContract, setNftContract] = useState(null);
  const [brandContractAddress, setBrandContractAddress] = useState(null);
  const [brandContract, setBrandContract] = useState(null);
  const [signer, setSigner] = useState(null);

  useEffect(() => {
    const ipfsClientInstance = create({
      url: "https://ipfs.infura.io:5001/api/v0",
    });
    setIpfsClient(ipfsClientInstance);
  }, []);

  useEffect(() => {
    if (window.ethereum) {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();

        const factoryContractInstance = new ethers.Contract(
          process.env.REACT_APP_CONTRACT_FACTORY_ADDRESS,
          factoryContractJSON.abi,
          signer
        );
        setSigner(signer);
        setFactoryContract(factoryContractInstance);
      }
    }
  }, [window.ethereum]);

  useEffect(() => {
    if (
      brandContractAddress &&
      brandContractAddress !== process.env.REACT_APP_NULL_CONTRACT
    ) {
      const brandContractInstance = new ethers.Contract(
        brandContractAddress,
        contractJSON.abi,
        signer
      );
      setBrandContract(brandContractInstance);
    }
  }, [brandContractAddress]);

  useEffect(() => {
    const fetchContract = async () => {
      const contractTxn = await factoryContract.getcontractofowner();

      if (contractTxn !== process.env.REACT_APP_NULL_CONTRACT) {
        setContractAddress(contractTxn);
        setHasContract(true);
      }
    };
    if (factoryContract) {
      fetchContract();
    }
  }, [factoryContract]);

  useEffect(() => {
    if (
      contractAddress &&
      contractAddress !== process.env.REACT_APP_NULL_CONTRACT
    ) {
      const nftContractInstance = new ethers.Contract(
        contractAddress,
        contractJSON.abi,
        signer
      );

      setNftContract(nftContractInstance);
    }
  }, [contractAddress]);

  return (
    <WagmiConfig client={client}>
      <BrowserRouter>
        <Layout style={{ minHeight: "100vh" }}>
          <AppHeader hasContract={hasContract} />
          <Switch>
            <Route exact path="/">
              <HomeWrapper
                contractAddress={contractAddress}
                nftContract={nftContract}
                factoryContract={factoryContract}
              />
            </Route>
            <Route exact path="/brands">
              <Brands
                contractAddress={contractAddress}
                ipfsClient={ipfsClient}
                hasContract={hasContract}
                factoryContract={factoryContract}
                nftContract={nftContract}
              />
            </Route>
            <Route exact path="/brand/:contract">
              <BrandDetails
                setBrandContractAddress={setBrandContractAddress}
                brandContract={brandContract}
                signer={signer}
              />
            </Route>
          </Switch>
          <AppFooter />
        </Layout>
      </BrowserRouter>
    </WagmiConfig>
  );
}

export default App;
