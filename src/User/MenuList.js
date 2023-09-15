import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import LogoutIcon from "@mui/icons-material/Logout";
import AddBoxIcon from "@mui/icons-material/AddBox";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";
import { Link } from "react-router-dom";
import PersonIcon from "@mui/icons-material/Person";
import LandscapeIcon from "@mui/icons-material/Landscape";
import DomainIcon from "@mui/icons-material/Domain";
const list = [
  {
    id: 0,
    icon: <PersonIcon />,
    text: "My Profile",
    path: "/user-dashboard",
  },
  {
    id: 1,
    icon: <LandscapeIcon />,
    text: "Lands For Sale",
    path: "/landgallery",
  },
  {
    id: 2,

    icon: <DomainIcon />,
    text: "My Land",
    path: "/myLand",
  },
  {
    id: 3,
    icon: <AddBoxIcon />,
    text: "Add Land",
    path: "/addland",
  },
  {
    id: 3,
    icon: <MonetizationOnIcon />,
    text: "Sent Requests ",
    path: "/myBuyRequest",
  },
  {
    id: 4,
    icon: <ShoppingBasketIcon />,
    text: "Received Requests ",
    path: "/recivedrequest",
  },
  {
    id: 7,
    icon: <LogoutIcon />,
    text: "Logout",
    path: "/",
  },
];
const Menu = ({ open }) => {

  
  return (
    <List component="nav">
      {list.map((item) => {
        const { icon, text, id, path } = item;
        return (
          <Link
            to={path}
            style={{
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <ListItem key={id} disablePadding sx={{ display: "block" }}>
              <ListItemButton
                sx={{
                  minHeight: 18,
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
                  sx={{ opacity: open ? 1 : 0, margin: -0.5 }}
                />
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
