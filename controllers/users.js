const User = require('../models/user');
const Review = require('../models/review');

function validateZip(s) {
    const re = /^[0-9]{5}(?:-[0-9]{4})?$/g;
    return re.exec(s);
}

module.exports.renderRegister = (req, res) => {
    res.render('users/register');
}

module.exports.register = async (req, res) => {
    try {
        const { username, password, zip, city, state } = req.body;
        if (!validateZip(zip)) throw new Error("Invalid ZIP Code");

        const user = new User({ username, zip, city, state });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash("success", "Welcome to Day Trip!");
            res.redirect('/');
        });
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/users/register');
    }
}

module.exports.renderLogin = (req, res) => {
    res.render('users/login');
}

module.exports.login = async (req, res) => {
    req.flash('success', 'Welcome back!');
    /*
    Get username from req.body and get user obj 
    from the db to display username and pfp
    */


    const redirectUrl = res.locals.returnTo || "/";
    delete res.locals.returnTo;

    if (redirectUrl.includes("save")) {
        res.redirect(307, redirectUrl);
    } else {
        res.redirect(redirectUrl);
    }
}

module.exports.renderProfile = async (req, res) => {
    const { id } = req.params;
    const user = req.user;
    const reviews = await Review.find({ authorId: id }).populate('places');

    res.render('users/overview', { reviews, user });
}

module.exports.saveCity = async (req, res) => {
    const id = req.user._id;
    const location = req.params.city;
    const state = location.split(',')[1].trim();
    const city = location.split(',')[0];

    const user = await User.findById(id);
    user.bookmarks.push({ city: city, state: state });
    user.save();
    req.flash('success', 'City saved!');
    res.redirect(`/cities/${location}`);
}

module.exports.renderPhoto = (req, res) => {
    res.render('users/photo')
}

module.exports.uploadPhoto = async (req, res) => {
    const id = req.user._id;
    console.log(req.body);
    console.log(req.file);
    const user = await User.findById(id);
    user.avatar = { url: req.file.path, filename: req.file.filename };
    await user.save();
    req.flash('success', 'Successfully uploaded an image!')
    res.redirect(`/users/${id}`);
}

module.exports.logout = (req, res) => {
    req.logout(function (err) {
        if (err) { return next(err); }
        req.flash("success", "Goodbye!");
        res.redirect('/');
    });
}