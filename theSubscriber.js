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


