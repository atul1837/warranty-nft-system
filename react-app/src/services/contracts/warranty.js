export const getTokenUri = async (contract, tokenId) => {
  const nftTxn = await contract.tokenURI(tokenId);
  return nftTxn;
};

export const getOwnerAddress = async (contract, tokenId) => {
  const nftTxn = await contract.ownerOf(tokenId);
  return nftTxn;
};

export const burnNft = async (contract, tokenId) => {
  const nftTxn = await contract.burn(parseInt(tokenId._hex, 16), {
    gasLimit: 5000000,
  });

  return nftTxn;
};

export const transferNft = async (nftContract, from, to, tokenId) => {
  const nftTxn = nftContract.transferFrom(from, to, tokenId, {
    gasLimit: 5000000,
  });

  return nftTxn;
};

export const getTokenId = async (contract, tokenIndex) => {
  const nftTxn = await contract.tokenByIndex(tokenIndex);

  return nftTxn;
};

export const getTokenIds = async (contract, totalNfts) => {
  const tokenIds = [];
  for (let i = 0; i < totalNfts; i++) {
    const tokenId = await getTokenId(contract, i);
    tokenIds.push(parseInt(tokenId._hex, 16));
  }

  return tokenIds;
};

export const getTotalSupply = async (contract) => {
  const nftTxn = await contract.totalSupply();

  return parseInt(nftTxn._hex, 16);
};

export const isWarrantyValid = async (contract, tokenId) => {
  const nftTxn = await contract.isWarrantyStillApplicable(tokenId);

  return nftTxn;
};
