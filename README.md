# Lumo

Sunucusuz, reklamsız, tamamen ücretsiz bir beyin antrenmanı uygulaması. 20 mini oyun (hafıza, dikkat, hız, esneklik, problem çözme), Türkçe/İngilizce arayüz, yerel veri.

- **Stack:** React 19 · TypeScript · Vite · zustand · framer-motion · vitest
- **Oyun mantığı:** `app/src/core/` (saf, seeded RNG, birim testli) — arayüz `app/src/games/`
- **Notlar:** [Farklılaşma notları](NOTES-differentiation.md)

## Çalıştırma

```bash
cd app
npm install
npm run dev     # http://localhost:5173
npm test        # vitest
npm run build
```

`legacy/` eski vanilla sürümdür, yalnızca referans içindir.
