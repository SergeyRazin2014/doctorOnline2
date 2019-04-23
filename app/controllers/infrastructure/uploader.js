const mongoose = require('mongoose');

const multer = require('multer');
const path = require('path');

const crypto = require('crypto');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const methodOverride = require('method-override');


//для сохранения файлов в файловой системе
// const storage = multer.diskStorage({
//     destination: (req, file, callback) => {
//         callback(null, 'static/uploads'); //УКАЗЫВАЕМ КУДА БУДУТ СОХРАНЯТЬСЯ ФАЙЛЫ
//     },
//     filename: (req, file, callback) => {
//         let fileName = Date.now() + path.extname(file.originalname);
//         callback(null, fileName);
//     }
// });


let gfs;
mongoose.connection.once('open', () => {
    gfs = Grid(mongoose.connection.db, mongoose.mongo);
    gfs.collection('uploads');
});


// для сохранения файлов в mongodb
const storage = new GridFsStorage({
    url: process.env.DB_URI,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if (err) {
                    return reject(err);
                }
                const filename = Date.now() + path.extname(file.originalname);
                const fileInfo = {
                    filename: filename,
                    bucketName: 'uploads'
                };
                resolve(fileInfo);
            });
        });
    }
});




const upload = multer({
    storage,
    limits: { fileSize: 6 * 1024 * 1024 },
    fileFilter: (req, file, callback) => {
        const ext = path.extname(file.originalname);
        if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png') {
            const err = new Error('Extention');
            err.code = 'EXTENTION';
            return callback(err);
        }

        callback(null, true);
    }
}).single('file');

const getImgByName = async (req, res) => {

    // await gfs.files.find().toArray((err, files) => {
    //     // Check if files
    //     if (!files || files.length === 0) {
    //         return res.status(404).json({
    //             err: 'No files exist'
    //         });
    //     }

    //     // Files exist
    //     let test = res.json(files);
    // });

    let test = await gfs.files.findOne({ filename: "1555961767417.png" })

    await gfs.files.findOne({ filename: req.params.imgName })
        .then((file) => {
            // Check if file
            if (!file || file.length === 0) {
                return res.status(404).json({
                    err: 'No file exists'
                });
            }

            // Check if image
            if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
                // Read output to browser
                const readstream = gfs.createReadStream(file.filename);
                readstream.pipe(res);
            } else {
                res.status(404).json({
                    err: 'Not an image'
                });
            }
        });
}

module.exports = {
    upload,
    getImgByName
};


