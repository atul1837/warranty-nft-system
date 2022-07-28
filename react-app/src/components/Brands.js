import { useState } from "react";
import { Layout, Menu } from "antd";

import MintContract from "./MintContract";
import MintNFT from "./MintNFT";
import NFTList from "./NFTList";

const Brands = ({ hasContract, factoryContract, nftContract, ipfsClient }) => {
  const [selectedKey, setSelectedKey] = useState(true);
  return hasContract ? (
    <Layout>
      <Layout.Sider breakpoint="sm" collapsedWidth="0">
        <Menu
          selectedKeys={selectedKey}
          onSelect={(e) => setSelectedKey(e.key)}
          theme="dark"
          mode="inline"
          items={[
            { key: "1", label: "Mint NFT" },
            { key: "2", label: "View Minted NFTs" },
          ]}
        />
      </Layout.Sider>
      <Layout>
        <Layout.Content>
          {selectedKey == "1" && (
            <MintNFT ipfsClient={ipfsClient} nftContract={nftContract} />
          )}
          {selectedKey == "2" && <NFTList nftContract={nftContract} />}
        </Layout.Content>
      </Layout>
    </Layout>
  ) : (
    <MintContract factoryContract={factoryContract} />
  );
};

export default Brands;
