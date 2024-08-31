const { default: SequelizeAuto } = require('sequelize-auto');
const config = require('./config');

var auto = new SequelizeAuto(config.dbname, config.user, config.pass, config.autoOptions);

auto.run().then(data => {
    const tableNames = Object.keys(data.tables);
    console.log(tableNames);      // table list
    // console.log(data.foreignKeys); // foreign key list
    // console.log(data.text)         // text of generated files
}).catch(err => {
    console.error('Error:', err);
});