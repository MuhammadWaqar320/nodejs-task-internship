import validator from 'validator'
export const userRegistrationValidation=(req,res,next)=>
{
    const {name,email,phone_Number,password}=req.body;
    const isEmailValid=validator.isEmail(email);
    const isNameValid=validator.isAlpha(name);
    const isNumberValid=validator.isNumeric(phone_Number);
    const isEmpty=validator.isEmpty(password);
    if((isEmailValid==true)&&(isNameValid==true)&&(isNumberValid==true)&&(!isEmpty==true))
    {
        next();
    }
    else
    {
        if(isEmailValid==false)
        {
            res.json({message:"Email is invalid"})
        }
        if(isNameValid==false)
        {
            res.json({message:"Name is invalid only alphabets are allowed"})
        }
        if(isNumberValid==false)
        {
            res.json({message:"Phone number must be contain numbers only"})
        }
        if(isEmpty==true)
        {
            res.json({message:"please enter password"})
        }
    }
}
export const actorsValidations=(req,res,next)=>
{
    const {name,age,gender}=req.body;
    const isNameValid=validator.isAlpha(name);
    const isAgeValid=validator.isEmpty(age);
    const isGender=validator.isAlpha(gender);
    if((isNameValid==true)&&(!isAgeValid==true)&&(isGender==true)&&(req.file))
    {
        next();
    }
    else
    {
        if((isNameValid==false)&&(!isAgeValid==true)&&(isGender==true))
        {
            res.status(406).json({message:"please enter valid name only alphabets are allowed"})
        }
        if((isNameValid==true)&&(!isAgeValid==false)&&(isGender==true))
        {
            res.status(406).json({message:"please enter valid age between 1 to 120"})
        }
        if((isNameValid==true)&&(!isAgeValid==true)&&(isGender==false))
        {
            res.status(406).json({message:"please enter valid gender only aphanets "})
        }
        else
        {
            res.status(406).json({message:"please fill all fields"})
        }
    }
    
}

export const calculateAvgRating=(reviews)=>
{
    let RatingArray=[]
    for(let i in reviews)
    {
        RatingArray.push(reviews[i].rating);
    }
    // here i am calculating sum using reduce function
    let sum=RatingArray.reduce((accumulator,currentValue)=>
    {
        return (accumulator+currentValue)
    },0);
    let Total_rating=RatingArray.length;
    let  avg=sum/Total_rating;
    const avg_rating=Math.round((avg + Number.EPSILON) * 100) / 100;
    return avg_rating;
}
export const reviewsValidations=(req,res,next)=>
{
   const {rating}=req.body.Reviews;
   if((rating>0)&&(rating<6))
   {
       next()
   }
   else
   {
       res.json("Invalid rating only 1-5 is allowed")
   }
}