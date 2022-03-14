import UserRegister_Model from "../Models/user_model.js";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import {forgotPasswordToken, generateToken, generateEmailActivateToken } from "../MiddleWares/AuthMiddleWare.js";
import nodemailer from 'nodemailer';
import { okHttpResponse,unauthorizedHttpResponse, serverErrorHttpResponse } from "../Response/responseHelper.js";
import transporter from "../MiddleWares/SendMail.js";
import 'dotenv/config';
export const createUser=async(req,res)=>
{
    const url=process.env.CLIENT_URL;
    const userData=req.body;
    const isExist=await UserRegister_Model.findOne({email:req.body.email});
    if(isExist)
    {
       unauthorizedHttpResponse(res,{message:"Email is already exist"})       
       
    }
    else
    {
      
        const token= generateEmailActivateToken({email:req.body.email})   
        let mailOptions={
            from:process.env.EMAIL,
            to:req.body.email,
            subject:'Activation Link',
            text:`
             please click on below link to activate your account \n
            ${url}/user/activate/${token} `,  
        }
        const newUser=UserRegister_Model({name:userData.name,email:userData.email,phone_Number:userData.phone_Number,password:userData.password})
        try {
           await newUser.save();
           transporter.sendMail(mailOptions,(error)=>
           {
               if(error)
               {
                serverErrorHttpResponse(res,error);
               }
               else
               {
                    okHttpResponse(res,  {message:"Please check your email account and verify it"})

               }
           })
           }
           catch (error)
           {
            serverErrorHttpResponse(res,error);
           }


    }
}
export const activateUserEmail=async(req,res)=>
{
    const token=req.params.token;

    try {
        jwt.verify(token,process.env.EMAIL_ACTIVATE_TOKEN);
        const newUser=jwt.decode(token,{complete:true})  
        const userData=newUser.payload;
        try {
            await UserRegister_Model.updateOne({email:userData.email},{verified:true})
            okHttpResponse(res,  {message:"Verified successfully"})

        } catch (error) {
            serverErrorHttpResponse(res,error);
        }
       
    } catch (error) {
        unauthorizedHttpResponse(res,{message:"You are not authorized user so you can not verified"})       
        
      }


       
}
export const loginUser=async(req,res)=>
{
    const {email,password}=req.body;
    try {
        const user=await UserRegister_Model.findOne({email:email});
        if(user)
        {
            if(user.verified)
            {
                bcrypt.compare(password, user.password, function(err, result)
                {
                    if(err)
                    {
                        unauthorizedHttpResponse(res,{message:'email or password is invalid'})       
                    }
                    if(result==true)
                    {
                        var token =generateToken(user)
                        res.cookie("jwt", token, {httpOnly: true,}).status(200).json({ message: `${user.name} You have Logged in successfully 😊 👌` });
                    }
                    else
                    {
                        unauthorizedHttpResponse(res,{message:'Email or password is invalid'})       

                    }
                }); 
            }
            else
            {
                unauthorizedHttpResponse(res,{message:"Please verify your account"})       

                
            }
               
        }
        else
        {

            unauthorizedHttpResponse(res,{message:"Email or password is invalid"})       

            
        }
      
    } catch (error) {
        serverErrorHttpResponse(res,error);
    }
   
}
export const logoutUser=(req,res)=>
{
    try {
       res.clearCookie("jwt")
     okHttpResponse(res,  {message:"logged out successfully"})
       
    } catch (error) {
        serverErrorHttpResponse(res,error);
    }
}

export const forgetpassword=async(req,res)=>
{
  const {email}=req.body;
  const url=process.env.CLIENT_URL;
  const isExist=await UserRegister_Model.findOne({email:email});
  if(!isExist)
  {  
      unauthorizedHttpResponse(res,{message:"Sorry email is not exist"})       
  }
  else
  {
  
    const token=forgotPasswordToken({email:email});
    console.log(token)
    let mailOptions={
        from:process.env.EMAIL,
        to:email,
        subject:'Activation Link',
        text:`
         please click on below link to forgot your password \n
        ${url}/user/reset/${token} `,  
    }
    transporter.sendMail(mailOptions,(error)=>
    {
        if(error)
        {
            serverErrorHttpResponse(res,error);
        }
        else
        {      
            okHttpResponse(res,  {message:"Please check your email account for reset password"})
        }
    })
  }
}
export const resetPassword=async(req,res)=>
{
    const token=req.params.token;
    const {password}=req.body;

    try {
        const verified_token=jwt.verify(token,process.env.FORGOT_MAIL_KEY);
        const decodedToken=jwt.decode(token,{complete:true})
        const {email}=decodedToken.payload;
        const salt=await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(password,salt);
        try {
            await UserRegister_Model.findOneAndUpdate({email:email},{password:hashedPassword})
            okHttpResponse(res,{message:"your password has been changed"})
        } catch (error) {
            serverErrorHttpResponse(res,error);        
        }       
    } catch (error) {
        unauthorizedHttpResponse(res,{message:"You are not authorized user"})       
    }
}



