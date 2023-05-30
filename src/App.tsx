import "./App.css";
import Daily from "./components/Daily";
import User from "./components/User";
import Random from "./components/Random";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#ffa726",
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <User />
      <Daily />
      <Random />
    </ThemeProvider>
  );
}

export default App;
