const express = require('express')
const { decrypt, encrypt, check } = require('./cryptography')
const app = express()
const cors = require("cors");
const fs = require('fs');
const port = 3000
const userID = 77;
const userID_2 = 78;
const officerID = 777;
const officerID_2 = 778;
const officerID_3 = 779;
const adminID = 7777;
const adminID_2 = 7778;
const adminID_3 = 7779;
const userPassword = 'sec123';
const userPassword_2 = 'sec100';
const officerPassword = 'sec1234';
const officerPassword_2 = 'sec12340';
const officerPassword_3 = 'sec123400';
const adminPassword = 'sec12345';
const adminPassword_2 = 'sec123450';
const adminPassword_3 = 'sec1234500';

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
        || check("ADMIN", { code, iv })
        //|| check('USER', { code, iv})
    ) {
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
        || (IDNum === userID_2 && password === userPassword_2)) {
        res.send(encrypt(IDNum, 'USER'))
    }
    else if ((IDNum === officerID && password === officerPassword)
        || (IDNum === officerID_2 && password === officerPassword_2)
        || (IDNum === officerID_3 && password === officerPassword_3)) {
        res.send(encrypt(IDNum, 'OFFICER'))
    }
    else if ((IDNum === adminID && password === adminPassword)
        || (IDNum === adminID_2 && password === adminPassword_2)
        || (IDNum === adminID_3 && password === adminPassword_3)) {
        res.send(encrypt(IDNum, 'ADMIN'))
    } else {
        res.send('Unauthorised')
    }
})
app.get('/login-3', (req, res) => {
    fs.readFile('users.json', 'utf8', (err, data) => {
        const allData = JSON.parse(data)
        const { username, password } = req.query;
        const user = allData.find(x => x.username === username)
        if (!user || user.password !== password) {
            return res.status(401).send('Unauthorized!')
        }
        return res.send(encrypt(user.id, user.role))
    })
})
app.post('/signup', (req, res) => {
    fs.readFile('users.json', 'utf8', (err, data) => {
        const allData = JSON.parse(data)
        const userData = req.body;
        userData.id = allData.users.length + 1;
        allData.users.push(userData)
        fs.writeFile('users.json', JSON.stringify(userData), () => { });
        return res.send(userData);
    })
})
app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})