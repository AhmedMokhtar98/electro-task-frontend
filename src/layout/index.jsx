import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";

import Header from "./Header/Header";
import DashboardSidebar from "./sidebar/Sidebar";

const PageContainer = ({ children }) => {
  return (
    <section
      className="
        relative z-[1]
        mx-auto
        h-[calc(100vh-130px)]
        min-h-[calc(100vh-130px)]
        w-[96%]
        overflow-hidden
        rounded-[10px]
        bg-[var(--bg-secondary-color)]
        transition-colors duration-300
      "
    >
      <div
        className="
          h-full w-full
          overflow-x-hidden overflow-y-auto
          transition-all duration-300 ease-in-out
          [scrollbar-width:none]
          [-ms-overflow-style:none]
          [&::-webkit-scrollbar]:hidden
        "
      >
        {children}
      </div>
    </section>
  );
};

PageContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

const DashboardLayout = ({ children }) => {
  const { i18n } = useTranslation();

  const direction = i18n.dir(
    i18n.resolvedLanguage || i18n.language,
  );

  return (
    <div
      dir={direction}
      className="
        relative flex
        h-screen min-h-screen w-full
        overflow-hidden
        bg-slate-50 text-slate-900
        transition-colors duration-300
        dark:bg-slate-950 dark:text-slate-100
      "
    >
      <DashboardSidebar />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Header />

        <main className="min-h-0 flex-1 overflow-hidden">
          <PageContainer>{children}</PageContainer>
        </main>
      </div>
    </div>
  );
};

DashboardLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default DashboardLayout;