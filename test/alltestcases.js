var assert = require('assert');
const { query } = require('express');
const CassaoneDao = require('../scripts/casaonedao');

var dao = new CassaoneDao("mongodb://localhost:27017/","casaonedb_test");

const collection = "productinfo";

const test_products = require("../resources/sampledata");
const recreateSampleData = require("../resources/sampledatautil");

const queries = [
	{query:{"sortby":"atime","sortorder":"desc"},result_count:4},
	{query:{"sortby":"price","sortorder":"asc"},result_count:4},
	{query:{},result_count:4},
	{query:{"productid":1234},result_count:1},
	{query:{"color":"white"},result_count:2},
	{query:{"maxatime":10},result_count:2},
	{query:{"minatime":11},result_count:1},
	{query:{"minatime":9,"maxatime":10},result_count:1}
];

before(async function () {
	console.info("--------- Start : Initializing sample database ---------");
	await recreateSampleData(dao);
	console.info("--------- End: Initializing sample database ---------\n");
});

describe('Test cases', async function () {

	it('testGetProductInfo: Check existence of product, id '+test_products[0].productid, async function () {
		var productinfo = await dao.getProductInfo(test_products[0].productid).catch((error) => {
			console.error(error);
		});

		assert.notEqual(productinfo,undefined);
		assert.equal(productinfo.productid, test_products[0].productid);
		assert.equal(productinfo.name, test_products[0].name);
		assert.equal(productinfo.color, test_products[0].color);
		assert.equal(productinfo.assemblytime, test_products[0].assemblytime);
		assert.equal(productinfo.lastassemblies.length,
			productinfo.lastassemblies.length);

		productinfo.lastassemblies.every((val, i) => assert.equal(val,productinfo.lastassemblies[i]));

	});

	it('testAddNewAssemblyTime: Update product assembly time, id '+test_products[0].productid, async function () {

		await dao.addNewAssemblyTime(test_products[0].productid,30);

		var productinfo = await dao.getProductInfo(test_products[0].productid).catch((error) => {
			console.error(error);
		});

		var newatimes = [50,35,70,60,30];

		assert.equal(productinfo.assemblytime, 49);
		assert.equal(productinfo.lastassemblies.length,
			newatimes.length);

		productinfo.lastassemblies.every((val, i) => assert.equal(val,newatimes[i]));
	});

	it('testAddNewRatingvalue: Update product rating, id '+test_products[0].productid, async function () {
		await dao.addNewRatingvalue(test_products[0].productid,4);

		var productinfo = await dao.getProductInfo(test_products[0].productid).catch((error) => {
			console.error(error);
		});

		assert.equal(productinfo.overallrating, 4.5);
		assert.equal(productinfo.ratingcounts[4],1);
	});

	it('testProductListing: List all product after filter', async function () {

		queries.forEach(async (pair,i) =>{
			var query = pair.query;
			var expected_count = pair.result_count;

			var productlist = await dao.productListing(query).catch((error) => {
				console.error(error);
			});
			assert.equal(productlist.length,expected_count);
			if(i==0){
				assert.equal(productlist[0].productid,1234);
				assert.equal(productlist[1].productid,1235);
				assert.equal(productlist[2].productid,1237);
				assert.equal(productlist[3].productid,1236);
			}
			if(i==1){
				assert.equal(productlist[0].productid,1236);
				assert.equal(productlist[1].productid,1237);
				assert.equal(productlist[2].productid,1235);
				assert.equal(productlist[3].productid,1234);
			}
		});

	});
});

after(async function () {
//  close mongo connection
});