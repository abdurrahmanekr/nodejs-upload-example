const path = require('path');
const express = require('express');
const multer = require('multer');

const app = express();

// medya yüklenebilecek bir middleware
const mediaUpload = multer({
    dest: path.join(require('os').tmpdir(), 'nodejs-upload-example'),
});

// middleware'i ekliyor sadece tek dosya için
app.put('/upload', mediaUpload.single('file'), (req, res) => {
    // req içerisinde file yüklenen dosyayı belirtiyor
    const file = req.file;

    // bu dosyanın son durumunu nereye yüklendiğini response içerisinde verelim
    res.send(file);
});

app.listen(8080, () => {
    console.log('http://localhost:8080/ üzerinde uygulama çalışmakta');
});
