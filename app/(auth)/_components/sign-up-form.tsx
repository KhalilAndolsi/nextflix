"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from "@/components/ui/input-otp";
import { signUp, signIn, authClient } from "@/lib/auth-client";

const signUpSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[a-zA-Z]/, "Password must contain a letter")
      .regex(/[0-9]/, "Password must contain a number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });
type SignUpValues = z.infer<typeof signUpSchema>;

const verifySchema = z.object({
  otp: z
    .string()
    .length(6, "Code must be exactly 6 digits")
    .regex(/^\d{6}$/, "Code must be 6 digits"),
});
type VerifyValues = z.infer<typeof verifySchema>;

const getNextPath = () =>
  typeof window !== "undefined"
    ? new URLSearchParams(window.location.search).get("next") || "/"
    : "/";

export default function SignUpForm() {
  const router = useRouter();
  const [pendingEmail, setPendingEmail] = useState("");
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const signUpForm = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const verifyForm = useForm<VerifyValues>({
    resolver: zodResolver(verifySchema),
    defaultValues: { otp: "" },
  });

  const handleSignUp = async (values: SignUpValues) => {
    setServerError("");
    setLoading(true);
    const { error } = await signUp.email({
      name: values.name,
      email: values.email,
      password: values.password,
    });
    setLoading(false);
    if (error) {
      setServerError(error.message || "Could not create your account");
      return;
    }
    setPendingEmail(values.email);
    verifyForm.reset();
  };

  const handleVerify = async (values: VerifyValues) => {
    setServerError("");
    setLoading(true);
    const { error } = await authClient.emailOtp.verifyEmail({
      email: pendingEmail,
      otp: values.otp,
    });
    if (error) {
      setLoading(false);
      setServerError(error.message || "Invalid or expired code");
      return;
    }
    const { error: signInError } = await signIn.email({
      email: pendingEmail,
      password: signUpForm.getValues("password"),
    });
    setLoading(false);
    if (signInError) {
      setServerError(signInError.message || "Account created. Please sign in.");
      return;
    }
    router.push(getNextPath());
    router.refresh();
  };

  const handleResend = async () => {
    setServerError("");
    setLoading(true);
    const { error } = await authClient.emailOtp.sendVerificationOtp({
      email: pendingEmail,
      type: "email-verification",
    });
    setLoading(false);
    if (error) setServerError(error.message || "Could not resend the code");
  };

  const handleGoogle = async () => {
    setServerError("");
    setLoading(true);
    const { error } = await signIn.social({
      provider: "google",
      callbackURL: getNextPath(),
    });
    setLoading(false);
    if (error) setServerError(error.message || "Google sign-in failed");
  };

  if (pendingEmail) {
    return (
      <div className="w-full rounded-xl border border-border bg-card p-8 shadow-xl">
        <div className="mb-2 flex justify-center">
          <ShieldCheck className="size-12 text-primary" />
        </div>
        <h1 className="mb-2 text-center text-2xl font-semibold text-foreground">
          Verify your email
        </h1>
        <p className="mb-6 text-center text-sm text-muted-foreground">
          We sent a 6-digit code to{" "}
          <span className="font-medium text-foreground">{pendingEmail}</span>.
          Enter it below to activate your account.
        </p>

        {serverError && (
          <div className="mb-4 rounded-md bg-destructive/10 px-4 py-2.5 text-sm text-destructive">
            {serverError}
          </div>
        )}

        <form
          onSubmit={verifyForm.handleSubmit(handleVerify)}
          className="space-y-4"
          noValidate
        >
          <div>
            <Label htmlFor="verify-otp">Verification Code</Label>
            <Controller
              control={verifyForm.control}
              name="otp"
              render={({ field }) => (
                <InputOTP
                  id="verify-otp"
                  maxLength={6}
                  pattern="^[0-9]+$"
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  disabled={loading}
                  containerClassName="justify-center mt-1.5"
                  aria-label="Verification code"
                >
                  <InputOTPGroup>
                    {[0, 1, 2].map((index) => (
                      <InputOTPSlot key={index} index={index} className="h-11 w-9 text-lg font-mono" />
                    ))}
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    {[3, 4, 5].map((index) => (
                      <InputOTPSlot key={index} index={index} className="h-11 w-9 text-lg font-mono" />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              )}
            />
            {verifyForm.formState.errors.otp && (
              <p className="mt-1 text-center text-xs text-destructive">
                {verifyForm.formState.errors.otp.message}
              </p>
            )}
          </div>
          <Button type="submit" disabled={loading} className="w-full cursor-pointer">
            {loading ? "Verifying..." : "Verify Email"}
            <ArrowRight className="size-4" />
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-muted-foreground">
          Didn&apos;t get the code?{" "}
          <button
            type="button"
            onClick={handleResend}
            disabled={loading}
            className="font-medium text-primary hover:underline underline-offset-2 cursor-pointer"
          >
            Resend code
          </button>
        </p>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          Wrong email?{" "}
          <button
            type="button"
            onClick={() => {
              setPendingEmail("");
              setServerError("");
            }}
            className="font-medium text-muted-foreground hover:text-foreground underline underline-offset-2 cursor-pointer"
          >
            Go back
          </button>
        </p>
      </div>
    );
  }

  return (
    <div className="w-full rounded-xl border border-border bg-card p-8 shadow-xl">
      <h1 className="mb-2 text-center text-2xl font-semibold text-foreground">
        Create your account
      </h1>
      <p className="mb-6 text-center text-sm text-muted-foreground">
        Join Nextflix and start watching.
      </p>

      {serverError && (
        <div className="mb-4 rounded-md bg-destructive/10 px-4 py-2.5 text-sm text-destructive">
          {serverError}
        </div>
      )}

      <form onSubmit={signUpForm.handleSubmit(handleSignUp)} className="space-y-4" noValidate>
        <div>
          <Label htmlFor="su-name">Name</Label>
          <div className="relative mt-1.5">
            <User className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="su-name"
              type="text"
              placeholder="Your name"
              className="pl-9"
              autoComplete="name"
              disabled={loading}
              {...signUpForm.register("name")}
            />
          </div>
          {signUpForm.formState.errors.name && (
            <p className="mt-1 text-xs text-destructive">
              {signUpForm.formState.errors.name.message}
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="su-email">Email</Label>
          <div className="relative mt-1.5">
            <Mail className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="su-email"
              type="email"
              placeholder="you@example.com"
              className="pl-9"
              autoComplete="email"
              disabled={loading}
              {...signUpForm.register("email")}
            />
          </div>
          {signUpForm.formState.errors.email && (
            <p className="mt-1 text-xs text-destructive">
              {signUpForm.formState.errors.email.message}
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="su-password">Password</Label>
          <div className="relative mt-1.5">
            <Lock className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="su-password"
              type={showPassword ? "text" : "password"}
              placeholder="Min. 8 chars, letters & numbers"
              className="pr-9 pl-9"
              autoComplete="new-password"
              disabled={loading}
              {...signUpForm.register("password")}
            />
            <button
              type="button"
              tabIndex={-1}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
              onClick={() => setShowPassword((v) => !v)}
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
          {signUpForm.formState.errors.password && (
            <p className="mt-1 text-xs text-destructive">
              {signUpForm.formState.errors.password.message}
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="su-confirm">Confirm Password</Label>
          <div className="relative mt-1.5">
            <Lock className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="su-confirm"
              type={showConfirm ? "text" : "password"}
              placeholder="Repeat your password"
              className="pr-9 pl-9"
              autoComplete="new-password"
              disabled={loading}
              {...signUpForm.register("confirmPassword")}
            />
            <button
              type="button"
              tabIndex={-1}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
              onClick={() => setShowConfirm((v) => !v)}
            >
              {showConfirm ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
          {signUpForm.formState.errors.confirmPassword && (
            <p className="mt-1 text-xs text-destructive">
              {signUpForm.formState.errors.confirmPassword.message}
            </p>
          )}
        </div>
        <Button type="submit" disabled={loading} className="w-full cursor-pointer">
          {loading ? "Creating account..." : "Create Account"}
          <ArrowRight className="size-4" />
        </Button>
      </form>

      <div className="relative my-6">
        <Separator />
        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
          or continue with
        </span>
      </div>

      <Button
        variant="outline"
        onClick={handleGoogle}
        disabled={loading}
        className="w-full cursor-pointer"
        type="button"
      >
        <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        Continue with Google
      </Button>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/sign-in" className="font-medium text-primary hover:underline underline-offset-2">
          Sign in
        </Link>
      </p>
    </div>
  );
}