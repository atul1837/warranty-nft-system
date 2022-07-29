export const mintNftEmail = ({ walletAddress, hash }) => ({
    subject: `NFT Warranty Minted Succesfully!`,
    body: (
        <body>
        <p>Hi,</p>
        <p>This is to notify you that NFT Minting has been successful and Your warranty card 
        has been tranferred to Your wallet: <strong> {walletAddress} </strong>
        </p>
        <p>You can look up the Transaction using the Transaction Hash: <strong> {hash} </strong>
        </p>
        </body>
    ),
})