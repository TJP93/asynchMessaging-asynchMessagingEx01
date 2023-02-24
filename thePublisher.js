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


ActiveMq.getConnection().then(
    ( mqConnection  ) => {
        const QUEUE = reqQueueSpec;

        let payload = {
            "user" : "Tom Porter",
            "action" : "search",
            "type" : "accomodation",
            "criteria" : ["mid range", "restaurants"],
            "location" : "New York, USA"
        }
       
        let body = JSON.stringify(payload);

        let headers = {
            "priority" : 4,
            "persistent": false,
        };

        mqConnection.publish(QUEUE, body, headers);
        
    //    const timeout = 5000; 
     //   setTimeout(() => {
            mqConnection.disconnect( 
                () => console.log('DISCONNECTED')
           );
      //  }, timeout);
    }
).catch( e => console.log(e) );