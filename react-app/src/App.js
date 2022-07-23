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

import AppHeader from "./components/AppHeader";
import AppFooter from "./components/AppFooter";
import MintNFT from "./components/MintNFT";
import HomeWrapper from "./components/HomeWrapper";

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
  return (
    <WagmiConfig client={client}>
      <BrowserRouter>
        <Layout style={{ minHeight: "100vh" }}>
          <AppHeader />
          <Switch>
            <Route exact path="/">
              <HomeWrapper />
            </Route>
            <Route exact path="/mint">
              <MintNFT />
            </Route>
          </Switch>
          <AppFooter />
        </Layout>
      </BrowserRouter>
    </WagmiConfig>
  );
}

export default App;
