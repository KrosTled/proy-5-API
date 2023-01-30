const express = require('express')
const { Auth, estaAutenticada } = require('./userUse')
const app = express()
const port = 3000

app.use(express.json())

app.post('/login', Auth.login)
app.post('/register', Auth.register)
app.get('/verify', estaAutenticada,async (req, res) => {
    res.send(req.auth)
} )

app.use(express.static('app'))

app.get('*', (req, res) => {
	res.status(404).send('no esta solicitando nada')
})

app.listen(port, () => {
	console.log('Arrancando la aplicación!')
})
