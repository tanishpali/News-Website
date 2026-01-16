// Placeholder for SMTP mail sender
const sendMail = async (email, subject, body) => {
    console.log(`Sending email to ${email} with subject: ${subject}`);
    // Implement your mail sending logic here (e.g., using nodemailer)
    return Promise.resolve();
};

module.exports = sendMail;
