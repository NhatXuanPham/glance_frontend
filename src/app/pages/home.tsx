
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchCurrentUser } from "@/store/userSlice";

export function Home() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { data, loading, initialized } = useAppSelector((state) => state.user);

  useEffect(() => {
    if (!initialized && !loading) {
      void dispatch(fetchCurrentUser());
    }
  }, [dispatch, initialized, loading]);

  useEffect(() => {
    if (!initialized) return;
    navigate(data?.username ? `/${data.username}` : "/login", { replace: true });
  }, [data, initialized, navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="text-center space-y-4">
        <h1 className="text-xl font-semibold">Checking your session...</h1>
      </div>
    </div>
  );
}