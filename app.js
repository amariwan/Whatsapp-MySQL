const { Client } = require('whatsapp-web.js');
const client = new Client();
const qrcode = require('qrcode-terminal');
const mysql = require('mysql')

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'status'
})


db.connect(function(err) {
    if (err) console.log(JSON.stringify(err));
    else console.log("MySQL Connected!");
});




client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('Client is ready!');
});
client.on('message', message => {
    console.log(message.body);
    if (message.body.includes('!')) {
        if (message.body === '!test') {
            message.reply('u conected!');
        } else {
            let sqlQuery = message.body.replace('!', '')
            db.query(sqlQuery, (err, result, fields) => {
                if (err) {
                    message.reply('error : \n' + JSON.stringify(err))
                } else if (result) {
                    let res = Object.assign([], result)
                    res.forEach(element => {
                        message.reply('element :\n' + JSON.stringify(element));
                    });
                } else {
                    message.reply('done');
                }
            })
        }
    }
});


client.initialize();
