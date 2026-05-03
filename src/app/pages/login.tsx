import { useState, type ChangeEvent, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import { getGoogleLoginUrl, login, setAuthTokens } from "@/services/api/auth";
import { useAppDispatch } from "@/store/hooks";
import { fetchCurrentUser } from "@/store/userSlice";

export function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const data = await login({
        username: form.username.trim(),
        password: form.password,
      });

      setAuthTokens({
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
      });

      await dispatch(fetchCurrentUser());

      navigate("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = getGoogleLoginUrl();
  };

  return (
    <div className="min-h-screen flex bg-black text-white">
      <div className="hidden lg:flex w-1/2 items-center justify-center relative bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="max-w-md text-center space-y-6">
          <h1 className="text-4xl font-bold leading-tight">
            Hãy xem các khoảnh khắc thường ngày của{" "}
            <span className="text-pink-500">bạn thân</span> nhé.
          </h1>
          <div className="relative flex justify-center mt-6">
            <img
              src="src/assets/image_login.webp"
              className="relative w-120 object-cover rounded-xl shadow-xl z-10"
            />
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-md space-y-6">
          <h2 className="text-2xl font-semibold">
            Đăng nhập vào Instagram
          </h2>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="Số di động, tên người dùng hoặc email"
              className="w-full rounded-lg bg-gray-900 border border-gray-700 px-4 py-3 outline-none focus:border-gray-500"
              required
            />

            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Mật khẩu"
              className="w-full rounded-lg bg-gray-900 border border-gray-700 px-4 py-3 outline-none focus:border-gray-500"
              required
            />

            {error && (
              <div className="text-red-400 text-sm">{error}</div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 transition rounded-lg py-3 font-medium"
            >
              {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>
          </form>

          <div className="text-center text-sm text-gray-400">
            Quên mật khẩu?
          </div>

          <button
            onClick={handleGoogleLogin}
            className="w-full border border-gray-700 rounded-lg py-3 hover:bg-gray-900 transition"
          >
            Đăng nhập bằng Google
          </button>

          <div className="text-center text-sm">
            Chưa có tài khoản?{" "}
            <Link to="/register" className="text-blue-400">
              Tạo tài khoản mới
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}