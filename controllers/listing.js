const Listing = require("../models/listing");
const forwardGeocode = require("../utils/forwardGeocode.js");

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs", {allListings});
};

module.exports.renderNewForm = (req, res) => {
    res.render("./listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id)
    .populate({
        path: "reviews",
        populate: {
            path: "author",
        },
})
    .populate("owner");
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listings");
    }
    console.log(listing);
    res.render("./listings/show.ejs", {listing});
};

module.exports.createListing = async (req, res, next) => {
    const { location } = req.body.listing;

    // Extract image info
    let url = req.file.path;
    let filename = req.file.filename;

    // Create new listing
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };

    // Get geo-coordinates from Mapbox
    const geoData = await forwardGeocode(location);

    // Set default coordinates to Mumbai if geocoding failed
    newListing.lat = geoData.lat ?? 19.0760;
    newListing.lng = geoData.lng ?? 72.8777;

    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
};

  

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_250,w_250");
    res.render("./listings/edit.ejs", {listing , originalImageUrl});
};


module.exports.updateListing = async (req, res) => {
    const { id } = req.params;
    const updatedData = req.body.listing;

    // Fetch the current listing from DB
    let listing = await Listing.findById(id);

    // Update main fields
    listing.title = updatedData.title;
    listing.description = updatedData.description;
    listing.price = updatedData.price;
    listing.location = updatedData.location;
    listing.country = updatedData.country;

    // Update coordinates based on the new location
    const geoData = await forwardGeocode(updatedData.location);
    listing.lat = geoData.lat ?? 19.0760; // default to Mumbai
    listing.lng = geoData.lng ?? 72.8777;

    // Update image if a new file is uploaded
    if (req.file) {
        listing.image = {
            url: req.file.path,
            filename: req.file.filename
        };
    }

    await listing.save();
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
};


module.exports.destroyListing = async (req, res) => {
    const { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted");
    res.redirect("/listings");
    console.log(deletedListing);
};