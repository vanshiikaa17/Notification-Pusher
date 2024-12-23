const amqp = require('amqplib/callback_api');
const db = require('./db');

// Function to consume messages from user-selection queue
function consumeSelectionMessages() {
  amqp.connect('amqp://localhost', (error0, connection) => {
    if (error0) throw error0;

    connection.createChannel((error1, channel) => {
      if (error1) throw error1;

      const queue = 'user-selection';
      const notificationQueue = 'user-notification';

      channel.assertQueue(queue, { durable: true });
      channel.prefetch(1); // Process one message at a time

      console.log("Waiting for messages in user-selection queue. To exit press CTRL+C", queue);

      channel.consume(queue, async (msg) => {
        const { emailMessage } = JSON.parse(msg.content.toString());
        const criteria= emailMessage.criteria;
        console.log("Processing selection criteria:", criteria);

        try {
          // Fetch users from database
          const [users] = await db.query("SELECT email FROM users WHERE location = ?", [criteria]);
          const recipients = users.map(user => user.email);

          if (recipients.length === 0) {
            console.log("No users found for criteria:", criteria);
          } else {
            // Send user details to notification queue
            recipients.forEach((email) => {
              const message = {
                subject: emailMessage.subject,
                body: emailMessage.body,
                recipients: [email]
              };
              channel.assertQueue(notificationQueue, { durable: true });
              channel.sendToQueue(notificationQueue, Buffer.from(JSON.stringify(message)));
            });

            console.log("Forwarded email messages to notification queue.");
          }
        } catch (error) {
          console.error("Error processing selection criteria:", error);
        }

        // Acknowledge the message
        channel.ack(msg);
      });
    });
  });
}

module.exports = { consumeSelectionMessages };
