const mysql = require('mysql2')
const inquirer = require('inquirer')
const server = require('server.js')

function openingQ() {
    inquirer.prompt([{
        type: 'list',
        messsage: 'Please choose if you want to view, add, or update',
        name: 'openingQchoice',
        choices: ['view', 'add', 'update']
    }
    ]).then(function(openingQdata){
        if (openingQdata.openingQchoice === 'view') {
            viewQ(openingQdata)
        }
        else if (openingQdata.openingQchoice === 'add') {
            addQ(openingQdata)
    })
}