import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { clearAuthTokens } from "../../services/api/auth";
import { getMe, type UserProfile } from "../../services/api/user";

export function MePage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    const handleUnauthorized = () => {
      clearAuthTokens();
      navigate("/login");
    };

    window.addEventListener("auth:unauthorized", handleUnauthorized);
    return () => window.removeEventListener("auth:unauthorized", handleUnauthorized);
  }, [navigate]);

  useEffect(() => {
    let isMounted = true;
    const loadProfile = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getMe();
        if (isMounted) setProfile(data);
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Failed to load profile");
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadProfile();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleLogout = () => {
    clearAuthTokens();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto w-full max-w-2xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">My profile</h1>
            <p className="text-sm text-muted-foreground">
              Account details pulled from the API.
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="rounded-md border px-4 py-2 text-sm"
          >
            Logout
          </button>
        </div>

        {isLoading ? (
          <div className="rounded-md border p-4">Loading...</div>
        ) : error ? (
          <div className="rounded-md border p-4 text-destructive">{error}</div>
        ) : profile ? (
          <div className="rounded-md border bg-card p-4 space-y-3">
            <div>
              <div className="text-xs text-muted-foreground">ID</div>
              <div className="text-sm break-all">{profile.id}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Display name</div>
              <div className="text-sm">{profile.display_name}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Username</div>
              <div className="text-sm">{profile.username}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Email</div>
              <div className="text-sm">{profile.email}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Created at</div>
              <div className="text-sm">{profile.created_at}</div>
            </div>
          </div>
        ) : null}

        <Link to="/" className="text-primary underline text-sm">
          Back to home
        </Link>
      </div>
    </div>
  );
}
