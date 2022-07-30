import { useState } from "react";
import { Layout, Menu } from "antd";

import MintContract from "./MintContract";
import MintNFT from "./MintNFT";
import NFTList from "./NFTList";
import FindNFT from "./FindNFT";

const Brands = ({ contractAddress, hasContract, factoryContract, nftContract, ipfsClient }) => {
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
            { key: "2", label: "View Minted Warranty" },
            { key: "3", label: "Find Warranty Card" },
          ]}
        />
      </Layout.Sider>
      <Layout>
        <Layout.Content>
          {selectedKey == "1" && (
            <MintNFT contractAddress={contractAddress} ipfsClient={ipfsClient} nftContract={nftContract} />
          )}
          {selectedKey == "2" && <NFTList nftContract={nftContract} />}
          {selectedKey == "3" && <FindNFT nftContract={nftContract} />}
        </Layout.Content>
      </Layout>
    </Layout>
  ) : (
    <MintContract ipfsClient={ipfsClient} factoryContract={factoryContract} />
  );
};

export default Brands;
