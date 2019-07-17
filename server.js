var express = require('express');
var bodyParser = require('body-parser');
const request = require('request-promise');
const FuelRest = require('fuel-rest');
var parseString = require('xml2js').parseString;
var app = express();
var port = process.env.PORT || 8080;

// Serve static files
app.use(express.static(__dirname + '/public'));

// Serve your app
console.log('Served: http://localhost:' + port);
app.listen(port);
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());



const options = {
	auth: {
		clientId: process.env.CLIENTID,
		clientSecret: process.env.CLIENT_SECRET
	},
	origin: `https://${process.env.ENDPOINT}.rest.marketingcloudapis.com`
};

const RestClient = new FuelRest(options);

global.marketingCloudAccessToken = {
	access_token: "",
	expiry: null,
	isExpired: true
}

// app.get('/getDataExtensions', (req, res) => {
// 	var options = {
//             method: 'POST',
//             uri:  `https://${process.env.ENDPOINT}.auth.marketingcloudapis.com/v2/token`,
//             body: {
//               'grant_type': 'client_credentials',
//               'client_id': `${process.env.CLIENTID}`,
//               'client_secret': `${process.env.CLIENT_SECRET}`
//             },
//             json: true
//         }

//     console.log(options);

//     request(options)
//     	.then(function(resp) {
//     		const accessToken = resp['access_token'];
//             console.log(`Access Token is ${accessToken}`);

//             const xml = `<?xml version="1.0" encoding="UTF-8"?><s:Envelope xmlns:s="http://www.w3.org/2003/05/soap-envelope" xmlns:a="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns:u="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd"><s:Header><a:Action s:mustUnderstand="1">Retrieve</a:Action><a:MessageID>urn:uuid:7e0cca04-57bd-4481-864c-6ea8039d2ea0</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><a:To s:mustUnderstand="1">https://${process.env.ENDPOINT}.soap.marketingcloudapis.com/Service.asmx</a:To><fueloauth xmlns="http://exacttarget.com">${accessToken}</fueloauth></s:Header><s:Body xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema"><RetrieveRequestMsg xmlns="http://exacttarget.com/wsdl/partnerAPI"><RetrieveRequest><ObjectType>DataExtension</ObjectType><Properties>Name</Properties><Filter xsi:type="SimpleFilterPart"><Property>CategoryID</Property><SimpleOperator>equals</SimpleOperator><Value>${process.env.DE_ID}</Value> </Filter></RetrieveRequest></RetrieveRequestMsg></s:Body></s:Envelope>`

//             var soapOptions = {
// 				    method: 'POST',
// 				    uri: `https://${process.env.ENDPOINT}.soap.marketingcloudapis.com/Service.asmx`,
// 				    headers: {
// 				        'Content-Type': 'text/xml'
// 				    },
// 				    body: xml,
// 				    json: false 
// 				};

// 			let voucherDEs = [];
// 			request(soapOptions)
// 				.then(function(response) {
// 					parseString(response, function (err, result) {
// 					    let envelope = result['soap:Envelope']['soap:Body'][0]['RetrieveResponseMsg'][0];
// 					    let results = envelope['Results'];
// 					    results.forEach(function (item) {
// 					    	let name = item['Name'][0]
// 						    //console.log(name);
// 						    voucherDEs.push(name);
// 						});
// 						res.send(voucherDEs);
// 					});
// 				})
// 				.catch(function(error) {
// 					console.log(error);
// 				})
//     	})
//     	.catch(function(err){
//     		console.log(err);
//     	});
// });

app.get('/getLanguage', (req, res) => {
	if (process.env.LANGUAGE) {
		res.send(process.env.LANGUAGE);
	} else {
		res.send('English');
	}

});


app.get('/getDEs', (req, res) => {
	//I should get an access token if I need one, also
	let voucherDEs = [];
	console.log(global.marketingCloudAccessToken);
	if (global.marketingCloudAccessToken.expiry) {
		console.log('Ive gotten a token before');
		let timediff = global.marketingCloudAccessToken.expiry - process.hrtime()[0];
		if (timediff > 20) {
			console.log('my token is still active');
			global.marketingCloudAccessToken.isExpired = false;
		} else {
			console.log('my token is expired');
			global.marketingCloudAccessToken.isExpired = true;
		}
	}
	if (global.marketingCloudAccessToken.isExpired == true) {
		getAccessToken().then((data) => {
			global.marketingCloudAccessToken.access_token = data['body']['access_token'];
			global.marketingCloudAccessToken.expiry = data['body']['expires_in'] ? process.hrtime()[0] + data['body']['expires_in'] : null;
			global.marketingCloudAccessToken.isExpired = false;
			console.log(global.marketingCloudAccessToken);
			//get journeys
			getListOfDataExtensions(global.marketingCloudAccessToken.access_token).then((response) => {
				parseString(response['body'], function (err, result) {
				    let envelope = result['soap:Envelope']['soap:Body'][0]['RetrieveResponseMsg'][0];
				    let results = envelope['Results'];
				    results.forEach(function (item) {
				    	let name = item['Name'][0]
					    //console.log(name);
					    voucherDEs.push(name);
					});
					res.send(voucherDEs);
				});
			});
			
		})
		.catch(error => console.log(error));
	} else {
		//get journeys
		getListOfDataExtensions(global.marketingCloudAccessToken.access_token).then((response) => {

			parseString(response['body'], function (err, result) {
			    let envelope = result['soap:Envelope']['soap:Body'][0]['RetrieveResponseMsg'][0];
			    let results = envelope['Results'];
			    results.forEach(function (item) {
			    	let name = item['Name'][0]
				    //console.log(name);
				    voucherDEs.push(name);
				});
				res.send(voucherDEs);
			});
		});
	}

});

function getListOfDataExtensions(accessToken) {
	return new Promise((resolve, reject) => {
		const xml = `<?xml version="1.0" encoding="UTF-8"?><s:Envelope xmlns:s="http://www.w3.org/2003/05/soap-envelope" xmlns:a="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns:u="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd"><s:Header><a:Action s:mustUnderstand="1">Retrieve</a:Action><a:MessageID>urn:uuid:7e0cca04-57bd-4481-864c-6ea8039d2ea0</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><a:To s:mustUnderstand="1">https://${process.env.ENDPOINT}.soap.marketingcloudapis.com/Service.asmx</a:To><fueloauth xmlns="http://exacttarget.com">${accessToken}</fueloauth></s:Header><s:Body xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema"><RetrieveRequestMsg xmlns="http://exacttarget.com/wsdl/partnerAPI"><RetrieveRequest><ObjectType>DataExtension</ObjectType><Properties>Name</Properties><Filter xsi:type="SimpleFilterPart"><Property>CategoryID</Property><SimpleOperator>equals</SimpleOperator><Value>${process.env.DE_ID}</Value> </Filter></RetrieveRequest></RetrieveRequestMsg></s:Body></s:Envelope>`

        var options = {
			    method: 'POST',
			    uri: `https://${process.env.ENDPOINT}.soap.marketingcloudapis.com/Service.asmx`,
			    headers: {
			        'Content-Type': 'text/xml'
			    },
			    body: xml,
			    json: false 
			};

        request(options, (err, res) => {
			if (err) reject(err);
			else resolve(res);
		})
	});

}

function getAccessToken() {
	return new Promise((resolve, reject) => {
		var options = {
            method: 'POST',
            uri: `https://${process.env.ENDPOINT}.auth.marketingcloudapis.com/v2/token`,
            body: {
              'grant_type': 'client_credentials',
              'client_id': `${process.env.CLIENTID}`,
              'client_secret': `${process.env.CLIENT_SECRET}`
            },
            json: true
        }
		request(options, (err, res) => {
			if (err) reject(err);
			else resolve(res);
		})
	})
}