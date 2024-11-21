const express = require ('express');
const app=express();
const dotenv=require("dotenv");

app.use(express.json());
dotenv.config({path:'./config.env'});
const pushMailToSome=require('./routes/MailRoute');
const { consumeMessages } = require('./consumer');
app.use("/api/notification", pushMailToSome);

app.listen(process.env.PORT, ()=>{
    console.log(`Notification app listening at port ${process.env.PORT}`);

    consumeMessages();
})