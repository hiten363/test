const mongoose=require('mongoose');

const mySchema=mongoose.Schema({
    name: String,
    tag: String,
    status: {
        type: String,
        default: 'false'
    }
});

mySchema.index({name: 1, status: 1});

const Book = mongoose.model('Book', mySchema);

module.exports=Book;
