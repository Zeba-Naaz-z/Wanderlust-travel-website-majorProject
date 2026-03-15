const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {listingSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require('multer')
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage })

const validateListing = (req, res, next) => {
  let {error} = listingSchema.validate(req.body);
    
    if(error){
      let errMsg = error.details.map((el) => el.message).join(",");
      throw new ExpressError(400, errMsg);
    } else {
      next();
    }
 };


router
.route("/")
//Index Route
.get( wrapAsync(listingController.index))
//create route
.post( 
  isLoggedIn,
  validateListing,
  upload.single("listing[image]"),
  wrapAsync(listingController.createListing) 
);


//search route
router.get("/search", async (req, res) => {

  const { query } = req.query;

  const listings = await Listing.find({
    location: { $regex: query, $options: "i" }
  });

  res.render("listings/index", { allListings: listings });

});


//New Route
router.get("/new",isLoggedIn,listingController.renderNewForm);

router.route("/:id")
//Show Route
.get(
   wrapAsync(listingController.showListing)
)
//update Route
.put(
  isLoggedIn,
  isOwner,
  upload.single("listing[image]"),
  validateListing,
  wrapAsync(listingController.updateListing))
//delete Route
.delete(isLoggedIn,
  isOwner, wrapAsync(listingController.destroyListing));


//Edit Route
router.get("/:id/edit", isLoggedIn,
  isOwner, wrapAsync(listingController.renderEditForm));

//search route  
router.get("/autocomplete", async (req, res) => {

  const term = req.query.term;

  const listings = await Listing.find({
    location: { $regex: term, $options: "i" }
  }).limit(5);

  const locations = listings.map(l => l.location);

  res.json(locations);

});



  


module.exports = router;