// multer documentation

// basically multer uses the form-data that is seen in postman.
// it takes all the info that is mentioned, takes the image and saves it in the media folder
// all the rest of the info it puts it in the req.body

const multer = require("multer");

const storage = multer.diskStorage({
  destination: "./media",
  filename: (req, file, cb) => {
    cb(null, `${+new Date()}${file.originalname}`);
  },
});

const upload = multer({
  storage,
});

module.exports = upload;
