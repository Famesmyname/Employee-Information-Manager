const mysql = require('mysql2');
const inquirer = require('inquirer');
const server = require('./server.js');
const { restart } = require('nodemon');
const { functionsIn, functions } = require('lodash');

//This function starts on app start due to being started from server.js
function initialQ() {
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
            viewRoles()
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
        if (addQdata.addQchoice === 'New Department'){
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
        server.connection.query("INSERT INTO department SET ?", {
            dept_name: newDdata.addDchoice
        },
        function(err){
            if (err) throw err;
        again()
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
                        deptChoices.push(`${res[i].id} | ${res[i].dept_name}`);
                    }
                    return deptChoices
                }
            }
    ]).then(function(newRdata){
        let sqlquery = server.connection.query(
            'INSERT INTO roles SET ?',
            {
                title: newRdata.addRoleTitle,
                salary: newRdata.addRoleSalary,
                dept_id: parseInt(newRdata.addRoleDept.slice(0,3))
            } ,
            function(err, res) {
                if (err) throw err;
                again()
            }
        )
    })
    })
}

// Add new employee w/ fname, lname, title, manager?, id
function addEmployee() {
    server.connection.query('SELECT * FROM roles', function(err, res){
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
            let query = server.connection.query(
                "INSERT INTO employee SET ?",
                {
                    first_name: newEdata.addEmployeeFirstName,
                    last_name: newEdata.addEmployeeLastName,
                    role_id: parseInt(newEdata.addEmployeeTitle.slice(0, 5))
                },
                function(err, res) {
                    if (err) throw err;
                    console.log(res.affectedRows + ' new employee added!');
                    if (newEdata.addEmployeeHasManager == true) {
                        setMgr()
                    }
                    else {again()}
                }
            )
        })
    })
}

function setMgr() {
    server.connection.query('SELECT * FROM Employee', function(err, res){
        if (err) throw err;
        inquirer.prompt([
            {
               type: 'list',
               message: 'Who is going to be their manager',
               name: 'addEmployeeMgr',
               choices: function(){
                   const mgrChoices = [];
                   for (let k = 0; k<res.length; k++) {
                       mgrChoices.push(`${res[k].id} | ${res[k].first_name} ${res[k].last_name}`)
                   }
                   return mgrChoices
               }
            }
        ]).then(function(newMdata) {
            const employeeAr = [];
            server.connection.query('SELECT id FROM employee ORDER BY id ASC', function(err, mgrA) {
                if (err) throw err;
                for (let l = 0; l < mgrA.length; l++) {
                    employeeAr.push(mgrA[l].id)
                }
                console.log(employeeAr)
                const newE = employeeAr[employeeAr.length-1];
                const mgr = parseInt(newMdata.addEmployeeMgr.slice(0, 4));
                console.log(newE)
                console.log(mgr)
                addMgr(newE, mgr)
            })
        })
    })
}

function addMgr(manager, employee) {
    server.connection.query('UPDATE employee SET manager_id = ? WHERE id = ?', [employee, manager], function(err, res){
        if (err) {console.log(err)}
        else {console.log('Employee`s manager set!')
        again()
        }
    })
}

function viewEmployee() {
    server.connection.query('SELECT employee.id, employee.first_name, employee.last_name, employee.manager_id, department.dept_name AS Department, roles.title AS Title, roles.salary AS Salary FROM employee JOIN roles ON employee.role_id = roles.id JOIN department ON roles.dept_id = department.id', function(err, res) {
        if (err) throw err;
        const employeeArray = [];
        for (let m = 0; m < res.length; m++) {
            employeeArray.push(res[m])
        }
        console.table(employeeArray);
        again()
    })
}

function viewRoles() {
    server.connection.query('SELECT roles.id, roles.title, salary, department.dept_name FROM roles JOIN department ON roles.dept_id = department.id', function(err, res) {
        if (err) throw err;
        const rolesArray = [];
        for (let n = 0; n < res.length; n++) {
            rolesArray.push(res[n])
        }
        console.table(rolesArray);
        again()
    })
}

function viewDept() {
    server.connection.query('SELECT * FROM department', function(err, res) {
        if (err) throw err;
        const deptArray = [];
        for (let p = 0; p < res.length; p++) {
            deptArray.push(res[p])
        }
        console.table(deptArray);
        again()
    })
}

function again() {
    inquirer.prompt([
        {
            type: 'list',
            message: 'Would you like to do something else?',
            name: 'restartChoice',
            choices: ['yes', 'no']
        }
    ]).then(function(answer){
        if (answer.restartChoice == 'yes') {
            initialQ()
        }
        else 
        {
            console.log('Goodbye.')
            server.connection.end()
        }
    })
}



exports.initialQ = initialQ