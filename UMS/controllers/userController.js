// importing the created model from models folder
const User = require('../models/userModel');
const bcrypt = require('bcrypt');

const nodemailer = require("nodemailer");

// securing the password
const securePassword = async(password)=>{
            
   try{
        
      const passwordHash = await bcrypt.hash(password,10);
      return passwordHash;
   } catch (error) {
    console.log(error.message);
   }

}


// for send mail
const sendVerifyMail = async(name,email,user_id)=>{

    try {

       const transporter = nodemailer.createTransport({
            host:'smtp.gmail.com',
            port:587,
            secure:false,
            requireTLS:true,
            auth:{
                user:'junuchammayil@gmail.com',
                pass:'musz soef nqvg ofoe'
            }
        }) 

        const mailOptions = {
            from:'junuchammayil@gmail.com',
            to:email,
            subject:'For Verification mail',
            html: '<p>Hii ' +name+ 'please click here to <a href="http://localhost:3000/verify?id='+user_id+'"> Verify  </a>  your mail.</p> '
        }
        transporter.sendMail(mailOptions,function(error,info){
          if(error){
            console.log(error);
          }
          else{
            console.log("Email has been send:- ",info.response);
          }
        })

    } catch (error) {
        console.log(error.message);
    }

}

// loading the register page

const loadRegister = async (req, res) => {
    
    try {

        res.render('registration')

    } catch (error) {
        console.log(error.message)
    }

}

const insertUser = async (req, res) => {

    try {
        
        const spassword = await securePassword(req.body.password);
        const user = new User({
             name:req.body.name,
             email:req.body.email,
             mobile:req.body.mno,
             image:req.file.filename,
             password:spassword,
             is_admin:0
        });
        


        const userData = await user.save();

        if (userData){
            sendVerifyMail(req.body.name, req.body.email, userData._id);
            res.render('registration',{message:"Your registration has been Successfully. Please verify your mail"});
        }
        else{
            res.render('registration',{message:"Your registration has been fialed"});
        }

    } catch (error) {
        console.log(error.message)
    }

}

const verifyMail = async(req, res)=>{

     try {

       const updateInfo = await User.updateOne({_id:req.query.id},{$set:{is_varified:1}});

       console.log(updateInfo);
       res.render("email-verified");


     } catch (error) {
        
        console.log(error.message)
     }

}

// login user methods started 

const loginLoad = async (req,res)=>{
    
    try {

        res.render('login');

    } catch (error) {
        console.log(error.message);
    }

}

const verifyLogin = async(req,res)=> {
    try {
        
        const email = req.body.email;
        const password = req.body.password;

        const userData = await User.findOne({email:email});

        if(userData){
            
             const passwordMatch = await bcrypt.compare(password,userData.password);
              if(passwordMatch){
                if(userData.is_varified === 0){
                     res.render('login',{message:"Please verify your mail."});
                }
                else{
                      
                      req.session.user_id = userData._id;
                      res.redirect('/home');
                }

              }else {
                res.render('login',{message:"Email and password is incorrect"});
              }

        }
        else{
            res.render('login',{message:"Email and password is incorrect"});
        }

    } catch (error) {
        console.log(error.message);
    }
}


const loadHome = async(req,res)=>{
    try {
      const userData = await User.findById({_id:req.session.user_id});
       res.render('home',{ user:userData });

    }catch(error){
      console.log(error.message);
    }
}


const userLogout = async(req,res)=>{

  try {

     req.session.destroy();
     res.redirect('/');

  } catch (error) {
    console.log(error.message);
  }

}

// user profile edit & update

const editLoad = async(req,res)=> {

    try {

        const id = req.query.id;
        const userData = await User.findById({_id:id});

        if(userData) {
            res.render('edit',{ user:userData})
        }
        else {
            res.redirect('/home');
        }

    } catch (error) {
        console.log(error.message);
    }
}

const updateProfile = async(req,res)=> {

    try {

        if(req.file){
            const userData = await User.findByIdAndUpdate({_id:req.body.user_id},{$set:{ name:req.body.name, email:req.body.email , mobile:req.body.mno, image:req.file.filename}});
        }
        else{
            const userData = await User.findByIdAndUpdate({_id:req.body.user_id},{$set:{ name:req.body.name, email:req.body.email , mobile:req.body.mno}});
        }

        res.redirect('/home');

    } catch (error) {
        console.log(error.message);
    }

}

module.exports = {
    loadRegister,
    insertUser,
    verifyMail,
    loginLoad,
    verifyLogin,
    loadHome,
    userLogout,
    updateProfile,
    editLoad,
    
    
}

