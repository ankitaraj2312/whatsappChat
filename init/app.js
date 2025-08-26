//file for inserting data 
//is file ko bass ek bar ho run karna hai taki sare data database m insert ho jayeagar hum bar bar run karenge to same data bar bar insert hoga database mai 
const mongoose=require("mongoose");
const initData=require("./data.js");
const Listing=require("../models/chat.js");
const Mongo_url="mongodb://127.0.0.1:27017/whatsappChat";

main().then(()=>{
    console.log("connected to DB");
}).catch((err)=>{
    console.log(err);
});

async function main(){
    await mongoose.connect(Mongo_url);
}
const initDB=async()=>{
    await Listing.deleteMany({});//phle database m jitne v element the sare delete karo
    //ab sare sample data add kar do
    await Listing.insertMany(initData.data);   //data we wrote as "data: sampleListings" in data.js
    console.log("data was inserted");
}

initDB();//call this function
