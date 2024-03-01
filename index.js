const express = require('express');
const cors = require('cors');
const app = express();
const port = 5001;
require('./db/conn');
const User = require('./models/User');
// var mammoth = require("mammoth");
const { upload } = require('./util/util');
const Book = require('./models/Book');

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(cors());

app.get('/', async (req, res) => {
    res.send('hello world');
});

app.get('/users', async (req, res) => {
    const data = await User.find();
    res.json({ data });
});

app.post('/postUser', async (req, res) => {
    const { name, email, phone, ts } = req.body;

    const newUser = new User({
        name, email, phone, ts
    });
    const data = await newUser.save();
    res.json({ data });
});

app.put('/updateUser/:id', async (req, res) => {
    const { name, email, phone, ts } = req.body;
    const data = await User.findByIdAndUpdate(req.params.id, { $set: { name, email, phone, ts } }, { new: true });
    res.json({ data });
});

app.delete('/deleteUser/:id', async (req, res) => {
    const data = await User.findByIdAndDelete(req.params.id);
    res.json({ data });
});

app.post('/test', upload, async (req, res) => {
    try {
        let file = req.file.path;
        mammoth.extractRawText({ path: file }).then(function (result) {
            var html = result.value; // The generated HTML
            var messages = result.messages; // Any messages, such as warnings during conversion
            res.json({ html })
        }).catch(function (error) {
            console.error(error);
        });

        // mammoth.convertToHtml({ path: file })
        //     .then(function (result) {
        //         var html = result.value; // The generated HTML
        //         var messages = result.messages; // Any messages, such as warnings during conversion
        //         res.json({ html })
        //     })
        //     .catch(function (error) {
        //         console.error(error);
        //     });
    } catch (error) {
        res.json({ status: false, message: error.message });
    }
});

app.get('/books', async (req, res) => {
    // let data = await Book.find();
    let data=await Book.countDocuments({status: "true"});
    res.json({ data });
});

app.post('/books', async (req, res) => {
    let { name, tag } = req.body;
    let newBook = new Book({
        name, tag
    });
    let saveBook = await newBook.save();
    res.json({ data: saveBook });
});

app.post('/bulk-books', async (req, res) => {
    let n=100000;
    let arr=[];
    for(let i=0;i<n;i++)
    {   
        arr.push({
            name: `Book ${i+6}`,
            tag: "tag 1"
        });
    }
    let saveBook=await Book.insertMany(arr);
    res.json({ data: saveBook });
});

app.put('/books', async (req, res) => {
    let data = [];
    let ids=await Book.find({}, {_id: 1});
    // data=await Book.updateMany({_id: {$in: ids}},{$set: {status: 'true'}});
    let t1=new Date().getTime();
    let updateArr=[];
    for(let i=0;i<ids.length;i++)
    {
        if(i%2===0)
        {
            updateArr.push({
                updateOne: {filter: {_id: ids[i]}, update: {$set: {status: "false"}}}
            });
        }
        else
        {
            updateArr.push({
                updateOne: {filter: {_id: ids[i]}, update: {$set: {status: "true"}}}
            });
        }
    }

    data=await Book.bulkWrite(updateArr);
    let t2=new Date().getTime();

    res.json({ data, time: (t2-t2)/1000 });
});

app.listen(port, () => {
    console.log('Listening ...');
});
