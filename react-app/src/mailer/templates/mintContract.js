export const mintContractEmail = ({ hash }) => ({
  subject: `Contract Minted Succesfully!`,
  body: (
    <body>
      <p>Hi,</p>
      <p>This is to notify you that Contract Minting has been successful and You can look up the 
        transaction using the Transaction Hash: <strong>{hash}</strong>
      </p>
    </body>
  ),
})