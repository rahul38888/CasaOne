const express = require('express');
const path = require('path');
const app = express();

const updateatime = require('./routes/controller')

// app.use("/public",express.static(path.join(__dirname,"module")));

app.get("/healthcheck",(req,res)=>{
	res.send("All good");
});

app.use('/productinfo',updateatime);

app.listen(2020);