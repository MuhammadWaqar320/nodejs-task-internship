
import mongoose from "mongoose";
const { Schema } = mongoose;
const MoviesSchema=mongoose.Schema(
    {
        name:{type:String,required:true},
        genre:{type:String,required:true},
        actors:[{_id:{type:Schema.Types.ObjectId,ref:'Actors'}}],
        business_done:{type:Number,required:true},
        avg_rating:{type:Number,required:true},
        reviews:[{name:String,feedback:String,rating:Number}],
        directors:[{_id:{type:Schema.Types.ObjectId,ref:'Directors'}}],
        poster:{type:String}
    }
)

const MovieModel=mongoose.model('Movies',MoviesSchema);
export default MovieModel