import { useRef } from "react";

/**
 * Función para reproducir sonido de notificación
 * @param {React.RefObject<HTMLAudioElement>} audioRef - Referencia al elemento de audio
 */
export const playNotificationSound = (notificacion) => {
  if (!notificacion.current) {
    console.error("La referencia de audio no está definida");
    return;
  }

  try {
    if (notificacion.current) {
      notificacion.current.currentTime = 0; // Reinicia el audio
      notificacion.current.volume = 0.3; // Ajusta el volumen

      notificacion.current.play().catch((error) => {
        console.error("Error al reproducir sonido:", error);
        // Intenta reproducir después de una interacción del usuario
        document.addEventListener(
          "click",
          function handler() {
            notificacion.current
              .play()
              .then(() => document.removeEventListener("click", handler))
              .catch(() => document.removeEventListener("click", handler));
          },
          { once: true }
        );
      });
    }
  } catch (error) {
    console.error("Error en la reproducción de sonido:", error);
  }
};
