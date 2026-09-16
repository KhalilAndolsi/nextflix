"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from "@/components/ui/input-otp";
import { signIn, authClient } from "@/lib/auth-client";
import { isEmailRegistered } from "@/lib/auth-actions";

const passwordSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});
type PasswordValues = z.infer<typeof passwordSchema>;

const otpSchema = z.object({
  email: z.string().email("Enter a valid email address"),
});
type OtpEmailValues = z.infer<typeof otpSchema>;

const otpCodeSchema = z.object({
  otp: z
    .string()
    .length(6, "Code must be exactly 6 digits")
    .regex(/^\d{6}$/, "Code must be 6 digits"),
});
type OtpCodeValues = z.infer<typeof otpCodeSchema>;

type Mode = "password" | "otp";
type OtpStep = "email" | "code";

const getNextPath = () =>
  typeof window !== "undefined"
    ? new URLSearchParams(window.location.search).get("next") || "/"
    : "/";

export default function SignInForm() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("password");
  const [otpStep, setOtpStep] = useState<OtpStep>("email");
  const [otpEmail, setOtpEmail] = useState("");
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const passwordForm = useForm<PasswordValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { email: "", password: "" },
  });

  const otpEmailForm = useForm<OtpEmailValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: { email: "" },
  });

  const otpCodeForm = useForm<OtpCodeValues>({
    resolver: zodResolver(otpCodeSchema),
    defaultValues: { otp: "" },
  });

  const handlePasswordSubmit = async (values: PasswordValues) => {
    setServerError("");
    setLoading(true);
    const { error } = await signIn.email({
      email: values.email,
      password: values.password,
    });
    setLoading(false);
    if (error) {
      setServerError(error.message || "Invalid email or password");
      return;
    }
    router.push(getNextPath());
  };

  const handleSendOtp = async (values: OtpEmailValues) => {
    setServerError("");
    setLoading(true);
    const exists = await isEmailRegistered(values.email);
    if (!exists) {
      setLoading(false);
      toast.error("This email doesn't have an account", {
        description: "Create an account to continue watching.",
        action: {
          label: "Sign up",
          onClick: () => router.push(`/sign-up?next=${encodeURIComponent(getNextPath())}`),
        },
      });
      return;
    }
    const { error } = await authClient.emailOtp.sendVerificationOtp({
      email: values.email,
      type: "sign-in",
    });
    setLoading(false);
    if (error) {
      setServerError(error.message || "Could not send verification code");
      return;
    }
    setOtpEmail(values.email);
    setOtpStep("code");
  };

  const handleVerifyOtp = async (values: OtpCodeValues) => {
    setServerError("");
    setLoading(true);
    const { error } = await signIn.emailOtp({
      email: otpEmail,
      otp: values.otp,
    });
    setLoading(false);
    if (error) {
      setServerError(error.message || "Invalid or expired code");
      return;
    }
    router.push(getNextPath());
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

  const resetOtp = () => {
    setOtpStep("email");
    setOtpEmail("");
    otpCodeForm.reset();
  };

  return (
    <div className="w-full rounded-xl border border-border bg-card p-8 shadow-xl">
      <h1 className="mb-2 text-center text-2xl font-semibold text-foreground">
        Sign in to Nextflix
      </h1>
      <p className="mb-6 text-center text-sm text-muted-foreground">
        Welcome back! Choose how you&apos;d like to sign in.
      </p>

      <div className="mb-6 flex rounded-lg bg-muted p-0.5">
        <button
          type="button"
          onClick={() => { setMode("password"); setServerError(""); }}
          className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors cursor-pointer ${
            mode === "password"
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Password
        </button>
        <button
          type="button"
          onClick={() => { setMode("otp"); setServerError(""); setOtpStep("email"); }}
          className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors cursor-pointer ${
            mode === "otp"
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Email Code
        </button>
      </div>

      {serverError && (
        <div className="mb-4 rounded-md bg-destructive/10 px-4 py-2.5 text-sm text-destructive">
          {serverError}
        </div>
      )}

      {mode === "password" && (
        <form
          onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)}
          className="space-y-4"
          noValidate
        >
          <div>
            <Label htmlFor="si-email">Email</Label>
            <div className="relative mt-1.5">
              <Mail className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="si-email"
                type="email"
                placeholder="you@example.com"
                className="pl-9"
                disabled={loading}
                {...passwordForm.register("email")}
              />
            </div>
            {passwordForm.formState.errors.email && (
              <p className="mt-1 text-xs text-destructive">
                {passwordForm.formState.errors.email.message}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="si-password">Password</Label>
            <div className="relative mt-1.5">
              <Lock className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="si-password"
                type={showPassword ? "text" : "password"}
                placeholder="At least 8 characters"
                className="pr-9 pl-9"
                disabled={loading}
                {...passwordForm.register("password")}
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
            {passwordForm.formState.errors.password && (
              <p className="mt-1 text-xs text-destructive">
                {passwordForm.formState.errors.password.message}
              </p>
            )}
          </div>
          <Button type="submit" disabled={loading} className="w-full cursor-pointer">
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      )}

      {mode === "otp" && (
        <div className="space-y-4">
          {otpStep === "email" && (
            <form onSubmit={otpEmailForm.handleSubmit(handleSendOtp)} className="space-y-4" noValidate>
              <div>
                <Label htmlFor="otp-email">Email</Label>
                <div className="relative mt-1.5">
                  <Mail className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="otp-email"
                    type="email"
                    placeholder="you@example.com"
                    className="pl-9"
                    disabled={loading}
                    {...otpEmailForm.register("email")}
                  />
                </div>
                {otpEmailForm.formState.errors.email && (
                  <p className="mt-1 text-xs text-destructive">
                    {otpEmailForm.formState.errors.email.message}
                  </p>
                )}
              </div>
              <Button type="submit" disabled={loading} className="w-full cursor-pointer">
                {loading ? "Sending code..." : "Send Code"}
                <ArrowRight className="size-4" />
              </Button>
            </form>
          )}

          {otpStep === "code" && (
            <form onSubmit={otpCodeForm.handleSubmit(handleVerifyOtp)} className="space-y-4" noValidate>
              <div className="text-center text-sm text-muted-foreground">
                We sent a 6-digit code to{" "}
                <span className="font-medium text-foreground">{otpEmail}</span>
                <button
                  type="button"
                  onClick={resetOtp}
                  className="ml-1 underline underline-offset-2 hover:text-foreground cursor-pointer"
                >
                  use a different email
                </button>
              </div>
              <div>
                <Label htmlFor="otp-code">Verification Code</Label>
                <Controller
                  control={otpCodeForm.control}
                  name="otp"
                  render={({ field }) => (
                    <InputOTP
                      id="otp-code"
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
                {otpCodeForm.formState.errors.otp && (
                  <p className="mt-1 text-center text-xs text-destructive">
                    {otpCodeForm.formState.errors.otp.message}
                  </p>
                )}
              </div>
              <Button type="submit" disabled={loading} className="w-full cursor-pointer">
                {loading ? "Verifying..." : "Verify & Sign In"}
                <ArrowRight className="size-4" />
              </Button>
            </form>
          )}
        </div>
      )}

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
        Don&apos;t have an account?{" "}
        <Link href="/sign-up" className="font-medium text-primary hover:underline underline-offset-2">
          Sign up
        </Link>
      </p>
    </div>
  );
}