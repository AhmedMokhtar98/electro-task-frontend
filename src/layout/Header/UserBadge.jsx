import { Dropdown } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { CiLogout } from "react-icons/ci";
import { CgProfile } from "react-icons/cg";
import { IoIosArrowDown } from "react-icons/io";

import { logout } from "@/redux/slices/authDataSlice";

export default function UserBadge() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const { authData } = useSelector((state) => state.authData);

  const fullName =
    [authData?.firstName, authData?.lastName]
      .filter(Boolean)
      .join(" ") || t("User Name");

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login", { replace: true });
  };

  const items = [
    {
      key: "profile",
      icon: <CgProfile className="size-5" />,
      label: t("Profile"),
      onClick: () => navigate("/profile"),
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      danger: true,
      icon: <CiLogout className="size-5" />,
      label: t("Log out"),
      onClick: handleLogout,
    },
  ];

  return (
    <Dropdown
      trigger={["click"]}
      placement="bottomRight"
      arrow={{ pointAtCenter: true }}
      menu={{
        items,
        className: `
          !min-w-40
          !rounded-xl
          !bg-[var(--bg-secondary-color)]
          !p-2
          [&_.ant-dropdown-menu-item]:!flex
          [&_.ant-dropdown-menu-item]:!items-center
          [&_.ant-dropdown-menu-item]:!gap-2
          [&_.ant-dropdown-menu-item]:!rounded-lg
          [&_.ant-dropdown-menu-item]:!px-3
          [&_.ant-dropdown-menu-item]:!py-2.5
          [&_.ant-dropdown-menu-item]:!text-[var(--text-primary-color)]
        `,
      }}
    >
      <button
        type="button"
        className="
          group flex max-w-56
          cursor-pointer items-center gap-2
          rounded-full border-0
          bg-transparent px-3 py-2
          text-[var(--text-primary-color)]
          transition-colors duration-200
          hover:bg-black/5
          focus:outline-none
          focus-visible:ring-2
          focus-visible:ring-[var(--primary-color)]
          dark:hover:bg-white/10
        "
      >
        <span className="truncate text-sm font-medium">
          {fullName}
        </span>

        <IoIosArrowDown
          className="
            size-4 shrink-0
            transition-transform duration-200
            group-hover:translate-y-0.5
          "
        />
      </button>
    </Dropdown>
  );
}