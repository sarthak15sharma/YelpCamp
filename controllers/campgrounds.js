const Campground = require('../models/campground');
const {cloudinary} = require('../cloudinary');

module.exports.index = async(req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds});
};

module.exports.createCampground = async(req, res) => {
    const campground = new Campground(req.body.campground);
    campground.images = req.files.map(f => ({url: f.path, filename: f.filename}));
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', 'You have successfully created a new Campground');
    res.redirect(`/campgrounds/${campground.id}`);
};

module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new');
};

module.exports.showCampground = async(req, res) => {
    const campground = await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if(!campground){
        req.flash('error', 'Cannot find Campground !');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', {campground});
};

module.exports.renderEditForm = async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    if(!campground){
        req.flash('error', 'Cannot find Campground !');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', {campground});
};

module.exports.editCampground = async(req, res) => {
    const {id} = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground});
    const images = req.files.map(f => ({url: f.path, filename: f.filename}));
    await cloudinary.uploader.destroy(campground.images[0].filename);
    campground.images.pop();
    campground.images.push(...images);
    await campground.save();
    req.flash('success', 'You have successfully updated a Campground');
    res.redirect(`/campgrounds/${campground.id}`);
};

module.exports.deleteCampground = async(req, res) => {
    const {id} = req.params;
    const campground = await Campground.findById(id);
    const imgfile = campground.images[0].filename;
    if(imgfile){
        cloudinary.uploader.destroy(imgfile);
    }
    await campground.deleteOne();
    req.flash('success', 'You have successfully deleted a Campground');
    res.redirect('/campgrounds');
};