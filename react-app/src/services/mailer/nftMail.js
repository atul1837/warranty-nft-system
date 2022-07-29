import mailer from "../../mailer/config";

export const sendNftMail = async (to, walletAddress, hash) => {
  await mailer.send("mintNftMail", { walletAddress, hash }, { to });
};
