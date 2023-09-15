import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LogoutIcon from "@mui/icons-material/Logout";
import { Link } from "react-router-dom";
import PeopleIcon from "@mui/icons-material/People";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import { styled } from "@mui/material/styles";

const MyListItem = styled(ListItem)(({ theme }) => ({
  borderRadius: "20px",
  "&:hover": {
    backgroundColor: theme.palette.primary.light,
  },
}));

const list = [
  {
    id: 0,
    icon: <DashboardIcon fontSize="large" />,
    text: "Dashboard",
    path: "/dashboard",
  },
  {
    id: 1,
    icon: <PersonAddAlt1Icon fontSize="large" />,
    text: "Add Land Inspector",
    path: "/addlandinspector",
  },
  {
    id: 2,
    icon: <PeopleIcon fontSize="large" />,
    text: "All Land Inspectors",
    path: "/alllandinspector",
  },
  {
    id: 3,
    icon: <SwapHorizIcon fontSize="large" />,
    text: "Modify Owner",
    path: "/changeAdmin",
  },
  {
    id: 4,
    icon: <LogoutIcon fontSize="large" />,
    text: "Logout",
    path: "/",
  },
];

const Menu = ({ open }) => {
  return (
    <List component="nav">
      {list.map((item) => {
        const { icon, text, path,id } = item;
        return (
          <Link
          key={id} // Use the unique `id` as the key prop
            to={path}
            style={{
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <MyListItem
              key={icon}
              disablePadding
              sx={{ display: "block" }}
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
                  }}
                >
                  {icon}
                </ListItemIcon>
                <ListItemText
                  primary={text}
                  sx={{ opacity: open ? 1 : 0, fontWeight: 600 }}
                />
              </ListItemButton>
            </MyListItem>
          </Link>
        );
      })}
      <Divider sx={{ my: 1 }} />
    </List>
  );
};

export default Menu;
