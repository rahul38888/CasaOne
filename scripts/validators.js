const joi = require('joi');

const product_id_validator = joi.object().keys({
	productid:joi.number().required().positive().integer()
});

const atime_validator = joi.object().keys({
	atime:joi.number().required().positive().integer()
});

const filter_schema = joi.object().keys({
	productid:joi.number().positive(),
	color:joi.string(),
	maxatime:joi.number().positive(),
	minatime:joi.number().positive(),
	sortby:joi.string().valid('atime','price'),
	sortorder:joi.string().valid('desc','asc')
}).required()

const query_validator = joi.object({
	q:filter_schema
})

function validate(data,validator) {
	return joi.validate(data,validator,(err,result)=>{
		if(err){
			const errors = [];
			err.details.forEach(detail=>{errors.push(detail.message)});
			console.log(errors);
			throw err;
		}
		else
			return true;
	});
}

exports.productidvalidator = function(data){validate(data,product_id_validator)};
exports.atimevalidator = function(data){validate(data,atime_validator)};
exports.queryvalidator = function(data){validate(data,query_validator)};