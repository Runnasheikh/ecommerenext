import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, amount, orderId } = req.body;

    // Create a transporter object using SMTP transport
    let transporter = nodemailer.createTransport({
      service: 'Gmail', // e.g., Gmail
      auth: {
        user: process.env.NEXT_PUBLIC_EMAIL_USERNAME,
        pass: process.env.NEXT_PUBLIC_EMAIL_PASSWORD, 
      },
    });

    // Email options
    let mailOptions = {
      from: process.env.NEXT_PUBLIC_EMAIL_USERNAME,
      to: email,
      subject: 'Order Confirmation',
      text: `Your order with ID ${orderId}  has been successfully placed. The total amount is ₹${amount}.`,
      
    };

    console.log(mailOptions);

    // Send email
    try {
      await transporter.sendMail(mailOptions);
      res.status(200).json({ message: 'Email sent successfully' });
      console.log("email sent");
    } catch (error) {
      console.error('Error sending email:', error);
      res.status(500).json({ error: 'Error sending email', details: error.message });
      console.log("email not sent", error);
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
