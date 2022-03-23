const mysql = require('mysql2')
const inquirer = require('inquirer')
const server = require('server.js')
const { restart } = require('nodemon')
const { functionsIn, functions } = require('lodash')

//This function starts on app start due to being started from server.js
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
            addQ(openingQdata)}
        else {
            updateQ(openingQdata)
        }
    })
}

// Ask user what to view of three tables
function viewQ() {
    inquirer.prompt([{
        type: 'list',
        message: 'What do you want to view?',
        name: 'viewQchoice',
        choices: ['Departments', 'Roles', 'Employees']
        }
    ]).then(function(viewQdata){
        if (viewQdata.viewQchoice === 'Departments'){
            viewDept()
        }
        else if (viewQdata.viewQchoice === 'Roles'){
            viewRole()
        }
        else {
            viewEmployee()
        };
    })
}

// Ask user what to add of three choices/tables
function addQ() {
    inquirer.prompt([{
        type: 'list',
        message: 'What is going to be added?',
        name: 'addQchoice',
        choices: ['New Department', 'New Role', 'New Employee']
    }]).then(function(addQdata){
        if (addQdata.addQchoice === 'New Darpartment'){
            addDept()
        }
        else if (addQdata.addQchoice === 'New Role'){
            addRole()
        }
        else addEmployee();
    })
}

// Add new department with automatic new id
function addDept() {
    inquirer.prompt([{
        type: 'input',
        message: 'Please enter the name of the department you would like to add.',
        name: 'addDchoice'
    }]).then(function(newDdata){
        server.connection.query("INSERT INTO departments SET ?", {
            dept_name: newDdata.addDchoice
        },
        function(err){
            if (err) throw err;
        restart()
        })
    })
}

// if add role chosen, take department data and let user create a new role with a choice of which department the role in is.
function addRole() {
    server.connection.query('SELECT * FROM department', function(err, res){
        if (err) throw err;
        inquirer.prompt([
            {
                type: 'input',
                message: 'Please enter the title for the role you want to add.',
                name: 'addRoleTitle',
            },
            {
                type: 'input',
                message: 'What is the salary for this position?',
                name: 'addRoleSalary'
            },
            {
                type: 'list',
                message: 'What department is this role in?',
                name: 'addRoleDept',
                choices: function(){
                    const deptChoices = []
                    for (let i = 0; i<res.length; i++) {
                        deptChoices.push(`${res[i].id} | ${res[i.name]}`);
                    }
                    return deptChoices
                }
            }
    ]).then(function(newRdata){
        let sqlquery = server.connection.query(
            'INSERT INTO role SET ?',
            {
                title: newRdata.addRoleTitle,
                salary: newRdata.addRoleSalary,
                department_id: parseInt(newRdata.addRoleDept.slice(0,3))
            } ,
            function(err, res) {
                if (err) throw err;
                restart()
            }
        )
    })
    })
}

// Add new employee w/ fname, lname, title, manager?, id
function addEmployee() {
    server.connection.query('SELECT * FROM role', function(err, res){
        if (err) throw err;
        inquirer.prompt([
            {
                type: 'input',
                message: 'Enter the first name of the new employee',
                name: 'addEmployeeFirstName'
            },
            {
                type: 'input',
                message: 'Enter the last name of the new employee',
                name: 'addEmployeeLastName'
            },
            {
                type: 'list',
                message: 'What is the job/title of the new employee?',
                name: 'addEmployeeTitle',
                choices: function(){
                    const roleChoices = [];
                    for (let j = 0; j < res.length; j++) {
                        roleChoices.push(`${res[j].id} | ${res[j].title}`)
                    }
                    return roleChoices
                }
            },
            {
                type: 'confirm',
                message: 'Does this new employee have a manager?',
                name: 'addEmployeeHasManager'
            }
        ]).then(function(newEdata) {
            let 
        })
    })
}