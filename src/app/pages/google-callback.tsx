import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { googleExchange, setAuthTokens } from "../../services/api/auth";

export function GoogleCallbackPage() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");

      if (!code) {
        setError("Missing authorization code.");
        return;
      }

      try {
        const data = await googleExchange({ code });
        setAuthTokens({
          accessToken: data.access_token,
          refreshToken: data.refresh_token,
        });
        navigate("/me");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Google login failed");
      }
    };

    run();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-lg border bg-card p-6 shadow-sm">
        <h1 className="text-2xl font-semibold">Signing you in...</h1>
        <p className="text-sm text-muted-foreground mt-2">
          Please wait while we finish the Google login.
        </p>
        {error ? (
          <div className="mt-4 rounded-md border p-3 text-sm text-destructive">
            {error}
          </div>
        ) : null}
      </div>
    </div>
  );
}
