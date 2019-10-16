var WebSocketClient = require('websocket').client;

//Set up endpoint, you'll probably need to change this
var cirrusAPIendpoint = "cirrus21.yanzi.se";

// ##########CHANGE BELOW TO YOUR OWN DATA##########

//Set up credentials. Please DONT have your credentials in your code when running on production
var username = "653498331@qq.com";
var password = "000000";

//A flag to indicate which stage the session was in
var sessionstage = "getlocations";
//Set up Location ID and Device ID, please change this to your own, can be found in Yanzi Live
var locationId = "229349" //Usually a 6 digit number
var deviceID = "EUI64-0080E10300056EB7-3-Temp" //Found in Yanzi Live, ends with "-Temp"

// ################################################

// Create a web socket client initialized with the options as above
var client = new WebSocketClient();


client.on('connectFailed', function(error) {
    console.log('Connect Error: ' + error.toString());
    connection.close();
});

client.on('connect', function(connection) {
    console.log('Websocket open!');
    console.log("Checking API service status with ServiceRequest.");
    sendServiceRequest();
    sendGetLocationsRequest();
    sendGetUnitsRequest();
    sendPeriodicRequest();
    sendSubsribeRequest();

    // Handle messages
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            var json = JSON.parse(message.utf8Data);
            console.log('recieved message type:');
            console.log(json.messageType);
            if (json.messageType == 'ServiceResponse') {
                console.log("ServiceRequest succeeded, sending LoginRequest");
                console.log('rcvd' + JSON.stringify(json));
                sendLoginRequest();
            } else if (json.messageType == 'LoginResponse') {
                if (json.responseCode.name == 'success') {
                    console.log("LoginRequest succeeded, let's get some data...");
                    sendGetLocationsRequest();
                } else {
                    console.log(json.responseCode.name);
                    console.log("Couldn't login, check your username and passoword");
                    connection.close();
                }
            } else if (json.messageType == 'GetLocationsResponse') {
                if (json.responseCode.name == 'success') {
                    console.log("rcvd :  location  " + JSON.stringify(json));

                } else {
                    console.log(json.responseCode.name);
                    console.log("Couldn't get location");
                    connection.close();
                }
            } else if (json.messageType == 'GetSamplesResponse') {
                if (json.responseCode.name == 'success') {
                    console.log("Yaaaay, temperaturedata in abundance!");
                    console.log(json.sampleListDto.list);
                    connection.close();
                } else {
                    console.log("Couldn't get samples.");

                    connection.close();
                }
            } else {
                console.log("Couldn't understand");
                connection.close();
            }
        }
    });

    connection.on('error', function(error) {
        console.log("Connection Error: " + error.toString());
    });

    connection.on('close', function(error) {
        console.log('Connection closed!');
    });


});

function UserLogin() {
    if (!username) {
        console.error("The username has to be set");
        return;
    }
    if (!password) {
        console.error("The password has to be set");
        return;
    }
    client.connect("wss://" + cirrusAPIendpoint + "/cirrusAPI");
    console.log("Connecting to wss://" + cirrusAPIendpoint + "/cirrusAPI using username " + username);
}


function SendPeriodicRequest() {

}

function sendSubsribeRequest() {}

UserLogin();