import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendApprovalEmail(to: string, name: string) {
  await resend.emails.send({
    from: "GlobalCV Pro <noreply@globalcvpro.com>",
    to,
    subject: "Payment Approved - Your CV is Ready",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #1e40af; padding: 24px; border-radius: 8px 8px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 24px;">GlobalCV Pro</h1>
        </div>
        <div style="background: #f8fafc; padding: 32px; border-radius: 0 0 8px 8px;">
          <h2 style="color: #1e293b;">Payment Approved ✅</h2>
          <p style="color: #475569;">Hi ${name},</p>
          <p style="color: #475569;">Your payment has been verified successfully. You can now download your professional CV.</p>
          <a href="${process.env.NEXTAUTH_URL}/dashboard" 
             style="display: inline-block; background: #1e40af; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; margin-top: 16px;">
            Download Your CV
          </a>
          <p style="color: #94a3b8; font-size: 12px; margin-top: 32px;">GlobalCV Pro — Create International Standard CVs That Get Interviews</p>
        </div>
      </div>
    `,
  });
}

export async function sendRejectionEmail(to: string, name: string, reason: string) {
  await resend.emails.send({
    from: "GlobalCV Pro <noreply@globalcvpro.com>",
    to,
    subject: "Payment Verification Failed",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #1e40af; padding: 24px; border-radius: 8px 8px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 24px;">GlobalCV Pro</h1>
        </div>
        <div style="background: #f8fafc; padding: 32px; border-radius: 0 0 8px 8px;">
          <h2 style="color: #1e293b;">Payment Verification Failed ❌</h2>
          <p style="color: #475569;">Hi ${name},</p>
          <p style="color: #475569;">Your payment screenshot could not be verified. Please review the reason below and upload a valid payment proof.</p>
          <div style="background: #fee2e2; border: 1px solid #fca5a5; padding: 16px; border-radius: 6px; margin: 16px 0;">
            <strong style="color: #dc2626;">Reason:</strong>
            <p style="color: #7f1d1d; margin: 4px 0 0;">${reason}</p>
          </div>
          <a href="${process.env.NEXTAUTH_URL}/dashboard" 
             style="display: inline-block; background: #1e40af; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; margin-top: 16px;">
            Upload New Screenshot
          </a>
          <p style="color: #94a3b8; font-size: 12px; margin-top: 32px;">GlobalCV Pro — Create International Standard CVs That Get Interviews</p>
        </div>
      </div>
    `,
  });
}
