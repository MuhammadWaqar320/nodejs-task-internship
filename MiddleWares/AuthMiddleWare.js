import JWT from 'jsonwebtoken';
import RateLimiting from 'express-rate-limit';

export const generateToken=(user)=>
{
    const token=JWT.sign({name:user.name,userId:user._id,email:user.email}, 'secret', {expiresIn:"1h"},{ algorithm: 'RS256'});
    return token;
}
export  const auth=(req,res,next)=>
{
    const token=req.cookies.jwt;
   if(token)
   {
      try {
        const verified=JWT.verify(token,'secret');
        const decode=JWT.decode(token);
        next();
      } catch (error) {
        res.json({message:"token is not verified"})
      }
   }
   else
   {
       res.json({message:"Not Authorized"})
   }
}
export const rateLimiter= RateLimiting(
  {
    max:5,
    windowMs:20000
  }
) 
export const generateEmailActivateToken=(user)=>
{
  const token=JWT.sign({name:user.name,userId:user._id,email:user.email,phone_Number:user.phone_Number,password:user.password},process.env.EMAIL_ACTIVATE_TOKEN, {expiresIn:"1h"},{ algorithm: 'RS256'});
  return token;
}
export const forgotPasswordToken=(payload)=>
{
  const token=JWT.sign(payload,process.env.FORGOT_MAIL_KEY, {expiresIn:"1h"},{ algorithm: 'RS256'});
  return token;
}
export const auth0=(req,res,next)=>
{
  if(req.oidc.isAuthenticated())
  {
    next();
  }
  else
  {
    res.render("message")
  }
}