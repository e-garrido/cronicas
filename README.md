# FacelessStudio (PWA)

Panel de solo lectura con los vídeos de varios canales. Se aloja en GitHub Pages y se instala en el iPhone desde Safari.

## Secciones

- **Panel**: totales, tarjeta de cada canal (banner, logo y cifras), "Continuar viendo" y recientes.
- **Biblioteca**: búsqueda, filtro por canal y etiqueta, orden y vista en cuadrícula o lista.
- **Favoritos**: los vídeos marcados con el corazón.
- **Reproductor**: reanuda donde lo dejaste, velocidad, siguiente automático, deslizar arriba o abajo, copiar título, descripción y etiquetas, compartir y descargar.

El historial y los favoritos se guardan en el propio iPhone.

## Canales

Se definen en `videos/canales.json`. El logo y el banner de cada canal se leen de `videos/assets/canales/<id>/logo.png` y `banner.png`, y `crear_pwa.py` los copia a `pwa/media/canales/<id>/`.
Cada vídeo va al canal indicado en `videos/output/<historia>/canal.txt` (solo el id), o en `asignaciones`, o al canal `por_defecto`.

## Actualizar

Desde `videos/`:

    python3 crear_pwa.py            # recodifica a 720p y escribe pwa/data.json
    python3 crear_pwa.py --iconos   # solo regenera el logo y los iconos

Después, dentro de `pwa/`: `git add -A`, `git commit` y `git push`.

## Instalar en el iPhone

Abre la dirección de Pages en Safari, pulsa Compartir y luego Añadir a pantalla de inicio.
