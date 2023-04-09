const express = require('express')
const { decrypt, encrypt, check } = require('./cryptography')
const app = express()
const cors = require("cors");
const port = 3000
const userID = 77;
const userID_2 = 78;
const officerID = 777;
const adminID = 7777;
const userPassword = 'sec123';
const userPassword_2 = 'sec100';
const officerPassword = 'sec1234';
const adminPassword = 'sec12345';

app.use(cors({
    origin: 'http://localhost:3001',
    credentials: true, // <= Accept credentials (cookies) sent by the client
}));
app.get('/secret', (req, res) => {
    const code = req.header('Authorization');
    const iv = req.header('IV');
    if (check(userID, { code, iv })
        || check(officerID, { code, iv })
        || check(adminID, { code, iv })) {
        res.send('Secret Message!')
    } else {
        res.send('Unauthorised')
    }
})
app.get('/secret-2', (req, res) => {
    const code = req.header('Authorization');
    const iv = req.header('IV');
    if (check("OFFICER", { code, iv })
        || check("ADMIN", { code, iv })) {
        res.send('Secret Message!')
    } else {
        res.send('Unauthorised')
    }
})

app.get('/login', (req, res) => {
    const { id, password } = req.query;
    const IDNum = parseInt(id);
    if ((IDNum === userID && password === userPassword)
        || (IDNum === officerID && password === officerPassword)
        || (IDNum === adminID && password === adminPassword)) {
        res.send(encrypt(IDNum))
    } else {
        res.send('Unauthorised')
    }
})
app.get('/login-2', (req, res) => {
    const { id, password } = req.query;
    const IDNum = parseInt(id);
    if ((IDNum === userID && password === userPassword)
        || (IDNum === userID_2 && password === userPassword_2) ) {
        res.send(encrypt(IDNum, 'USER'))
    }
    else if (IDNum === officerID && password === officerPassword) {
        res.send(encrypt(IDNum, 'OFFICER'))
    }
    else if (IDNum === adminID && password === adminPassword) {
        res.send(encrypt(IDNum, 'ADMIN'))
    } else {
        res.send('Unauthorised')
    }
})
app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})