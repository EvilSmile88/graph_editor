const path = require('path');
const fs = require('fs');
const directoryPath = path.join(__dirname, 'client', 'src', 'js', 'env.js');

fs.writeFile(directoryPath, 'env = {API_URL: \'/api/\'}', function (err) {
    if (err) throw err;
    console.log('File is created successfully.');
});