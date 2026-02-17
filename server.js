// const express = require("express");
// const fileHandler = require("/.moudles/FileHandler");
// const path = require("path");

// const app = express();
// const PORT = 3000;

// //MiddleWare
// app.use(express.json());
// app.use(express.urlencoded({extended: true }));
// app.use(express.static(path.json(__dirname, "public")));

// //set EJS
// app.set("view enigine", "ejs");
// app.set("views ","./views");

// //Dashboard route
// app.get("/", async(req , res ) => {
//     const employees = await fileHandler.read();
//     //show Add employee from
// app.get("/add", (req,res) => {
//     res.render("add");
// })

// //Hadle Form Submission
// app.post("/add", async(req,res) => {
//     const{name, department, basicsalary } =req.body;
//     const employees = await fileHandler.read();
//     const newEmployees = {
//         id: employees.length > 0 ? employees[employees.length - 1].id + 1 : 1,
//         name, 
//         department,
//         basicsalary: Number(basicsalary)
//     };

//     employees.push(newEmployee);
//     await fileHandler.write(employees);
//     res.redirect("/");
// });

// //calculate tax abd net salary
// const updatedEmployees = employees.map(emp => {
//     const tax = emp.basicsalary * 0.10;
//     const netSalary = emp.basicsalary - tax;

//     return{
//         ...emp,
//         tax,
//         netSalary
//     };
// });
//  res.render("index", {employees: updatedEmployees})
// // fileHandler ko import kar rahe hain
// const { read } = require("./modules/fileHandler");

// // Server start hone par data read karenge
// async function startServer() {
//     try {
//         const employees = await read();

//         console.log("Employee Data:");
//         console.log(employees);

//     } catch (error) {
//         console.error("Error starting server:", error.message);
//     }
// }

// // Function call
// startServer();

// app.listen(3000, () => {
//     console.log("Server is running on port 3000");
// });

const express = require("express");
const fs = require("fs");

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

// ================= DASHBOARD =================
app.get("/", (req, res) => {
    const data = fs.readFileSync("employees.json");
    const employees = JSON.parse(data);

    res.render("index", { employees });
});

// ================= ADD EMPLOYEE =================
// app.post("/add", (req, res) => {
//     const data = fs.readFileSync("employees.json");
//     const employees = JSON.parse(data);

//     const newEmployee = {
//         id: Date.now(),
//         name: req.body.name,
//         salary: Number(req.body.salary)
//     };

//     employees.push(newEmployee);

//     fs.writeFileSync("employees.json", JSON.stringify(employees, null, 2));

//     res.redirect("/");
// });
app.post("/add", (req, res) => {
    console.log(req.body);

    const { name, department, salary } = req.body;

    let employees = [];

    if (fs.existsSync("employees.json")) {
        employees = JSON.parse(fs.readFileSync("employees.json"));
    }

    const newEmployee = {
        id: Date.now(),
        name,
        department,   
        salary: Number(salary)
    };

    employees.push(newEmployee);

    fs.writeFileSync("employees.json", JSON.stringify(employees, null, 2));

    res.redirect("/");
});


// ================= DELETE EMPLOYEE =================
app.get("/delete/:id", (req, res) => {
    const data = fs.readFileSync("employees.json");
    let employees = JSON.parse(data);

    employees = employees.filter(emp => emp.id != req.params.id);

    fs.writeFileSync("employees.json", JSON.stringify(employees, null, 2));

    res.redirect("/");
});

// ================= EDIT PAGE =================
app.get("/edit/:id", (req, res) => {
    const data = fs.readFileSync("employees.json");
    const employees = JSON.parse(data);

    const employee = employees.find(emp => emp.id == req.params.id);

    res.render("edit", { employee });
});

// ================= UPDATE EMPLOYEE =================
app.post("/update/:id", (req, res) => {
    const data = fs.readFileSync("employees.json");
    let employees = JSON.parse(data);

    employees = employees.map(emp => {
        if (emp.id == req.params.id) {
            emp.name = req.body.name;
            emp.salary = Number(req.body.salary);
        }
        return emp;
    });

    fs.writeFileSync("employees.json", JSON.stringify(employees, null, 2));

    res.redirect("/");
});

// ================= SERVER =================
app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});
