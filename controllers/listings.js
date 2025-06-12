const Listing = require("../models/listing");
const { getCoordinates } = require("../utils/geocode");


module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "author",
            },
        })
        .populate("owner");
    if (!listing) {
        req.flash("error", "Listing that you requested does not exist!");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
};


module.exports.createListing = async (req, res, next) => {

    const { listing } = req.body;
    const newListing = new Listing(listing);
    newListing.owner = req.user._id;

    if (req.file) {
        newListing.image = {
            url: req.file.path,
            filename: req.file.filename,
        };
    }

    const geo = await getCoordinates(listing.location);
    if (geo) newListing.geometry = geo;

    await newListing.save()
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
};


module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing that you requested does not exist!");
        return res.redirect("/listings");
    }
    let orignalImageUrl = listing.image.url;
    orignalImageUrl = orignalImageUrl.replace("/upload", "/upload/w_250");
    res.render("listings/edit.ejs", { listing, orignalImageUrl });
};

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    if (req.file) {
        listing.image = {
            url: req.file.path,
            filename: req.file.filename,
        };
    }

    if (req.body.listing.location) {
        const geo = await getCoordinates(req.body.listing.location);
        if (geo) listing.geometry = geo;
    }

    await listing.save();
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
};