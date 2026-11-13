import { createTheme } from "@mui/material/styles";

export default createTheme({
  palette: {
    primary: { main: "#0f5c63" },
    secondary: { main: "#b4532a" },
    background: { default: "#f4f6f8" },
  },
  shape: { borderRadius: 8 },
  typography: { fontFamily: '"Inter", "Segoe UI", system-ui, sans-serif', button: { textTransform: "none" } },
});
