const express = require ('express');
const { pushMailToSome } = require('../controller/pushNotif');

const router=express.Router();

//push email notification to some users
router.route("/push-email-to-some").post(pushMailToSome);

module.exports=router;