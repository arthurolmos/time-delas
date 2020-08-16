const multer = require("multer");
const path = require("path");
const crypto = require("crypto");

const env = process.env.NODE_ENV === "test" ? "__tests__" : "public";

module.exports = {
  dest: path.resolve(__dirname, "..", "..", "tmp", "uploads"),
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const { id, models } = req.params;

      const dir = path.resolve(
        __dirname,
        "..",
        "..",
        "tmp",
        "uploads",
        models,
        id
      );

      console.log("multer - DIRE", dir);

      cb(null, dir);
    },

    filename: (req, file, cb) => {
      crypto.randomBytes(16, function (err, hash) {
        if (err) cb(err);

        const fileName = `${hash.toString("hex")}-${file.originalname}`;

        cb(null, fileName);
      });
    },
  }),

  fileFilter: function (req, file, cb) {
    const allowedMimes = ["image/png", "image/jpg", "image/jpeg"];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(null, false, new Error("Invalid file type"));
    }
  },

  limits: {
    fileSize: 2 * 1024 * 1024,
  },
};
