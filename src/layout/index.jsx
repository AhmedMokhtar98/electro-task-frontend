import Header from "./Header/Header";
import DashboardSidebar from "./sidebar/Sidebar";

const PageContainer = ({ children }) => {
  return (
    <section
      className="
        relative z-[1]
        mx-auto
        h-full
        min-h-0
        w-[96%]
        overflow-hidden
        rounded-[10px]
        transition-colors duration-300
      "
    >
      <div
        className="
          h-full min-h-0 w-full
          overflow-x-hidden overflow-y-auto
          overscroll-y-contain touch-pan-y
          transition-all duration-300 ease-in-out
          pb-24 md:pb-0
          [-webkit-overflow-scrolling:touch]
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

const DashboardLayout = ({ children }) => {
  return (
    <div
      className="
        relative flex
        h-screen h-dvh min-h-0 w-full
        overflow-hidden
        bg-[linear-gradient(45deg,#9effa261,#00b0ff33)]
        transition-colors duration-300
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

export default DashboardLayout;
