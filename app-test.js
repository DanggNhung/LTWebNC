require("dotenv").config();

const express = require("express");
const path = require("path");

const app = express();


// Middleware
app.use(express.urlencoded({
    extended: true
}));

app.use(express.json());


// Static
app.use(express.static(
    path.join(__dirname, "public")
));


// EJS
app.set(
    "view engine",
    "ejs"
);

app.set(
    "views",
    path.join(__dirname, "views")
);


// Chỉ load class route
const classRoutes = require("./routes/classRoutes");


app.use(
    "/classes",
    classRoutes
);


// Trang test
app.get("/", (req, res) => {

    res.send(
        "Class Management Test Running"
    );

});


// Xử lý lỗi 404
app.use((req, res) => {

    res.status(404).send(
        "404 Not Found"
    );

});


// Chạy server
const PORT = process.env.PORT || 3000;


app.listen(PORT, () => {

    console.log(
        `Server đang chạy tại http://localhost:${PORT}`
    );

});