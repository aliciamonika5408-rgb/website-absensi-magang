import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function databaseSyncPlugin() {
  return {
    name: 'database-sync-plugin',
    configureServer(server) {
      server.middlewares.use('/api/save-database', (req, res, next) => {
        if (req.method === 'POST') {
          let body = ''
          req.on('data', chunk => {
            body += chunk.toString()
          })
          req.on('end', () => {
            try {
              const data = JSON.parse(body)
              const dbPath = path.resolve(__dirname, 'src/data/database.json')
              const exportPath = path.resolve(__dirname, 'database_export.json')

              let currentData = {}
              if (fs.existsSync(dbPath)) {
                try {
                  currentData = JSON.parse(fs.readFileSync(dbPath, 'utf-8'))
                } catch (e) {
                  currentData = {}
                }
              }

              const fullData = {
                company: data.company || currentData.company || {},
                admin: data.admin || currentData.admin || {},
                students: data.students || currentData.students || [],
                attendanceRecords: data.attendanceRecords || currentData.attendanceRecords || []
              }

              const jsonStr = JSON.stringify(fullData, null, 2)
              fs.writeFileSync(dbPath, jsonStr, 'utf-8')
              fs.writeFileSync(exportPath, jsonStr, 'utf-8')

              res.statusCode = 200
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ success: true, message: 'Database saved successfully to disk' }))
            } catch (err) {
              console.error('Error saving database.json:', err)
              res.statusCode = 500
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ error: err.message }))
            }
          })
        } else {
          next()
        }
      })
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), databaseSyncPlugin()],
  server: {
    port: 5173,
    host: true
  }
})
