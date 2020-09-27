const express = require('express');

const { productidvalidator, atimevalidator, queryvalidator, ratingvalidator } = require('../scripts/validators')
const CassaoneDao = require('../scripts/casaonedao');

var dao = new CassaoneDao("mongodb://localhost:27017","casaonedb");

const route = express.Router();
route.get("/updateatime/:productid",async (req,res)=>{

	try{
		productidvalidator(req.params);
		atimevalidator(req.query);
	}
	catch(e){
		res.header("Content-Type",'application/json');
		res.send(JSON.stringify({error:"Validation exception. Product id and/or assembly time is passed wrong",exception:e.message},null,2));
		return;
	}

	var productid = parseInt(req.params.productid);
	var atime = parseInt(req.query.atime);

	try{
		var result = await dao.addNewAssemblyTime(productid,atime);
		res.header("Content-Type",'application/json');
		res.send(JSON.stringify({status:"Done","update":result},null,2));
	}
	catch(e){
		res.header("Content-Type",'application/json');
		res.send(JSON.stringify({error:"Exception while updating",exception:e.message},null,2));
	}

});

route.get("/updaterating/:productid",async (req,res)=>{

	try{
		productidvalidator(req.params);
		ratingvalidator(req.query);
	}
	catch(e){
		res.header("Content-Type",'application/json');
		res.send(JSON.stringify({error:"Validation exception.",exception:e.message},null,2));
		return;
	}

	var productid = parseInt(req.params.productid);
	var newrating = parseInt(req.query.newrating);

	try{
		var result = await dao.addNewRatingvalue(productid,newrating);
		res.header("Content-Type",'application/json');
		res.send(JSON.stringify({status:"Done","update":result},null,2));
	}
	catch(e){
		res.header("Content-Type",'application/json');
		res.send(JSON.stringify({error:"Exception while updating",exception:e.message},null,2));
	}

});

route.get("/fetch",async (req,res)=>{

	try{
		queryvalidator(req.query)
	}
	catch(e){
		res.header("Content-Type",'application/json');
		res.send(JSON.stringify({error:"Validation exception. Invalid query passed",exception:e.message},null,2));
		return;
	}

	var query = JSON.parse(req.query.q);

	try{
		var result = await dao.productListing(query);
		res.header("Content-Type",'application/json');
		res.send(JSON.stringify({count:result.length,products:result},null,2));
	}
	catch(e){
		res.header("Content-Type",'application/json');
		res.send(JSON.stringify({error:"Exception while updating",exception:e.message},null,2));
	}

});

module.exports = route;