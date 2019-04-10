var express = require('express');
var bodyParser = require('body-parser');
const FuelRest = require('fuel-rest');
const request = require('request-promise');
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
		clientId: 'nwbiy6rkgktykoquuixgjhdg',
		clientSecret: '1GFFAQ4jNLqo5WTJaiCkqlaJ'
	},
	origin: 'https://mct181ddvnpf05z2r5mcclnpt34q.rest.marketingcloudapis.com'
};

const RestClient = new FuelRest(options);

app.get('/getDataExtensions', (req, res) => {
	var options = {
            method: 'POST',
            uri: 'https://mct181ddvnpf05z2r5mcclnpt34q.auth.marketingcloudapis.com/v2/token',
            body: {
              'grant_type': 'client_credentials',
              'client_id': 'nwbiy6rkgktykoquuixgjhdg',
              'client_secret':'1GFFAQ4jNLqo5WTJaiCkqlaJ'
            },
            json: true
        }

    request(options)
    	.then(function(resp) {
    		const accessToken = resp['access_token'];
            console.log(`Access Token is ${accessToken}`);

            const xml = `<?xml version="1.0" encoding="UTF-8"?><s:Envelope xmlns:s="http://www.w3.org/2003/05/soap-envelope" xmlns:a="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns:u="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd"><s:Header><a:Action s:mustUnderstand="1">Retrieve</a:Action><a:MessageID>urn:uuid:7e0cca04-57bd-4481-864c-6ea8039d2ea0</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><a:To s:mustUnderstand="1">https://mct181ddvnpf05z2r5mcclnpt34q.soap.marketingcloudapis.com/Service.asmx</a:To><fueloauth xmlns="http://exacttarget.com">${accessToken}</fueloauth></s:Header><s:Body xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema"><RetrieveRequestMsg xmlns="http://exacttarget.com/wsdl/partnerAPI"><RetrieveRequest><ObjectType>DataExtension</ObjectType><Properties>Name</Properties><Filter xsi:type="SimpleFilterPart"><Property>CategoryID</Property><SimpleOperator>equals</SimpleOperator><Value>919156</Value> </Filter></RetrieveRequest></RetrieveRequestMsg></s:Body></s:Envelope>`

            //https://mct181ddvnpf05z2r5mcclnpt34q.soap.marketingcloudapis.com/etframework.wsdl
            var soapOptions = {
				    method: 'POST',
				    uri: 'https://mct181ddvnpf05z2r5mcclnpt34q.soap.marketingcloudapis.com/Service.asmx',
				    headers: {
				        'Content-Type': 'text/xml'
				    },
				    body: xml,
				    json: false // automatically stringifys body to json if true
				};

			let voucherDEs = [];
			request(soapOptions)
				.then(function(response) {
					parseString(response, function (err, result) {
					    let envelope = result['soap:Envelope']['soap:Body'][0]['RetrieveResponseMsg'][0];
					    let results = envelope['Results'];
					    results.forEach(function (item) {
					    	let name = item['Name'][0]
						    //console.log(name);
						    voucherDEs.push(name);
						});
						res.send(voucherDEs);
					});
				})
				.catch(function(error) {
					console.log(error);
				})
    	})
    	.catch(function(err){
    		console.log(err);
    	});
});


app.get('/transformXML', (req, res) => {

	let xml = `<?xml version="1.0" encoding="utf-8"?><soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:wsa="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd" xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd"><env:Header xmlns:env="http://www.w3.org/2003/05/soap-envelope"><wsa:Action>RetrieveResponse</wsa:Action><wsa:MessageID>urn:uuid:3a7f63ad-cec5-4485-a0f5-ed3ae1bea760</wsa:MessageID><wsa:RelatesTo>urn:uuid:7e0cca04-57bd-4481-864c-6ea8039d2ea0</wsa:RelatesTo><wsa:To>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</wsa:To><wsse:Security><wsu:Timestamp wsu:Id="Timestamp-fde72d80-69bc-4865-8a8b-e40adaaf5d05"><wsu:Created>2019-04-10T10:11:40Z</wsu:Created><wsu:Expires>2019-04-10T10:16:40Z</wsu:Expires></wsu:Timestamp></wsse:Security></env:Header><soap:Body><RetrieveResponseMsg xmlns="http://exacttarget.com/wsdl/partnerAPI"><OverallStatus>OK</OverallStatus><RequestID>92b4e3f3-9262-4190-8bfe-0f3455535e12</RequestID><Results xsi:type="DataExtension"><PartnerKey xsi:nil="true" /><ObjectID xsi:nil="true" /><Name>Gutschein_OTTO_April_2019</Name></Results><Results xsi:type="DataExtension"><PartnerKey xsi:nil="true" /><ObjectID xsi:nil="true" /><Name>Gutschein_ASOS_April_2019</Name></Results></RetrieveResponseMsg></soap:Body></soap:Envelope>`;

	parseString(xml, function (err, result) {
	    let envelope = result['soap:Envelope']['soap:Body'][0]['RetrieveResponseMsg'][0];
	    let results = envelope['Results'];
	    console.log(results);
	    console.log(JSON.stringify(results));
	    let voucherDEs = [];
	    results.forEach(function (item) {
	    	let name = item['Name'][0]
		    console.log(name);
		    voucherDEs.push(name);
		});
		res.send(voucherDEs);
	    // let more = envelope['$'];
	    // console.log(more);
	});

});