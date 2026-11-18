import { createHash } from 'node:crypto'
import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join, relative, resolve, sep } from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// After `vite build` this plugin fills two placeholders in dist/sw.js:
//   "__PRECACHE_URLS__"  -> list of every built file (JS/CSS with hashes, index.html, icons, offline.html…)
//   "__BUILD_VERSION__"  -> hash of all those files; it changes whenever any file changes,
//                           so each deploy gets a new cache name and the browser sees a new Service Worker.
function serviceWorkerManifest() {
  let outDir = 'dist'

  function listFiles(dir) {
    return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
      const path = join(dir, entry.name)
      return entry.isDirectory() ? listFiles(path) : [path]
    })
  }

  return {
    name: 'service-worker-manifest',
    apply: 'build',
    configResolved(config) {
      outDir = resolve(config.root, config.build.outDir)
    },
    closeBundle() {
      const swPath = join(outDir, 'sw.js')
      const files = listFiles(outDir)
        .map((file) => relative(outDir, file).split(sep).join('/'))
        .filter((file) => file !== 'sw.js' && !file.endsWith('.map') && !file.endsWith('.DS_Store'))
        .sort()

      const hash = createHash('sha256')
      for (const file of files) {
        hash.update(file)
        hash.update(readFileSync(join(outDir, file)))
      }
      const version = hash.digest('hex').slice(0, 10)

      const sw = readFileSync(swPath, 'utf8')
        .replace('["__PRECACHE_URLS__"]', JSON.stringify(files, null, 2))
        .replace('__BUILD_VERSION__', version)
      writeFileSync(swPath, sw)

      console.log(`\nService Worker: version ${version}, ${files.length} files pre-cached`)
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), serviceWorkerManifest()],
  base: '/ReactLabs/week09/',
})