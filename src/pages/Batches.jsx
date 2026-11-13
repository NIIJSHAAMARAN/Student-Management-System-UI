import CrudPage from "../componets/CrudPage";
import { useAuth } from "../context/AuthContext";

const fmt = (v) => (v ? new Date(v).toLocaleDateString() : "");
const columns = [
  { field: "batchName", headerName: "Batch", flex: 1, minWidth: 160 },
  { field: "course", headerName: "Course", flex: 1, minWidth: 160, valueGetter: (v) => v?.title },
  { field: "trainer", headerName: "Trainer", width: 160, valueGetter: (v) => v?.name },
  { field: "startDate", headerName: "Start", width: 120, valueFormatter: fmt },
  { field: "endDate", headerName: "End", width: 120, valueFormatter: fmt },
  { field: "status", headerName: "Status", width: 110 },
];
const fields = [
  { name: "batchName", label: "Batch name", required: true },
  { name: "course", label: "Course", type: "select", optionsFrom: "/courses", optionLabel: (c) => c.title, required: true },
  // Needs GET /api/users?role=trainer on the backend
  { name: "trainer", label: "Trainer", type: "select", optionsFrom: "/users?role=trainer", optionLabel: (u) => u.name, required: true },
  { name: "startDate", label: "Start date", type: "date" },
  { name: "endDate", label: "End date", type: "date" },
  { name: "status", label: "Status", type: "select", options: ["Upcoming", "Active", "Completed"] },
];

export default function Batches() {
  const { isAdmin } = useAuth();
  return <CrudPage title="Batches" endpoint="/batches" columns={columns} fields={fields} canWrite={isAdmin} />;
}
