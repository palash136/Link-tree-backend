const errorhandler = (err,req,res,next)=>{
    if(req.headerSent){
        return next(err);
    }
    res.status(500).json({
        message:err.message
        })
}

module.exports=errorhandler;