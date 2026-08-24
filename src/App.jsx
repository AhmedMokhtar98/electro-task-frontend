import { BrowserRouter as Router } from "react-router-dom";
import { ConfigProvider } from "antd";
import { ToastContainer } from "react-toastify";
import { ThemeProvider, useTheme, } from "./layout/themeColor/ThemeContext";
import AllRoutes from "./routes";

const ThemedApp = () => {
  const { antdTheme, themeMode } = useTheme();

  return (
    <ConfigProvider theme={antdTheme}>
      <ToastContainer
        theme={themeMode}
        position="top-right"
        newestOnTop
      />
      <AllRoutes />
    </ConfigProvider>
  );
};

const App = () => (
  <Router>
    <ThemeProvider>
      <ThemedApp />
    </ThemeProvider>
  </Router>
);

export default App;