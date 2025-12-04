require('dotenv').config(); // load RESEND_API_KEY from .env
const sendEmail = require('./src/utils/email/sendEmail'); // adjust path if needed

async function test() {
  try {
    await sendEmail({
      to: 'wayne.omollo@iu-study.org',   // put your email here
      subject: 'Test Email from SignMeUp',
      html: '<h1>Hello!</h1><p>This is a test email from SignMeUp project.</p>',
    });
    console.log('Test email sent successfully!');
  } catch (err) {
    console.error('Error sending test email:', err);
  }
}

test();
