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
app.use(bodyParser.urlencoded({ extended: false}));
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
    	.then(function(res) {
    		const accessToken = res['access_token'];
            console.log(`Access Token is ${accessToken}`);

            const xml = `<s:Envelope xmlns:s="http://www.w3.org/2003/05/soap-envelope" xmlns:a="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns:u="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd"><s:Header><a:Action s:mustUnderstand="1">Retrieve</a:Action><a:MessageID>urn:uuid:7e0cca04-57bd-4481-864c-6ea8039d2ea0</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><a:To s:mustUnderstand="1">https://mct181ddvnpf05z2r5mcclnpt34q.soap.marketingcloudapis.com/Service.asmx</a:To><fueloauth xmlns="http://exacttarget.com">${accessToken}</fueloauth></s:Header><s:Body xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema"><RetrieveRequestMsg xmlns="http://exacttarget.com/wsdl/partnerAPI"><RetrieveRequest><ObjectType>DataFolder</ObjectType><Properties>Name</Properties><Properties>ID</Properties><Properties>ContentType</Properties><Properties>ParentFolder.AllowChildren</Properties> <Filter xsi:type="par:SimpleFilterPart" xmlns:par="http://exacttarget.com/wsdl/partnerAPI"><Property>ContentType</Property><SimpleOperator>equals</SimpleOperator><Value>dataextension</Value></Filter></RetrieveRequest></RetrieveRequestMsg></s:Body></s:Envelope>`

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

			request(soapOptions)
				.then(function(response) {
					console.log(response);
					parseString(response, function (err, result) {
					    console.log(result);
					    console.log(result['soap:Body']);
					});
				})
				.catch(function(error) {
					console.log(error);
				})
    	})
    	.catch(function(err){
    		console.log(err);
    	});

    res.send('200');
});


app.get('/transformXML', (req, res) => {

	let xml = `<?xml version="1.0" encoding="utf-8"?><soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:wsa="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd" xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd"><env:Header xmlns:env="http://www.w3.org/2003/05/soap-envelope"><wsa:Action>RetrieveResponse</wsa:Action><wsa:MessageID>urn:uuid:54e02905-d8de-438d-abc6-2101e9b6f898</wsa:MessageID><wsa:RelatesTo>urn:uuid:7e0cca04-57bd-4481-864c-6ea8039d2ea0</wsa:RelatesTo><wsa:To>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</wsa:To><wsse:Security><wsu:Timestamp wsu:Id="Timestamp-d31f8963-4836-446a-babb-c5d74eb61b70"><wsu:Created>2019-04-09T20:58:34Z</wsu:Created><wsu:Expires>2019-04-09T21:03:34Z</wsu:Expires></wsu:Timestamp></wsse:Security></env:Header><soap:Body><RetrieveResponseMsg xmlns="http://exacttarget.com/wsdl/partnerAPI"><OverallStatus>OK</OverallStatus><RequestID>ddf26568-1f17-4748-9f29-dc15c1cd273c</RequestID><Results xsi:type="DataFolder"><PartnerKey xsi:nil="true" /><ID>830150</ID><ObjectID xsi:nil="true" /><Name>Data Extensions</Name><ContentType>dataextension</ContentType></Results><Results xsi:type="DataFolder"><PartnerKey xsi:nil="true" /><ID>916439</ID><ObjectID xsi:nil="true" /><ParentFolder><PartnerKey xsi:nil="true" /><ObjectID xsi:nil="true" /><AllowChildren>true</AllowChildren></ParentFolder><Name>Data Model</Name><ContentType>dataextension</ContentType></Results><Results xsi:type="DataFolder"><PartnerKey xsi:nil="true" /><ID>916440</ID><ObjectID xsi:nil="true" /><ParentFolder><PartnerKey xsi:nil="true" /><ObjectID xsi:nil="true" /><AllowChildren>true</AllowChildren></ParentFolder><Name>System</Name><ContentType>dataextension</ContentType></Results><Results xsi:type="DataFolder"><PartnerKey xsi:nil="true" /><ID>916441</ID><ObjectID xsi:nil="true" /><ParentFolder><PartnerKey xsi:nil="true" /><ObjectID xsi:nil="true" /><AllowChildren>true</AllowChildren></ParentFolder><Name>Segmentation</Name><ContentType>dataextension</ContentType></Results><Results xsi:type="DataFolder"><PartnerKey xsi:nil="true" /><ID>919156</ID><ObjectID xsi:nil="true" /><ParentFolder><PartnerKey xsi:nil="true" /><ObjectID xsi:nil="true" /><AllowChildren>true</AllowChildren></ParentFolder><Name>Vouchers</Name><ContentType>dataextension</ContentType></Results><Results xsi:type="DataFolder"><PartnerKey xsi:nil="true" /><ID>919166</ID><ObjectID xsi:nil="true" /><ParentFolder><PartnerKey xsi:nil="true" /><ObjectID xsi:nil="true" /><AllowChildren>true</AllowChildren></ParentFolder><Name>VoucherConfig</Name><ContentType>dataextension</ContentType></Results></RetrieveResponseMsg></soap:Body></soap:Envelope>`;

	parseString(xml, function (err, result) {
	    console.log(result);
	    console.log(util.inspect(result, false, null));
	});

});