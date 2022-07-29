import { Mailer } from "nodemailer-react";
import { mintContractEmail } from "./templates/mintContract";
import { mintNftEmail } from "./templates/mintNft";

const mailerConfig = {
  transport: {
    host: "smtp.example.com",
    secure: true,
    auth: { user: "vaibhav.jindal.2001@gmail.com", pass: "VJvaibhav@google1" },
  },
  defaults: {
    from: { name: "Vaibhav", address: "vaibhav.jindal.2001@gmail.com" },
  },
};

const emailsList = {
  mintContractEmail,
  mintNftEmail,
};

const mailer = Mailer(mailerConfig, emailsList);

export default mailer;
