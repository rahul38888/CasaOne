const joi = require('joi');

const chid_schema = joi.object().keys({
	chid:joi.number().required()
});

const validateChid = function(data){
	joi.validate(data,chid_schema,(err,result)=>{
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

module.exports = validateChid;