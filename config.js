const path = require('path');
const fs = require('fs');
const output = path.join(__dirname, "./models");

const options = { directory: output, caseFile: 'c', caseModel: 'c', caseProp: 'c', lang: 'js', useDefine: false, singularize: true, spaces: true, indentation: 2,
    typescript: false
 };

const postgres = {
    dbname: 'foodiesmap_prod',         // Extracted from the connection string
    user: 'foodiesmap_prod_user',      // Extracted from the connection string
    pass: 'iPCPgz9PTMuBpN8nsxGZTCp5Ja8KrPzX',  // Password extracted from the connection string
    autoOptions: {
        dialect: 'postgres',
        dialectOptions: {
            ssl: {
                require: true, // This will ensure SSL is used
            }
        },
        host: 'dpg-crldccrtq21c73ed2gs0-a.singapore-postgres.render.com',
        port: 5432,
        ...options
    }  
};


module.exports = postgres;