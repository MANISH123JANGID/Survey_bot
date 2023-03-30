const mongoose= require('mongoose')

const educationsSchema= new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        lowercase:true,
        required:true,
    },
    qualification:{
        type:String,
        enum:['Primary Education','Secondary Education','High School','Diploma','Bachelors','Masters','Doctorate'],
    },
    college:{
        type:String,
        required:true,
    }, 
    grades:{
        type:String,
        required:true,
    },
    placed:{
        type:String,
        required:true,

    },
    package_:{
        type:String,
        required:true,
    },  
    invested:{
        type:String,
        enum:['Below ₹3 Lakh','₹3-5 Lakh','₹5-10 Lakh','₹10-15 Lakh','₹15-20 Lakh','₹20-30 Lakh','Above ₹30 Lakh']
    },
    campus_rating:{
        type:String,
        required:true,
    },
    opinion:{
        type:String,
        required:true,
    },
    Status:{
        type:String,
        enum:['Pending','Approved','Rejected'],
        default:'Pending'
    }
},{timestamps:true})

module.exports= mongoose.model('education',educationsSchema);