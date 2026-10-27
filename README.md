# Crónicas Ocultas (PWA)

Galería de solo lectura de los vídeos generados. Se aloja en GitHub Pages y se instala en el iPhone desde Safari.

## Publicar en GitHub Pages

Desde la carpeta `pwa/`:

bash
cd pwa
git init -b main
git add -A
git commit -m "PWA Crónicas Ocultas"
git remote add origin https://github.com/TU_USUARIO/cronicas.git
git push -u origin main

Después, en GitHub: **Settings → Pages → Build and deployment → Deploy from a branch → main / (root) → Save**.
La dirección será `https://TU_USUARIO.github.io/cronicas/`.

Notas:
- El repositorio puede ser público o privado, pero Pages en repos privados requiere un plan de pago. GitHub Pages admite sitios de hasta 1 GB.
- Cada vídeo pesa menos de 25 MB, muy por debajo del límite de 100 MB por fichero de GitHub.

## Instalar en el iPhone

1. Abre la dirección de Pages en **Safari**.
2. Pulsa Compartir y luego **Añadir a pantalla de inicio**.
3. Ábrela desde el icono. Funciona a pantalla completa.

## Añadir o actualizar vídeos

En el ordenador, desde la carpeta `videos/`:

bash
python3 crear_pwa.py
cd ../pwa
git add -A
git commit -m "Nuevos vídeos"
git push

`crear_pwa.py` recodifica cada vídeo de `videos/output/` a 720x1280, crea el póster y regenera `data.json`. Solo procesa los vídeos nuevos o modificados. Usa `--force` para rehacerlo todo.

La app es solo de visualización: no genera vídeos. Los favoritos y el ajuste de sonido se guardan en el propio iPhone.
