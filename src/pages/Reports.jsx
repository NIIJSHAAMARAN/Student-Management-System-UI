import { useEffect, useState } from "react";
import { MenuItem, Paper, TextField, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import toast from "react-hot-toast";
import api, { toList, errMsg } from "../api/client";

const columns = [
  { field: "name", headerName: "Student", flex: 1, minWidth: 180, valueGetter: (_, r) => r.student?.name ?? r.studentName ?? "" },
  { field: "presentCount", headerName: "Present", width: 100, type: "number" },
  { field: "lateCount", headerName: "Late", width: 90, type: "number" },
  { field: "absentCount", headerName: "Absent", width: 100, type: "number" },
  { field: "leaveCount", headerName: "Leave", width: 90, type: "number" },
  { field: "attendancePercentage", headerName: "Attendance %", width: 140, type: "number",
    valueFormatter: (v) => (v == null ? "" : `${Number(v).toFixed(1)}%`) },
];

export default function Reports() {
  const [batches, setBatches] = useState([]);
  const [batchId, setBatchId] = useState("");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get("/batches").then((r) => setBatches(toList(r))).catch((e) => toast.error(errMsg(e)));
  }, []);

  useEffect(() => {
    if (!batchId) return;
    setLoading(true);
    api.get(`/attendance/batch/${batchId}`)
      .then((r) => setRows(toList(r)))
      .catch((e) => toast.error(errMsg(e)))
      .finally(() => setLoading(false));
  }, [batchId]);

  return (
    <>
      <Typography variant="h5" className="mb-4 font-semibold">Batch attendance report</Typography>
      <TextField select label="Batch" value={batchId} onChange={(e) => setBatchId(e.target.value)} sx={{ minWidth: 260, mb: 2 }}>
        {batches.map((b) => <MenuItem key={b._id} value={b._id}>{b.batchName}</MenuItem>)}
      </TextField>
      {batchId && (
        <Paper variant="outlined" sx={{ height: 480 }}>
          <DataGrid rows={rows} columns={columns} loading={loading}
            getRowId={(r) => r._id ?? r.student?._id ?? r.studentId}
            showToolbar disableRowSelectionOnClick sx={{ border: 0 }} />
        </Paper>
      )}
    </>
  );
}
