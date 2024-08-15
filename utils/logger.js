const fs = require('fs');
const path = require('path');

// Define the path for the log file
const logFilePath = path.join(__dirname, 'search-log.txt');

// Function to log search queries
function logSearch(userId, query) {
    const timestamp = new Date().toISOString();
    const logEntry = `${timestamp} - User ID: ${userId} - Query: ${query}\n`;

    fs.appendFile(logFilePath, logEntry, (err) => {
        if (err) {
            console.error('Failed to write to log file', err);
        }
    });
}

module.exports = { logSearch };

//this is a logger option: better error handling, logging system is more organized : A LOG FILE NEED TO
//BE CREATED IF DOESNT EXIST.( OPTIONAL)
//const fs = require('fs');
//const path = require('path');
//
//// Define the path for the log directory and file
//const logDirPath = path.join(__dirname, 'logs');
//const logFilePath = path.join(logDirPath, 'search-log.txt');
//
//// Ensure the log directory exists, create if it doesn't
//if (!fs.existsSync(logDirPath)) {
//    fs.mkdirSync(logDirPath, { recursive: true });
//}
//
//// Function to log search queries
//function logSearch(userId, query) {
//    const timestamp = new Date().toISOString();
//    const logEntry = `${timestamp} - User ID: ${userId} - Query: ${query}\n`;
//
//    fs.appendFile(logFilePath, logEntry, (err) => {
//        if (err) {
//            console.error('Failed to write to log file:', err);
//        }
//    });
//}
//
//module.exports = { logSearch };
