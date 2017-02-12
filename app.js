/*jshint esversion: 6 */

let http = require('http');
let dispatcher = require('httpdispatcher');
let firebase = require('firebase');
let nodemailer = require('nodemailer');
let credentials = require('./mailCredentials.json');

let server = http.createServer(handleRequest);
const PORT = 8080;

firebase.initializeApp({
    serviceAcount: '/SecuriPI-firebase.json',
    databaseURL: 'https://securipi-9439b.firebaseio.com/'
});


function handleRequest(request, response) {
    try {
        console.log(request.url);
        dispatcher.dispatch(request, response);
    } catch (err) {
        console.log(err);
    }
}

server.listen(PORT, function () {
    console.log('Server listening on: http://localhost:%s', PORT);
});

dispatcher.onGet('/door-opened', function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    firebaseUpdate();
    sendMail('calin1611@gmail.com');
    res.end('Door opened!');
});

function sendMail(to) {
    let smtpConfig = {
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // use SSL
        auth: {
            user: credentials.username,
            pass: credentials.password
        }
    };
    let transporter = nodemailer.createTransport(smtpConfig);
    let mailData = {
        from: 'nodeServer@yourRaspberry.pi',
        to: to,
        subject: 'The door was opened.',
        text: 'Was that you?'
    };
    transporter.sendMail(mailData);
}

function firebaseUpdate() {
    let currentDate = new Date(Date.now());

    let db = firebase.database();
    let ref = db.ref("/");
    ref.once("value", function (snapshot) {
        //console.log(snapshot.val());
    });

    let triggersRef = ref.child("triggers");
    triggersRef.push({
        timeStamp: {
            month: currentDate.getMonth() + 1,
            day: currentDate.getDate(),
            hour: currentDate.getHours(),
            minute: currentDate.getMinutes(),
            second: currentDate.getSeconds()
        }
    });
}