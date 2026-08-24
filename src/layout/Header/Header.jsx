import { useNavigate } from "react-router-dom";
import { FiSettings } from "react-icons/fi";

import Breadcrumbs from "./Breadcrumbs";
import UserBadge from "./UserBadge";
import ThemeToggle from "@/layout/themeColor/ThemeToggle";

export default function Header() {
  const navigate = useNavigate();

  return (
    <header
      className="
        relative z-20
        mx-auto my-4
        w-[96%]
        rounded-2xl
        border border-black/[0.06]
        bg-[var(--bg-secondary-color)]
        transition-colors duration-300
        dark:border-white/[0.08]
      "
    >
      <div className="flex min-h-[72px] w-full items-center justify-between gap-4 px-5">
        {/* Left */}
        <div className="min-w-0 flex-1 overflow-hidden">
          <Breadcrumbs />
        </div>

        {/* Right */}
        <div className="flex shrink-0 items-center gap-3">
          <button
            type="button"
            aria-label="Open settings"
            title="Settings"
            onClick={() => navigate("/settings/form")}
            className="
              group
              flex size-10 shrink-0
              items-center justify-center
              rounded-xl
              bg-black/[0.04]
              p-0
              text-[var(--text-primary-color)]
              transition-all duration-200
              hover:bg-black/[0.08]
              focus:outline-none
              focus-visible:ring-2
              focus-visible:ring-[var(--primary-color)]
              dark:bg-white/[0.06]
              dark:hover:bg-white/[0.1]
            "
          >
            <FiSettings
              className="
                size-5 shrink-0
                transition-transform duration-500
                group-hover:rotate-90
              "
            />
          </button>

          {/* Do not put ThemeToggle inside a fixed-width wrapper */}
          <div className="flex shrink-0 items-center">
            <ThemeToggle />
          </div>

          <div
            aria-hidden="true"
            className="h-7 w-px shrink-0 bg-black/10 dark:bg-white/10"
          />

          <div className="flex shrink-0 items-center">
            <UserBadge />
          </div>
        </div>
      </div>
    </header>
  );
}