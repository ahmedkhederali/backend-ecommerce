const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv').config();
const stripe = require("stripe")(process.env.STRIPE_API_KEY);
const connectDB = require("./db/connect");
const categoryRoutes = require('./routes/categoryRoutes');
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const genreRoutes = require('./routes/GenreRoutes');
const ratingRoutes = require('./routes/ratingRoutes');
const commentRoutes = require('./routes/commentRoutes');
const orderRoutes = require('./routes/orderRoutes');
const reportRoutes = require('./routes/reportRoutes');
const imageRoutes = require('./routes/imageRoutes');
const miniImageRoutes = require('./routes/miniImageRoutes');
const path=require('path')
const app = express();
const PORT = process.env.PORT || 4000;

// MIDDLEWARES
app.use(cors());
app.use(express.static("./frontend/build"));

app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.json());

// ROUTES
app.get("/", (req, res) => {

  res.status(StatusCodes.OK).json({mag:"Done Welcome"});
});

app.use('/users', userRoutes);
app.use('/categories', categoryRoutes);
app.use('/genres', genreRoutes);
app.use('/products', productRoutes);
app.use('/ratings', ratingRoutes);
app.use('/comments', commentRoutes);
app.use('/orders', orderRoutes);
app.use('/reports', reportRoutes);
app.use('/images', imageRoutes);
app.use('/minis', miniImageRoutes);

app.get("/", (req, res) => {
  res.status(200).send( "Done Welcome Employee 1111");
});
// STRIPE CONNECTION
app.post("/create-payment-intent", async (req, res) => {
    try{
        const { price } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
        amount: Number(price),
        currency:'USD',
        automatic_payment_methods: {
            enabled: true,
        },
    });

    res.status(200).send({
        clientSecret: paymentIntent.client_secret,
    });
    }catch(error){
        res.status(500).json({msg:error})
    }
});

/*if(process.env.NODE_ENV === 'production'){
  app.use(express.static('frontend/build'))
  app.get('*',(req,res)=>{
    res.sendFile(path.join(__dirname,'frontend','build','index.html'))
  })
}*/

const start = async () => {
    try {
      await connectDB(process.env.MONGODB_URL);
      app.listen(PORT, () =>
        console.log(`Server is listening on port ${PORT}...`)
      );
    } catch (error) {
      console.log(error);
    }
  };
  
  start();
