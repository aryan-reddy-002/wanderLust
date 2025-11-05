const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const dataSample = require("./data.js");
let MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
.then((err)=>{
    console.log("connection Established !!");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initData = async ()=>{
  await Listing.deleteMany({});
  dataSample.data = dataSample.data.map((obj)=>({
    ...obj, 
    owner : '6906243821e1030e6bf94624',
  }))
  await  Listing.insertMany(dataSample.data);
 console.log("data was initilised !!");
}

initData();

