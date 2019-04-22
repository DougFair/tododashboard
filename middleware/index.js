

var middlewareObj = {};

middlewareObj.isLoggedIn = function isLoggedIn (req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You must be logged in to access this page");
    res.redirect("/");
};

module.exports = middlewareObj;