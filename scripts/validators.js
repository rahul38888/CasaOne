const joi = require('joi');

const product_id_validator = joi.object().keys({
	productid:joi.number().required().positive()
});

const atime_validator = joi.object().keys({
	atime:joi.number().required()
});

function validate(data,validator) {
	joi.validate(data,validator,(err,result)=>{
		if(err){
			const errors = [];
			err.details.forEach(detail=>{errors.push(detail.message)});
			console.log(errors);
			return false;
		}
		else
			return true;
	});
}

exports.paramvalidator = function(data){validate(data,product_id_validator);};
exports.queryvalidator = function(data){validate(data,atime_validator);};