const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const applicationSchema = new Schema({
    job:{
        type:schema.type.objectId,
        ref:"job",
        required:true,
    },
    user:{
        type:schema.type.objectId,
        ref:"user",
        required:true,
    },
    status:{
        type:string,
        enum:["pending","accepeted","rejected"],
        required:true,
        default:"pending",
    },

})
module.exports=mongoose.model("application",applicationSchema);