var assert = require('assert');
const { CassaoneDao } = require('../scripts/casaonedao');

var dao = new CassaoneDao("mongodb://localhost:27017/","casaonedb_test");

const collection = "productinfo";

before(function () {

});

describe('testGetProductInfo', function () {
	it('One document should be there', async function () {
		var productinfo = await dao.getProductInfo(1234).catch((error) => {
			assert.isNotOk(error,'Promise error');
		  });

		assert.notEqual(productinfo,undefined);
		assert.equal(productinfo.productid, 1234);
		assert.equal(productinfo.name, "Montauk Queen Bed Rustic Gray");
		assert.equal(productinfo.color, "grey");
		assert.equal(productinfo.assemblytime, 51);
		assert.equal(productinfo.lastassemblies.length, [40,50,35,70,60].length);

	});
});

// after(function () {
// 	return dao.mongo_handler.getDBObject().close();
// });