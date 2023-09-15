import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";

import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LandscapeIcon from "@mui/icons-material/Landscape";
import LockIcon from "@mui/icons-material/Lock";
import TransferWithinAStationIcon from "@mui/icons-material/TransferWithinAStation";
import LogoutIcon from "@mui/icons-material/Logout";
import { Link } from "react-router-dom";

const list = [
  {
    id: 0,
    icon: <DashboardIcon />,
    text: "Dashboard",
    path: "/Inspector-dashboard",
  },
  {
    id: 1,

    icon: <LockIcon />,
    text: "Verify User",
    path: "/verifyuser",
  },

  {
    id: 2,

    icon: <LandscapeIcon />,
    text: "Verify Land",
    path: "/verifyland",
  },
  {
    id: 3,

    icon: <TransferWithinAStationIcon />,
    text: "Transfer Ownership",
    path: "/transferownership",
  },
  {
    id: 4,

    icon: <LogoutIcon />,
    text: "Logout",
    path: "/",
  },
];

const Menu = ({ open }) => {
  return (
    <List component="nav" sx={{ backgroundColor: "#f5f5f5" }}>
      {list.map((item) => {
        const { icon, text, id, path } = item;
        return (
          <Link
          key={id} // Add a unique "key" prop here
            to={path}
            style={{
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <ListItem
              key={id}
              disablePadding
              sx={{ display: "block", "&:hover": { backgroundColor: "#e0e0e0" } }}
            >
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                    color: "#777777",
                  }}
                >
                  {icon}
                </ListItemIcon>
                <ListItemText primary={text} sx={{ opacity: open ? 1 : 0, color: "#333333" }} />
              </ListItemButton>
            </ListItem>
          </Link>
        );
      })}

      <Divider sx={{ my: 1 }} />
    </List>
  );
};

export default Menu;
