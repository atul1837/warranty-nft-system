export const getTokenUri = async (contract, tokenId) => {
  const nftTxn = await contract.tokenURI(tokenId);
  return nftTxn;
};

export const burnNft = async (contract, tokenId) => {
  const nftTxn = await contract.burn(tokenId);

  return nftTxn;
};

export const transferNft = async (nftContract, from, to, tokenId) => {
  const nftTxn = nftContract.transferFrom(from, to, tokenId);

  return nftTxn;
};
