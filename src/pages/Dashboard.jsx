import { useEffect, useState } from "react";
import { Paper, Typography } from "@mui/material";
import api, { toList } from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user, isAdmin } = useAuth();
  const [counts, setCounts] = useState({});

  useEffect(() => {
    const items = [["Students", "/students"], ["Batches", "/batches"], ...(isAdmin ? [["Courses", "/courses"]] : [])];
    items.forEach(async ([label, url]) => {
      try { const n = toList(await api.get(url)).length; setCounts((c) => ({ ...c, [label]: n })); }
      catch { setCounts((c) => ({ ...c, [label]: "–" })); }
    });
  }, [isAdmin]);

  return (
    <>
      <Typography variant="h5" className="mb-1 font-semibold">Welcome, {user.name}</Typography>
      <Typography color="text.secondary" className="mb-6">Here is what is in the system right now.</Typography>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {Object.entries(counts).map(([label, n]) => (
          <Paper key={label} variant="outlined" className="p-5">
            <Typography variant="h3" color="primary" className="font-semibold">{n}</Typography>
            <Typography color="text.secondary">{label}</Typography>
          </Paper>
        ))}
      </div>
    </>
  );
}
