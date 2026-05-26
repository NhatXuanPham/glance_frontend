import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Bookmark, Grid3X3, Settings, UserSquare2 } from "lucide-react";
import { clearAuthTokens } from "../../services/api/auth";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { clearUser } from "@/store/userSlice";

export function MePage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { data: profile } = useAppSelector((state) => state.user);

  const username = profile?.username ?? "user";
  const displayName = profile?.display_name ?? profile?.username ?? "User";
  const stats = {
    posts: profile?.total_posts ?? 0,
    followers: profile?.total_followers ?? 0,
    following: profile?.total_following ?? 0,
  };
  const avatarUrl = profile?.avatar_url;
  const postCards = Array.from({ length: 9 }, (_, index) => index + 1);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    const handleUnauthorized = () => {
      clearAuthTokens();
      dispatch(clearUser());
      navigate("/login");
    };

    window.addEventListener("auth:unauthorized", handleUnauthorized);
    return () => window.removeEventListener("auth:unauthorized", handleUnauthorized);
  }, [dispatch, navigate]);

  const handleLogout = () => {
    clearAuthTokens();
    dispatch(clearUser());
    navigate("/login");
  };

  return (
    <div className="mx-auto w-full max-w-5xl px-4 pb-20 pt-10">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
        <div className="flex items-start gap-6">
          <div className="h-28 w-28 rounded-full bg-gradient-to-br from-slate-600 via-slate-700 to-slate-900 p-[3px]">
            {avatarUrl ? (
              <img src={avatarUrl} alt={displayName} className="h-full w-full rounded-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center rounded-full bg-black/60 text-2xl font-semibold">
                {displayName.slice(0, 1).toUpperCase()}
              </div>
            )}
          </div>
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-semibold">{displayName}</h1>
              <button
                onClick={() => setShowSettings(true)}
                className="rounded-full border border-white/15 bg-white/10 p-2"
              >
                <Settings className="h-4 w-4" />
              </button>
              {showSettings && (
                <div
                  onClick={() => setShowSettings(false)}
                  className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
                >
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="w-full max-w-xl overflow-hidden rounded-[28px] border border-white/10 bg-[#262626] shadow-2xl"
                  >
                    {[
                      "Ứng dụng và trang web",
                      "Tài khoản công việc",
                      "Mã QR",
                      "Thông báo",
                      "Cài đặt và quyền riêng tư",
                      "Meta đã xác minh",
                      "Giám sát",
                      "Hoạt động đăng nhập",
                    ].map((item) => (
                      <button
                        key={item}
                        className="flex h-14 w-full items-center justify-center border-b border-white/10 text-sm transition hover:bg-white/5"
                      >
                        {item}
                      </button>
                    ))}

                    <button
                      onClick={handleLogout}
                      className="flex h-14 w-full items-center justify-center border-b border-white/10 text-sm font-semibold text-red-400 transition hover:bg-white/5"
                    >
                      Đăng xuất
                    </button>

                    <button
                      onClick={() => setShowSettings(false)}
                      className="flex h-14 w-full items-center justify-center text-sm transition hover:bg-white/5"
                    >
                      Hủy
                    </button>
                  </div>
                </div>
              )}
            </div>
            <div className="flex items-center gap-6 text-sm text-white/80">
              <span>
                <strong className="text-white">{stats.posts}</strong> bai viet
              </span>
              <span>
                <strong className="text-white">{stats.followers}</strong> nguoi theo doi
              </span>
              <span>
                Dang theo doi <strong className="text-white">{stats.following}</strong> nguoi dung
              </span>
            </div>
            <div>
              <div className="text-sm text-white/70">{username}</div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-8 flex items-center gap-5">
        <button className="rounded-full border border-white/15 bg-white/10 px-4 py-1 text-sm">
          Chinh sua trang ca nhan
        </button>
        <button className="rounded-full border border-white/15 bg-white/10 px-4 py-1 text-sm">
          Xem kho luu tru
        </button>
      </div>
      <div className="mt-8 flex items-center gap-5">
        <button className="flex h-20 w-20 items-center justify-center rounded-full border border-white/15 bg-white/5 text-3xl text-white/60">
          +
        </button>
        <div>
          <div className="text-sm font-medium">Moi</div>
          <div className="text-xs text-white/50">Ghi chu</div>
        </div>
      </div>

      <div className="mt-10 border-t border-white/10">
        <div className="flex items-center justify-center gap-10 pt-4 text-xs uppercase tracking-[0.3em] text-white/50">
          <div className="flex items-center gap-2 text-white">
            <Grid3X3 className="h-4 w-4" />
            Bai viet
          </div>
          <div className="flex items-center gap-2">
            <Bookmark className="h-4 w-4" />
            Da luu
          </div>
          <div className="flex items-center gap-2">
            <UserSquare2 className="h-4 w-4" />
            Duoc gan the
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3">
        {postCards.map((card) => (
          <div
            key={card}
            className="group relative aspect-square overflow-hidden rounded-2xl bg-gradient-to-br from-slate-500/60 via-slate-800/60 to-black/90"
          >
            <div className="absolute inset-0 opacity-0 transition group-hover:opacity-100 bg-gradient-to-t from-black/70 via-transparent" />
            <div className="absolute bottom-3 left-3 text-xs text-white/70">#{card}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
