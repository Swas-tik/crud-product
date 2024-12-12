const express = require('express')
const mongoose = require('mongoose')

const app = express()
app.use(express.json());
const port = 8000;

async function mongoDBConnection(){
  try {
    await mongoose.connect("mongodb://localhost:27017/product-database")
  } catch (error) {
    console.log(error)
  }
}
mongoDBConnection();

const schemaProduct = new mongoose.Schema(
  {
    title: {type: String},
    description: {type: String},
    category:{type: String},
    price:{type: Number},
    rating:{type:Number},
    stock:{type:Number}
  },
  {collection: "product-collection"},
  {timestamps: true}
)

const Product = mongoose.model("Product", schemaProduct);

//Create Product in the database

app.post("/product/create", async(req,res)=>{
const {title,description,category,price,rating,stock} = req.body
try {
  const productData = await Product.create({
    title,
    description,
    category,
    price,
    rating,
    stock
  })

  return res.status(200).json({
    message: 'product created successfully...',
    product:productData})
} catch (error) {
  return res.status(500).json('Internal server error')
}
});

//Read Products from the database

app.get("/products", async (req, res)=>{
 try{ const productData = await Product.find({})
  return res.status(200).json(productData)}
  catch(error){
    return res.status(500).json(error)
  }
});

//Upadte one product from the database
app.put("/product/update", async(req,res)=>{
  const {title, price, stock} = req.body
  try{
    const productData = await Product.findOneAndUpdate(
      {title: title},
      {price: price, stock: stock},
      { new: true, upsert: true }
    )
    return res.status(200).json(
      {
      message: "product updated successfully",
      product: productData})
  }
  catch(error){
    return res.status(500).json("Internal error")
  }
  
})

//delete product from database
app.delete("/product/:stock", async(req,res)=>{
  try{
    const reqParam = req.params.stock
    const productData = await Product.findOneAndDelete({stock: reqParam})
    return res.status(200).json(
      {
      message: "Product deleted successfully...",
       product: productData})
  }catch(error){
    return res.status(500).json("Internal error",error)
  }
})

app.listen(port, ()=>{
  console.log(`Server is ready to listen on Port: ${port}`)
})