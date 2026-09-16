import { Resend } from "resend";
import { render } from "@react-email/components";
import OTPEmail from "@/components/emails/otp-email";

interface SendOTPEmailOptions {
  to: string;
  subject: string;
  otp: string;
  type?: string;
}

export async function sendOTPEmail({ to, subject, otp, type }: SendOTPEmailOptions) {
  const html = await render(<OTPEmail otp={otp} type={type} />);
  const text = `Your Nextflix verification code is ${otp}. It expires in 5 minutes.`;

  if (process.env.RESEND_API_KEY && process.env.RESEND_FROM_DOMAIN) {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: `Nextflix <no-reply@${process.env.RESEND_FROM_DOMAIN}>`,
      to,
      subject,
      text,
      html,
    });
    return;
  }

  console.log(
    `\n[DEV EMAIL] to=${to} subject="${subject}" code=${otp}\n`
  );
}