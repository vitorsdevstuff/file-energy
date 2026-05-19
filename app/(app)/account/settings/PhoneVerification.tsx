"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
import {
  Phone,
  CheckCircle2,
  AlertCircle,
  Clock,
  RefreshCw,
} from "lucide-react";

interface PhoneVerificationProps {
  phone: string | null;
  phoneVerifiedAt: Date | null;
  phoneVerificationSentAt: Date | null;
}

const CODE_COOLDOWN = 30;
const CODE_EXPIRY = 60;
const MAX_ATTEMPTS = 3;
const MAX_RESENDS = 3;

export function PhoneVerification({
  phone,
  phoneVerifiedAt,
  phoneVerificationSentAt,
}: PhoneVerificationProps) {
  const [phoneInput, setPhoneInput] = useState(phone ?? "");
  const [codeInput, setCodeInput] = useState("");

  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isChangingPhone, setIsChangingPhone] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [resendCount, setResendCount] = useState(0);

  const [cooldown, setCooldown] = useState(0);

  const [codeExpiry, setCodeExpiry] = useState(() => {
    if (!phoneVerificationSentAt) return 0;

    const elapsed = Math.floor(
      (Date.now() - phoneVerificationSentAt.getTime()) / 1000
    );

    return Math.max(CODE_EXPIRY - elapsed, 0);
  });

  const isVerified = Boolean(phoneVerifiedAt);

  const currentPhone = useMemo(() => {
    return phone || phoneInput.trim();
  }, [phone, phoneInput]);

  const isLockedOut = failedAttempts >= MAX_ATTEMPTS;
  const resendExhausted = resendCount >= MAX_RESENDS;

  const step: "idle" | "enter-phone" | "enter-code" = (() => {
    if (isChangingPhone) return "enter-phone";

    if (isVerified) return "idle";

    if (currentPhone) return "enter-code";

    return "idle";
  })();

  /**
   * Cooldown timer
   */
  useEffect(() => {
    if (cooldown <= 0) return;

    const timer = setTimeout(() => {
      setCooldown((c) => c - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [cooldown]);

  /**
   * Code expiry timer
   */
  useEffect(() => {
    if (codeExpiry <= 0) return;

    const timer = setTimeout(() => {
      setCodeExpiry((c) => c - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [codeExpiry]);

  const handleSendCode = useCallback(async (targetPhone: string) => {
    setIsSending(true);

    try {
      const res = await fetch("/api/auth/verify-phone", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone: targetPhone,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.code === "COOLDOWN") {
          toast.error(data.error);
          return;
        }

        throw new Error(data.error || "Failed to send verification code");
      }

      toast.success("Verification code sent to your phone.");

      setCooldown(CODE_COOLDOWN);
      setCodeExpiry(CODE_EXPIRY);
      setCodeInput("");
      setFailedAttempts(0);
      setIsChangingPhone(false);
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Something went wrong."
      );
    } finally {
      setIsSending(false);
    }
  }, []);

  const handleSubmitPhone = async () => {
    const trimmed = phoneInput.trim();

    if (!/^\+[1-9]\d{1,14}$/.test(trimmed)) {
      toast.error(
        "Enter phone in E.164 format (e.g. +1234567890)"
      );
      return;
    }

    await handleSendCode(trimmed);
  };

  const handleVerifyCode = async () => {
    if (!/^\d{4}$/.test(codeInput)) {
      toast.error("Enter the 4-digit code");
      return;
    }

    setIsVerifying(true);

    try {
      const res = await fetch(
        "/api/auth/verify-phone/confirm",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            code: codeInput,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        if (data.code === "CODE_EXPIRED") {
          toast.error(
            "Code expired. Please request a new one."
          );

          setCodeExpiry(0);
          return;
        }

        if (data.code === "INVALID_CODE") {
          setFailedAttempts((a) => a + 1);
        }

        throw new Error(data.error || "Invalid code");
      }

      toast.success("Phone number verified!");

      window.location.reload();
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "Verification failed."
      );
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (!currentPhone || resendExhausted) return;

    setResendCount((c) => c + 1);
    await handleSendCode(currentPhone);
  };

  const handleChangePhone = () => {
    setIsChangingPhone(true);

    setPhoneInput("");
    setCodeInput("");
    setCodeExpiry(0);
    setCooldown(0);
    setFailedAttempts(0);
    setResendCount(0);
  };

  const handleCancelChange = () => {
    setIsChangingPhone(false);

    setPhoneInput(phone ?? "");
    setCodeInput("");
    setCodeExpiry(0);
  };

  return (
    <div className="mt-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
        <Phone className="h-5 w-5 text-primary" />
        Phone Verification
      </h3>

      {/* VERIFIED */}
      {isVerified && !isChangingPhone && (
        <div>
          <div className="mb-3 flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
            <CheckCircle2 className="h-4 w-4" />

            <span>
              Phone verified: <strong>{phone}</strong>
            </span>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleChangePhone}
          >
            Change phone number
          </Button>
        </div>
      )}

      {/* ENTER PHONE */}
      {step === "enter-phone" && (
        <div>
          <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
            {isChangingPhone
              ? "Enter your new phone number. You'll need to verify it again."
              : "Add and verify your phone number to unlock full account access, including purchases."}
          </p>

          <div className="flex gap-3">
            <Input
              type="tel"
              placeholder="+1234567890"
              value={phoneInput}
              onChange={(e) =>
                setPhoneInput(e.target.value)
              }
              className="flex-1"
            />

            <Button
              onClick={handleSubmitPhone}
              isLoading={isSending}
              disabled={!phoneInput.trim()}
            >
              Send code
            </Button>
          </div>

          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Use E.164 format: country code + number
            (e.g. +14155552671)
          </p>

          {isChangingPhone && (
            <Button
              variant="ghost"
              size="sm"
              className="mt-3"
              onClick={handleCancelChange}
            >
              Cancel
            </Button>
          )}
        </div>
      )}

      {/* ENTER CODE */}
      {step === "enter-code" && currentPhone && (
        <div>
          <p className="mb-1 text-sm text-gray-600 dark:text-gray-400">
            We sent a verification code to{" "}
            <strong>{currentPhone}</strong>
          </p>

          {isLockedOut ? (
            <>
              <div className="mt-4 flex items-start gap-2 rounded-lg bg-red-50 p-3 dark:bg-red-950/40">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600 dark:text-red-400" />
                <p className="text-sm text-red-700 dark:text-red-300">
                  You&apos;ve entered the wrong code too many times.{" "}
                  <a
                    href="/contact"
                    className="underline hover:text-red-800 dark:hover:text-red-200"
                  >
                    Contact support
                  </a>{" "}
                  for assistance.
                </p>
              </div>

              <Button
                variant="ghost"
                size="sm"
                className="mt-3"
                onClick={handleChangePhone}
              >
                Change phone
              </Button>
            </>
          ) : (
            <>
              {codeExpiry > 0 ? (
                <p className="mb-4 flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400">
                  <Clock className="h-3 w-3" />
                  Code expires in {codeExpiry}s
                </p>
              ) : (
                <p className="mb-4 text-xs text-red-500">
                  Code has expired. Request a new one below.
                </p>
              )}

              <div className="flex gap-3">
                <Input
                  type="text"
                  inputMode="numeric"
                  maxLength={4}
                  placeholder="1234"
                  value={codeInput}
                  onChange={(e) =>
                    setCodeInput(
                      e.target.value
                        .replace(/\D/g, "")
                        .slice(0, 4)
                    )
                  }
                  className="max-w-[120px]"
                />

                <Button
                  onClick={handleVerifyCode}
                  isLoading={isVerifying}
                  disabled={
                    codeInput.length !== 4 ||
                    codeExpiry <= 0
                  }
                >
                  Verify
                </Button>
              </div>

              <div className="mt-3 flex items-center gap-3">
                {resendExhausted ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleChangePhone}
                  >
                    Change phone
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleResend}
                    isLoading={
                      isSending && cooldown <= 0
                    }
                    disabled={cooldown > 0}
                  >
                    <RefreshCw className="mr-1.5 h-3.5 w-3.5" />

                    {cooldown > 0
                      ? `Resend in ${cooldown}s`
                      : "Resend code"}
                  </Button>
                )}

                {!resendExhausted && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleChangePhone}
                  >
                    Change phone
                  </Button>
                )}
              </div>
            </>
          )}
        </div>
      )}

      {/* WARNING */}
      {!isVerified &&
        step === "idle" &&
        currentPhone && (
          <div className="flex items-start gap-2 rounded-lg bg-amber-50 p-3 dark:bg-amber-950/40">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />

            <p className="text-sm text-amber-700 dark:text-amber-300">
              Your phone number is not verified.
              You must verify both your email
              and phone to make purchases.
            </p>
          </div>
        )}

      {/* EMPTY STATE */}
      {!isVerified &&
        step === "idle" &&
        !currentPhone && (
          <div>
            <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
              Add and verify your phone number
              to unlock full account access,
              including purchases.
            </p>

            <Button
              onClick={() =>
                setIsChangingPhone(true)
              }
            >
              Add phone number
            </Button>
          </div>
        )}
    </div>
  );
}