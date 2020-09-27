const joi = require('joi');

const productid_schema = joi.object().keys({
	productid:joi.number().required().positive().integer()
});

const atime_schema = joi.object().keys({
	atime:joi.number().required().positive()
});

const range = joi.object().keys({
	max:joi.number(),
	min:joi.number()
});

const filter_schema = joi.object().keys({
	productid:joi.number().positive().integer(),
	color:joi.string(),
	atimerange:range,
	ratingrange:range,
	sortby:joi.string().valid('atime','price','rating'),
	sortorder:joi.string().valid('desc','asc'),

}).required()

const query_scheme = joi.object({
	q:filter_schema
})

const rating_schema = joi.object({
	newrating:joi.number().valid(1,2,3,4,5).required()
})

function validate(data,validator) {
	return joi.validate(data,validator,(err,result)=>{
		if(err)
			throw err;
		else
			return true;
	});
}

exports.productidvalidator = function(data){validate(data,productid_schema)};
exports.atimevalidator = function(data){validate(data,atime_schema)};
exports.ratingvalidator = function(data){validate(data,rating_schema)};
exports.queryvalidator = function(data){validate(data,query_scheme)};