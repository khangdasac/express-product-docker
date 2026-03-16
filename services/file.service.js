const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const FILE_TYPE_MATCH = [
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/gif"
];


const imagesDir = path.join(__dirname, '../images');
if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
}

const uploadFile = async file => {
    if (!file) {
        throw new Error("No file provided");
    }

    if (FILE_TYPE_MATCH.indexOf(file.mimetype) === -1) {
        throw new Error(`${file?.originalname} is invalid!`);
    }

    const uuid = crypto.randomUUID();    
    const ext = path.extname(file.originalname); 
    const fileName = `${uuid}${ext}`;
    const filePath = path.join(imagesDir, fileName);

    try {
        fs.writeFileSync(filePath, file.buffer);
        console.log(`File uploaded successfully: ${filePath}`);

        return `/images/${fileName}`;
    } catch (error) {
        console.error("Error uploading file:", error);
        throw error;
    }
};

const deleteFile = async (imagePath) => {
    if (!imagePath) return;
    
    try {
        const fileName = imagePath.split('/').pop();
        const filePath = path.join(imagesDir, fileName);

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            console.log("File deleted:", fileName);
        }
    } catch (error) {
        console.log("Delete file error:", error);
    }
};

module.exports = { uploadFile, deleteFile };