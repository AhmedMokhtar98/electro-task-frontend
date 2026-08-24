import { Breadcrumb } from "antd";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";

const formatLabel = (value) =>
  value
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

export default function Breadcrumbs() {
  const { t } = useTranslation();
  const location = useLocation();

  const pathnames = location.pathname
    .split("/")
    .filter(Boolean);

  const linkClassName = `
    !text-sm
    !text-[var(--text-primary-color)]
    transition-colors duration-200
    hover:!bg-transparent
    hover:!text-[var(--primary-color)]
    sm:!text-base
  `;

  const activeClassName = `
    cursor-default
    text-sm font-bold capitalize
    text-[var(--primary-color)]
    sm:text-base
  `;

  const dashboardItem = {
    key: "dashboard",
    title: (
      <Link className={linkClassName} to="/">
        {t("Dashboard")}
      </Link>
    ),
  };

  const isClientProfile = pathnames[2] === "client_profile";

  const pathItems = isClientProfile
    ? [
        {
          key: "clients",
          title: (
            <Link
              className={linkClassName}
              to="/clients/list?page=1&limit=10"
            >
              {t("clients")}
            </Link>
          ),
        },
        {
          key: "profile",
          title: (
            <span className={activeClassName}>
              {t("profile")}
            </span>
          ),
        },
      ]
    : pathnames.map((name, index) => {
        const routeTo = `/${pathnames
          .slice(0, index + 1)
          .join("/")}`;

        const isLast = index === pathnames.length - 1;
        const translatedName = t(name, {
          defaultValue: formatLabel(name),
        });

        return {
          key: routeTo,
          title: isLast ? (
            <span className={activeClassName}>
              {translatedName}
            </span>
          ) : (
            <Link
              className={linkClassName}
              to={`${routeTo}/list?page=1&limit=10`}
            >
              {translatedName}
            </Link>
          ),
        };
      });

  return (
    <nav
      aria-label="Breadcrumb"
      className="
        flex w-fit max-w-full
        items-center overflow-hidden
        rounded-full
        bg-neutral-500/10
        px-4 py-1.5
        transition-all duration-300 ease-in-out
        sm:px-6
      "
    >
      <div
        className="
          max-w-full overflow-x-auto
          whitespace-nowrap
          [scrollbar-width:none]
          [-ms-overflow-style:none]
          [&::-webkit-scrollbar]:hidden
        "
      >
        <Breadcrumb
          className="
            flex items-center
            [&_.ant-breadcrumb-separator]:!text-[var(--text-primary-color)]
            [&_.ant-breadcrumb-separator]:opacity-40
          "
          items={[dashboardItem, ...pathItems]}
        />
      </div>
    </nav>
  );
}