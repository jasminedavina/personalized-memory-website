"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

type PasscodeGateProps = {
  passcode: string;
  friendName: string;
  children?: React.ReactNode;
  onUnlock?: () => void;
  passcodeBackground?: string;
  redirectUrl?: string;
  redirectMessage?: string;
};

function normalize(value: string): string {
  return value.trim().toLowerCase();
}

export function PasscodeGate({
  passcode,
  friendName,
  children,
  onUnlock,
  passcodeBackground,
  redirectUrl,
  redirectMessage = "Opening...",
}: PasscodeGateProps) {
  const [value, setValue] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [error, setError] = useState("");
  const [isRedirecting, setIsRedirecting] = useState(false);

  const router = useRouter();

  const normalizedPasscode = useMemo(
    () => normalize(passcode),
    [passcode]
  );

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!value.trim()) {
      setError("Please enter the passcode.");
      return;
    }

    if (normalize(value) !== normalizedPasscode) {
      setError("That passcode is not correct.");
      return;
    }

    setError("");

    if (redirectUrl) {
      setIsRedirecting(true);
      onUnlock?.();

      window.setTimeout(() => {
        if (redirectUrl.startsWith("/")) {
          router.push(redirectUrl);
          return;
        }

        window.location.assign(redirectUrl);
      }, 150);

      return;
    }

    setUnlocked(true);
    onUnlock?.();
  };

  if (unlocked && children) {
    return <>{children}</>;
  }

  const hasBackground = Boolean(passcodeBackground);

  return (
    <div
      className={`passcode-stage relative w-full bg-background text-foreground ${
        hasBackground ? "passcode-has-bg" : ""
      }`}
    >
      <div className="passcode-stack">
        {hasBackground ? (
          <div className="passcode-frame" aria-hidden="true">
            <img
              src={passcodeBackground}
              alt=""
              className="passcode-image"
            />
          </div>
        ) : null}

        <div className="passcode-overlay">
          <motion.div
            className="passcode-content w-full max-w-[17rem]"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="scrapbook-page passcode-card mx-auto rounded-[2rem] bg-white/70 p-4 text-center shadow-2xl backdrop-blur-md">

          {/* Main Title */}
          <h1 className="text-xl font-semibold text-foreground">
            For {friendName} ✨
          </h1>

          {/* Subtitle */}
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            This little scrapbook was made just for you 🌸
            <br />
            Enter the passcode to continue.
          </p>

          {isRedirecting ? (
            <div className="mt-5">
              <p className="text-xs text-muted-foreground">
                {redirectMessage}
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="mt-5 space-y-3"
            >
              <input
                type="password"
                value={value}
                onChange={(event) =>
                  setValue(event.target.value)
                }
                placeholder="Enter your memory key..."
                className="w-full rounded-2xl border border-white/40 bg-white/70 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none backdrop-blur-sm transition focus:border-white/70"
              />

              {error ? (
                <p className="text-xs text-rose-500">
                  {error}
                </p>
              ) : null}

              <button
                type="submit"
                className="theme-button w-full rounded-2xl px-4 py-3 text-sm font-medium transition hover:scale-[1.02]"
              >
                Open Scrapbook 💌
              </button>
            </form>
          )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}