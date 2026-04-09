const app = require('./app');
const dotenv = require('dotenv');
const connection = require('./config/db');

dotenv.config({path :'./Config/Config.env'});

// ✅ CONNECT TO DB
connection.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err);
        return;
    }
    console.log('MySQL Connected...');
});

app.listen(process.env.PORT || 8586,()=>{
    console.log(`server is connected to http://localhost:${process.env.PORT || 8586}`);
})