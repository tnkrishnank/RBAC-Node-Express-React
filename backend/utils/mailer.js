const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const sendVerificationEmail = async (email, verificationLink) => {
    const mailOptions = {
        from: '"Blog RBAC" <tnkrish02@email.com>',
        to: email,
        subject: 'Blog RBAC - Verify your email',
        html: `
            <h2>Welcome!</h2>
            <p>Click below to verify your email:</p>
            <a href="${verificationLink}">${verificationLink}</a>
            <p>This link will expire in 10 minutes.</p>
        `,
    };

    await transporter.sendMail(mailOptions);
};

module.exports = { sendVerificationEmail };