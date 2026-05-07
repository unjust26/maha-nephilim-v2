import { useConvexAuth } from "convex/react";
import { ArrowRight } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "./ui/button";

export function Header() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const location = useLocation();

  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/signup";

  return (
    <header className="sticky top-0 z-50 border-b border-green-500/10 bg-zinc-950/80 backdrop-blur-xl">
      <div className="container">
        <div className="flex h-14 items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
              <span className="text-sm">🛡️</span>
            </div>
            <span className="font-bold font-mono tracking-tight text-green-400">NEPHILIM</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-green-500/10 text-green-400 border border-green-500/20 font-mono">v2.0</span>
          </Link>

          <nav className="flex items-center gap-6 text-sm font-mono">
            <a href="#modules" className="text-zinc-400 hover:text-green-400 transition-colors text-xs hidden sm:inline">MODULES</a>
            <a href="#threat-feed" className="text-zinc-400 hover:text-green-400 transition-colors text-xs hidden sm:inline">THREATS</a>
            {isLoading ? null : isAuthenticated ? (
              <Link to="/dashboard" className="px-4 py-1.5 rounded-lg bg-green-600 hover:bg-green-700 text-white text-xs transition-colors font-medium">
                ENTER
              </Link>
            ) : (
              !isAuthPage && (
                <Link to="/login" className="px-4 py-1.5 rounded-lg bg-green-600 hover:bg-green-700 text-white text-xs transition-colors font-medium">
                  ACCESS
                </Link>
              )
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
