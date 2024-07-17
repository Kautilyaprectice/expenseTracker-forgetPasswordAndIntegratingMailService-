const User = require('../modles/user');
const Sib = require('sib-api-v3-sdk');
// require('dotenv').config();
const { v4: uuidv4 } = require('uuid');
const ForgetPassword = require('../modles/forgetPassword'); 

exports.forgetPassword = async (req, res, next) => {
    const { email } = req.body; 
    const user = await User.findOne({ where: { email: email } });
    if (!user) {
        return res.status(400).json({ message: 'The Email is not registered' });
    }
    console.log(email);
    
    var defaultClient = Sib.ApiClient.instance;
    var apiKey = defaultClient.authentications['api-key'];
    apiKey.apiKey = process.env.API_KEY;
    
    const tranEmailApi = new Sib.TransactionalEmailsApi();
    const sender = {
        email: 'kautilyatiwari134@gmail.com'
    };
    const receivers = [
        {
            email: email
        }
    ];
    
    const uid = uuidv4();
    const userId = user.id; 
  
    try {
        await ForgetPassword.create({
            id: uid,
            userId: userId,
            active: true,
        });
        
        const response = await tranEmailApi.sendTransacEmail({
            sender,
            to: receivers,
            subject: "Password Reset Mail",
            textContent: `http://localhost:3000/password/resetpassword/${uid}`, 
        });
        
        console.log(response);
        res.status(201).json({ message: 'Password reset email sent successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
