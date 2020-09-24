var assert = require('assert');
const { CassaoneDao } = require('../scripts/casaonedao');

var dao = new CassaoneDao("localhost",27017,"casaonedb");

before(function () {
	// TODO
});

describe('testGetProductInfo', function () {
	it('One document should be there', async function (done) {
		await dao.getProductInfo(1234).then((result) => {

			console.log(result);

			assert.notEqual(result,null).done();
			assert.equal(result.length, 2);
		}).catch(done());

		// return productInfo.should.eventually.have.length(1);

	});
});

// after(function () {
// 	return dao.mongo_handler.getDBObject().close();
// });