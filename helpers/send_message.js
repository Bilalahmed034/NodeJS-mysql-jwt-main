// Download the helper library from https://www.twilio.com/docs/node/install
// Find your Account SID and Auth Token in Account Info and set the environment variables.
// See http://twil.io/secure
module.exports = sendMessage;
async function sendMessage(message ,phone_no , otp) {
    console.log("in send message to send otp "+otp+" on "+phone_no)
  const accountSid = ""
  const authToken =""
  const client = require('twilio')(accountSid, authToken);

  client.messages
      .create({
         contentSid: '',
         from: '',
         contentVariables: JSON.stringify({
           1: otp.toString()
         }),
         to: 'whatsapp:'+phone_no
       })
      .then(message => console.log(message.sid))
      .catch(error=>console.error(error));

  // client.messages
  //   .create({ body: message, from: 'Viahop', to:  phone_no})
  //   .then((message) => console.log(message.sid+"========tiwilio sid"))
  //   .catch((message)=>console.log(message))
}
