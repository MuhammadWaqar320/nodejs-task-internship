import nodemailer from 'nodemailer';
import 'dotenv/config';
 let transporter=nodemailer.createTransport(
    {
        service:'gmail',
        secure:false,
        auth:{
            user:process.env.EMAIL,
            pass:process.env.PASSWORD
        },
        tls: {
            rejectUnauthorized: false
        }
    }
);
export default transporter