const mongoose = require('mongoose');

const dbConnection = async () => {

    try{

        await mongoose.connect(process.env.MONGODB_CNN);
        //     , {
        //     useNewUrlParser: true,
        //     useUnifiedTopology: true,
        //     useCreateIndex: true
        // });

        console.log('Base de datos on-line');

    }catch (err){
        console.Error(error);
        throw new Error('Error a la hora de conectar a la base de datos');
    }


}

module.exports = {
    dbConnection
}