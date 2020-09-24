const express = require('express');
const request = require('request');
const path = require('path');

const { productidvalidator, atimevalidator, queryvalidator } = require('../scripts/validators')
const CassaoneDao = require('../scripts/casaonedao');

var dao = new CassaoneDao("mongodb://localhost:27017/","casaonedb");

const route = express.Router();
route.get("/updateatime/:productid",async (req,res)=>{

	if(productidvalidator(req.params) == false || atimevalidator(req.query)==false){
		res.send({error:"Validation exception. Product id and/or assembly time is passed wrong"});
		return;
	}

	var productid = parseInt(req.params.productid);
	var atime = parseInt(req.query.atime);

	try{
		var result = await dao.addNewAssemblyTime(productid,atime);
		res.send({status:"Done","update":result});
	}
	catch(e){
		res.send({error:"Exception while updating",exception:e.message});
	}

});

route.get("/fetch",async (req,res)=>{

	var query = req.query.q;

	if(queryvalidator(query) == false ){
		res.send({error:"Validation exception. Invalid query passed"});
		return;
	}

	try{
		var result = await dao.getProductInfo(productid);
		res.send({status:"Done","update":result});
	}
	catch(e){
		res.send({error:"Exception while updating",exception:e.message});
	}

});

module.exports = route;