const fs = require('fs');
const path = require('path');
const imaps = require('imap-simple');


const regex = /(https?:\/\/(.+?\.)?torontomls\.net(\/[A-Za-z0-9\-\._~:\/\?#\[\]@!$&'\(\)\*\+,;\=]*)?)/gm;

const getMessages = (cb) => {
    const config = getCredentials();

    var parsedUrls = [];

    imaps.connect(config).then(function (connection) {        
        connection.openBox('INBOX').then(function () {
        
            var searchCriteria = ['ALL'];
            var fetchOptions = { bodies: ['TEXT'], struct: true };
            return connection.search(searchCriteria, fetchOptions);
     
        //Loop over each message
        }).then(function (messages) {
            let taskList = messages.map(function (message) {
                return new Promise((res, rej) => {
                    var parts = imaps.getParts(message.attributes.struct); 
                    parts.map(function (part) {
                        return connection.getPartData(message, part)
                        .then(function (partData) {
                            
                            //Display e-mail body
                            if (part.disposition == null && part.encoding != "base64"){
                                // console.log(partData);
                                const parsedUrl = partData.match(regex);

                                // check if email contains the URL
                                if(parsedUrl && parsedUrl.length === 1) {
                                    parsedUrls.push(parsedUrl[0])
                                }
                                
                            }
     
                            //Mark message for deletion
                            // connection.addFlags(message.attributes.uid, "\Deleted", (err) => {
                            //     if (err){
                            //         console.log('Problem marking message for deletion');
                            //         rej(err);
                            //     }
     
                            //     res(); //Final resolve
                            // })

                            // Don't do anything for now
                            res();
                        });
                    });
                });    
            })
     
            return Promise.all(taskList).then(() => {
                connection.imap.closeBox(true, (err) => { //Pass in false to avoid delete-flagged messages being removed
                    if (err){
                        console.log(err);
                    }
                });
                connection.end();
                cb(parsedUrls);
            });
        });
    });

}

const getCredentials = () => {
    const imapConfig = JSON.parse(fs.readFileSync(path.join(__dirname, '../config/mailbox.json')).toString());
    return({ imap: imapConfig});
}


// Sample usage of retrieving URLs from mailbox
getMessages((urls) => {
    console.log(urls);
});

module.exports = getMessages;