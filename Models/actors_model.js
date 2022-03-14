import mongoose from "mongoose";
export const ActorsSchema=mongoose.Schema(
    {
        name:{type:String},
        age:{type:Number},
        gender:{type:String},
        profile:{type:String}
    }
)
const ActorsModel=mongoose.model('Actors',ActorsSchema)
export default ActorsModel;