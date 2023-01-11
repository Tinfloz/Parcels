import nodeMailer from "nodemailer";

interface IMailOptions {
    email: string,
    subject: string,
    emailToSend: string
}

export const sendEmail = async (mailOptions: IMailOptions): Promise<void> => {
    let transporter = nodeMailer.createTransport({
        host: process.env.SMTP_HOST!,
        port: Number(process.env.SMTP_PORT!),
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });
    const options = {
        from: process.env.SMTP_EMAIL!,
        to: mailOptions.email,
        subject: mailOptions.subject,
        text: mailOptions.emailToSend
    };
    await transporter.sendMail(options);
};