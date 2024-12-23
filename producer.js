const amqp = require('amqplib/callback_api');

// Function to push criteria to the user-selection queue
function sendSelectionCriteria(emailMessage) {
  amqp.connect('amqp://localhost', (error0, connection) => {
    if (error0) throw error0;

    connection.createChannel((error1, channel) => {
      if (error1) throw error1;

      const queue = 'user-selection';
      const message = { emailMessage };

      channel.assertQueue(queue, { durable: true });
      channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));

      console.log("Sent selection criteria to queue:", message);
    });
  });
}

module.exports = { sendSelectionCriteria };
