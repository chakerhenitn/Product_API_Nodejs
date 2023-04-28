const express = require('express');
const mongoose = require('mongoose');
const Product = require('./models/productModel')
const app = express()

//using express meadlware to  get json format
app.use(express.json())
//using meadlware if we want to send data from a form not json
app.use(express.urlencoded({extended: false}))
// Declare routes
app.get('/', (req, res)=>{
    res.send('Hello This is the hoome page')
})
app.get('/blog', (req, res)=>{
    res.send('Hello This is the bolog page')
})
//post data to database
app.post('/product', async(req,res)=>{
    //console.log(req.body);
    //res.send(req.body)
    //save data model to the database
    try {
        const products = await Product.create(req.body)
        res.status(200).json(products);
        
    } catch (error) {
        console.log(error.message);
        res.status(500).json({message: error.message})
    }
})
//fetch data from the database
app.get('/products', async(req, res)=>{
    try {
        const products = await Product.find({});
        res.status(200).json(products);
        
    } catch (error) {
        res.status(500).json({message: error.mesage})
    }
});
// fetch only one product by ID
app.get('/getoneproduct/:id', async(req, res)=>{
    try {
        const {id} = req.params;
        const product = await Product.findById(id);
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({message: error.mesage})
    }
})
//update the data in the database
app.put('/updateproducts/:id', async(req, res)=>{
    try {
        const {id} = req.params;
        const product = await Product.findByIdAndUpdate(id, req.body);
        //if the product is not foud
        if(!product){
            return res.status(404)
            .json({message: `Can not found the appropriate product with this id ${id}`})
        }  // else
        const updateProduct = await Product.findById(product);
        res.status(200).json(updateProduct);
    } catch (error) {
        res.status(500).json({message: error.mesage})
    }
})

//delete products from database
app.delete('/deleteproducts/:id', async(req, res)=>{
    try {
        const {id} = req.params;
        const product = await Product.findByIdAndDelete(id);
        if(!product){
            return res.status(404).json({message: `cannot find the product by this id ${id}`})
        }
        //if the product successfully deleted
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({message: error.mesage})
    }
})




//connect to the database
try{
mongoose.set('strictQuery', false)
mongoose.connect('mongodb+srv://chakerhenitn:chakerhenitn@orderapi.p5xgvpp.mongodb.net/?retryWrites=true&w=majority')
.then(() => console.log('Connected to mongodb cloud database!'))
app.listen(3000, ()=>{
console.log('THe server is running succesfully on port 3000')
})}
catch(error){
console.log(error)
}





