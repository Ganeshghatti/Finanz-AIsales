import * as React from "react";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CallSharpIcon from '@mui/icons-material/CallSharp';
import PeopleIcon from "@mui/icons-material/People";
import BarChartIcon from "@mui/icons-material/BarChart";
import LayersIcon from "@mui/icons-material/Layers";
import AssignmentIcon from "@mui/icons-material/Assignment";
import { Link } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";
import { useDispatch } from "react-redux";
import { logout } from "../../features/Admin";
import CategoryIcon from "@mui/icons-material/Category";
import SettingsIcon from "@mui/icons-material/Settings";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import DeleteIcon from "@mui/icons-material/Delete";
import QuizIcon from "@mui/icons-material/Quiz";
import AddIcCallIcon from "@mui/icons-material/AddIcCall";
import CallIcon from "@mui/icons-material/Call";

const LogoutButton = () => {
  const dispatch = useDispatch();

  const logoutf = async () => {
    try {
      dispatch(logout());
      localStorage.clear();
      window.location.href = "/";
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <ListItemButton
      onClick={logoutf}
      className="mt-10 border-2 border-solid border-black bg-black"
    >
      <ListItemIcon>
        <LogoutIcon />
      </ListItemIcon>
      <ListItemText primary="Logout" />
    </ListItemButton>
  );
};
export const mainListItems = (
  <React.Fragment>
    <Link to="/single-call">
      <ListItemButton>
        <ListItemIcon>
          <CallSharpIcon/>
        </ListItemIcon>
        <ListItemText primary="Single Call" />
      </ListItemButton>
    </Link>
    <Link to="/bulk-call">
      <ListItemButton>
        <ListItemIcon>
          <AddIcCallIcon />
        </ListItemIcon>
        <ListItemText primary="Bulk Call" />
      </ListItemButton>
    </Link>
    <Link to="/call-log">
      <ListItemButton>
        <ListItemIcon>
          <CallIcon />
        </ListItemIcon>
        <ListItemText primary="Call Logs" />
      </ListItemButton>
    </Link>
    
  </React.Fragment>
);

export const secondaryListItems = (
  <React.Fragment>
    <Link to="/settings">
      <ListItemButton className="mt-18">
        <ListItemIcon>
          <SettingsIcon />
        </ListItemIcon>
        <ListItemText primary="Settings" />
      </ListItemButton>
    </Link>

    <LogoutButton />
  </React.Fragment>
);
