const path = require('path');
const fs = require('fs');
const directoryPath = path.join(__dirname, 'client', 'src', 'js', 'env.js');

const DEV_VARIABLES = {
    API_URL: 'http://localhost:5000/api/'
};

const PROD_VARIABLES = {
    API_URL: '/api/'
};

fs.writeFile(directoryPath, `env = ${process.argv[2] === '--prod' ? JSON.stringify(PROD_VARIABLES) :JSON.stringify(DEV_VARIABLES)}`, function (err) {
    if (err) throw err;
    console.log('File is created successfully.');
});