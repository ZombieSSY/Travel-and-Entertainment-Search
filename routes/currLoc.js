var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
	try {
		var API_KEY = "AIzaSyBl9PldQxzq8DhuKpVCUmXc83zP1K0Ka5M";
		if (!req.query.inputLoc) {
			var errorMsg = {};
			errorMsg.error = 1;
			errorMsg["Error Message"] = "Failed to get latitude and longitude!";
			res.send(JSON.stringify(errorMsg));
		} else {
			var loc = req.query.inputLoc;
			const queryURL = "https://maps.googleapis.com/maps/api/geocode/json?address=" + encodeURIComponent(loc).replace(/%20/g, '+') + "&key=" + API_KEY;
			getLoc(queryURL, res);
		}
	} catch (error) {
		var errorMsg = {};
		errorMsg.error = 1;
		errorMsg["Error Message"] = "Failed to get latitude and longitude!";
		res.send(JSON.stringify(errorMsg));
	}
});

function getLoc(locURL, res) {
	var request = require('request');
	request(locURL, function(error, response, body){
		if (error) {
			var errorMsg = {};
			errorMsg.error = 1;
			errorMsg["Error Message"] = "Location is not correct!";
			res.send(JSON.stringify(errorMsg));
		} else {
			try {
				var jsonObj = JSON.parse(body);
				var locations = [];				
				if (jsonObj === null || jsonObj["status"] !== "OK") {
					locations[0] = null;
					locations[1] = null;
				} else {
					if(jsonObj.results[0].geometry.location){
						var geoLocation = jsonObj.results[0].geometry.location;
						if (geoLocation["lat"] && geoLocation["lng"]) {
							locations[0] = geoLocation["lat"];
							locations[1] = geoLocation["lng"];
						} else {
							locations[0] = null;
							locations[1] = null;
						}

					} else{
						locations[0] = null;
						locations[1] = null;
					}
				}
				if (locations[0] == null || locations[1] == null) {
					var errorMsg = {};
					errorMsg.error = 1;
					errorMsg["Error Message"] = "Failed to get latitude and longitude!";
					res.send(JSON.stringify(errorMsg));
				} else {
					var output = {};
					output.error = 0;
					output.data = locations;
					res.send(JSON.stringify(output));
				}
			}
			catch (err) {
				var errorMsg = {};
				errorMsg.error = 1;
				errorMsg["Error Message"] = "Failed to get latitude and longitude!";
				res.send(JSON.stringify(errorMsg));
			}
		}
	});
}

module.exports = router;