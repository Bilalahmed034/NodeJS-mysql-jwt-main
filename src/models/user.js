module.exports= (sequelize ,DataTypes)=>{
    const User = sequelize.define('users', {
      // Model attributes are defined here
      firstName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      lastName: {
        type: DataTypes.STRING
        // allowNull defaultValues to true
      },
      email:{
        type: DataTypes.STRING,
        allowNull: false
      },
      password:{
        type: DataTypes.STRING,
        allowNull: false,
        
      },
      phone_no:{
        type: DataTypes.STRING
      },
      address:{
        type: DataTypes.STRING
      },
      status:{
        type: DataTypes.INTEGER,
        defaultValue:1
      },
      date_of_birth:{
        type: DataTypes.DATE,
        
      },
      country:{
        type: DataTypes.STRING
      },
      gender:{
        type: DataTypes.STRING,
        defaultValue:'other'
      },
      image:{
        type: DataTypes.STRING
      },
      last_login_date:{
        type: DataTypes.DATE,
        
      },
      device_token:{
        type:DataTypes.STRING
      }
    }, {
      // Other model options go here
    });
    // User.sync({});
    User.sync({}).then(()=>{
        console.log("table users is created!!!")
    }).catch((error)=>console.log(error))
    return User;
    // `sequelize.define` also returns the model
    console.log(User === sequelize.models.User); // true
    }