const { application } = require("express");
const mongoose= require("mongoose");
const { date } = require("zod");
const Schema = mongoose.Schema;
const jobschema= new schema({
    title:{
        type:string,
        required:true,
    },
    description:{
        type:string,
        required:true,
    },
    createdBy:{
        type:Schema.type.objectId,
        ref:"user",
        required:true,
    },
    createdAt:{
        type:date,
        default:Date.now,
    },
    updatedAt:{
        type:date,
        default:Date.now,
    },
    application:{
        type:Schema.type.objectId,
        ref:"Application",
        required:true,
    },
})

module.exports= mongoose.model("job", jobschema)