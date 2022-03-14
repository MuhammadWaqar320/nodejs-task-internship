import mongoose from "mongoose";
import pagination from "mongoose-paginate-v2";
const DirectorSchema=mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    gender:{type:String,required:true},
})
DirectorSchema.plugin(pagination);
const Director_Model=mongoose.model('Directors',DirectorSchema);
export default Director_Model;