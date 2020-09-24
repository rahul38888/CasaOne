const express = require('express');
const request = require('request');
const path = require('path');

const validator = require('../scripts/validator')

const route = express.Router();

route.get("/:id",(req,res)=>{
	validator.
	request.get('127.0.0.1:8080/hello').on('response',(response)=>{
		console.log(response.statusCode);
		console.log(response.headers['content-type']);
		res.send(response);
	});

});

module.exports = route;