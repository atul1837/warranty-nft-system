import mailer from "../../mailer/config";

export const sendContractMail = async (to, hash) => {
  await mailer.send("mintContractMail", { hash }, { to });
};
