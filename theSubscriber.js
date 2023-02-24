ActiveMq = require("./ActiveMqConnection.js");

let reqQueueName = process.argv[2]; // sets to an entry on commmand line? node, then file, then the desired queue name. [2]
if (!reqQueueName || reqQueueName.length == 0) {
  reqQueueName = "defaultReq";
}
const reqQueueSpec = "/queue/" + reqQueueName;

let messageContent = process.argv[3];
if (!messageContent || messageContent.length == 0) {
    messageContent = "No specified message"
}

let subscribeHeader = {
    selector: "JMSPriority > 1"
};

ActiveMq.getConnection().then(
    ( mqConnection  ) => {
        const QUEUE = reqQueueSpec;
        mqConnection.subscribe(QUEUE, subscribeHeader,
            (data, headers) => 
                  console.log('MESSAGE RECEIVED:\n', data, headers)
        );
        const REPONSEQUEUE = "holidayResponse"
        let payload = {
            "user" : "Tom Porter",
            "message" : "Destination choice received"
        }
        let body = JSON.stringify(payload);

        let headers = {
            "priority" : 4,
            "persistent" : false,
        }

        mqConnection.publish(REPONSEQUEUE, body, headers);

       
        
        const timeout = 5000; 
        setTimeout(() => {
            mqConnection.disconnect( 
                () => console.log('DISCONNECTED')
           );
        }, timeout);
    }
).catch( e => console.log(e) );


/*

RESPONDER

ActiveMq = require("./ActiveMqConnection.js");

// Responder, with example selector

let reqQueueName = process.argv[2];
if (!reqQueueName || reqQueueName.length == 0) {
    reqQueueName = "defaultReq";
}
const reqQueueSpec = "/queue/" + reqQueueName;

const subscribeHeader = {
    selector: "JMSPriority < 6"
};

ActiveMq.getConnection().then(
    ( mqConnection  ) => {
        mqConnection.subscribe(reqQueueSpec, subscribeHeader, (data, headers) => {
           console.log('Request\n', data, headers);
           if ( headers["reply-to"] && headers["reply-to"].length > 0 ){
               // persistent response for persistent request
               let respHeader = { 
                   "persistent": headers["persistent"], 
                   "correlation-id": headers["correlation-id"], 
                };

               // reply to specfified queue
               mqConnection.publish(headers["reply-to"], 'a response to ' + data, respHeader);
           } else {
               console.log("No response destination specified");
           }
        }); 
        console.log("Booking service listening on " + reqQueueSpec); 
    }
).catch( e => console.log(e) );
*/