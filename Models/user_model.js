import bcrypt from "bcrypt";
import mongoose from "mongoose";
import pagination from "mongoose-paginate-v2";
const UserReisterSchema=mongoose.Schema(
    {
        name:{type:String,required:true},
        email:{type:String,required:true},
        phone_Number:{type:Number,required:true},
        password:{type:String,required:true},
        verified:{type:Boolean,required:true,default:false}
    }
)
UserReisterSchema.pre('save',{ document: true, query: false },async function(next)
{
    try {
        if(this.isModified('password'))
        {
            const salt=await bcrypt.genSalt(10);
            const HashedPassword=await bcrypt.hash(this.password,salt);
            this.password=HashedPassword;
            console.log(this.password)
            next();
        }
     
    } catch (error) {
        next(error)
    }
})
UserReisterSchema.plugin(pagination);
const UserRegister_Model=mongoose.model('User',UserReisterSchema)
export default UserRegister_Model;
