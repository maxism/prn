import path from 'path'
import express from 'express'

const app = express()
const port = 3002

console.log('process.env.NODE_ENV', process.env.NODE_ENV)

app.use('/assets', express.static('dist'))

app.get(/.*/, (req, res) => {
  res.sendFile(path.resolve('./dist/index.html'))
})

app.listen(port, (error) => {
  if (error) {
    console.error(error)
  } else {
    console.info('Listening on port %s. Open up http://localhost:%s/ in your browser.', port, port)
  }
})
