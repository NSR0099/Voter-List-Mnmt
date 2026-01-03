import { Twilio } from 'twilio';

const accountSid = 'USfc0a9602d207363eac75401a10ecbdf6';
const authToken = '6c387411f405447a999a2113e29aebfd';
const fromPhone = '+14172756330';
const toPhone = '+919588205994';

console.log("Testing Twilio SMS with NAMED IMPORT...");

try {
    const client = new Twilio(accountSid, authToken);

    client.messages.create({
        body: 'Test SMS from Hack4Delhi Debugger',
        from: fromPhone,
        to: toPhone
    })
        .then(message => console.log(`✅ Success! Message SID: ${message.sid}`))
        .catch(error => {
            console.error("❌ Failed to send SMS:");
            console.error(error.message);
        });
} catch (e) {
    console.error("Setup Error:", e);
}
