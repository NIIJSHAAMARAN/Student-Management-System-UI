import { useEffect, useState } from "react";
import { Alert, MenuItem, Paper, TextField, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import toast from "react-hot-toast";
import api, { toList, errMsg } from "../api/client";

const num = (...v) => Number(v.find((x) => x !== undefined && x !== null) ?? 0);
const idOf = (v) => (v && typeof v === "object" ? v._id : v);

// find the first array in the response, up to 2 levels deep
const findArray = (d) => {
  if (Array.isArray(d)) return d;
  if (d && typeof d === "object") {
    for (const v of Object.values(d)) if (Array.isArray(v)) return v;
    for (const v of Object.values(d))
      if (v && typeof v === "object") for (const w of Object.values(v)) if (Array.isArray(w)) return w;
  }
  return [];
};

// make any report row look the same
const normalize = (r, i) => {
  const present = num(r.presentCount, r.present, r.counts?.present);
  const absent = num(r.absentCount, r.absent, r.counts?.absent);
  const late = num(r.lateCount, r.late, r.counts?.late);
  const leave = num(r.leaveCount, r.leave, r.counts?.leave);
  const denom = present + absent + late;     // Leave excluded, as in your guide
  const pct = r.attendancePercentage ?? r.percentage ?? r.attendancePercent ?? r.percent ??
    (denom ? ((present + late) / denom) * 100 : 0);
  return {
    id: idOf(r.student) ?? r.studentId ?? r._id ?? i,
    name: r.student?.name ?? r.studentName ?? r.name ?? "(unknown)",
    present, late, absent, leave, pct: Number(pct),
  };
};

// fallback: build the report from raw attendance records
const fromRecords = (records) => {
  const by = {};
  records.forEach((rec) => {
    const id = idOf(rec.student);
    by[id] ??= { student: rec.student, present: 0, absent: 0, late: 0, leave: 0 };
    const key = String(rec.status).toLowerCase();
    if (key in by[id]) by[id][key] += 1;
  });
  return Object.values(by);
};

const columns = [
  { field: "name", headerName: "Student", flex: 1, minWidth: 180 },
  { field: "present", headerName: "Present", width: 100, type: "number" },
  { field: "late", headerName: "Late", width: 90, type: "number" },
  { field: "absent", headerName: "Absent", width: 100, type: "number" },
  { field: "leave", headerName: "Leave", width: 90, type: "number" },
  { field: "pct", headerName: "Attendance %", width: 150, type: "number",
    valueFormatter: (v) => `${Number(v ?? 0).toFixed(1)}%` },
];

export default function Reports() {
  const [batches, setBatches] = useState([]);
  const [batchId, setBatchId] = useState("");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [note, setNote] = useState("");

  useEffect(() => {
    api.get("/batches").then((r) => setBatches(toList(r))).catch((e) => toast.error(errMsg(e)));
  }, []);

  useEffect(() => {
    if (!batchId) return;
    (async () => {
      setLoading(true); setNote(""); setRows([]);
      try {
        // 1. the report endpoint
        const res = await api.get(`/attendance/batch/${batchId}`);
        console.log("REPORT RESPONSE →", res.data);
        let raw = findArray(res.data);

        // 2. fallback: raw attendance records
        if (!raw.length) {
          const att = await api.get("/attendance", { params: { batch: batchId } });
          console.log("ATTENDANCE RESPONSE →", att.data);
          raw = fromRecords(findArray(att.data));
          if (raw.length) setNote("The report endpoint returned no rows, so this was calculated from saved attendance records.");
        }
        setRows(raw.map(normalize));
      } catch (e) {
        console.log("REPORT FAILED →", e.config?.url, e.response?.status, e.response?.data || e.message);
        toast.error(errMsg(e));
      } finally { setLoading(false); }
    })();
  }, [batchId]);

  return (
    <>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>Batch attendance report</Typography>
      <TextField select label="Batch" value={batchId} onChange={(e) => setBatchId(e.target.value)}
        sx={{ minWidth: 260, mb: 2 }}>
        {batches.map((b) => <MenuItem key={b._id} value={b._id}>{b.batchName}</MenuItem>)}
      </TextField>

      {note && <Alert severity="info" sx={{ mb: 2 }}>{note}</Alert>}
      {batchId && !loading && rows.length === 0 && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          No attendance data came back for this batch. Open the browser console (F12) to see the raw response.
        </Alert>
      )}

      {batchId && (
        <Paper variant="outlined" sx={{ height: 480 }}>
          <DataGrid rows={rows} columns={columns} loading={loading}
            showToolbar disableRowSelectionOnClick sx={{ border: 0 }} />
        </Paper>
      )}
    </>
  );
}