var express = require('express');
var router = express.Router();
var yelp = require('yelp-fusion');

router.get('/', function (req, res) {
	try {
		var YELP_API_KEY = "Q51AQchzmtfrcd0FsNSe8pMYFKV4gCp1aJWmROFWKSJD7SafFgLexoSXneUTgjPP-iaZ-KHqvjDJGMmeHNNAH3muVUco1R-PVqMMzbb1RkGQrxfnb-48cMpHWDTBWnYx";
		var client = yelp.client(YELP_API_KEY);	
		if (!req.query.businessID) {
			var errorMsg = {};
			errorMsg.error = 1;
			errorMsg["Error Message"] = "No Records has been found";
			res.send(JSON.stringify(errorMsg));
		} else {
			var business_id = req.query.businessID;
			client.reviews(business_id).then(function (response) {
				var data = response.jsonBody.reviews;
				var output = {};
				output.error = 0;
				output.data = data;
				res.send(JSON.stringify(output));
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