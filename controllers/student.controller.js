const student = require("../model/student.model");
const fs = require("fs");

exports.create = (req, res) => {
  res.render("index", {
    page_title: "Home",
  });
};

/**
 * @Method insert
 * @Description Insert User Data
 */

exports.insert = async (req, res) => {
  try {
    console.log(req.body);
    console.log(req.file);
    req.body.image = req.file.filename;
    req.body.firstName = req.body.firstName.trim();
    req.body.lastName = req.body.lastName.trim();
    if (!req.body.firstName && !req.body.lastName) {
      console.log("Field should not be empty");
      res.redirect("/");
    }
    let isEmailExist = await student.find({
      email: req.body.email,
      isDeleted: false,
    });
    if (!isEmailExist.length) {
      let isContactExists = await student.find({
        contactNumber: req.body.contactNumber,
        isDeleted: false,
      });
      if (!isContactExists.length) {
        req.body.fullName = `${req.body.firstName} ${req.body.lastName}`;
        console.log(req.body);

        let saveData = await student.create(req.body);
        console.log(saveData);
        if (saveData && saveData._id) {
          console.log("Data Added Successfully");
          res.redirect("/student-view");
        } else {
          console.log("Data Not Added");
          res.redirect("/");
        }
      } else {
        console.log("Contact Number Already Exists");
        res.redirect("/");
      }
    } else {
      console.log("Email Already exists");
      res.redirect("/");
    }
  } catch (err) {
    throw err;
  }
};

/**
 * @Method studentView
 * @Description view student data
 */

exports.studentView = async (req, res) => {
  try {
    let studentData = await student.find({ isDeleted: false });
    // console.log(studentData);
    res.render("studentView", {
      page_title: "student || view",
      studentData,
    });
  } catch (err) {
    throw err;
  }
};

/**
 * @Method delete
 * @Description Delete Data
 * @Delete Hard delete
 */

//Hard Delete

/* exports.delete = async (req, res) => {
  try {
    let deleteData = await student.findByIdAndRemove(req.params.id);
    if (deleteData) {
      console.log("Data Deleted Successfully...");
      res.redirect("/student-view");
    } else {
      console.log("Something went wrong...");
    }
  } catch (err) {
    throw err;
  }
}; */

//Soft Delete

exports.delete = async (req, res) => {
  try {
    let dataUpdate = await student.findByIdAndUpdate(req.params.id, {
      isDeleted: true,
    });
    if (dataUpdate && dataUpdate._id) {
      console.log("Data Deleted");
      res.redirect("/student-view");
    } else {
      console.log("Data is NOt Deleted");
      res.redirect("/student-view");
    }
  } catch (err) {
    throw err;
  }
};

/**
 * @Method edit
 * @Description edit student data
 *
 *
 */

exports.edit = async (req, res) => {
  try {
    let studentData = await student.find({ _id: req.params.id });
    console.log(studentData[0]);

    res.render("edit", {
      page_title: "Edit",
      response: studentData[0],
    });
    // console.log(studentData);
  } catch (err) {
    throw err;
  }
};

/**
 *
 * @Methode update
 * @Description Update student Data
 *
 */

exports.update = async (req, res) => {
  try {
    let data = await student.find({_id: req.body.id})
    console.log(data);
    let isEmailExists = await student.find({
      email: req.body.email,
      _id: { $ne: req.body.id },
    });
    if (!isEmailExists.length) {
      console.log(req.file);
      if (req.file) {
        req.body.image = req.file.filename;
      }
      let studentUpdate = await student.findByIdAndUpdate(
        req.body.id,
        req.body
      );
      if (req.file) {
        fs.unlinkSync(`./public/uploads/${data[0].image}`)
      };
      if (studentUpdate && studentUpdate._id) {
        console.log("Student Data Updated");
        res.redirect("/student-view");
      } else {
        console.log("Somthing went wrong");
        res.redirect("/student-view");
      }
    } else {
      console.log("Email Already Exists");
      res.redirect("/student-view");
    }
  } catch (err) {
    throw err;
  }
};

//H.W
//Ready new template
