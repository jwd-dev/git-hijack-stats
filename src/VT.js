const fs = require("fs");
const VirusTotalApi = require("virustotal-api");
const virusTotal = new VirusTotalApi("<YOUR API KEY>");

fs.readFile(__filename, (err, data) => {
    if (err) {
        console.log(`Cannot read file. ${err}`);
    } else {
        virusTotal
            .fileScan(data, "file.js")
            .then(response => {
                let resource = response.resource;
                // sometimes later try:
                virusTotal.fileReport(resource).then(result => {
                    console.log(result);
                });
            })
            .catch(err => console.log(`Scan failed. ${err}`));
    }
});