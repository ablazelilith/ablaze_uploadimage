const express = require('express');
const multer =  require('multer');
const ejs = require('ejs');
const path = require('path');
const port = 3000;

// **************** Upload Image ****************
// 4) Set Storage Engine
const storage = multer.diskStorage({
    destination: './public/uploads',
    filename: (req, file, cb) => {
        // ***** Solution 1 | input name and date
        // cb(null, file.fieldname + '_' +  Date.now() + path.extname(file.originalname));

        // ***** Solution 2 | file name and date
        let temp_file_arr = file.originalname.split(".");
        let temp_file_name = temp_file_arr[0];
        let temp_file_ext = temp_file_arr[1];
        cb(null, temp_file_name + '_' +  Date.now() + '.' + temp_file_ext);
    }
});
// 5) Init Upload
const upload = multer({ storage: storage }).single('postImage');
// **********************************************

// 1) Init app
const app = express();
// 2) EJS
app.set('view engine', 'ejs');
// 3) Public Folder
app.use(express.static('./public'));

 
const newUploads = [];


app.get('/', (req, res) => 
    res.render('index', {uploadedImage: newUploads})
);

app.post('/', (req, res) => {
    // res.send("Image uploaded");
    
    upload(req, res, (err) => {
        if (err) {
            res.render('index', {
                msg: err
            });
        } else {
            console.log(req.file);
            // res.send('Post image was successfully uploaded!');

            let newImgUpload = req.file.filename;
            newUploads.push(newImgUpload);
            res.redirect('/new-uploads');
        }
    });

});

app.get('/new-uploads', (req, res) => 
    res.render('new-uploads', {uploadedImage: newUploads})
);

app.listen(port, () => {
    console.log(`Ablaze's server started on port http://localhost:${port}`);
});