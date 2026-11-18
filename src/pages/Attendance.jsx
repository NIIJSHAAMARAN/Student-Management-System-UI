import { useCallback, useEffect, useState } from "react";
import {
  Alert, Button, MenuItem, Paper, Stack, TextField, ToggleButton,
  ToggleButtonGroup, Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import toast from "react-hot-toast";
import api, { toList, errMsg } from "../api/client";

const STATUSES = ["Present", "Absent", "Late", "Leave"];
const idOf = (v) => (v && typeof v === "object" ? v._id : v);
const unwrap = (r) => r.data?.batch ?? r.data?.data ?? r.data;

export default function Attendance() {
  const [batches, setBatches] = useState([]);
  const [batchId, setBatchId] = useState("");
  const [date, setDate] = useState(dayjs());
  const [students, setStudents] = useState([]);
  const [existing, setExisting] = useState({});   // studentId -> saved attendance record
  const [marks, setMarks] = useState({});         // studentId -> status shown on screen
  const [saving, setSaving] = useState(false);

  const day = date?.isValid() ? date.format("YYYY-MM-DD") : null;

  // 1. batches for the dropdown
  useEffect(() => {
    api.get("/batches")
      .then((r) => setBatches(toList(r)))
      .catch((e) => toast.error(errMsg(e)));
  }, []);

  // 2. students of the selected batch
  useEffect(() => {
    if (!batchId) { setStudents([]); return; }
    (async () => {
      try {
        const batch = unwrap(await api.get(`/batches/${batchId}`));
        let list = batch?.students ?? [];
        if (list.length && typeof list[0] === "string") {
          // students came back as plain IDs, so look up their names
          const all = toList(await api.get("/students"));
          list = all.filter((s) => list.includes(s._id));
        }
        setStudents(list);
      } catch (e) { toast.error(errMsg(e)); setStudents([]); }
    })();
  }, [batchId]);

  // 3. attendance already saved for this batch + date
  const loadExisting = useCallback(async () => {
    if (!batchId || !day) { setExisting({}); return; }
    try {
      const res = await api.get("/attendance", { params: { batch: batchId, date: day } });
      const recs = toList(res).filter(
        (r) =>
          (!r.batch || idOf(r.batch) === batchId) &&
          (!r.date || dayjs(r.date).format("YYYY-MM-DD") === day)
      );
      setExisting(Object.fromEntries(recs.map((r) => [idOf(r.student), r])));
    } catch { setExisting({}); }
  }, [batchId, day]);

  useEffect(() => { loadExisting(); }, [loadExisting]);

  // 4. what the toggles show: saved status if it exists, otherwise Present
  useEffect(() => {
    setMarks(Object.fromEntries(
      students.map((s) => [s._id, existing[s._id]?.status ?? "Present"])
    ));
  }, [students, existing]);

  const alreadyMarked = Object.keys(existing).length > 0;

  const submit = async () => {
  if (!day) return toast.error("Choose a valid date");
  const toCreate = [];
  const toUpdate = [];
  Object.entries(marks).forEach(([student, status]) => {
    const rec = existing[student];
    if (!rec) toCreate.push({ student, status });
    else if (rec.status !== status) toUpdate.push({ id: rec._id, status });
  });
  if (!toCreate.length && !toUpdate.length) return toast("Nothing has changed");

  setSaving(true);
  try {
    if (toCreate.length) {
      const list = toCreate.map((r) => ({ student: r.student, studentId: r.student, status: r.status }));
      const body = { batch: batchId, batchId, date: day, records: list, attendance: list };
      console.log("MARK REQUEST →", JSON.stringify(body, null, 2));
      try {
        const res = await api.post("/attendance/mark", body);
        console.log("MARK RESPONSE →", res.status, res.data);
      } catch (e) {
        console.log("MARK FAILED →", e.response?.status, e.response?.data);
        throw e;
      }
    }
    await Promise.all(toUpdate.map((u) => api.put(`/attendance/${u.id}`, { status: u.status })));
    toast.success("Attendance saved");
    loadExisting();
  } catch (e) { toast.error(errMsg(e)); }
  finally { setSaving(false); }

  };

  return (
    <>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>Attendance</Typography>

      <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ mb: 2 }}>
        <TextField select label="Batch" value={batchId}
          onChange={(e) => setBatchId(e.target.value)} sx={{ minWidth: 260 }}>
          {batches.map((b) => <MenuItem key={b._id} value={b._id}>{b.batchName}</MenuItem>)}
        </TextField>
        <DatePicker label="Date" value={date} onChange={setDate} disableFuture />
      </Stack>

      {batchId && alreadyMarked && (
        <Alert severity="info" sx={{ mb: 2 }}>
          Attendance is already saved for this date. Changing a status will update it.
        </Alert>
      )}

      {batchId && (
        <Paper variant="outlined">
          {students.length === 0 && (
            <Typography sx={{ p: 2 }} color="text.secondary">
              No students found in this batch.
            </Typography>
          )}
          {students.map((s) => (
            <Stack key={s._id} direction="row" spacing={2} useFlexGap
              sx={{ p: 1.5, flexWrap: "wrap", alignItems: "center", justifyContent: "space-between",
                    borderBottom: 1, borderColor: "divider" }}>
              <Typography sx={{ fontWeight: 500 }}>{s.name}</Typography>
              <ToggleButtonGroup size="small" exclusive color="primary" value={marks[s._id] ?? null}
                onChange={(_, v) => v && setMarks({ ...marks, [s._id]: v })}>
                {STATUSES.map((st) => <ToggleButton key={st} value={st}>{st}</ToggleButton>)}
              </ToggleButtonGroup>
            </Stack>
          ))}
          {students.length > 0 && (
            <Stack direction="row" sx={{ p: 1.5, justifyContent: "flex-end" }}>
              <Button variant="contained" onClick={submit} disabled={saving}>
                {saving ? "Saving…" : alreadyMarked ? "Update attendance" : "Save attendance"}
              </Button>
            </Stack>
          )}
        </Paper>
      )}
    </>
  );
}