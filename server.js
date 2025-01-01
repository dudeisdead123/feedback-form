const http = require("http");
const fs = require("fs");
const qs = require("querystring");

const server = http.createServer((req, res) => {
    if (req.method === "GET") {
        if (req.url === "/") {
            fs.readFile("User.json", "utf8", (err, data) => {
                if (err) {
                    res.writeHead(500);
                    res.end("Server Error");
                } else {
                    res.writeHead(200, { "Content-Type": "application/json" });
                    res.end(data);
                }
            });
        } else if (req.url === "/allstudent") {
            fs.readFile("allstudent.html", "utf8", (err, data) => {
                if (err) {
                    res.writeHead(500);
                    res.end("Server Error");
                } else {
                    res.writeHead(200, { "Content-Type": "text/html" });
                    res.end(data);
                }
            });
        } else if (req.url === "/register") {
            fs.readFile("register.html", "utf8", (err, data) => {
                if (err) {
                    res.writeHead(500);
                    res.end("Server Error");
                } else {
                    res.writeHead(200, { "Content-Type": "text/html" });
                    res.end(data);
                }
            });
        } else {
            res.writeHead(404);
            res.end("Not Found");
        }
    } else if (req.method === "POST" && req.url === "/register") {
        let body = "";

        req.on("data", (chunk) => {
            body += chunk.toString();
        });

        req.on("end", () => {
            try {
                const formData = qs.parse(body);

                let users = [];
                if (fs.existsSync("User.json")) {
                    const fileData = fs.readFileSync("User.json", "utf8");
                    users = fileData ? JSON.parse(fileData) : [];
                }

                users.push(formData);
                fs.writeFileSync("User.json", JSON.stringify(users, null, 2));

                let tableRows = users
                    .map((user) => `
                        <tr>
                            <td>${user.name || ""}</td>
                            <td>${user.age || ""}</td>
                            <td>${user.email || ""}</td>
                            <td>${user.phone || ""}</td>
                            <td>${user.gender || ""}</td>
                            <td>${user.occupation || ""}</td>
                            <td>${user.country || ""}</td>
                            <td>${user.state || ""}</td>
                            <td>${user.city || ""}</td>
                            <td>${user.date || ""}</td>
                            <td>${user.friendliness || ""}</td>
                            <td>${user.value || ""}</td>
                            <td>${user.recommend || ""}</td>
                            <td>${user.contact || ""}</td>
                            <td>${user.reuse || ""}</td>
                            <td>${user.source || ""}</td>
                            <td>${user.problems || ""}</td>
                            <td>${user.textarea || ""}</td>

                        </tr>
                    `)
                    .join("\n");

                const updatedHTML = `
                    <!DOCTYPE html>
                    <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>All Students</title>
                        <style>
                           th{
                                text-align: center;
                            }
                            td{
                                text-align: center;
                            }
                        </style>
                    </head>
                    <body>
                        <h1 style="text-align: center;">All Students</h1>
                        <table border="1" align="center" cellspacing="4px" cellpadding="10px">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Age</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Gender</th>
                                    <th>Occupation</th>
                                    <th>Country</th>
                                    <th>State</th>
                                    <th>City</th>
                                    <th>Date of Visit</th>
                                    <th>Staff Friendliness</th>
                                    <th>Value for Money</th>
                                    <th>Likelihood to Recommend</th>
                                    <th>Preferred Contact Method</th>
                                    <th>Would You Use the Service Again?</th>
                                    <th>How Did You Hear About Us?</th>
                                    <th>Any Problems Faced?</th>
                                    <th>Describe any problems faced...</th>
                                    
                                </tr>
                            </thead>
                            <tbody>
                                ${tableRows}
                            </tbody>
                        </table>
                    </body>
                    </html>
                `;

                fs.writeFileSync("allstudent.html", updatedHTML);

                res.writeHead(200, { "Content-Type": "text/html" });
                res.end("Registration successful!");
            } catch (error) {
                console.error("Error:", error);
                res.writeHead(500);
                res.end("Server Error");
            }
        });
    } else {
        res.writeHead(404);
        res.end("Not Found");
    }
});

server.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});



