const express = require('express');
const request = require('request');
const path = require('path');

const { paramvalidator, queryvalidator } = require('../scripts/validators')

const route = express.Router();

route.get("/:productid",(req,res)=>{
	paramvalidator(req.params);
	queryvalidator(req.query);

	var productid = req.params.productid;
	var atime = req.query.atime;

	console.log(req.params);
	console.log(req.query);

	res.send({productid,atime});

});

module.exports = route;