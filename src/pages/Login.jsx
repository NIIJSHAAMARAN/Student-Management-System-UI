import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Paper, TextField, Button, Typography } from "@mui/material";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { errMsg } from "../api/client";

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  if (user) return <Navigate to="/" replace />;

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try { await login(email, password); navigate("/"); }
    catch (err) { toast.error(errMsg(err)); }
    finally { setBusy(false); }
  };

  return (
    <div className="grid min-h-screen place-items-center bg-slate-100 p-4">
      <Paper component="form" onSubmit={submit} variant="outlined" className="w-full max-w-sm space-y-4 p-8">
        <div>
          <Typography variant="h5" className="font-semibold">Sign in</Typography>
          <Typography variant="body2" color="text.secondary">Student Management, Applet Logic</Typography>
        </div>
        <TextField fullWidth label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <TextField fullWidth label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <Button fullWidth type="submit" variant="contained" size="large" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</Button>
      </Paper>
    </div>
  );
}
