const express = require('express')
const { decrypt, encrypt, check } = require('./cryptography')
const app = express()
const port = 3000
const userID = 1
const userPassword = 'sec123'

app.get('/', (req, res) => {
    res.send('Hello World!')
})
app.get('/secret', (req, res) => {
    res.send('Secret Message!')
})
app.get('/secret-2/:id', (req, res) => {
    const { id } = req.params;
    if (parseInt(id) === userID) {
        res.send('Secret Message!')
    } else {
        res.send('Unauthorised')
    }
})
app.get('/secret-3', (req, res) => {
    const { id } = req.query;
    if (parseInt(id) === userID) {
        res.send('Secret Message!')
    } else {
        res.send('Unauthorised')
    }
})
app.get('/secret-4', (req, res) => {
    const { id, password } = req.query;
    if (parseInt(id) === userID && password === userPassword) {
        res.send('Secret Message!')
    } else {
        res.send('Unauthorised')
    }
})
app.get('/secret-5', (req, res) => {
    const { code } = req.query;
    if (check(userPassword, JSON.parse(code))) {
        res.send('Secret Message!')
    } else {
        res.send('Unauthorised')
    }
})
app.get('/login', (req, res) => {
    const { password} = req.query;
    if (password === userPassword) {
        res.send(encrypt(password))
    } else {
        res.send('Unauthorised')
    }
})

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})