const mysql = require('mysql2');
const questions = require('questions.js');
const figlet = require('figlet');

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3000,
    user: 'root',
    password: '5D0llar$',
    database: 'employee_tracker'
});

connection.connect(function(err) {
    if (err) throw err;
    figlet('Employee Information Manager', function(err, data) {
            if(err) {
                console.log('something went wrong');
                console.dir(err);
                return;
            }
            console.log(data)
    });
    questions.openingQ();
})

module.exports(connection)

