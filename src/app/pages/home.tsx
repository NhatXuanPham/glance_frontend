
import { Link } from "react-router";

export function Home() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="text-center space-y-4">
        <h1>Welcome</h1>
        <div className="flex items-center justify-center gap-4 text-sm">
          <Link className="text-primary underline" to="/login">
            Login
          </Link>
          <Link className="text-primary underline" to="/register">
            Register
          </Link>
          <Link className="text-primary underline" to="/me">
            My profile
          </Link>
        </div>
      </div>
    </div>
  );
}