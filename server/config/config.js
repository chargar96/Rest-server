process.env.PORT = process.env.PORT || 3000;


process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

let urlDB;
/*
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else{
    urlDB = 'mongodb://cafe-user:lkija8@ds115798.mlab.com:15798/cafe';
}*/
urlDB = process.env.MONGO_URL;
process.env.URLDB = urlDB;
