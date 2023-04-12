const mongoose=require('mongoose')

const imgSchema= new mongoose.Schema({
    name:String,
    image:{
        type:Buffer,
        contentType:String,
        required:true
    }
})

module.exports=mongoose.model('image', imgSchema);