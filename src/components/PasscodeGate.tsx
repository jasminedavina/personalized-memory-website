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
  redirectMessage = "Opening your Canva scrapbook...",
}: PasscodeGateProps) {
  const [value, setValue] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [error, setError] = useState("");
  const [isRedirecting, setIsRedirecting] = useState(false);
  const router = useRouter();

  const normalizedPasscode = useMemo(() => normalize(passcode), [passcode]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
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
      className={`ambient-bg passcode-stage flex min-h-screen items-center justify-center bg-background px-6 text-foreground ${
        hasBackground ? "passcode-has-bg" : ""
      }`}
    >
      {hasBackground ? (
        <div className="passcode-background" aria-hidden="true">
          <div className="passcode-frame">
            <img
              src={passcodeBackground}
              alt=""
              className="passcode-image"
            />
          </div>
        </div>
      ) : null}
      <motion.div
        className="passcode-content w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="scrapbook-page passcode-card text-center">
          <span className="tape tape-left" aria-hidden="true" />
          <span className="tape tape-right" aria-hidden="true" />
          <p className="text-xs uppercase tracking-[0.3em] text-muted">
            Private Memory Letter
          </p>
          <h1 className="font-title mt-4 text-3xl font-semibold text-foreground">
            For {friendName}
          </h1>
          <p className="mt-3 text-sm text-muted">
            Enter the passcode to open the letter. Passcodes are
            case-insensitive.
          </p>

          {isRedirecting ? (
            <div className="mt-6 space-y-3">
              <p className="text-sm text-muted">{redirectMessage}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 space-y-3">
              <input
                type="password"
                value={value}
                onChange={(event) => setValue(event.target.value)}
                placeholder="Passcode"
                className="w-full rounded-xl border border-foreground/10 bg-background/80 px-4 py-3 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none"
              />
              {error ? (
                <p className="text-xs text-rose-500">{error}</p>
              ) : (
                <p className="text-xs text-muted">
                  Tip: Check the friend JSON file to update the passcode.
                </p>
              )}
              <button
                type="submit"
                className="w-full rounded-xl bg-accent px-4 py-3 text-sm font-semibold text-foreground transition hover:opacity-90"
              >
                Open letter
              </button>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}
