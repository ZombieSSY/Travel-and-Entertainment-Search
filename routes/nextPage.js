var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
	try {
		var API_KEY= "AIzaSyBl9PldQxzq8DhuKpVCUmXc83zP1K0Ka5M";
		if (!req.query.nextPageToken) {
			var errorMsg = {};
			errorMsg.error = 1;
			errorMsg["Error Message"] = "No Records has been found";
			res.send(JSON.stringify(errorMsg));
		} else {
			var next_page_token = req.query.nextPageToken;
			var nextURL = "https://maps.googleapis.com/maps/api/place/nearbysearch/json?pagetoken=" + next_page_token + "&key=" + API_KEY;
			queryNextJSON(nextURL, res);
		}
	} catch(error) {
		var errorMsg = {};
		errorMsg.error = 1;
		errorMsg["Error Message"] = "No Records has been found";
		res.send(JSON.stringify(errorMsg));
	}
});

function queryNextJSON(next_url, res) {
	var request = require('request');
	request(next_url, function(error, response, body){
		if (error) {
			var errorMsg = {};
			errorMsg.error = 1;
			errorMsg["Error Message"] = "No Records has been found";
			res.send(JSON.stringify(errorMsg));
		} else {
			var responseObj = JSON.parse(body);
			if (responseObj === null || responseObj.length === 0 || responseObj["status"] !== "OK") {
				var errorMsg = {};
				errorMsg.error = 1;
				errorMsg["Error Message"] = "No Records has been found";
				res.send(JSON.stringify(errorMsg));
			} else {
				var data = [];
				if ("results" in responseObj && responseObj["results"].length !== 0) {
					getResult(responseObj["results"], data);
				} else {
					var errorMsg = {};
					errorMsg.error = 1;
					errorMsg["Error Message"] = "No Records has been found";
					res.send(JSON.stringify(errorMsg));
				}

				var result = {};
				result.error = 0;
				result.data = data;
				if ("next_page_token" in responseObj && responseObj["next_page_token"] !== "") {
					result.nextPageToken = responseObj["next_page_token"];
				}
				console.log(result);
				res.send(JSON.stringify(result));
			}
		}
	});
}

function getResult(response, data) {
	for (var i = 0; i < response.length; i++) {
		var icon = response[i]["icon"];
		var name = response[i]["name"];
		var address = response[i]["vicinity"];
		var place_id = response[i]["place_id"];
		var lat = response[i]["geometry"]["location"]["lat"];
		var lng = response[i]["geometry"]["location"]["lng"];
		var curr_data = { icon: icon, name: name, address: address, place_id: place_id, lat: lat, lng: lng };
		data.push(curr_data);
	}
}

module.exports = router;