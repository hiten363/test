const fs = require("fs");
const multer = require("multer");

const removeUndefined = (obj) => {
    return Object.fromEntries(Object.entries(obj).filter(([e, f]) => f));
};

if (!fs.existsSync("./uploads")) {
    fs.mkdirSync("./uploads");
}

// Multer setup
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./uploads");
    },
    filename: function (req, file, cb) {
        // cb(null, file.originalname + new Date().getTime());
        let name=file.originalname;
        let splited=name.split('.');
        cb(null, 'i' + new Date().getTime() + `.${splited[splited.length-1]}`);
    }
});

const upload = multer({ storage }).single('file');

const multiUpload = multer({ storage }).fields([
    {
        name: 'images',
        maxCount: 10
    }
]);


module.exports = {
    removeUndefined,
    upload,
    multiUpload
};
