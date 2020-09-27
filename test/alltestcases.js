var assert = require('assert');

const CassaoneDao = require('../scripts/casaonedao');
const { productidvalidator, atimevalidator, queryvalidator, ratingvalidator } = require('../scripts/validators')

var dao = new CassaoneDao("mongodb://localhost:27017/","casaonedb_test");

const collection = "productinfo";

const test_products = require("../resources/sampledata");
const recreateSampleData = require("../resources/sampledatautil");

const queries = [
	{query:{"sortby":"atime","sortorder":"desc"},result_count:4},
	{query:{"sortby":"price","sortorder":"asc"},result_count:4},
	{query:{"sortby":"rating","sortorder":"asc"},result_count:4},
	{query:{},result_count:4},
	{query:{"productid":1234},result_count:1},
	{query:{"color":"white"},result_count:2},
	{query:{"atimerange":{"max":10}},result_count:2},
	{query:{"atimerange":{"min":11}},result_count:1},
	{query:{"atimerange":{"min":9,"max":10}},result_count:1},
	{query:{"ratingrange":{"max":3.8}},result_count:1},
	{query:{"ratingrange":{"min":4.5}},result_count:1},
	{query:{"ratingrange":{"min":4,"max":5}},result_count:3}
];

before(async function () {
	await recreateSampleData(dao);
});

describe('Test CassaoneDao', async function () {

	it('test getProductInfo: Check existence of product, id ' + test_products[0].productid, async function () {
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

	it('test addNewAssemblyTime: Update product assembly time, id '+test_products[0].productid, async function () {

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

	it('test addNewRatingvalue: Update product rating, id '+test_products[0].productid, async function () {
		await dao.addNewRatingvalue(test_products[0].productid,4);

		var productinfo = await dao.getProductInfo(test_products[0].productid).catch((error) => {
			console.error(error);
		});

		assert.equal(productinfo.overallrating, 4.5);
		assert.equal(productinfo.ratingcounts[4],1);
	});

	it('test productListing: List all product after filter', async function () {

		for(var i=0;i<queries.length;i++){
			var pair = queries[i];

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
			else if(i==1){
				assert.equal(productlist[0].productid,1236);
				assert.equal(productlist[1].productid,1237);
				assert.equal(productlist[2].productid,1235);
				assert.equal(productlist[3].productid,1234);
			}
			else if(i==2){
				assert.equal(productlist[0].productid,1235);
				assert.equal(productlist[1].productid,1236);
				assert.equal(productlist[2].productid,1237);
				assert.equal(productlist[3].productid,1234);
			}
		}

	});
});

describe('Validator test', async function () {
	it("productidvalidator", async function () {

		assert.throws(()=>{productidvalidator({})},Error);
		assert.throws(()=>{productidvalidator(null)},Error);
		assert.throws(()=>{productidvalidator({productid:-1})},Error);
		assert.throws(()=>{productidvalidator({productid:1.5})},Error);
		assert.throws(()=>{productidvalidator({productid:"34afs"})},Error);

		assert.doesNotThrow(()=>{productidvalidator({productid:1})},Error);
	});

	it("atimevalidator", async function () {

		assert.throws(()=>{atimevalidator({})},Error);
		assert.throws(()=>{atimevalidator(null)},Error);
		assert.throws(()=>{atimevalidator({atime:"34afs"})},Error);

		assert.doesNotThrow(()=>{atimevalidator({atime:1.5})},Error);
		assert.doesNotThrow(()=>{atimevalidator({atime:1})},Error);
	});

	it("ratingvalidator", async function () {

		assert.throws(()=>{ratingvalidator({})},Error);
		assert.throws(()=>{ratingvalidator(null)},Error);
		assert.throws(()=>{ratingvalidator({newrating:"34afs"})},Error);
		assert.throws(()=>{ratingvalidator({newrating:0})},Error);
		assert.throws(()=>{ratingvalidator({newrating:6})},Error);

		assert.doesNotThrow(()=>{ratingvalidator({newrating:1})},Error);
		assert.doesNotThrow(()=>{ratingvalidator({newrating:2})},Error);
		assert.doesNotThrow(()=>{ratingvalidator({newrating:3})},Error);
		assert.doesNotThrow(()=>{ratingvalidator({newrating:4})},Error);
		assert.doesNotThrow(()=>{ratingvalidator({newrating:5})},Error);
	});

	it("queryvalidator", async function () {

		assert.throws(()=>{queryvalidator({})},Error);
		assert.throws(()=>{queryvalidator(null)},Error);
		assert.throws(()=>{queryvalidator({q:"34afs"})},Error);
		assert.throws(()=>{queryvalidator({q:0})},Error);

		assert.throws(()=>{queryvalidator({q:{productid:1.5}})},Error);
		assert.throws(()=>{queryvalidator({q:{productid:-1}})},Error);

		assert.throws(()=>{queryvalidator({q:{color:0}})},Error);
		assert.throws(()=>{queryvalidator({q:{color:{}}})},Error);

		assert.throws(()=>{queryvalidator({q:{atimerange:0}})},Error);
		assert.throws(()=>{queryvalidator({q:{atimerange:{min:"sdsd"}}})},Error);
		assert.throws(()=>{queryvalidator({q:{atimerange:{max:"sdsd"}}})},Error);

		assert.throws(()=>{queryvalidator({q:{ratingrange:0}})},Error);
		assert.throws(()=>{queryvalidator({q:{ratingrange:{min:"sdsd"}}})},Error);
		assert.throws(()=>{queryvalidator({q:{ratingrange:{max:"sdsd"}}})},Error);

		assert.throws(()=>{queryvalidator({q:{sortby:0}})},Error);
		assert.throws(()=>{queryvalidator({q:{sortby:"afasfd"}})},Error);

		assert.throws(()=>{queryvalidator({q:{sortorder:0}})},Error);
		assert.throws(()=>{queryvalidator({q:{sortorder:"afasfd"}})},Error);

		assert.doesNotThrow(()=>{queryvalidator({q:{productid:1}})},Error);
		assert.doesNotThrow(()=>{queryvalidator({q:{color:"grey"}})},Error);
		assert.doesNotThrow(()=>{queryvalidator({q:{atimerange:{min:0,max:60}}})},Error);
		assert.doesNotThrow(()=>{queryvalidator({q:{ratingrange:{min:1,max:4}}})},Error);

		assert.doesNotThrow(()=>{queryvalidator({q:{sortby:"atime"}})},Error);
		assert.doesNotThrow(()=>{queryvalidator({q:{sortby:"price"}})},Error);
		assert.doesNotThrow(()=>{queryvalidator({q:{sortby:"rating"}})},Error);

		assert.doesNotThrow(()=>{queryvalidator({q:{sortorder:"desc"}})},Error);
		assert.doesNotThrow(()=>{queryvalidator({q:{sortorder:"asc"}})},Error);
	});
});

after(async function () {
//  close mongo connection
});