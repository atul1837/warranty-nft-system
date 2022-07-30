import emailjs from "@emailjs/browser";

export const sendContractMail = async (to, hash) => {
  if(process.env.REACT_APP_IS_PRODUCTION) {
    try {
      const response = await emailjs
      .send(
        process.env.REACT_APP_EMAILJS_SERVICE_ID,
        process.env.REACT_APP_MINT_CONTRACT_TEMPLATE_ID,
        { to, hash },
        process.env.REACT_APP_EMAILJS_PUBLIC_KEY
      )
      console.log("SUCCESS!", response.status, response.text);      
    } catch(err) {
      console.log("FAILED...", err);      
    }
  }
};
