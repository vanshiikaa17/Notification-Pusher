const amqp = require('amqplib/callback_api');
const nodemailer = require('nodemailer');

// Configure email transport (SMTP)
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE, // You can use any service or SMTP server
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Function to send email
function sendEmail(message) {
  const mailOptions = {
    from: 'vanshikamohindra.vani@gmail.com',
    bcc: message.recipients.join(', '),
    subject: message.subject,
    text: message.body
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error sending email:', error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}

// Function to consume messages from RabbitMQ
function consumeMessages() {
  amqp.connect('amqp://localhost', (error0, connection) => {
    if (error0) throw error0;

    connection.createChannel((error1, channel) => {
      if (error1) throw error1;

      const queue = 'user-notification';

      channel.assertQueue(queue, { durable: true });
      channel.prefetch(1); // Limit the number of unacknowledged messages

      console.log("Waiting for messages in %s. To exit press CTRL+C", queue);

      channel.consume(queue, (msg) => {
        const message = JSON.parse(msg.content.toString());

        // Send the email
        sendEmail(message);

        // Acknowledge the message after processing
        channel.ack(msg);
      });
    });
  });
}

// Start the consumer
module.exports={consumeMessages}
