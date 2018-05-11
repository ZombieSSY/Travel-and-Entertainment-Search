var express = require('express');
var router = express.Router();
var yelp = require('yelp-fusion');

router.get('/', function (req, res) {
	try {
		var YELP_API_KEY = "Q51AQchzmtfrcd0FsNSe8pMYFKV4gCp1aJWmROFWKSJD7SafFgLexoSXneUTgjPP-iaZ-KHqvjDJGMmeHNNAH3muVUco1R-PVqMMzbb1RkGQrxfnb-48cMpHWDTBWnYx";
		var client = yelp.client(YELP_API_KEY);	
		if (!req.query.name || !req.query.address1 || !req.query.address2 || !req.query.city || !req.query.state || !req.query.country) {
			var errorMsg = {};
			errorMsg.error = 1;
			errorMsg["Error Message"] = "No Records has been found";
			res.send(JSON.stringify(errorMsg));
		} else {
			console.log(req.query.name);
			console.log(req.query.address1);
			console.log(req.query.address2);
			console.log(req.query.city);
			console.log(req.query.state);
			console.log(req.query.country);

			var zipCode = req.query.zipCode;
			client.businessMatch('lookup', {
				name: req.query.name,
				address1: req.query.address1,
				address2: req.query.address2,
				city: req.query.city,
				state: req.query.state,
				country: req.query.country
			}).then(function (response) {
				var data = response.jsonBody.businesses[0];
				console.log(data);
				if (data.location.zip_code == zipCode) {
					var output = {};
					output.error = 0;
					output.data = data.id;
					res.send(JSON.stringify(output));
				} else {
					var errorMsg = {};
					errorMsg.error = 1;
					errorMsg["Error Message"] = "No Records has been found";
					res.send(JSON.stringify(errorMsg));
				}
			}).catch (function (err) {
				var errorMsg = {};
				errorMsg.error = 1;
				errorMsg["Error Message"] = err;
				res.send(JSON.stringify(errorMsg));
			}); 
		} 
	} catch(error) {
		var errorMsg = {};
		errorMsg.error = 1;
		errorMsg["Error Message"] = "No Records has been found";
		res.send(JSON.stringify(errorMsg));
	}
});

module.exports = router;