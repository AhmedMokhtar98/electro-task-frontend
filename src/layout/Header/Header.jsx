import Breadcrumbs from "./Breadcrumbs";
import UserBadge from "./UserBadge";
import ThemeToggle from "@/layout/themeColor/ThemeToggle";

export default function Header() {
  return (
    <header
      className="
        sticky top-3 z-50
        mx-auto my-3
        w-[96%] shrink-0
        rounded-2xl
        border border-black/[0.06]
        bg-[var(--bg-secondary-color)]
        shadow-sm
        transition-colors duration-300
        dark:border-white/[0.08]
        dark:bg-[#171717]
      "
    >
      <div className="flex min-h-14 items-center justify-between gap-4 px-4">
        <div className="min-w-0 flex-1 overflow-hidden">
          <Breadcrumbs />
        </div>

        <div className="flex shrink-0 items-center gap-2">
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
