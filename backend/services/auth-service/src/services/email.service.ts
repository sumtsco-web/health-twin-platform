import nodemailer from 'nodemailer';

class EmailService {
    private transporter: nodemailer.Transporter;

    constructor() {
        // Create a test account on Ethereal
        // In production, replace this with your real SMTP config (SendGrid, AWS SES, Gmail)
        this.transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            auth: {
                user: 'maddison53@ethereal.email',
                pass: 'jn7jnAPss4f63QBp6D'
            }
        });
    }

    async sendWelcomeEmail(email: string, name: string) {
        try {
            const info = await this.transporter.sendMail({
                from: '"Health Twin Platform" <no-reply@healthtwin.com>',
                to: email,
                subject: "Welcome to Health Twin! 🚀",
                text: `Hello ${name},\n\nWelcome to Health Twin! Your account has been successfully created.\n\nYou can now log in to the dashboard and mobile app.\n\nBest regards,\nThe Health Twin Team`,
                html: `
                    <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                        <h1 style="color: #00d4ff;">Welcome to Health Twin! 🚀</h1>
                        <p>Hello <strong>${name}</strong>,</p>
                        <p>Your account has been successfully created.</p>
                        <p>You can now log in to:</p>
                        <ul>
                            <li><a href="https://health-twin-dashboard.vercel.app">Web Dashboard</a></li>
                            <li>Mobile App</li>
                        </ul>
                        <p>Best regards,<br>The Health Twin Team</p>
                    </div>
                `
            });

            console.log("Message sent: %s", info.messageId);
            console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
            return info;
        } catch (error) {
            console.error("Error sending email:", error);
            return null;
        }
    }
}

export default new EmailService();
