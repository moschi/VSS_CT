let express = require('express');
let path = require("path");
let app = express();

console.log("test");
const PATH_TO_STATIC_BUILD_FOLDER = "../build";



app.use(express.static(path.join(__dirname, PATH_TO_STATIC_BUILD_FOLDER)));
app.listen(8001);
