import CrudPage from "../componets/CrudPage";
import { useAuth } from "../context/AuthContext";

const columns = [
  { field: "name", headerName: "Name", flex: 1, minWidth: 160 },
  { field: "email", headerName: "Email", flex: 1, minWidth: 200 },
  { field: "phone", headerName: "Phone", width: 140 },
  { field: "status", headerName: "Status", width: 110 },
];
const fields = [
  { name: "name", label: "Name", required: true },
  { name: "email", label: "Email", type: "email", required: true },
  { name: "phone", label: "Phone" },
  { name: "status", label: "Status", type: "select", options: ["Active", "Inactive"] },
];

export default function Students() {
  const { isAdmin } = useAuth();
  return <CrudPage title="Students" endpoint="/students" columns={columns} fields={fields} canWrite={isAdmin} />;
}
