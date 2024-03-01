const mongoose=require('mongoose');

mongoose.connect('mongodb+srv://akashraibinarymetrix:1234@cluster0.pnuqog3.mongodb.net/').then(()=>{
    console.log('Database Connected');
}).catch((error)=>{
    console.log(error)
});

module.exports=mongoose;
