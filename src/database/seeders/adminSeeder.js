const {
    hash: hashPassword,
    compare: comparePassword,
  } = require('../../utils/password');

//   const { logger } = require('../../utils/logger');

(() => {    
    const hashedPassword = hashPassword("admin123")
    require('../../config/db.config').query("insert into users (firstname , lastname ,email , password , is_super_admin , createdAt , updatedAt) values('Super','Admin','admin@gmail.com','"+hashedPassword+"',1, NOW(), NOW())" , (err, _) => {
         if (err) {
             console.error(err.message);
             return;
         }
         console.info('Admin seeder seed.');
         process.exit(0);
     });
 })();