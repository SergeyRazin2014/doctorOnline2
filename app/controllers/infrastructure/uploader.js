const multer = require('multer');
const path = require('path');



const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'static/uploads'); //УКАЗЫВАЕМ КУДА БУДУТ СОХРАНЯТЬСЯ ФАЙЛЫ
    },
    filename: (req, file, callback) => {
        let fileName = Date.now() + path.extname(file.originalname);
        callback(null, fileName);
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

module.exports = { 
    upload
 };


