const router = require("express").Router();
const studentController = require("../controllers/student.controller");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/uploads");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname +
        "_" +
        Date.now() +
        "myimg" +
        path.extname(file.originalname)
    );
  },
});

const maxSize = 1 * 1024 * 1024;

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("only jpg and png and jpeg allowed"));
    }
  },
  limits: maxSize,
});

router.get("/", studentController.create);
router.post("/insert", upload.single("image"), studentController.insert);
router.get("/student-view", studentController.studentView);
router.get("/edit/:id", studentController.edit);
router.post("/update", upload.single("image"), studentController.update);
router.get("/delete/:id", studentController.delete);

module.exports = router;
