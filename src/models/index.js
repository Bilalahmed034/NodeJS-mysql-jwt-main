const { Sequelize, DataTypes } = require('sequelize');
const config = require('../../config.json');


const sequelize = new Sequelize(config.database.database, config.database.user, config.database.password, {
  host: config.database.host,
  port: config.database.port,
  sslmode : "REQUIRED",
  dialect: 'mysql',  /* one of| 'postgres' | 'sqlite' | 'mariadb' | 'mssql' | 'db2' | 'snowflake' | 'oracle' */
  dialectOptions: {
    connectTimeout: 70000,
  },
  pool: {
    max: 30,
    min: 0,
    acquire: 60000,
    idle: 5000
  }
});

try {
  sequelize.authenticate();
  console.log('Connection has been established successfully.');
} catch (error) {
  console.error('Unable to connect to the database:', error);
}
const db = {}

db.Sequelize = Sequelize
db.sequelize = sequelize
db.user = require('./user')(sequelize, DataTypes);
db.forGotPassword = require('./forgotPassword')(sequelize, DataTypes);
db.support = require('./support')(sequelize, DataTypes);


//Relations
// db.travlerOffer.hasOne(db.user, { foreignKey: 'id', sourceKey: 'user_id' })
// db.senderOffer.hasOne(db.user, { foreignKey: 'id', sourceKey: 'user_id', truncate: { cascade: true } })
// db.travlerOffer.hasMany(db.counterTravelerOffer, { foreignKey: 'traveler_offer_id', sourceKey: 'id' })
// db.counterTravelerOffer.hasOne(db.user, { foreignKey: 'id', sourceKey: 'offered_by_sender' })
// db.senderOffer.hasMany(db.counterSenderOffer, { foreignKey: 'sender_offer_id', sourceKey: 'id' })
// db.blog.hasMany(db.blogImages, { foreignKey: 'blog_id', sourceKey: 'id' })
// db.blog.hasMany(db.blogTags, { foreignKey: 'blog_id', sourceKey: 'id' })
// db.counterSenderOffer.hasOne(db.user, { foreignKey: 'id', sourceKey: 'offered_by_traveler' })
// db.acceptedSenderOffer.hasOne(db.senderOffer, { foreignKey: 'id', sourceKey: 'sender_offer_id' })
// db.acceptedTravelerOffer.hasOne(db.travlerOffer, { foreignKey: 'id', sourceKey: 'traveler_offer_id' })
// db.acceptedSenderOffer.hasOne(db.user, { foreignKey: 'id', sourceKey: 'accepted_by_traveler' })
// db.acceptedTravelerOffer.hasOne(db.user, { foreignKey: 'id', sourceKey: 'accepted_by_sender' })
// db.travlerOffer.hasOne(db.acceptedTravelerOffer, { foreignKey: 'traveler_offer_id', sourceKey: 'id' })
// db.senderOffer.hasOne(db.acceptedSenderOffer, { foreignKey: 'sender_offer_id', sourceKey: 'id' })
// db.travlerOffer.hasOne(db.ratings, { foreignKey: 'traveler_offer_id', sourceKey: 'id' })
// db.senderOffer.hasOne(db.ratings, { foreignKey: 'sender_offer_id', sourceKey: 'id' })
// db.zonePrices.hasMany(db.paymentFormula, { foreignKey: 'zone_id', sourceKey: 'id' })
// db.zonePrices.hasOne(db.zones, { as: 'formZone', foreignKey: 'id', sourceKey: 'from_zone_id' })
// db.zonePrices.hasOne(db.zones, { as: 'toZone', foreignKey: 'id', sourceKey: 'to_zone_id' })
// db.cities.hasOne(db.countryManager, { as: 'country', foreignKey: 'id', sourceKey: 'country_id' })
// db.countryManager.hasOne(db.zones, { as: 'zone', foreignKey: 'id', sourceKey: 'zone_id' })
// db.user.hasMany(db.travlerOffer, {as:'travlerOffers' ,foreignKey: 'user_id', sourceKey: 'id' })
// db.user.hasMany(db.senderOffer, { as:'senderOffers' ,foreignKey: 'user_id', sourceKey: 'id' })
// db.user.hasMany(db.ratings, { as:'ratings' ,foreignKey: 'given_to', sourceKey: 'id' })
// db.ratings.hasOne(db.user, { as: 'givenBy', foreignKey: 'id', sourceKey: 'given_by' })
// db.ratings.hasOne(db.user, { as: 'givenTo', foreignKey: 'id', sourceKey: 'given_to' })
// db.user.hasOne(db.topDestinations , {foreignKey: 'user_id', sourceKey: 'id'})


module.exports = db;