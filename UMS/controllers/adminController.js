const User = require("../models/userModel");
const bcrypt = require('bcrypt');
const randomstring = require('randomstring');


// securing the password
const securePassword = async(password)=>{
            
    try{
         
       const passwordHash = await bcrypt.hash(password,10);
       return passwordHash;
    } catch (error) {
     console.log(error.message);
    }
 
 }


const loadLogin = async(req,res)=>{
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

             if(userData.is_admin === 0) {
                res.render('login',{message:"Email and password is incorrect"});
             }
             else {
                req.session.user_id = userData._id;
                res.redirect("/admin/home");
             }

           }else{
            res.render('login',{message:"Email and password is incorrect"});

           }

        }else{
            res.render('login',{message:"Email and password is incorrect"});
        }

    } catch (error) {
        console.log(error.message)
    }
   
}


const loadDashboard = async(req,res)=> {

    try {
      const userData =  await  User.findById({_id:req.session.user_id}); 
        res.render('home',{admin:userData});

    } catch (error) {
        console.log(error.message);
    }

}

const logout = async(req,res) => {
     
    try {
      
        req.session.destroy();
        res.redirect('/admin');

    } catch (error) {
        console.log(error.message);
    }

}

const adminDashboard = async(req,res)=> {
    try {
        
       const usersData = await User.find({is_admin:0});
       res.render('dashboard',{users:usersData});

    } catch (error) {
        console.log(error.message);
    }
}


//* Add New Work start 

const newUserLoad = async(req,res) => {
    try {

        res.render('new-user');

    } catch (error) {
        console.log(error.message);
    }    
}


const addUser = async(req,res)=> {
    try {
       
          const email=req.body.email;
          
        //   const emailRegex = /^[A-Za-z0-9.%+-]+@gmail\.com$/
          if (!email) {
              res.render('new-user' , { message: 'Invalid email provided'});
            }
            const checkmail = await User.findOne({email:email});
          

          if(!checkmail){
            const name = req.body.name

            if(!name || !/^[a-zA-Z\s]*$/.test(name)){
                res.render('new-user',{message:"Invalid name provided"})
            }

            const email = req.body.email
            const mno= req.body.mno


            const spassword= await securePassword(req.body.password)
         
            const user = new User({
                name:name,
                email:email,
                mobile:mno,
                image:0,
                password:spassword,
                is_varified:1,
                is_admin:0
            })

            const userData = await user.save()
            console.log(userData)
            if(userData){

                res.redirect('/admin/dashboard')
            }else{
                res.render('new-user',{message:"somthing wrong"});
            }
         

          }else{
            res.render('new-user',{message:"Email already Exist"});
          }


    } catch (error) {
        console.log(error.message);
    }
}

// edit user fuctionality

const editUserLoad = async(req,res)=> {
  
    try {
        const id = req.query.id;
        const userData = await User.findById({_id:id});
        if(userData){
        res.render('edit-user',{user:userData});
        }
        else{
            res.redirect('/admin/dashboard');
        }
        

    } catch (error) {
        console.log(error.message)
    }
}


// const updateUsers = async(req,res)=>{
//     try {
//         const user= await User.findById({_id:req.body.id})
//         console.log(user)
       
//     const userData= await User.findByIdAndUpdate({_id:req.body.id}, {$set:{name:req.body.name,email:req.body.email,mobile:req.body.mno,is_varified:req.body.verify}}); 
//        res.redirect('/admin/dashboard');
//     } catch(error) {
//         console.log(error.message);
//     }
// }

const updateUsers = async(req,res)=>{
    try {
        const user =await User.findOne({_id:req.body.id})
        const checkemail=await  User.findOne({email:req.body.email})
       
        if(checkemail&&checkemail._id.toString() !== req.body.category){
            res.render('edit-user',{user,message:"Email already exist"})
        

        }
        const name = req.body.name;  const email = req.body.email;
        const emailRegex = /^[A-Za-z0-9.%+-]+@gmail\.com$/;
        if (!emailRegex.test(email)) {
            return res.render('edit-user',{ user,message: 'Invalid email provided' });
        }

        if (!name || !/^[a-zA-Z][a-zA-Z\s]*$/
        .test(name)) {
            return res.render('edit-user',{user, message: 'Invalid name provided' });
        }

      const userData = await User.findByIdAndUpdate({_id:req.body.id},{$set:{name:req.body.name,email:req.body.email,mobile:req.body.mobile}})
      
      res.redirect('/admin/dashboard')
    } catch (error) {
        console.log(error.message);
    }
}

//delete Users

const deleteUser = async(req,res)=>{
    try{

       const id = req.query.id;
       await User.deleteOne({_id:id});
       res.redirect('/admin/dashboard');

    } catch (error) {
        console.log(error.message)
    }

}

module.exports = {
    loadLogin,
    verifyLogin,
    loadDashboard,
    logout,
    adminDashboard,
    newUserLoad,
    addUser,
    editUserLoad,
    updateUsers,
    deleteUser
}