import CrudPage from "../componets/CrudPage";

const columns = [
  { field: "title", headerName: "Title", flex: 1, minWidth: 180 },
  { field: "durationMonths", headerName: "Months", width: 100, type: "number" },
  { field: "fee", headerName: "Fee", width: 120, type: "number" },
  { field: "status", headerName: "Status", width: 110 },
];
const fields = [
  { name: "title", label: "Title", required: true },
  { name: "description", label: "Description", multiline: true },
  { name: "durationMonths", label: "Duration (months)", type: "number", required: true },
  { name: "fee", label: "Fee", type: "number", required: true },
  { name: "status", label: "Status", type: "select", options: ["Active", "Inactive"] },
];

export default function Courses() {
  return <CrudPage title="Courses" endpoint="/courses" columns={columns} fields={fields} />;
}
