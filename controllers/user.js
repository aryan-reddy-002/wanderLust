const User = require("../models/user.js");

module.exports.signup = (req,res)=>{

    res.render("./users/signup.ejs");
};

module.exports.signin =async(req,res)=>{
   try{
     let {username , password ,email} = req.body;
    const newUser = new User({
        email : email,
        username : username,
    });
   const userRegistered =  await User.register(newUser,password);
   req.login(userRegistered , (err)=>{
    if(err){
       return next(err);
   }
    req.flash("success","Welcome To WanderLust");
    res.redirect("/listings");
   })
}
   
   catch(e){
    req.flash("error","Already Same User Exists");
    res.redirect("/signup");

   }
};

module.exports.login = (req,res)=>{
    res.render("./users/login.ejs");
}

module.exports.savelogin = (req, res) => {
    req.flash("success","Welcome Back ");
    const link =res.locals.redirUrl || "/listings"  ;
    res.redirect(link);
}
module.exports.logout = (req,res)=>{
    req.logout((err)=>{
        if(err){
         next(err);
        }
        req.flash("success","you have sucessfully logout");
        return res.redirect("/listings");
    })
}