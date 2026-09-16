import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

const primary = "#e50914";
const background = "#000000";
const card = "#1e1e1e";
const border = "#2e2e2e";
const foreground = "#ffffff";
const muted = "#94a3b8";

const TITLES: Record<string, string> = {
  "sign-in": "Your Nextflix sign-in code",
  "email-verification": "Verify your Nextflix email",
  "forget-password": "Reset your Nextflix password",
  "change-email": "Confirm your new Nextflix email",
};

const HEADLINES: Record<string, string> = {
  "sign-in": "Sign in to Nextflix",
  "email-verification": "Verify your email",
  "forget-password": "Reset your password",
  "change-email": "Confirm your new email",
};

const SUBTITLES: Record<string, string> = {
  "sign-in": "Enter this code to sign in to your account.",
  "email-verification": "Enter this code to activate your account.",
  "forget-password": "Enter this code to reset your password.",
  "change-email": "Enter this code to confirm your new email address.",
};

interface OTPEmailProps {
  otp: string;
  type?: string;
}

export function OTPEmail({ otp, type = "email-verification" }: OTPEmailProps) {
  const title = TITLES[type] ?? "Your Nextflix verification code";
  return (
    <Html lang="en" dir="ltr">
      <Head />
      <Preview>{title}</Preview>
      <Body style={body}>
        <Container style={container}>
          <Text style={brand}>NEXTFLIX</Text>

          <Heading style={heading}>
            {HEADLINES[type] ?? "Your verification code"}
          </Heading>

          <Text style={subtitle}>
            {SUBTITLES[type] ?? "Enter this code to continue."}
          </Text>

          <Section style={codeSection}>
            {otp.split("").map((digit, index) => (
              <span
                key={index}
                style={{
                  ...codeDigit,
                  ...(index < otp.length - 1 ? { marginRight: 8 } : {}),
                }}
              >
                {digit}
              </span>
            ))}
          </Section>

          <Text style={hint}>The code expires in 5 minutes.</Text>

          <Hr style={hr} />

          <Text style={footer}>
            If you didn&apos;t request this email, you can safely ignore it.
            Your code will never be asked from you by Nextflix support.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const body = {
  backgroundColor: background,
  fontFamily:
    "'Helvetica Neue', Helvetica, Arial, 'Liberation Sans', sans-serif",
  margin: 0,
  padding: "32px 0",
};

const container = {
  backgroundColor: card,
  border: `1px solid ${border}`,
  borderRadius: 12,
  margin: "0 auto",
  maxWidth: 480,
  padding: "40px 32px",
};

const brand = {
  color: primary,
  fontSize: 20,
  fontWeight: 800,
  letterSpacing: 4,
  textAlign: "center" as const,
  textTransform: "uppercase" as const,
  margin: "0 0 28px",
};

const heading = {
  color: foreground,
  fontSize: 22,
  fontWeight: 700,
  textAlign: "center" as const,
  margin: "0 0 10px",
};

const subtitle = {
  color: muted,
  fontSize: 14,
  lineHeight: "22px",
  textAlign: "center" as const,
  margin: "0 0 28px",
};

const codeSection = {
  display: "flex",
  justifyContent: "center",
  itemsAlign: "center",
  margin: "0 0 24px",
};

const codeDigit = {
  display: "inline-block",
  width: 44,
  height: 54,
  lineHeight: "54px",
  textAlign: "center" as const,
  fontSize: 24,
  fontWeight: 800,
  letterSpacing: 2,
  color: foreground,
  backgroundColor: background,
  border: `1px solid ${border}`,
  borderRadius: 8,
};

const hint = {
  color: muted,
  fontSize: 13,
  textAlign: "center" as const,
  margin: "0 0 24px",
};

const hr = {
  border: `1px solid ${border}`,
  margin: "24px 0",
};

const footer = {
  color: muted,
  fontSize: 12,
  lineHeight: "18px",
  textAlign: "center" as const,
  margin: 0,
};

export default OTPEmail;