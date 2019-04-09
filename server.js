var express = require('express');
var bodyParser = require('body-parser');
const FuelRest = require('fuel-rest');
const request = require('request-promise');
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
              'clientId': 'nwbiy6rkgktykoquuixgjhdg',
              'clientSecret':'1GFFAQ4jNLqo5WTJaiCkqlaJ'
            },
            json: true
        }

    request(options)
    	.then(function(res) {
    		const accessToken = res['access_token'];
            console.log(`Access Token is ${accessToken}`);

            const xml = `<s:Envelope xmlns:s="http://www.w3.org/2003/05/soap-envelope" xmlns:a="http://schemas.xmlsoap.org/ws/2004/08/addressing" xmlns:u="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd"><s:Header><a:Action s:mustUnderstand="1">Retrieve</a:Action><a:MessageID>urn:uuid:7e0cca04-57bd-4481-864c-6ea8039d2ea0</a:MessageID><a:ReplyTo><a:Address>http://schemas.xmlsoap.org/ws/2004/08/addressing/role/anonymous</a:Address></a:ReplyTo><a:To s:mustUnderstand="1">https://mct181ddvnpf05z2r5mcclnpt34q.soap.marketingcloudapis.com/Service.asmx</a:To><fueloauth xmlns="http://exacttarget.com">${accessToken}</fueloauth></s:Header><s:Body xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema"><RetrieveRequestMsg xmlns="http://exacttarget.com/wsdl/partnerAPI"><RetrieveRequest><ObjectType>DataFolder</ObjectType><Properties>Name</Properties><Properties>ID</Properties><Properties>ContentType</Properties><Properties>ParentFolder.AllowChildren</Properties> <Filter xsi:type="par:SimpleFilterPart" xmlns:par="http://exacttarget.com/wsdl/partnerAPI"><Property>ContentType</Property><SimpleOperator>equals</SimpleOperator><Value>dataextension</Value></Filter></RetrieveRequest></RetrieveRequestMsg></s:Body></s:Envelope>`

            //https://mct181ddvnpf05z2r5mcclnpt34q.soap.marketingcloudapis.com/etframework.wsdl

            var args = { _xml: xml };

            var url = 'https://mct181ddvnpf05z2r5mcclnpt34q.soap.marketingcloudapis.com/etframework.wsdl';

            soap.createClient(url, (err, client) => {
            	client.DataFolder(args, (err, result) => {
            		console.log(result);
            	});
            });
            
    	})
    	.catch(function(err){
    		console.log(err);
    	});

    res.send('200');
});