const express = require('express');
const path = require('path');
const app = express();
const PORT = 4000;
const { apiKey } = require('./code'); // นำเข้ารหัสจาก code.js

// ติดตั้ง static middleware สำหรับให้บริการไฟล์ในโฟลเดอร์ images
app.use('/images', express.static(path.join(__dirname, 'images')));

app.listen(PORT, () => {
    console.log(`API Listening on PORT ${PORT}`);
});

app.get('/', (req, res) => {
    res.send('This is my API running...');
});

app.get('/about', (req, res) => {
    res.send('This is my about route');
});

// Route ใหม่เพื่อตรวจสอบรหัสและส่งลิงก์ภาพ
app.get('/check-code', (req, res) => {
    const { code, imageName } = req.query; // รับรหัสและชื่อภาพจาก query parameters

    // ตรวจสอบรหัส
    if (code === apiKey) {
        if (imageName) {
            // ตรวจสอบว่าชื่อภาพมีในโฟลเดอร์ images หรือไม่
            const imagePath = path.join(__dirname, 'images', imageName);
            const imageUrl = `/images/${imageName}`;
            
            // ส่งลิงก์ภาพถ้าภาพมีอยู่
            if (path.extname(imagePath) && path.basename(imagePath) === imageName) {
                res.send(`<a href="${imageUrl}" target="_blank">Click here to view the image</a>`);
            } else {
                res.status(404).send('Image not found');
            }
        } else {
            res.send('success');
        }
    } else {
        res.status(403).send('Unauthorized'); // ใช้รหัสสถานะ 403 สำหรับการเข้าถึงที่ไม่ได้รับอนุญาต
    }
});

module.exports = app;
