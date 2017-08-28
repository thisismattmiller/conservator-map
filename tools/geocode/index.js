const H = require('highland')
const request = require('request')
const fs = require('fs')

var data = ["123 Main Street, New York, NY, 10000",""]
var results = ""

var download = function(address,callback){

	// var userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.133 Safari/537.36'
	var url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=<YOUR KEY HURR>`
	// request(url, { headers: { 'User-Agent': userAgent }}, function(err, resp, body) {
	request(url, {}, function(err, resp, body) {

	    if (err){
	    	console.log(err)
	    	process.exit()
	    }
	    console.log(url)
	    // console.log(body)
	    var json = JSON.parse(body)

	    var address = (json.results[0]) ? json.results[0].formatted_address : ""
	    var lat = (json.results[0]) ? json.results[0].geometry.location.lat : ""
	    var lng = (json.results[0]) ? json.results[0].geometry.location.lng : ""
	    var out = `"${address}","${lat}","${lng}"\n`
	    // JSON.stringify({address: address, latlng: latlng})
	    results = results + out
	    callback(null,resp)
	})


}


H(data)
	.map((addy) =>{
		// console.log(r)
		if (addy === '') results = results + "\n"
		return addy
	})
	.compact()
	.map(H.curry(download))
    .nfcall([])
    .parallel(1)
	.done(()=>{

		fs.writeFileSync(`results.csv`, results)

	})