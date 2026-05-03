import { useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router";
import { register } from "@/services/api/auth";

export function RegisterPage() {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    display_name: "",
    username: "",
    email: "",
    password: "",
    day: "",
    month: "",
    year: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await register({
        display_name: form.display_name.trim(),
        username: form.username.trim(),
        email: form.email.trim(),
        password: form.password,
      });

      navigate("/login");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Register failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex justify-center px-4 py-10">
      <div className="w-full max-w-md space-y-6">
        
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">
            Bắt đầu trên Glance
          </h1>
          <p className="text-sm text-gray-400">
            Đăng ký để xem ảnh và video từ bạn bè.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Email */}
          <div>
            <label className="text-sm text-gray-300">
              Số di động hoặc email
            </label>
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              className="mt-1 w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 outline-none focus:border-gray-500"
              placeholder="Số di động hoặc email"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-sm text-gray-300">Mật khẩu</label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              className="mt-1 w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 outline-none focus:border-gray-500"
              placeholder="Mật khẩu"
              required
            />
          </div>

          {/* Birthday */}
          <div>
            <label className="text-sm text-gray-300">Ngày sinh</label>
            <div className="flex gap-3 mt-2">
              <select
                name="day"
                onChange={handleChange}
                className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-3 py-3"
              >
                <option value="">Ngày</option>
                {Array.from({ length: 31 }, (_, i) => (
                  <option key={i} value={i + 1}>{i + 1}</option>
                ))}
              </select>

              <select
                name="month"
                onChange={handleChange}
                className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-3 py-3"
              >
                <option value="">Tháng</option>
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i} value={i + 1}>{i + 1}</option>
                ))}
              </select>

              <select
                name="year"
                onChange={handleChange}
                className="flex-1 bg-gray-900 border border-gray-700 rounded-lg px-3 py-3"
              >
                <option value="">Năm</option>
                {Array.from({ length: 100 }, (_, i) => (
                  <option key={i} value={2026 - i}>{2026 - i}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="text-sm text-gray-300">Tên</label>
            <input
              name="display_name"
              value={form.display_name}
              onChange={handleChange}
              className="mt-1 w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3"
              placeholder="Tên đầy đủ"
              required
            />
          </div>

          {/* Username */}
          <div>
            <label className="text-sm text-gray-300">Tên người dùng</label>
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              className="mt-1 w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3"
              placeholder="Tên người dùng"
              required
            />
          </div>

          {/* Error */}
          {error && (
            <div className="text-red-400 text-sm">{error}</div>
          )}

          {/* Terms */}
          <p className="text-xs text-gray-400 leading-relaxed">
            Bằng việc nhấn vào Gửi, bạn đồng ý với Điều khoản và Chính sách quyền riêng tư.
          </p>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 transition rounded-full py-3 font-medium"
          >
            {isLoading ? "Đang tạo..." : "Gửi"}
          </button>
        </form>

        {/* Login link */}
        <button
          onClick={() => navigate("/login")}
          className="w-full border border-gray-700 rounded-full py-3 hover:bg-gray-900"
        >
          Tôi có tài khoản rồi
        </button>
      </div>
    </div>
  );
}