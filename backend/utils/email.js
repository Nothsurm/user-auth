import nodemailer from 'nodemailer';

export const sendEmail = async (option) => {
    //Create a transporter
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    })

    //Define email options
    const emailOptions = {
        from: 'userauth support<support@userauth.com>',
        to: option.email,
        subject: option.subject,
        text: option.message
    }

    await transporter.sendMail(emailOptions)
}

export const generateOTP = () => {
    let otp = ''
        for (let i = 0; i <= 3; i++) {
            const randVal = Math.round(Math.random() * 9)
            otp = otp + randVal
        }
    return otp;
}