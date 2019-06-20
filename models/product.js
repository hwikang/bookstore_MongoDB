const Sequelize = require('sequelize');

const sequelize = require('../util/db');
                    //define new model (model name, model 구조
const Product = sequelize.define('product',{
    //attribute
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull :false,
        primaryKey : true
    },
    title:Sequelize.STRING,
    price:{
        type:Sequelize.DOUBLE,
        allowNull:false
    },
    description:{
        type:Sequelize.STRING,
        allowNull:false
    },
    imageUrl:{
        type:Sequelize.STRING,
        allowNull:false
    }
             
});
module.exports = Product
