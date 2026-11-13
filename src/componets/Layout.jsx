// import { useState } from "react";
// import { NavLink, Outlet, useNavigate } from "react-router-dom";
// import {
//   AppBar, Toolbar, IconButton, Typography, Drawer, List, ListItemButton,
//   ListItemIcon, ListItemText, Button, Chip, Box,
// } from "@mui/material";
// import MenuIcon from "@mui/icons-material/Menu";
// import DashboardIcon from "@mui/icons-material/SpaceDashboard";
// import PeopleIcon from "@mui/icons-material/People";
// import MenuBookIcon from "@mui/icons-material/MenuBook";
// import GroupsIcon from "@mui/icons-material/Groups";
// import EventAvailableIcon from "@mui/icons-material/EventAvailable";
// import AssessmentIcon from "@mui/icons-material/Assessment";
// import { useAuth } from "../context/AuthContext";

// const WIDTH = 230;
// const NAV = [
//   { to: "/", label: "Dashboard", icon: <DashboardIcon />, end: true },
//   { to: "/students", label: "Students", icon: <PeopleIcon /> },
//   { to: "/courses", label: "Courses", icon: <MenuBookIcon />, roles: ["admin"] },
//   { to: "/batches", label: "Batches", icon: <GroupsIcon /> },
//   { to: "/attendance", label: "Attendance", icon: <EventAvailableIcon /> },
//   { to: "/reports", label: "Reports", icon: <AssessmentIcon /> },
// ];

// export default function Layout() {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();
//   const [open, setOpen] = useState(false);

//   const menu = (
//     <List className="pt-4">
//       {NAV.filter((n) => !n.roles || n.roles.includes(user.role)).map((n) => (
//         <ListItemButton key={n.to} component={NavLink} to={n.to} end={n.end}
//           onClick={() => setOpen(false)}
//           sx={{ "&.active": { bgcolor: "primary.main", color: "#fff", "& .MuiListItemIcon-root": { color: "#fff" } }, mx: 1, borderRadius: 2, mb: 0.5 }}>
//           <ListItemIcon sx={{ minWidth: 40 }}>{n.icon}</ListItemIcon>
//           <ListItemText primary={n.label} />
//         </ListItemButton>
//       ))}
//     </List>
//   );

//   return (
//     <Box className="min-h-screen">
//       <AppBar position="fixed" elevation={0} sx={{ zIndex: (t) => t.zIndex.drawer + 1 }}>
//         <Toolbar>
//           <IconButton color="inherit" edge="start" onClick={() => setOpen(true)} sx={{ mr: 1, display: { md: "none" } }}>
//             <MenuIcon />
//           </IconButton>
//           <Typography variant="h6" className="grow font-semibold">Applet Logic</Typography>
//           <Chip label={user.role} size="small" sx={{ mr: 2, color: "#fff", bgcolor: "rgba(255,255,255,.18)" }} />
//           <span className="mr-3 hidden sm:inline">{user.name}</span>
//           <Button color="inherit" onClick={() => { logout(); navigate("/login"); }}>Log out</Button>
//         </Toolbar>
//       </AppBar>

//       <Drawer variant="permanent" sx={{ display: { xs: "none", md: "block" }, "& .MuiDrawer-paper": { width: WIDTH } }}>
//         <Toolbar />{menu}
//       </Drawer>
//       <Drawer open={open} onClose={() => setOpen(false)} sx={{ display: { md: "none" }, "& .MuiDrawer-paper": { width: WIDTH } }}>
//         <Toolbar />{menu}
//       </Drawer>

//       <Box component="main" sx={{ ml: { md: `${WIDTH}px` } }} className="p-4 pt-24 md:p-8 md:pt-24">
//         <Outlet />
//       </Box>
//     </Box>
//   );
// }
import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  AppBar, Toolbar, IconButton, Typography, Drawer, List, ListItemButton,
  ListItemIcon, ListItemText, Button, Chip, Box,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/SpaceDashboard";
import PeopleIcon from "@mui/icons-material/People";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import GroupsIcon from "@mui/icons-material/Groups";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import AssessmentIcon from "@mui/icons-material/Assessment";
import BadgeIcon from "@mui/icons-material/Badge";
import LogoutIcon from "@mui/icons-material/Logout";
import { useAuth } from "../context/AuthContext";

const WIDTH = 230;
const NAV = [
  { to: "/", label: "Dashboard", icon: <DashboardIcon />, end: true },
  { to: "/students", label: "Students", icon: <PeopleIcon /> },
  { to: "/courses", label: "Courses", icon: <MenuBookIcon />, roles: ["admin"] },
  { to: "/trainers", label: "Trainers", icon: <BadgeIcon />, roles: ["admin"] },
  { to: "/batches", label: "Batches", icon: <GroupsIcon /> },
  { to: "/attendance", label: "Attendance", icon: <EventAvailableIcon /> },
  { to: "/reports", label: "Reports", icon: <AssessmentIcon /> },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const menu = (
    <List sx={{ pt: 2 }}>
      {NAV.filter((n) => !n.roles || n.roles.includes(user.role)).map((n) => (
        <ListItemButton
          key={n.to} component={NavLink} to={n.to} end={n.end} onClick={() => setOpen(false)}
          sx={{
            mx: 1, mb: 0.5, borderRadius: 2,
            "&.active": { bgcolor: "primary.main", color: "#fff", "& .MuiListItemIcon-root": { color: "#fff" } },
            "&.active:hover": { bgcolor: "primary.dark" },
          }}>
          <ListItemIcon sx={{ minWidth: 40 }}>{n.icon}</ListItemIcon>
          <ListItemText primary={n.label} />
        </ListItemButton>
      ))}
    </List>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <AppBar position="fixed" elevation={0} sx={{ zIndex: (t) => t.zIndex.drawer + 1 }}>
        <Toolbar sx={{ gap: 1 }}>
          <IconButton color="inherit" edge="start" onClick={() => setOpen(true)} sx={{ display: { md: "none" } }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap sx={{ fontWeight: 600 }}>Student Management System </Typography>

          <Box sx={{ flexGrow: 1 }} />   {/* pushes everything after it to the right */}

          <Typography noWrap sx={{ display: { xs: "none", sm: "block" } }}>{user.name}</Typography>
          <Chip label={user.role} size="small" sx={{ color: "#fff", bgcolor: "rgba(255,255,255,.2)" }} />
          <Button color="inherit" startIcon={<LogoutIcon />}
            onClick={() => { logout(); navigate("/login"); }}>
            Log out
          </Button>
        </Toolbar>
      </AppBar>

      <Drawer variant="permanent"
        sx={{ display: { xs: "none", md: "block" }, width: WIDTH, flexShrink: 0,
              "& .MuiDrawer-paper": { width: WIDTH, boxSizing: "border-box" } }}>
        <Toolbar />{menu}
      </Drawer>
      <Drawer open={open} onClose={() => setOpen(false)}
        sx={{ display: { md: "none" }, "& .MuiDrawer-paper": { width: WIDTH } }}>
        <Toolbar />{menu}
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, minWidth: 0, p: { xs: 2, md: 4 } }}>
        <Toolbar />   {/* spacer = exactly the header height, so nothing hides underneath */}
        <Outlet />
      </Box>
    </Box>
  );
}