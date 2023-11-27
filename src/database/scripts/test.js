const { logger } = require('../../utils/logger');
const { truncateDB: truncateDBQuery } = require('../queries');
const db = require('../../config/db.config');
// const tables = ['country_managers', 'payment_formulas','pricings','supports'];
const tables = ['employees'];
const sendMessage = require('../../../helpers/send_message');

(async () => {
    const accountSid = ""
    const authToken = ""
    const client = require('twilio')(accountSid, authToken);

    db.query('Select * from ratings', (err, _) => {
                if (err) {
                    console.error(err.message);
                    return;
                }
                console.info(JSON.stringify(_));

            });
})();

// const crypto = require("crypto");

// const privateKey = crypto.randomBytes(32).toString("hex");
// console.log(privateKey);