const express = require("express");
const app = express();

const port = 3001;
app.listen(port, () => {
    console.log("SERVER INITIATED SUCCESS FULLY ON PORT: " + port);
});