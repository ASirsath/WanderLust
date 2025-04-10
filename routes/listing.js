const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController  = require("../controllers/listing.js");
const multer  = require('multer');
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });


router
   .route("/")
   //Index Route =  to see all the listings
   .get(wrapAsync (listingController.index))
   //Create Route = to add listing
   .post(
        isLoggedIn, 
        upload.single("listing[image]"),
        validateListing,
        wrapAsync (listingController.createListing));


//New Route
router.get("/new", 
    isLoggedIn, 
    listingController.renderNewForm);


router
   .route("/:id")
   //Show Route = to see individual list
   .get(wrapAsync(listingController.showListing))
   //Update Route
   .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing, 
    wrapAsync(listingController.updateListing))
    //Delete Route
    .delete( 
        isLoggedIn,
        isOwner, 
        wrapAsync(listingController.destroyListing));


//Edit Route
router.get("/:id/edit", 
    isLoggedIn,
    isOwner, 
    wrapAsync(listingController.renderEditForm));



// //Index Route =  to see all the listings
// router.get("/", 
//     wrapAsync (listingController.index));




// //Show Route = to see individual list
// router.get("/:id", 
//     wrapAsync(listingController.showListing));

// //Create Route = to add listing
// router.post("/", 
//     isLoggedIn, 
//     validateListing,
//     wrapAsync (listingController.createListing));



// //Update Route
// router.put("/:id",
//     isLoggedIn,
//     isOwner,
//     validateListing, 
//     wrapAsync(listingController.updateListing));

// //Delete Route
// router.delete("/:id", 
//     isLoggedIn,
//     isOwner, 
//     wrapAsync(listingController.destroyListing));

module.exports = router;