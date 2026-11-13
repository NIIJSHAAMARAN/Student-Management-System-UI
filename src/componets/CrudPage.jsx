import { useEffect, useState, useCallback } from "react";
import {
  Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem,
  Typography, Paper, Stack,
} from "@mui/material";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import dayjs from "dayjs";
import toast from "react-hot-toast";
import api, { toList, errMsg } from "../api/client";

/**
 * Reusable list + create/edit/delete screen.
 * fields: [{ name, label, type: text|number|date|select, required, options | optionsFrom + optionLabel }]
 */
export default function CrudPage({ title, endpoint, columns, fields, canWrite = true }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({});
  const [options, setOptions] = useState({});
  const [saving, setSaving] = useState(false);
  const single = title.replace(/s$/, "").toLowerCase();

  const load = useCallback(async () => {
    setLoading(true);
    try { setRows(toList(await api.get(endpoint))); }
    catch (e) { toast.error(errMsg(e)); }
    finally { setLoading(false); }
  }, [endpoint]);

  useEffect(() => {
    load();
    fields.filter((f) => f.optionsFrom).forEach(async (f) => {
      try {
        const list = toList(await api.get(f.optionsFrom));
        setOptions((o) => ({ ...o, [f.name]: list }));
      } catch (e) { toast.error(errMsg(e)); }
    });
  }, [load]); // eslint-disable-line

  const openForm = (row) => {
    const next = {};
    fields.forEach((f) => {
      let v = row?.[f.name];
      if (v && typeof v === "object" && v._id) v = v._id;   // populated reference -> id
      if (f.type === "date") v = v ? dayjs(v) : null;
      next[f.name] = v ?? (f.type === "date" ? null : "");
    });
    setForm(next);
    setEditId(row?._id ?? null);
    setOpen(true);
  };

  const save = async () => {
    const payload = {};
    for (const f of fields) {
      const v = form[f.name];
      if (f.required && (v === "" || v == null)) return toast.error(`${f.label} is required`);
      if (v === "" || v == null) continue;
      payload[f.name] = f.type === "number" ? Number(v) : f.type === "date" ? v.toISOString() : v;
    }
    setSaving(true);
    try {
      if (editId) await api.put(`${endpoint}/${editId}`, payload);
      else await api.post(endpoint, payload);
      toast.success(editId ? "Changes saved" : "Created");
      setOpen(false);
      load();
    } catch (e) { toast.error(errMsg(e)); }
    finally { setSaving(false); }
  };

  const remove = async (row) => {
    if (!window.confirm("Delete this record? This cannot be undone.")) return;
    try { await api.delete(`${endpoint}/${row._id}`); toast.success("Deleted"); load(); }
    catch (e) { toast.error(errMsg(e)); }
  };

  const cols = canWrite
    ? [...columns, {
        field: "actions", type: "actions", headerName: "", width: 90,
        getActions: ({ row }) => [
          <GridActionsCellItem key="e" icon={<EditIcon />} label="Edit" onClick={() => openForm(row)} />,
          <GridActionsCellItem key="d" icon={<DeleteIcon />} label="Delete" onClick={() => remove(row)} />,
        ],
      }]
    : columns;

  return (
    <>
      <Stack direction="row" className="mb-4 items-center justify-between">
        <Typography variant="h5" className="font-semibold">{title}</Typography>
        {canWrite && <Button variant="contained" startIcon={<AddIcon />} onClick={() => openForm(null)}>Add {single}</Button>}
      </Stack>

      <Paper variant="outlined" sx={{ height: 560 }}>
        <DataGrid rows={rows} columns={cols} loading={loading} getRowId={(r) => r._id}
          showToolbar pageSizeOptions={[10, 25, 50]}
          initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
          disableRowSelectionOnClick sx={{ border: 0 }} />
      </Paper>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>{editId ? "Edit" : "New"} {single}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} className="pt-2">
            {fields.map((f) =>
              f.type === "date" ? (
                <DatePicker key={f.name} label={f.label} value={form[f.name]}
                  onChange={(v) => setForm({ ...form, [f.name]: v })} />
              ) : f.type === "select" ? (
                <TextField key={f.name} select label={f.label} value={form[f.name] ?? ""}
                  onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}>
                  {(f.options ? f.options.map((o) => ({ value: o, label: o }))
                    : (options[f.name] || []).map((o) => ({ value: o._id, label: f.optionLabel(o) }))
                  ).map((o) => <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>)}
                </TextField>
              ) : (
                <TextField key={f.name} label={f.label} type={f.type || "text"} value={form[f.name] ?? ""}
                  multiline={f.multiline} onChange={(e) => setForm({ ...form, [f.name]: e.target.value })} />
              )
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={save} disabled={saving}>{saving ? "Saving…" : "Save"}</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
