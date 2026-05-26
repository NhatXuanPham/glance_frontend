import { Link, Outlet, useLocation } from "react-router";
import {
  Home,
  Search,
  Compass,
  MessageCircle,
  Heart,
  PlusSquare,
  UserCircle,
  Menu,
} from "lucide-react";
import { cn } from "@/app/components/ui/utils";
import { useAppSelector } from "@/store/hooks";

const navItems = [
  { label: "Trang chu", to: "/", Icon: Home },
  { label: "Tim kiem", to: "/", Icon: Search },
  { label: "Kham pha", to: "/", Icon: Compass },
  { label: "Tin nhan", to: "/", Icon: MessageCircle },
  { label: "Thong bao", to: "/", Icon: Heart },
  { label: "Tao", to: "/", Icon: PlusSquare },
];
export function Shell() {
  const location = useLocation();
  const { data: profile } = useAppSelector((state) => state.user);
  const profilePath = profile?.username ? `/${profile.username}` : "/";
  const fullNavItems = [
    ...navItems,
    { label: "Trang ca nhan", to: profilePath, Icon: UserCircle },
  ];

  return (
    <div className="relative min-h-screen bg-[#0b0f13] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(45,90,130,0.35),_transparent_52%),radial-gradient(circle_at_bottom,_rgba(5,10,18,0.9),_transparent_65%)]" />
      <div className="relative flex min-h-screen">
        <aside className="hidden md:flex w-20 lg:w-60 flex-col border-r border-white/10 bg-black/20 px-4 py-6 backdrop-blur">
          <div className="mb-10 flex items-center gap-3 px-2 text-lg font-semibold">
                    <img src="/src/assets/logo-white.png" alt="Glance" className="h-6 w-6" />
            <span className="hidden lg:inline">Glance</span>
          </div>

          <nav className="flex flex-1 flex-col gap-1">
            {fullNavItems.map(({ label, to, Icon }) => {
              const isActive = location.pathname === to;

              return (
                <Link
                  key={label}
                  to={to}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-white/80 transition hover:bg-white/10",
                    isActive && "bg-white/15 text-white",
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span className="hidden lg:inline">{label}</span>
                </Link>
              );
            })}
          </nav>

          <button className="mt-6 flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-white/70 transition hover:bg-white/10">
            <Menu className="h-5 w-5" />
            <span className="hidden lg:inline">Menu</span>
          </button>
        </aside>

        <main className="flex-1 min-w-0">
          <Outlet />
        </main>

        <aside className="hidden xl:flex w-80 flex-col gap-6 border-l border-white/10 bg-black/15 px-6 py-10">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="text-xs uppercase tracking-[0.2em] text-white/40">
              Gợi ý cho bạn
            </div>
            <div className="mt-4 space-y-3">
              {["userA", "userB", "userC"].map((item) => (
                <div key={item} className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium">{item}</div>
                    <div className="text-xs text-white/50">Goi y ket noi</div>
                  </div>
                  <button className="text-xs text-blue-300 hover:text-blue-200">
                    Theo doi
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-xs text-white/40">
          </div>
        </aside>
      </div>

      <button className="fixed bottom-6 right-6 flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm text-white shadow-lg backdrop-blur transition hover:bg-white/20">
        <MessageCircle className="h-4 w-4" />
        Tin nhan
      </button>
    </div>
  );
}
