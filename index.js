const express = require('express')
const cors = require('cors');
const { Auth, estaAutenticada } = require('./userUse')
const app = express()
const port = 3000

app.use(cors())
app.use(express.json())

app.post('/login', Auth.login)
app.post('/register', Auth.register)
app.patch('/updateService', Auth.updateService)
app.get('/verify', estaAutenticada,async (req, res) => {
    res.send(req.auth)
} )

app.use(express.static('app'))

app.get('*', (req, res) => {
	res.status(404).send('No se ha encontrado nada en esta ruta y/o metodo')
})

app.listen(port, () => {
	console.log('Arrancando la aplicación!')
})
