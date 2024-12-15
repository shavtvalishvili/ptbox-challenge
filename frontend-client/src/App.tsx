import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./routes/Routes";
import { CssBaseline, ThemeProvider } from "@mui/material";
import theme from "./theme/theme";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./App.css";

const App = () => {
  const queryClient = new QueryClient();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline/>
      <QueryClientProvider client={queryClient}>
        <Router>
          <AppRoutes/>
        </Router>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;