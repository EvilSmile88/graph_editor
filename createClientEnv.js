const path = require('path');
const fs = require('fs');
const PORT = process.env.PORT || 5000;

const directoryPath = path.join(__dirname, 'client', 'src', 'js', 'env.js');

const DEV_VARIABLES = {
    API_URL: `http://localhost:${PORT}/api/`
};

const PROD_VARIABLES = {
    API_URL: '/api/'
};

fs.writeFile(directoryPath, `env = ${process.argv[2] === '--prod' ? JSON.stringify(PROD_VARIABLES) :JSON.stringify(DEV_VARIABLES)}`, function (err) {
    if (err) throw err;
    console.log('File is created successfully.');
});