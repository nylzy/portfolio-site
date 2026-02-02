const express = require('express');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public')); // Serve your HTML/CSS files

// Configure email transporter
const transporter = nodemailer.createTransport({
    service: 'gmail', // or 'outlook', etc.
    auth: {
        user: process.env.EMAIL_USER, // your email
        pass: process.env.EMAIL_PASSWORD // app-specific password
    }
});

// Handle form submission
app.post('/send-email', async (req, res) => {
    const { name, company, email, phone, message } = req.body;
    
    // Basic validation
    if (!name || !email || !message) {
        return res.status(400).json({ 
            success: false, 
            error: 'Name, email, and message are required' 
        });
    }
    
    // Email content
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: 'tomnylund24@gmail.com', // your email
        subject: `Portfolio Contact: ${name}`,
        text: `
Name: ${name}
Company: ${company || 'N/A'}
Email: ${email}
Phone: ${phone || 'N/A'}

Message:
${message}
        `,
        html: `
            <h3>New Contact Form Submission</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Company:</strong> ${company || 'N/A'}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
            <h4>Message:</h4>
            <p>${message}</p>
        `
    };
    
    try {
        await transporter.sendMail(mailOptions);
        res.json({ success: true, message: 'Email sent successfully!' });
    } catch (error) {
        console.error('Email error:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to send email' 
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});