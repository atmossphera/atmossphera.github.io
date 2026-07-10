// scripts/fetch-instagram.mjs
// Descarga las ultimas publicaciones de @atmossphera.studio y las guarda
// en el repo (imagenes + posts.json) para que la web las pinte sola.
// No necesita dependencias: usa fetch y fs nativos de Node 20+.

import { mkdir, writeFile, rm } from "node:fs/promises";
import { existsSync } from "node:fs";

const TOKEN = process.env.IG_TOKEN;              // secreto de GitHub
const LIMIT = 9;                                 // cuantos posts mostrar
const OUT_DIR = "assets/instagram";
const MEDIA_DIR = `${OUT_DIR}/media`;

if (!TOKEN) {
  console.error("Falta IG_TOKEN. Anadelo como secreto del repo.");
  process.exit(1);
}

const fields = [
  "id", "caption", "media_type",
  "media_url", "thumbnail_url", "permalink", "timestamp"
].join(",");

const api = `https://graph.instagram.com/me/media` +
  `?fields=${fields}&limit=${LIMIT}&access_token=${TOKEN}`;

async function main() {
  const res = await fetch(api);
  const data = await res.json();

  if (data.error) {
    console.error("Error de Instagram:", JSON.stringify(data.error));
    process.exit(1);
  }

  // Carpeta limpia para no acumular fotos de posts ya borrados
  if (existsSync(MEDIA_DIR)) await rm(MEDIA_DIR, { recursive: true, force: true });
  await mkdir(MEDIA_DIR, { recursive: true });

  const posts = [];

  for (const item of data.data) {
    // En videos la foto valida es la miniatura, no media_url
    const src = item.media_type === "VIDEO"
      ? (item.thumbnail_url || item.media_url)
      : item.media_url;
    if (!src) continue;

    const localPath = `${MEDIA_DIR}/${item.id}.jpg`;
    try {
      const img = await fetch(src);
      const buf = Buffer.from(await img.arrayBuffer());
      await writeFile(localPath, buf);
    } catch (e) {
      console.error(`No se pudo bajar la imagen de ${item.id}:`, e.message);
      continue;
    }

    posts.push({
      id: item.id,
      caption: (item.caption || "").trim(),
      permalink: item.permalink,
      timestamp: item.timestamp,
      image: localPath,                 // ruta local, no caduca nunca
      isVideo: item.media_type === "VIDEO"
    });
  }

  const out = { updated: new Date().toISOString(), posts };
  await writeFile(`${OUT_DIR}/posts.json`, JSON.stringify(out, null, 2));
  console.log(`Guardados ${posts.length} posts.`);
}

main();
