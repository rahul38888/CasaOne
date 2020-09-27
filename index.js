const express = require('express');
const app = express();

const updateatime = require('./routes/controller')

app.get("/healthcheck",(req,res)=>{
	res.send("All good");
});

app.use('/productinfo',updateatime);

app.listen(2020);