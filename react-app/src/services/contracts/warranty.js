export const getTokenUri = async (contract, tokenId) => {
    const nftTxn = await contract.tokenURI(tokenId);
    return nftTxn;
};