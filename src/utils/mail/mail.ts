import nodemailer from "nodemailer";
import ejs from "ejs";
import path from "path";
import { 
    EMAIL_SMTP_SERVICE_NAME, 
    EMAIL_SMTP_HOST, 
    EMAIL_SMTP_PASS, 
    EMAIL_SMTP_PORT, 
    EMAIL_SMTP_SECURE, 
    EMAIL_SMTP_USER
} from "../env";

// konfigurasi nodemailer
const transporter = nodemailer.createTransport({
    service: EMAIL_SMTP_SERVICE_NAME,
    host: EMAIL_SMTP_HOST,
    port: EMAIL_SMTP_PORT,
    secure: EMAIL_SMTP_SECURE,
    auth: {
        user: EMAIL_SMTP_USER,
        pass: EMAIL_SMTP_PASS,
    },
    requireTLS: true,
});

export interface ISendEmail {
    from: string;
    to: string;
    subject: string;
    html: string;
}

// function kirim email
// penggunaan ...mailparams hanyalah shorthand dari yang biasanya
export const sendEmail = async ({ ...mailParams } : ISendEmail) => {
    const result = await transporter.sendMail({
        ...mailParams
    });
    return result;
};

// function untuk render file ejs
// penggunaan __dirname dikarenakan merujuk pada repo yang sama (repo saat ini)
export const renderMailHtml = async (template: string, data: any): Promise<string>=> {
    const content = await ejs.renderFile(
        path.join(__dirname, `templates/${template}`),
        data
    );
    return content as string;

};


