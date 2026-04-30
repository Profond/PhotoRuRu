import path from "path"
import fs from "fs"
import react from "@vitejs/plugin-react"
import { defineConfig, type Plugin } from "vite"
import { inspectAttr } from 'kimi-plugin-inspect-react'

const UPLOAD_DIR = path.resolve(__dirname, "./public/images/uploaded")
const MANIFEST = path.resolve(UPLOAD_DIR, "_manifest.json")

function ensureDir() {
  if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true })
}

function readManifest(): string[] {
  ensureDir()
  if (!fs.existsSync(MANIFEST)) return []
  try { return JSON.parse(fs.readFileSync(MANIFEST, 'utf-8')) } catch { return [] }
}

function writeManifest(files: string[]) {
  ensureDir()
  fs.writeFileSync(MANIFEST, JSON.stringify(files, null, 2))
}

function galleryApiPlugin(): Plugin {
  return {
    name: 'gallery-api',
    configureServer(server) {
      server.middlewares.use('/api/photos', (req, res) => {
        // GET /api/photos — list uploaded photos
        if (req.method === 'GET') {
          const files = readManifest()
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify(files))
          return
        }

        // DELETE /api/photos — delete a photo
        if (req.method === 'DELETE') {
          let body = ''
          req.on('data', (chunk) => body += chunk)
          req.on('end', () => {
            try {
              const { filename } = JSON.parse(body)
              const filePath = path.join(UPLOAD_DIR, filename)
              if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
              const files = readManifest().filter(f => f !== filename)
              writeManifest(files)
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ ok: true }))
            } catch {
              res.statusCode = 400
              res.end(JSON.stringify({ error: 'Invalid request' }))
            }
          })
          return
        }

        res.statusCode = 405
        res.end('Method not allowed')
      })

      server.middlewares.use('/api/upload-photo', (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405
          res.end('Method not allowed')
          return
        }

        const chunks: Buffer[] = []
        req.on('data', (chunk) => chunks.push(chunk))
        req.on('end', () => {
          try {
            const body = Buffer.concat(chunks)
            const contentType = req.headers['content-type'] || ''
            const boundary = contentType.split('boundary=')[1]

            if (!boundary) {
              res.statusCode = 400
              res.end(JSON.stringify({ error: 'Missing boundary' }))
              return
            }

            const parts = parseMultipart(body, boundary)
            const filePart = parts.find(p => p.filename)
            if (!filePart) {
              res.statusCode = 400
              res.end(JSON.stringify({ error: 'No file found' }))
              return
            }

            ensureDir()
            const ext = path.extname(filePart.filename!) || '.jpg'
            const uniqueName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`
            fs.writeFileSync(path.join(UPLOAD_DIR, uniqueName), filePart.data)

            const files = readManifest()
            files.push(uniqueName)
            writeManifest(files)

            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ filename: uniqueName }))
          } catch (e) {
            res.statusCode = 500
            res.end(JSON.stringify({ error: String(e) }))
          }
        })
      })
    },
  }
}

interface Part {
  filename?: string
  data: Buffer
}

function parseMultipart(body: Buffer, boundary: string): Part[] {
  const parts: Part[] = []
  const boundaryBuf = Buffer.from(`--${boundary}`)

  let pos = 0
  while (pos < body.length) {
    const start = body.indexOf(boundaryBuf, pos)
    if (start === -1) break

    const nextStart = body.indexOf(boundaryBuf, start + boundaryBuf.length)
    if (nextStart === -1) break

    const partBody = body.subarray(start + boundaryBuf.length, nextStart)
    const headerEnd = partBody.indexOf('\r\n\r\n')
    if (headerEnd === -1) { pos = nextStart; continue }

    const headers = partBody.subarray(0, headerEnd).toString('utf-8')
    const data = partBody.subarray(headerEnd + 4, partBody.length - 2) // trim trailing \r\n

    const filenameMatch = headers.match(/filename="([^"]+)"/)
    if (filenameMatch) {
      parts.push({ filename: filenameMatch[1], data })
    }

    pos = nextStart
  }

  return parts
}

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [inspectAttr(), react(), galleryApiPlugin()],
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
