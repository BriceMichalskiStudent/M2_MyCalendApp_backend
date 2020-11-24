import app from './App'

require('dotenv').config()

const port = process.env.PORT ?? 3000
const host = process.env.HOST ?? 'localhost'
const url = `http://${host}${port ? ':' + port : ''}`

// Route de vérification du serveur
app.get('/ping', function (req, res) {
  res.send('pong')
})

// Lancement de l'api sur le port spécifié.
app.listen(port, function () {
  console.log(`Running on PORT: ${port}, HOST: ${host}, URL: ${url}`)
})
