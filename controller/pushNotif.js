const { sendMessageToQueue } = require("../producer");

const pushMailToSome=(req, res)=>{
    const { subject, body, recipients } = req.body;
    if (!subject || !body || !Array.isArray(recipients) || recipients.length === 0) {
        return res.status(400).json({ error: 'Invalid input' });
      }
    const emailMessage={
        'subject': subject,
        'body' : body, 
        'recipients':recipients

    }
    sendMessageToQueue(emailMessage);
    res.status(200).json({success:'message sent to queue successfully', message: emailMessage });
}

module.exports={pushMailToSome};