const path = require('path');
const output = path.join(__dirname, "./model");
const options = { directory: output, caseFile: 'c', caseModel: 'c', caseProp: 'c', lang: 'js', useDefine: false, singularize: true, spaces: true, indentation: 2,
    typescript: false
 };

const postgres = {
    dbname: 'examplecreatepg',         // Extracted from the connection string
    user: 'examplecreatepg_user',      // Extracted from the connection string
    pass: 'HUxzz2R4Cxr7qaVtZMO2nxOdkDe92L9l',  // Password extracted from the connection string
    autoOptions: {
        dialect: 'postgres',
        dialectOptions: {
            ssl: {
                require: true, // This will ensure SSL is used
            }
        },
        host: 'dpg-cr4mp788fa8c73a4b6l0-a.singapore-postgres.render.com',
        port: 5432,
        ...options
    }  // Spread operator to inherit options
};


// Change to export appropriate config for your database
module.exports = postgres;