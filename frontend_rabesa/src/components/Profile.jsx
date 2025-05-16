import {
  Box,
  Button,
  Divider,
  InputAdornment,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import imagen_ejemplo from "../assets/img/imagen_ejemplo.jpg";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import PersonIcon from "@mui/icons-material/Person";
import NumbersIcon from "@mui/icons-material/Numbers";

function Profile() {
  return (
    <>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
        }}
      >
        <Toolbar />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "8px",
            marginBottom: "5px",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography
              sx={{
                fontFamily: "'Open sans'",
                fontSize: "22px",
                fontWeight: 600,
                color: "#00338e",
                padding: "0px",
                margin: "0px",
              }}
            >
              Perfil de usuario
            </Typography>
          </Box>
        </div>
        <Box sx={{ marginBottom: "10px" }}>
          <Typography variant="body1">
            Actualiza tu información personal
          </Typography>
        </Box>
        <Divider sx={{ my: 2, backgroundColor: "#3d64a8" }} />

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            flexDirection: {xs: "column", lg: "row"},
            gap: "3rem",
          }}
        >
          <Box
            sx={{
              border: "1px solid #BDBDBD",
              width: {xs: "100%", lg: "30%"},
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              backgroundColor: "white",
              borderRadius: "4px",
              padding: 2,
              height: "24rem",
            }}
          >
            <div style={{ position: "relative", width: "fit-content" }}>
              <img
                src={imagen_ejemplo}
                style={{
                  width: "150px",
                  height: "150px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  display: "block",
                }}
              />

              {/* Icono de cámara */}
              <div
                // onClick={() => tuFuncion()}
                style={{
                  position: "absolute",
                  bottom: "10px",
                  right: "10px",
                  backgroundColor: "#ffffff",
                  borderRadius: "50%",
                  padding: "5px",
                  cursor: "pointer",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                  color: "#3d64a8",
                }}
              >
                <AddAPhotoIcon></AddAPhotoIcon>
              </div>
            </div>
            <Typography
              sx={{
                color: "#3d64a8",
                fontFamily: "'Open sans'",
                fontWeight: 600,
                marginTop: "1rem",
              }}
            >
              Virginia Muñoz Castro
            </Typography>
            <Typography
              sx={{
                fontSize: { lg: "16px" },
                fontFamily: "Open Sans",
              }}
            >
              Delantera · #2
            </Typography>
            <Button
              size="large"
              //   onClick={handleSubmit}
              sx={{
                gap: 0.5,
                color: "#838383",
                border: "1px solid #838383",
                backgroundColor: "white",
                fontFamily: "'Open sans'",
                fontSize: "14px",
                fontWeight: 600,
                marginTop: "1rem",
                width: "90%",
              }}
            >
              <FileUploadIcon sx={{ fontSize: "20px" }}></FileUploadIcon>{" "}
              Cambiar foto
            </Button>
            <Divider
              sx={{ my: 2, backgroundColor: "#3d64a8", width: "100%" }}
            />
            <Box sx={{ alignSelf: "flex-start" }}>
              <Typography
                sx={{
                  color: "#3d64a8",
                  fontFamily: "'Open sans'",
                  fontWeight: 600,
                }}
              >
                Fecha alta
              </Typography>
              <Typography
                sx={{
                  fontSize: { lg: "16px" },
                  fontFamily: "Open Sans",
                }}
              >
                17/11/2002
              </Typography>
            </Box>
          </Box>

          <Box
            component="form"
            noValidate
            autoComplete="off"
            // onSubmit={handleSubmit}
            sx={{ width: {xs: "100%", lg: "70%"}, }}
          >
            <Box
              sx={{
                border: "1px solid #BDBDBD",
                display: "flex",
                flexDirection: "column",
                backgroundColor: "white",
                borderRadius: "4px",
                paddingX: 2,
                marginBottom: "1rem",
                paddingBottom: "2rem",
              }}
            >
              <Box
                sx={{
                  marginTop: "1rem",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography
                    sx={{
                      color: "#3d64a8",
                      fontFamily: "'Open sans'",
                      fontWeight: 600,
                    }}
                  >
                    Información personal
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: { lg: "16px" },
                      fontFamily: "Open Sans",
                    }}
                  >
                    Actualice sus datos personales
                  </Typography>
                </Box>
                <SettingsIcon sx={{ color: "#3d64a8" }}></SettingsIcon>
              </Box>
              <Divider
                sx={{ my: 2, backgroundColor: "#3d64a8", width: "100%" }}
              />

              <Box
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", md: "row" },
                  gap: { xs: 0, md: 2 },
                  marginBottom: 2,
                }}
              >
                <Box sx={{ width: { xs: "100%", md: "50%" } }}>
                  <Typography
                    sx={{
                      fontFamily: "'Open sans'",
                      fontWeight: 600,
                      fontSize: "13px",
                      marginTop: 1,
                      marginBottom: 1,
                      color: "#3d64a8",
                    }}
                  >
                    Nombre completo
                  </Typography>
                  <TextField
                    fullWidth
                    variant="outlined"
                    name="nombre"
                    type="text"
                    // value={formData.correo}
                    // onChange={handleChange}
                    placeholder="Introduce tu nombre completo"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon
                            sx={{ color: "#a6a6a6", fontSize: "20px" }}
                          />
                        </InputAdornment>
                      ),
                    }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    required={true}
                    // error={!!validacion.correo}
                    // helperText={validacion.correo}
                  />
                </Box>
                <Box sx={{ width: { xs: "100%", md: "50%" } }}>
                  <Typography
                    sx={{
                      fontFamily: "'Open sans'",
                      fontWeight: 600,
                      fontSize: "13px",
                      marginTop: 1,
                      marginBottom: 1,
                      color: "#3d64a8",
                    }}
                  >
                    Edad
                  </Typography>
                  <TextField
                    fullWidth
                    variant="outlined"
                    type="email"
                    name="correo"
                    // value={formData.contrasena}
                    // onChange={handleChange}
                    placeholder="Introduce tu correo electrónico"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon
                            sx={{ color: "#a6a6a6", fontSize: "20px" }}
                          />
                        </InputAdornment>
                      ),
                    }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    required={true}
                    // error={!!validacion.contrasena}
                    // helperText={validacion.contrasena}
                  />
                </Box>
              </Box>
              <Box sx={{ width: { xs: "100%", md: "50%" } }}>
                <Typography
                  sx={{
                    fontFamily: "'Open sans'",
                    fontWeight: 600,
                    fontSize: "13px",
                    marginTop: 1,
                    marginBottom: 1,
                    color: "#3d64a8",
                  }}
                >
                  Edad
                </Typography>
                <TextField
                  fullWidth
                  variant="outlined"
                  name="edad"
                  type="number"
                  // value={formData.correo}
                  // onChange={handleChange}
                  placeholder="Introduce tu edad"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <NumbersIcon
                          sx={{ color: "#a6a6a6", fontSize: "20px" }}
                        />
                      </InputAdornment>
                    ),
                  }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  required={true}
                  // error={!!validacion.correo}
                  // helperText={validacion.correo}
                />
              </Box>
            </Box>

            <Box
              sx={{
                border: "1px solid #BDBDBD",
                display: "flex",
                flexDirection: "column",
                backgroundColor: "white",
                borderRadius: "4px",
                paddingX: 2,
                marginBottom: "1rem",
                paddingBottom: "2rem",
              }}
            >
              <Box
                sx={{
                  marginTop: "1rem",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography
                    sx={{
                      color: "#3d64a8",
                      fontFamily: "'Open sans'",
                      fontWeight: 600,
                    }}
                  >
                    Seguridad
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: { lg: "16px" },
                      fontFamily: "Open Sans",
                    }}
                  >
                    Gestione su contraseña
                  </Typography>
                </Box>
                <LockIcon sx={{ color: "#3d64a8" }}></LockIcon>
              </Box>
              <Divider
                sx={{ my: 2, backgroundColor: "#3d64a8", width: "100%" }}
              />

              <Typography
                sx={{
                  fontFamily: "'Open sans'",
                  fontWeight: 600,
                  fontSize: "13px",
                  marginBottom: 1,
                  color: "#3d64a8",
                }}
              >
                Contraseña actual
              </Typography>
              <TextField
                fullWidth
                variant="outlined"
                name="contrasena"
                type="password"
                // value={formData.correo}
                // onChange={handleChange}
                placeholder="Introduce tu contraseña actual"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon sx={{ color: "#a6a6a6", fontSize: "20px" }} />
                    </InputAdornment>
                  ),
                }}
                InputLabelProps={{
                  shrink: true,
                }}
                required={true}
                // error={!!validacion.correo}
                // helperText={validacion.correo}
              />
              <Typography
                sx={{
                  fontFamily: "'Open sans'",
                  fontWeight: 600,
                  fontSize: "13px",
                  marginBottom: 1,
                  marginTop: 2,
                  color: "#3d64a8",
                }}
              >
                Nueva contraseña
              </Typography>
              <TextField
                fullWidth
                variant="outlined"
                name="newContrasena"
                type="password"
                // value={formData.correo}
                // onChange={handleChange}
                placeholder="Introduce una nueva contraseña"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon sx={{ color: "#a6a6a6", fontSize: "20px" }} />
                    </InputAdornment>
                  ),
                }}
                InputLabelProps={{
                  shrink: true,
                }}
                required={true}
                // error={!!validacion.correo}
                // helperText={validacion.correo}
              />
            </Box>
            <Button
              size="large"
            //   onClick={handleSubmit}
              sx={{
                gap: 0.5,
                color: "white",
                backgroundColor: "#00338e",
                fontFamily: "'Open sans'",
                fontSize: "14px",
                fontWeight: 600,
                alignSelf: "flex-start",
                width: "10rem",
                "&:hover": {
                  backgroundColor: "#AACBFF",
                  color: "#00338e",
                },
              }}
              type="submit"
            >
              Guardar
            </Button>
          </Box>
        </Box>
      </Box>
    </>
  );
}
export default Profile;
