const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const userRouter = require('./routes/user');
const productRouter = require('./routes/food')
const orderRouter = require('./routes/order')
const {success,error} = require('consola')
const json = require('express')
dotenv.config()

const app = express()

app.use(json())
app.use('/api/users', userRouter)
app.use('/api/auth', authRouter)
app.use('/api/products', productRouter)
app.use('/api/carts', cartRouter)
app.use('/api/orders', orderRouter)

const startApp = async () =>{
    try {
        await mongoose.connect(process.env.APP_DB, {
            useUnifiedTopology: true,
            useNewUrlParser: true
        });
        
        success({
            message:`Successfully connected with the Database  \n${process.env.APP_DB}`, 
            badge: true 
        })
        app.listen(process.env.APP_PORT, ()=> 
        success({
            message:`Server started on PORT ${process.env.APP_PORT}`, 
            badge: true 
        })
    );
    } catch (err) {
        
        error({
            message: `Unable to connect with \n${err}`,
            badge: true
            });
            startApp()
        }
    };
    startApp();
    