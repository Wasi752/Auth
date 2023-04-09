const express = require('express')
const { decrypt, encrypt, check } = require('./cryptography')
const app = express()
const cors = require("cors");
const port = 3000
const userID = 77;
const officerID = 777;
const adminID = 7777;
const userPassword = 'sec123';
const officerPassword = 'sec1234';
const adminPassword = 'sec12345';

app.use(cors({
    origin: 'http://localhost:3001',
    credentials: true, // <= Accept credentials (cookies) sent by the client
}));

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
app.get('/secret-6', (req, res) => {
    const code = req.header('Authorization');
    const iv = req.header('IV');
    if (check(userPassword, { code, iv })) {
        res.send('Secret Message!')
    } else {
        res.send('Unauthorised')
    }
})
app.get('/secret-7', (req, res) => {
    const code = req.header('Authorization');
    const iv = req.header('IV');
    if (check(userID, userPassword, { code, iv })) {
        res.send('Secret Message!')
    } else if (check(officerID, userPassword, { code, iv })) {
        res.send('Welcome!')
    } else if (check(adminID, userPassword, { code, iv })) {
        res.send('Most Welcome!')
    } else {
        res.send('Unauthorised')
    }
})
app.get('/secret-8', (req, res) => {
    const code = req.header('Authorization');
    const iv = req.header('IV');
    if (check(officerID, userPassword, { code, iv }) || check(adminID, userPassword, { code, iv })) {
        res.send('Secret Message!')
    } else {
        res.send('Unauthorised')
    }
})
app.get('/secret-9', (req, res) => {
    const code = req.header('Authorization');
    const iv = req.header('IV');
    if (check(userID, userPassword, { code, iv })
        || check(officerID, officerPassword, { code, iv })
        || check(adminID, adminPassword, { code, iv })) {
        res.send('Secret Message!')
    } else {
        res.send('Unauthorised')
    }
})
app.get('/login', (req, res) => {
    const { password } = req.query;
    if (password === userPassword) {
        res.send(encrypt(password))
    } else {
        res.send('Unauthorised')
    }
})

app.get('/login-2', (req, res) => {
    const { id, password } = req.query;
    if (parseInt(id) === userID && password === userPassword) {
        res.send(encrypt(password))
    } else {
        res.send('Unauthorised')
    }
})
app.get('/login-3', (req, res) => {
    const { id, password } = req.query;
    const IDNum = parseInt(id);
    if ((IDNum === userID || IDNum === officerID || IDNum === adminID) && password === userPassword) {
        res.send(encrypt(IDNum, password))
    } else {
        res.send('Unauthorised')
    }
})
app.get('/login-4', (req, res) => {
    const { id, password } = req.query;
    const IDNum = parseInt(id);
    if ((IDNum === userID && password === userPassword)
        || (IDNum === officerID && password === officerPassword)
        || (IDNum === adminID && password === adminPassword)) {
        res.send(encrypt(IDNum, password))
    } else {
        res.send('Unauthorised')
    }
})
app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})