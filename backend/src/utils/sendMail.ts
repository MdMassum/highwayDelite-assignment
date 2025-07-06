import nodemailer from 'nodemailer';

type MailOptions = {
    email: string;
    otp: string;
};

const sendMail = async (options: MailOptions): Promise<void> => {

    const transporter = nodemailer.createTransport({
        service: process.env.SMPT_SERVICE,
        auth: {
            user: process.env.EmailId,
            pass: process.env.Email_Password,
        },
    });

    const mailOptions = {
        from: process.env.EmailId,
        to: options.email,
        subject: "Your OTP Code",
        html: `
            <h3>Your OTP Code</h3>
            <p>Use this code to continue: <strong>${options.otp}</strong></p>
            <p>This code will expire in 5 minutes.</p>
        `,
    };

    await transporter.sendMail(mailOptions);
};

export default sendMail;
