import emailjs from "@emailjs/browser";

export const sendNftMail = async (to, address, tokenId, walletAddress, hash) => {
  if(process.env.REACT_APP_IS_PRODUCTION) {
    try {
    const response = await emailjs
      .send(
        process.env.REACT_APP_EMAILJS_SERVICE_ID,
        process.env.REACT_APP_MINT_NFT_TEMPLATE_ID,
        { to, walletAddress, hash, address, tokenId },
        process.env.REACT_APP_EMAILJS_PUBLIC_KEY
      )
      console.log("SUCCESS!", response.status, response.text);      
    } catch(err) {
      console.log("FAILED...", err);      
    }
  }
};
