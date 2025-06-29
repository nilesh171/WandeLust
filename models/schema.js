const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

let DBurl = process.env.MONGODB_URL;
async function main() {
  await mongoose.connect(DBurl);
}

main().then(()=>{
    console.log("MongoDB Connected succesfully");
}).catch(err => console.log(err));

let schema = new mongoose.Schema({
    title : String,
    description : String,
    img : {
      url : String,
      filename : String
    },
    price : Number,
    location : String,
    country : String,
    reviews : [{type: mongoose.Schema.Types.ObjectId, ref: 'review' }],
    owner : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    coordinates: {
    type: {
      type: String,
      enum: ['Point'],       // 'Point' is required for GeoJSON
      required: true
    },
    coordinates: {
      type: [Number],        // [longitude, latitude]
      required: true
    }
  }
})

let reviewSchema = new mongoose.Schema({
    rating: Number,
    comment: String,
    date: { type: Date, default: Date.now },
    author :{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

let review = mongoose.model('review', reviewSchema);

let listing = mongoose.model("listing",schema);

module.exports = {listing, review};