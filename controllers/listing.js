const Listing = require("../models/listing.js");
const mbxgeocoding =  require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN

const geocodingClient = mbxgeocoding({ accessToken: mapToken });

module.exports.index = async (req,res)=>{
    const listingdata = await Listing.find({});
    res.render("./listings/index.ejs",{listingdata});
}

module.exports.newlisting = (req,res)=>{

    res.render("./listings/new.ejs");
};

module.exports.indilisting =async (req,res)=>{
    let {id} = req.params;
let indidata = await Listing.findById(id)
  .populate({
    path: "reviews",
    populate: {
      path: "author",
      strictPopulate: false
    }
  })
  .populate("owner");

   if (!indidata) {
    req.flash("error", "Listing you are trying to get does not exist");
    return res.redirect("/listings");
}
 res.render("./listings/show.ejs",{indidata});
}

module.exports.addlisting = async (req,res)=>{


let response = await geocodingClient.forwardGeocode({
  query: req.body.listing.location,
  limit: 1
})
  .send()
    let url  =  req.file.path;
    let filename = req.file.filename;
    let newlisting = new Listing(req.body.listing);
    newlisting.owner = req.user._id;
    newlisting.image = {url,filename};
    const geoData = response.body.features[0];
if (!geoData) {
  req.flash("error", "Invalid location — please enter a valid place name.");
  return res.redirect("/listings/new");
}

newlisting.geometry = geoData.geometry;

    await newlisting.save();
    req.flash("success","New Listing Is Created");
    res.redirect("/listings");


};

module.exports.deletelisting =  async (req,res)=>{
    let {id} = req.params;
   let deletelisting= await Listing.findByIdAndDelete(id);
   req.flash("success","Listing Deleted");
    res.redirect("/listings");
};

module.exports.editlisting = async (req,res)=>{

     let {id} = req.params;
    let indidata = await Listing.findById(id);
       if (!indidata) {
    req.flash("error", "Listing you are trying to get does not exist");
    return res.redirect("/listings");
}
    res.render("./listings/edit.ejs",{indidata});

}


module.exports.updatelisting = async (req,res)=>{
    let {id} = req.params;
    if(!req.body.listing){
        throw new ExpressError(404,"Update Terms Accordingly !!");
    }
     let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});
     if(typeof req.file != "undefined"){
    let url  =  req.file.path;
    let filename = req.file.filename;
    listing.image = {url,filename};
    await listing.save();

     }
     req.flash("success","Listing Updated !!");
     res.redirect(`/listings/${id}`);

};