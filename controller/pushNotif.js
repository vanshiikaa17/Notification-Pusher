const { sendSelectionCriteria } = require("../producer");

const pushMailToSome=async(req, res)=>{
    const { subject, body, criteria } = req.body;
    if (!subject || !body || !criteria) {
        return res.status(400).json({ error: 'Invalid input' });
      }

    try{
        sendSelectionCriteria({subject, body, criteria});
        res.status(200).json({success:'message sent to queue successfully' });

    }catch(error){
        res.status(500).json({ error: error.message });
    }
     
}

module.exports={pushMailToSome};