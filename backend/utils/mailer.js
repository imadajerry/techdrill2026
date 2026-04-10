const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Sends an OTP email to the specified address.
 * @param {string} toEmail - Recipient's email
 * @param {string} otp - The one-time password
 */
const sendOtpEmail = async (toEmail, otp) => {
  try {
    if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 'your_key_here') {
      console.error('[MAILER] Resend API Key is missing. Email cannot be sent.');
      console.log(`[MAILER] Intended OTP for ${toEmail}: ${otp}`);
      return false; // Return false so registration flow can gracefully fail or fallback
    }

    const { data, error } = await resend.emails.send({
      from: 'TechDrill Registration <onboarding@resend.dev>', // resend.dev is allowed on free tier
      to: [toEmail],
      subject: 'TechDrill: Your Verification Code',
      text: `Your One-Time Password (OTP) for TechDrill registration is: ${otp}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>TechDrill Verification Code</h2>
          <p>Please use the following One-Time Password (OTP) to complete your registration:</p>
          <div style="font-size: 24px; font-weight: bold; padding: 10px; background-color: #f4f4f4; display: inline-block; border-radius: 5px;">
            ${otp}
          </div>
          <p style="color: #666; font-size: 12px; margin-top: 20px;">If you did not request this code, you can safely ignore this email.</p>
        </div>
      `,
    });

    if (error) {
      console.error('[MAILER] Error from Resend:', error);
      return false;
    }

    console.log('[MAILER] Message sent via Resend. ID:', data.id);
    return true;
  } catch (error) {
    console.error('[MAILER] Unhandled error sending OTP email:', error);
    return false;
  }
};

module.exports = {
  sendOtpEmail,
};
