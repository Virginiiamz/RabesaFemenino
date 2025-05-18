// useUserStore.jsx
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

/**
 * Hook personalizado para gestionar el estado del usuario.
 * Utiliza la biblioteca Zustand para la gestión del estado y persistencia en sessionStorage.
 */
// const useUserStore = create(
//   persist(
//     (set, get) => ({
//       // user: { rol: "None" }, // Estado inicial sin usuario
//       user: { rol: "None" }, // Estado inicial sin usuario

//       /**
//        * Establece los datos del usuario.
//        * @param {Object} userData - Datos del usuario.
//        */
//       setUser: (userData) => {
//         console.log("Guardando usuario en el store:", userData);
//         set({ user: userData });
//       },

//       /**
//        * Limpia los datos del usuario, estableciendo el rol a "None".
//        */
//       clearUser: () => set({ user: { rol: "None" } }),

//       // Métodos de validación

//       /**
//        * Verifica si el usuario ha iniciado sesión.
//        * @returns {boolean} - Verdadero si el usuario ha iniciado sesión, falso en caso contrario.
//        */
//       isLoggedIn: () => get().user?.rol && get().user.rol !== "None",

//       /**
//        * Verifica si el usuario tiene rol de administrador.
//        * @returns {boolean} - Verdadero si el usuario es administrador, falso en caso contrario.
//        */
//       isAdmin: () => get().user?.rol === "Entrenador",

//       /**
//        * Verifica si el usuario tiene rol de usuario.
//        * @returns {boolean} - Verdadero si el usuario es usuario, falso en caso contrario.
//        */
//       isUser: () => get().user?.rol === "Jugadora",
//     }),
//     {
//       name: "user-storage", // Clave en sessionStorage
//       storage: createJSONStorage(() => sessionStorage), // Para cambiar a sessionStorage
//     }
//   )
// );

const useUserStore = create(
  persist(
    (set, get) => ({
      // user: null,
      user: { rol: "None" },

      setUser: (u) => {
        console.log("🔐 setUser:", u);
        set({ user: u });
      },
      clearUser: () => {
        console.log("🚪 clearUser");
        set({ user: { rol: "None" } });
      },
      isLoggedIn: () => !!get().user?.rol && get().user.rol !== "None",
      isAdmin: () => get().user?.rol === "Entrenador",
      isUser: () => get().user?.rol === "Jugadora",
    }),
    {
      name: "user-storage", // clave en localStorage
      getStorage: () => localStorage, // fuerza localStorage en lugar de sessionStorage
      onRehydrateStorage: (state) => {
        // se ejecuta al leer del storage
        return (persistedState) => {
          console.log("✨ Zustand rehidrató user-store:", persistedState);
        };
      },
    }
  )
);

export default useUserStore;
