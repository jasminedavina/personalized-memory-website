"use client";

import { motion } from "framer-motion";
import { useMemo, useState } from "react";

type PasscodeGateProps = {
  passcode: string;
  friendName: string;
  children: React.ReactNode;
  onUnlock?: () => void;
};

function normalize(value: string): string {
  return value.trim().toLowerCase();
}

export function PasscodeGate({
  passcode,
  friendName,
  children,
  onUnlock,
}: PasscodeGateProps) {
  const [value, setValue] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [error, setError] = useState("");

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
    setUnlocked(true);
    onUnlock?.();
  };

  if (unlocked) {
    return <>{children}</>;
  }

  return (
    <div className="ambient-bg flex min-h-screen items-center justify-center bg-background px-6 text-foreground">
      <motion.div
        className="w-full max-w-md"
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
        </div>
      </motion.div>
    </div>
  );
}
