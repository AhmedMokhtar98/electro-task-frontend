import { useState } from "react";
import { Button, Layout, Menu, Tooltip } from "antd";
import { useDispatch } from "react-redux";
import { createSearchParams, useLocation, useNavigate } from "react-router-dom";
import {
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiCheckboxBlankCircleLine,
  RiCheckboxCircleLine,
  RiFileList3Line,
  RiLoader4Line,
  RiLogoutBoxRLine,
  RiTaskLine,
} from "react-icons/ri";
import { logout } from "@/redux/slices/authDataSlice";

const { Sider } = Layout;

const menuRoutes = {
  "all-tasks": null,
  "to-do": "To Do",
  "in-progress": "In Progress",
  done: "Done",
};

const statusMenuKeys = {
  "To Do": "to-do",
  "In Progress": "in-progress",
  Done: "done",
};

const navigationItems = [
  {
    key: "tasks",
    icon: <RiTaskLine size={20} />,
    label: "Tasks",
    popupClassName:
      "[&_.ant-menu]:!bg-white [&_.ant-menu]:!shadow-xl dark:[&_.ant-menu]:!bg-slate-900 dark:[&_.ant-menu]:!shadow-black/30 [&_.ant-menu-item]:!text-slate-600 dark:[&_.ant-menu-item]:!text-slate-300 [&_.ant-menu-item:hover]:!bg-emerald-50 dark:[&_.ant-menu-item:hover]:!bg-emerald-500/10 [&_.ant-menu-item:hover]:!text-emerald-600 dark:[&_.ant-menu-item:hover]:!text-emerald-400 [&_.ant-menu-item-selected]:!bg-emerald-100 dark:[&_.ant-menu-item-selected]:!bg-emerald-500/15 [&_.ant-menu-item-selected]:!text-emerald-700 dark:[&_.ant-menu-item-selected]:!text-emerald-400",
    children: [
      {
        key: "all-tasks",
        icon: <RiFileList3Line size={18} />,
        label: "All tasks",
      },
      {
        key: "to-do",
        icon: <RiCheckboxBlankCircleLine size={18} />,
        label: "To Do",
      },
      {
        key: "in-progress",
        icon: <RiLoader4Line size={18} />,
        label: "In Progress",
      },
      {
        key: "done",
        icon: <RiCheckboxCircleLine size={18} />,
        label: "Done",
      },
    ],
  }
];

export default function DashboardSidebar({
  brandName = "Electro Task",
  activeKey = "all-tasks",
  onNavigate,
  onLogout,
}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const currentStatus = new URLSearchParams(location.search).get("status");
  const selectedKey = statusMenuKeys[currentStatus] || activeKey;

  const handleMenuClick = ({ key }) => {
    if (Object.prototype.hasOwnProperty.call(menuRoutes, key)) {
      const status = menuRoutes[key];
      const search = status
        ? `?${createSearchParams({ status }).toString()}`
        : "";

      navigate({ pathname: "/", search });
    }

    onNavigate?.(key);
  };

  const handleLogout = () => {
    dispatch(logout());
    onLogout?.();
    navigate("/login", { replace: true });
  };

  return (
    <>
      <div
        aria-hidden="true"
        className={`h-screen shrink-0 transition-[width] duration-300 ${
          collapsed ? "w-[88px]" : "w-[264px]"
        }`}
      />

      <Sider
        width={264}
        collapsedWidth={88}
        collapsed={collapsed}
        trigger={null}
        theme="light"
        className="!fixed !bottom-0 !left-0 !top-0 z-40 !h-screen shrink-0 overflow-hidden border-e border-slate-200 !bg-white shadow-[8px_0_30px_rgba(15,23,42,0.04)] transition-all duration-300 dark:border-slate-800 dark:!bg-[#171717] dark:shadow-[8px_0_30px_rgba(0,0,0,0.18)]"
      >
      <div className="flex h-full flex-col px-3 py-4">
        <div
          className={`mb-6 flex h-12 items-center ${
            collapsed ? "justify-center" : "justify-between px-2"
          }`}
        >
          <div className="flex min-w-0 items-center gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-600 text-lg font-bold text-white shadow-sm shadow-emerald-600/20">
              {brandName.charAt(0).toUpperCase()}
            </div>

            {!collapsed && (
              <span className="truncate text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                {brandName}
              </span>
            )}
          </div>

          {!collapsed && (
            <Button
              type="text"
              aria-label="Collapse sidebar"
              icon={<RiArrowLeftSLine size={21} />}
              onClick={() => setCollapsed(true)}
              className="!grid !h-9 !w-9 !place-items-center !rounded-lg !text-slate-500 hover:!bg-slate-100 hover:!text-slate-900 dark:!text-slate-400 dark:hover:!bg-slate-800 dark:hover:!text-white"
            />
          )}
        </div>

        {collapsed && (
          <Tooltip title="Expand sidebar" placement="right">
            <Button
              type="text"
              aria-label="Expand sidebar"
              icon={<RiArrowRightSLine size={21} />}
              onClick={() => setCollapsed(false)}
              className="!mx-auto !mb-4 !grid !h-9 !w-9 !place-items-center !rounded-lg !text-slate-500 hover:!bg-slate-100 hover:!text-slate-900 dark:!text-slate-400 dark:hover:!bg-slate-800 dark:hover:!text-white"
            />
          </Tooltip>
        )}

        <Menu
          mode="inline"
          inlineCollapsed={collapsed}
          defaultOpenKeys={collapsed ? [] : ["tasks"]}
          selectedKeys={[selectedKey]}
          items={navigationItems}
          onClick={handleMenuClick}
          className="!border-0 !bg-transparent [&.ant-menu-inline-collapsed]:!mx-auto [&.ant-menu-inline-collapsed]:!w-16 [&_.ant-menu-item]:!my-1 [&_.ant-menu-item]:!h-11 [&_.ant-menu-item]:!w-full [&_.ant-menu-item]:!rounded-xl [&_.ant-menu-item]:!font-semibold [&_.ant-menu-item]:!leading-[44px] [&_.ant-menu-item]:!text-slate-600 dark:[&_.ant-menu-item]:!text-slate-300 [&_.ant-menu-item-icon]:!min-w-5 [&_.ant-menu-item-selected]:!bg-emerald-100 dark:[&_.ant-menu-item-selected]:!bg-emerald-500/15 [&_.ant-menu-item-selected]:!text-emerald-700 dark:[&_.ant-menu-item-selected]:!text-emerald-400 [&_.ant-menu-item-selected]:after:!hidden [&_.ant-menu-item:hover]:!bg-emerald-50 dark:[&_.ant-menu-item:hover]:!bg-emerald-500/10 [&_.ant-menu-item:hover]:!text-emerald-600 dark:[&_.ant-menu-item:hover]:!text-emerald-400 [&_.ant-menu-sub]:!bg-transparent [&_.ant-menu-submenu-arrow]:!text-slate-400 dark:[&_.ant-menu-submenu-arrow]:!text-slate-500 [&_.ant-menu-submenu-title]:!my-1 [&_.ant-menu-submenu-title]:!h-11 [&_.ant-menu-submenu-title]:!w-full [&_.ant-menu-submenu-title]:!rounded-xl [&_.ant-menu-submenu-title]:!font-semibold [&_.ant-menu-submenu-title]:!leading-[44px] [&_.ant-menu-submenu-title]:!text-slate-600 dark:[&_.ant-menu-submenu-title]:!text-slate-300 [&_.ant-menu-submenu-title:hover]:!bg-emerald-50 dark:[&_.ant-menu-submenu-title:hover]:!bg-emerald-500/10 [&_.ant-menu-submenu-title:hover]:!text-emerald-600 dark:[&_.ant-menu-submenu-title:hover]:!text-emerald-400"
        />

        <div className="mt-auto border-t border-slate-200 pt-3 dark:border-slate-800">
          <Tooltip title={collapsed ? "Logout" : ""} placement="right">
            <button
              type="button"
              onClick={handleLogout}
              className={`flex h-11 w-full items-center rounded-xl text-sm font-semibold text-slate-600 transition hover:bg-red-50 hover:text-red-600 dark:text-slate-300 dark:hover:bg-red-500/10 dark:hover:text-red-400 ${
                collapsed ? "justify-center" : "gap-3 px-4"
              }`}
            >
              <RiLogoutBoxRLine size={20} className="shrink-0" />
              {!collapsed && <span>Logout</span>}
            </button>
          </Tooltip>
        </div>
      </div>
      </Sider>
    </>
  );
}
