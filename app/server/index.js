// # load express server
import app from './app'

const port = process.env.PORT || 8080

// # start express server
const server = app.listen(port, function () {
  console.log(`Server listening on port ${server.address().port}`)
})

export default server
