import * as React from "react";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import useUserStore from "../stores/useUserStore";
import { MenuItem } from "@mui/material";
import { Link, useLocation } from "react-router";
import BarChartIcon from "@mui/icons-material/BarChart";
import TimerIcon from "@mui/icons-material/Timer";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import ShieldIcon from "@mui/icons-material/Shield";
import SettingsIcon from "@mui/icons-material/Settings";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import logoRabesa from "../assets/img/logo_rabesa.jpg";
import "@fontsource/open-sans";
import "@fontsource/lexend";
import { apiUrl } from "../config";
import { Icon } from "@iconify-icon/react";

const drawerWidth = 240;

function Menu(props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isClosing, setIsClosing] = React.useState(false);
  const { user } = useUserStore();
  const location = useLocation();
  const [datosUsuario, setDatosUsuario] = React.useState([]);

  let entrenador = false;

  if (user.rol == "Entrenador") {
    entrenador = true;
  }

  console.log(user);

  React.useEffect(() => {
    async function getEntrenadorByIdUsuario() {
      let response = await fetch(
        apiUrl + "/entrenadores/datos/" + user.idusuario,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (response.ok) {
        let data = await response.json();
        setDatosUsuario(data.datos);
        console.log(data.datos);
      }
    }

    async function getJugadoraByIdUsuario() {
      let response = await fetch(
        apiUrl + "/jugadoras/datos/" + user.idusuario,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (response.ok) {
        let data = await response.json();
        setDatosUsuario(data.datos);
        console.log(data.datos);
      }
    }

    if (entrenador) {
      getEntrenadorByIdUsuario();
    } else {
      getJugadoraByIdUsuario();
    }
  }, []);

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };

  const drawer = (
    <section style={{ height: "100%", backgroundColor: "#ffffff" }}>
      <div
        className="menu_titulo"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "start",
          margin: "1rem",
          gap: "0.5rem",
        }}
      >
        <img src={logoRabesa} style={{ width: "3rem" }}></img>
        <h4 style={{ fontFamily: "'Lexend'" }}>Rabesa Fem</h4>
      </div>
      <MenuItem
        style={{
          margin: "0.5rem",
          paddingLeft: "0.5rem",
          borderRadius: "10px",
          backgroundColor: location.pathname.includes("dashboard")
            ? "#AACBFF"
            : "transparent",
        }}
      >
        <Link to="dashboard">
          <ListItemIcon
            style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
          >
            <BarChartIcon sx={{ color: "#00338e" }}></BarChartIcon>
            <Typography
              style={{
                color: "#00338e",
                fontWeight: "600",
                fontFamily: "'Open sans'",
              }}
            >
              Dashboard
            </Typography>
          </ListItemIcon>
        </Link>
      </MenuItem>
      <MenuItem
        style={{
          margin: "0.5rem",
          paddingLeft: "0.5rem",
          borderRadius: "10px",
          backgroundColor: location.pathname.includes("training")
            ? "#AACBFF"
            : "transparent",
        }}
      >
        <Link to="training">
          <ListItemIcon
            style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
          >
            <TimerIcon sx={{ color: "#00338e" }}></TimerIcon>
            <Typography
              style={{
                color: "#00338e",
                fontWeight: "600",
                fontFamily: "'Open sans'",
              }}
            >
              Entrenamientos
            </Typography>
          </ListItemIcon>
        </Link>
      </MenuItem>
      <MenuItem
        style={{
          margin: "0.5rem",
          paddingLeft: "0.5rem",
          borderRadius: "10px",
          backgroundColor: location.pathname.includes("partidos")
            ? "#AACBFF"
            : "transparent",
        }}
      >
        <Link to="partidos">
          <ListItemIcon
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              color: "#00338e",
            }}
          >
            <iconify-icon
              icon="famicons:football-sharp"
              width="26"
              height="26"
            ></iconify-icon>
            {/* <SportsSoccerIcon sx={{ color: "#00338e" }}></SportsSoccerIcon> */}
            <Typography
              style={{
                color: "#00338e",
                fontWeight: "600",
                fontFamily: "'Open sans'",
              }}
            >
              Partidos
            </Typography>
          </ListItemIcon>
        </Link>
      </MenuItem>
      <MenuItem
        style={{
          margin: "0.5rem",
          paddingLeft: "0.5rem",
          borderRadius: "10px",
          backgroundColor: location.pathname.includes("team")
            ? "#AACBFF"
            : "transparent",
        }}
      >
        <Link to="team">
          <ListItemIcon
            style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
          >
            <ShieldIcon sx={{ color: "#00338e" }}></ShieldIcon>
            <Typography
              style={{
                color: "#00338e",
                fontWeight: "600",
                fontFamily: "'Open sans'",
              }}
            >
              Equipo
            </Typography>
          </ListItemIcon>
        </Link>
      </MenuItem>
      <MenuItem
        style={{
          margin: "0.5rem",
          paddingLeft: "0.5rem",
          borderRadius: "10px",
          backgroundColor: location.pathname.includes("club")
            ? "#AACBFF"
            : "transparent",
        }}
      >
        <Link to="club">
          <ListItemIcon
            style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
          >
            <EmojiEventsIcon sx={{ color: "#00338e" }}></EmojiEventsIcon>
            <Typography
              style={{
                color: "#00338e",
                fontWeight: "600",
                fontFamily: "'Open sans'",
              }}
            >
              Clubs
            </Typography>
          </ListItemIcon>
        </Link>
      </MenuItem>
      <MenuItem
       style={{
          margin: "0.5rem",
          paddingLeft: "0.5rem",
          borderRadius: "10px",
          backgroundColor: location.pathname.includes("profile")
            ? "#AACBFF"
            : "transparent",
        }}
      >
        <Link to="profile">
          <ListItemIcon
            style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
          >
            <SettingsIcon sx={{ color: "#00338e" }}></SettingsIcon>
            <Typography
              style={{
                color: "#00338e",
                fontWeight: "600",
                fontFamily: "'Open sans'",
              }}
            >
              Perfil
            </Typography>
          </ListItemIcon>
        </Link>
      </MenuItem>
    </section>
  );

  // Remove this const when copying and pasting into your project.
  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar
          sx={{
            backgroundColor: "#ffffff",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <IconButton
            style={{ color: "#00338e" }}
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ flexGrow: 1 }} />
          <img
            src={`http://localhost:3000/uploads/${datosUsuario.imagen}`}
            style={{
              height: "40px",
              width: "40px",
              marginRight: "0.5rem",
              borderRadius: "100%",
              objectFit: "cover",
            }}
          ></img>
          <Typography
            style={{
              color: "#00338e",
              fontWeight: "600",
              fontFamily: "'Open sans'",
            }}
            variant="h7"
            component="div"
          >
            {datosUsuario.correo}
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onTransitionEnd={handleDrawerTransitionEnd}
          onClose={handleDrawerClose}
          sx={{
            display: { xs: "block", sm: "none" },
          }}
          slotProps={{
            root: {
              keepMounted: true, // Better open performance on mobile.
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
    </Box>
  );
}

Menu.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * Remove this when copying and pasting into your project.
   */
  window: PropTypes.func,
};

export default Menu;
