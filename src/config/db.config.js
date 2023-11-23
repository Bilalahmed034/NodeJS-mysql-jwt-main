const mysql = require('mysql');
// const { logger } = require('../utils/logger');
const { DB_HOST, DB_USER, DB_PASS, DB_NAME, DB_PORT } = require('../utils/secrets');

const connection = mysql.createPool({
     host: DB_HOST,
     user: DB_USER,
     password: DB_PASS,
     database: DB_NAME,
     port:DB_PORT
 
});

connection.getConnection((err) => {
    if (err) console.error(err.message);
    else console.info('Database connected')
});

module.exports = connection;