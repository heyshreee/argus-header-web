/**
 * Minimal production preview server for the prerendered dist/ folder.
 *
 * Vite preview intentionally falls back to the SPA shell for every route, so
 * it cannot verify the per-route HTML that Vercel will serve. This server
 * mirrors the relevant Vercel behaviour:
 *   - clean URLs (/docs serves docs/index.html)
 *   - trailing slashes redirect to the canonical no-slash URL
 *   - unknown paths return 404.html with an HTTP 404 status
 *
 * Usage: node scripts/serve-dist.mjs [port]
 */

import http from 'node:http'
import { createReadStream, promises as fs } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DEFAULT_ROOT = path.resolve(__dirname, '..', 'dist')

const MIME = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.woff2': 'font/woff2',
  '.xml': 'application/xml; charset=utf-8',
}

function contentType(filePath) {
  return MIME[path.extname(filePath).toLowerCase()] || 'application/octet-stream'
}

async function statFile(filePath) {
  try {
    const stats = await fs.stat(filePath)
    return stats.isFile() ? stats : null
  } catch {
    return null
  }
}

async function resolveRequest(root, pathname) {
  const decoded = decodeURIComponent(pathname)
  if (decoded.includes('\0')) return null

  const relative = decoded.replace(/^\/+/, '')
  const base = path.resolve(root, relative)
  if (base !== root && !base.startsWith(`${root}${path.sep}`)) return null

  const candidates = []
  if (!relative) {
    candidates.push(path.join(root, 'index.html'))
  } else {
    candidates.push(base)
    if (!path.extname(base)) {
      candidates.push(`${base}.html`, path.join(base, 'index.html'))
    }
  }

  for (const candidate of candidates) {
    const stats = await statFile(candidate)
    if (stats) return { filePath: candidate, stats }
  }

  return null
}

export async function startServer({ root = DEFAULT_ROOT, port = 0, host = '127.0.0.1' } = {}) {
  const server = http.createServer(async (request, response) => {
    let url
    try {
      url = new URL(request.url || '/', `http://${request.headers.host || 'localhost'}`)
    } catch {
      response.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' })
      response.end('Bad request')
      return
    }

    let pathname
    try {
      pathname = decodeURIComponent(url.pathname)
    } catch {
      response.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' })
      response.end('Bad request')
      return
    }

    if (pathname !== '/' && pathname.endsWith('/')) {
      const target = `${pathname.replace(/\/+$/, '')}${url.search}`
      response.writeHead(308, { Location: target })
      response.end()
      return
    }

    let resolved = await resolveRequest(root, pathname)
    let statusCode = 200

    if (!resolved) {
      resolved = await resolveRequest(root, '/404.html')
      statusCode = 404
    }

    if (!resolved) {
      response.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' })
      response.end('dist/ not found — run npm run build first.')
      return
    }

    const { filePath, stats } = resolved
    const isHtml = filePath.endsWith('.html')
    const isHashedAsset = pathname.startsWith('/assets/')

    response.writeHead(statusCode, {
      'Content-Type': contentType(filePath),
      'Content-Length': stats.size,
      'Cache-Control': isHashedAsset
        ? 'public, max-age=31536000, immutable'
        : isHtml
          ? 'no-cache'
          : 'public, max-age=3600',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
    })

    if (request.method === 'HEAD') {
      response.end()
      return
    }

    createReadStream(filePath).pipe(response)
  })

  await new Promise((resolve, reject) => {
    server.once('error', reject)
    server.listen(port, host, resolve)
  })

  const address = server.address()
  return {
    server,
    port: address.port,
    url: `http://${host}:${address.port}`,
    close: () => new Promise((resolve, reject) => server.close((error) => (error ? reject(error) : resolve()))),
  }
}

const invokedDirectly = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)

if (invokedDirectly) {
  const port = Number(process.env.PORT || process.argv[2] || 4173)
  const instance = await startServer({ port })
  console.log(`Serving prerendered dist/ at ${instance.url}`)
}
