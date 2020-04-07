let express = require('express');
let app = express();

console.log("test");


app.use(express.static('build'));
app.listen(8001);
