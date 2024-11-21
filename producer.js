const amqp = require('amqplib/callback_api');
const nodemailer = require('nodemailer');

// Configure email transport (SMTP)
const transporter = nodemailer.createTransport({
  service: 'gmail', // You can use any service or SMTP server
  auth: {
    user: 'vanshikamohindra.vani@gmail.com',
    pass: 'yugm evqr ezrc gbbb'
  }
});

// Function to send message to RabbitMQ
function sendMessageToQueue(message) {
  amqp.connect('amqp://localhost', (error0, connection) => {
    if (error0) throw error0;

    connection.createChannel((error1, channel) => {
      if (error1) throw error1;

      const queue = 'advertisement-emails';

      channel.assertQueue(queue, { durable: true });
      channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));

      console.log("Sent message to queue:", message);
    });
  });
}

// Create an email message
const emailMessage = {
  subject: 'Exclusive Offer Just for You!',
  body: 'We have a special offer waiting for you. Visit A-902 Galaxy One Towers, EON Free Zone, Kharadi, Pune, Maharashtra, India NOW before it is GONEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE. MWAAHAHAHAHAHHAHAHAHHAHAHAHHAHAHAHHAHAHAHAHHAHAAAAAAAAAAAAAAAAAA',
  recipients: ['vanshikamohindra.vani@gmail.com', 'sahajshrivastava.official@gmail.com']
};

// Send the email message to the queue
// sendMessageToQueue(emailMessage);
module.exports={sendMessageToQueue};