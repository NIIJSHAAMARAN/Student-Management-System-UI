// // import CrudPage from "../componets/CrudPage";
// // import { useAuth } from "../context/AuthContext";

// // const fmt = (v) => (v ? new Date(v).toLocaleDateString() : "");
// // const columns = [
// //   { field: "batchName", headerName: "Batch", flex: 1, minWidth: 160 },
// //   { field: "course", headerName: "Course", flex: 1, minWidth: 160, valueGetter: (v) => v?.title },
//   // { field: "trainer", headerName: "Trainer", width: 160, valueGetter: (v) => v?.name },
// //   { field: "startDate", headerName: "Start", width: 120, valueFormatter: fmt },
// //   { field: "endDate", headerName: "End", width: 120, valueFormatter: fmt },
// //   { field: "status", headerName: "Status", width: 110 },
// // ];
// // const fields = [
// //   { name: "batchName", label: "Batch name", required: true },
// //   { name: "course", label: "Course", type: "select", optionsFrom: "/courses", optionLabel: (c) => c.title, required: true },
// //   // Needs GET /api/users?role=trainer on the backend
// //   { name: "trainer", label: "Trainer", type: "select", optionsFrom: "/users?role=trainer", optionLabel: (u) => u.name, required: true },
// //   { name: "startDate", label: "Start date", type: "date" },
// //   { name: "endDate", label: "End date", type: "date" },
// //   { name: "status", label: "Status", type: "select", options: ["Upcoming", "Active", "Completed"] },
// // ];

// // export default function Batches() {
// //   const { isAdmin } = useAuth();
// //   return <CrudPage title="Batches" endpoint="/batches" columns={columns} fields={fields} canWrite={isAdmin} />;
// // }
// import CrudPage from "../componets/CrudPage";
// import { useAuth } from "../context/AuthContext";

// const idOf = (v) => (v && typeof v === "object" ? v._id : v);
// const fmt = (v) => (v ? new Date(v).toLocaleDateString() : "");

// const columns = [
//   { field: "batchName", headerName: "Batch", flex: 1, minWidth: 160 },
//   { field: "course", headerName: "Course", flex: 1, minWidth: 160, valueGetter: (v) => v?.title },
//   // { field: "trainer", headerName: "Trainer", width: 160, valueGetter: (v) => v?.name },
// { name: "trainer", headerName: "Trainer",label: "Trainer", type: "select", optionsFrom: "/users?role=trainer",
//   optionLabel: (u) => u.name, required: true },
//   { name: "students", headerName: "Students", label: "Students", type: "select", multiple: true,
//   optionsFrom: "/students", optionLabel: (s) => s.name },  { field: "startDate", headerName: "Start", width: 120, valueFormatter: fmt },
//   { field: "endDate", headerName: "End", width: 120, valueFormatter: fmt },
//   { field: "status", headerName: "Status", width: 120 },
// ];

// const fields = [
//   { name: "batchName", label: "Batch name", required: true },
//   { name: "course", label: "Course", type: "select", optionsFrom: "/courses",
//     optionLabel: (c) => c.title, required: true },
//   { name: "trainer", label: "Trainer", type: "select", optionsFrom: "/trainers",
//     optionLabel: (u) => u.name, required: true },
//   {
//     name: "students", label: "Students in this batch", type: "select", multiple: true,
//     optionsFrom: "/students",
//     optionLabel: (s) => `${s.name} (${s.email})`,
//     dependsOn: "course", dependsLabel: "course",
//     filter: (s, form) => idOf(s.course) === form.course,
//     emptyText: "No students are enrolled in this course yet. Assign the course on the Students page.",
//   },
//   { name: "startDate", label: "Start date", type: "date", required: true },
//   { name: "endDate", label: "End date", type: "date", required: true },
//   { name: "status", label: "Status", type: "select",
//     options: ["Upcoming", "Ongoing", "Completed", "Cancelled"] },
// ];

// export default function Batches() {
//   const { isAdmin } = useAuth();
//   return (
//     <CrudPage title="Batches" singular="Batch" endpoint="/batches"
//       columns={columns} fields={fields} canWrite={isAdmin} />
//   );
// }
import CrudPage from "../componets/CrudPage";   // keep this exactly as your real folder name
import { useAuth } from "../context/AuthContext";

const fmt = (v) => (v ? new Date(v).toLocaleDateString() : "");

// COLUMNS: what the table shows (these use "field")
const columns = [
  { field: "batchName", headerName: "Batch", flex: 1, minWidth: 160 },
  { field: "course", headerName: "Course", flex: 1, minWidth: 160, valueGetter: (v) => v?.title ?? "" },
  { field: "trainer", headerName: "Trainer", width: 160, valueGetter: (v) => v?.name ?? "" },
  { field: "students", headerName: "Students", flex: 1, minWidth: 220,
    valueGetter: (v) => (v ?? []).map((s) => s.name).join(", ") },
  { field: "startDate", headerName: "Start", width: 120, valueFormatter: fmt },
  { field: "endDate", headerName: "End", width: 120, valueFormatter: fmt },
  { field: "status", headerName: "Status", width: 120 },
];

// FIELDS: what the Add/Edit form asks for (these use "name")
const fields = [
  { name: "batchName", label: "Batch name", required: true },
  { name: "course", label: "Course", type: "select", optionsFrom: "/courses",
    optionLabel: (c) => c.title, required: true },
  { name: "trainer", label: "Trainer", type: "select", optionsFrom: "/users?role=trainer",
    optionLabel: (u) => u.name, required: true },
  { name: "students", label: "Students", type: "select", multiple: true,
    optionsFrom: "/students", optionLabel: (s) => s.name },
  { name: "startDate", label: "Start date", type: "date", required: true },
  { name: "endDate", label: "End date", type: "date", required: true },
  { name: "status", label: "Status", type: "select",
    options: ["Upcoming", "Ongoing", "Completed", "Cancelled"] },
];

export default function Batches() {
  const { isAdmin } = useAuth();
  return (
    <CrudPage title="Batches" singular="Batch" endpoint="/batches"
      columns={columns} fields={fields} canWrite={isAdmin} />
  );
}