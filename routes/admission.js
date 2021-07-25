const Joi = require("joi");
const express = require("express");
const route = express.Router();
const auth = require("../middleware/auth");
const {
  admissionDb,
  branchDb,
  districtDb,
  examFeeDb,
  formTypeDb,
  mediumDb,
  prevQualDb,
  referenceDb,
  stateDb,
  subjectFeeDb,
  tocDataDb,
  stuSubDb,
} = require("../beans");
const utils = require("../utils");
const { ACTIVE, INACTIVE } = require("../db");

route.post("/", auth, async (req, res) => {
  try {
    // validate request
    const { error } = validate(req.body);
    if (error)
      return res.status(400).json({ lmsmsg: error.details[0].message });

    // insert into db
    let student = { ...req.body };
    student.actioned = req.user;

    // sessionYear + sessionMonth + Mob last 2 + uid last 4
    // 2021OCT265806
    let username =
      student.academic.sessionYear +
      student.academic.sessionMonth +
      student.basic.mobile.substr(8) +
      student.basic.uid.substr(8);

    let data = parseToStudent(student, username);
    const insertId = await admissionDb.createAdmission(data);
    if (!insertId)
      return res.status(400).json({
        lmsmsg: "Record creation failed. Please try again later.",
      });
    student.id = insertId;

    // send final response
    return res.status(200).json({ lmsmsg: "Record created successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      lmsmsg: "Something went wrong. Please try again later.",
    });
  }
});

function parseToStudent(student, username) {
  utils.decodeToFile(username, student.academic.image, (err, data) => {});
  let exId = student.exId ? student.exId : null;
  return [
    exId,
    utils.emptyToNull(student.academic.sessionMonth),
    student.academic.sessionYear,
    utils.emptyToNull(username),
    utils.emptyToNull(student.basic.studentName),
    student.basic.dob,
    utils.emptyToNull(student.basic.fatherName),
    utils.emptyToNull(student.basic.motherName),
    utils.emptyToNull(student.basic.occupation),
    utils.emptyToNull(student.basic.gender),
    utils.emptyToNull(student.basic.address),
    student.basic.district,
    student.basic.state,
    utils.emptyToNull(student.basic.mobile),
    utils.emptyToNull(student.basic.uid),
    utils.emptyToNull(student.basic.phone),
    utils.emptyToNull(student.basic.email),
    student.academic.applDate,
    student.academic.formType,
    student.academic.courseFee,
    student.academic.branchName,
    student.academic.courseMedium,
    student.academic.refBy,
    student.academic.refTo,
    student.subject.isNios ? 1 : 0,
    student.academic.aiCentre,
    utils.emptyToNull(student.academic.refNo),
    student.academic.enrollNo,
    utils.emptyToNull(student.subject.std),
    utils.emptyToNull(student.subject.school),
    student.subject.toc ? 1 : 0,
    utils.emptyToNull(student.subject.grpSub.join()),
    utils.emptyToNull(student.other.remark),
    student.other.prevQual ? 1 : 0,
    student.actioned.id,
  ];
}

route.put("/:id", auth, async (req, res) => {
  try {
    // validate request
    const id = req.params.id;
    if (!id)
      return res.status(400).json({
        lmsmsg: "Id is not porovided. Please provide Id and try again.",
      });

    const { error } = validate(req.body);
    if (error)
      return res.status(400).json({ lmsmsg: error.details[0].message });

    // update into db

    let student = { ...req.body };
    student.actioned = req.user;

    data = parseToStudent(student, student.username);
    console.log("1st", data);
    data.splice(28, 1);
    data.splice(17, 1);
    data.splice(5, 1);
    data.splice(0, 4);
    console.log("2nd", data);
    data.push(student.id, ACTIVE, INACTIVE);
    console.log("3rd", data);
    const updated = await admissionDb.updateAdmission(data);
    if (updated.affectedRows === 0)
      return res.status(404).json({
        lmsmsg: "No record found.",
      });

    // send final response
    return res.status(200).json({ lmsmsg: "Record updated successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      lmsmsg: "Something went wrong. Please try again later.",
    });
  }
});

route.delete("/:id", auth, async (req, res) => {
  try {
    const id = req.params.id;
    if (!id)
      return res.status(400).json({
        lmsmsg: "Id is not porovided. Please provide Id and try again.",
      });

    // Foreign key check

    const deleted = await admissionDb.deleteAdmission(id, req.user.id);
    if (deleted.affectedRows === 0)
      return res.status(404).json({
        lmsmsg: "No record found.",
      });

    // send final response
    return res.status(200).json({ lmsmsg: "Record deleted successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      lmsmsg: "Something went wrong. Please try again later.",
    });
  }
});

route.delete("/l/:id", auth, async (req, res) => {
  try {
    const id = req.params.id;
    if (!id)
      return res.status(400).json({
        lmsmsg: "Id is not porovided. Please provide Id and try again.",
      });

    // Foreign key check

    const left = await admissionDb.leftAdmission(id, req.user.id);
    if (left.affectedRows === 0)
      return res.status(404).json({
        lmsmsg: "No record found.",
      });

    // send final response
    return res
      .status(200)
      .json({ lmsmsg: "Student dropped or left successfully." });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      lmsmsg: "Something went wrong. Please try again later.",
    });
  }
});

route.delete("/t/:id", auth, async (req, res) => {
  try {
    const id = req.params.id;
    if (!id)
      return res.status(400).json({
        lmsmsg: "Id is not porovided. Please provide Id and try again.",
      });

    // Foreign key check

    const deleteTocData = await tocDataDb.deleteTocData(id, req.user.id);
    if (deleteTocData.affectedRows === 0)
      return res.status(404).json({
        lmsmsg: "No record found.",
      });

    // send final response
    return res
      .status(200)
      .json({ lmsmsg: "Requested Transfer of Credit deleted" });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      lmsmsg: "Something went wrong. Please try again later.",
    });
  }
});

route.delete("/p/:id", auth, async (req, res) => {
  try {
    const id = req.params.id;
    if (!id)
      return res.status(400).json({
        lmsmsg: "Id is not porovided. Please provide Id and try again.",
      });

    // Foreign key check

    const deletePrevQual = await prevQualDb.deletePrevQual(id, req.user.id);
    if (deletePrevQual.affectedRows === 0)
      return res.status(404).json({
        lmsmsg: "No record found.",
      });

    // send final response
    return res
      .status(200)
      .json({ lmsmsg: "Requested Previous Qualification deleted" });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      lmsmsg: "Something went wrong. Please try again later.",
    });
  }
});

route.get("/", auth, async (req, res) => {
  try {
    const students = await admissionDb.getAllAdmission();
    if (!students)
      return res.status(404).json({
        lmsmsg: "No record found.",
      });

    let retStudents = await students.map(async (value) => {
      return await parseStudent(value);
    });

    let finalRet = await Promise.all(retStudents);

    // send final response
    return res.status(200).json(finalRet);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      lmsmsg: "Something went wrong. Please try again later.",
    });
  }
});

route.get("/l/", auth, async (req, res) => {
  try {
    const students = await admissionDb.getAllLeftAdmission();
    if (!students)
      return res.status(404).json({
        lmsmsg: "No record found.",
      });

    let retStudents = await students.map(async (value) => {
      return await parseStudent(value);
    });

    let finalRet = await Promise.all(retStudents);

    // send final response
    return res.status(200).json(finalRet);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      lmsmsg: "Something went wrong. Please try again later.",
    });
  }
});

async function parseStudent(value) {
  return {
    id: value.id,
    exId: value.ex_id,
    username: value.student_username,
    sessionMonth: value.session_month,
    sessionYear: value.session_year,
    image: await utils.encodeFromFile(value.student_username),
    applDate: value.app_date,
    courseMedium: await mediumDb.getMedium(value.course_medium),
    branchName: await branchDb.getBranch(value.branch),
    formType: await formTypeDb.getFormType(value.form_type),
    courseFee: value.course_fee,
    aiCentre: value.ai_centre,
    refBy: await referenceDb.getReference(value.ref_by),
    refTo: await referenceDb.getReference(value.ref_to),
    refNo: value.ref_no,
    enrollNo: value.enroll_no,
    studentName: value.name,
    dob: value.dob,
    fatherName: value.father,
    motherName: value.mother,
    occupation: value.fmoccupation,
    gender: value.sex,
    address: value.address,
    state: await stateDb.getState(value.state),
    district: await districtDb.getDistrict(value.district),
    phone: value.phone,
    mobile: value.mobile,
    uid: value.uid,
    email: value.email,
    std: value.std,
    school: value.school,
    isNios: value.isnios ? true : false,
    toc: value.toc ? true : false,
    grpSub: await subjectFeeDb.getAllSubjectList(value.grp_subject),
    mainSub: await Promise.all(
      await (
        await stuSubDb.getAllStudentSubject(value.id)
      ).map(async (sub) => {
        return {
          ...sub,
          subject: (await subjectFeeDb.getAllSubjectList(sub.subject))[0],
        };
      })
    ),
    tocData: await Promise.all(
      await (
        await tocDataDb.getAllTocData(value.id)
      ).map(async (preVal) => {
        return {
          ...preVal,
          subject: (await subjectFeeDb.getAllSubjectList(preVal.subject))[0],
        };
      })
    ),
    remark: value.remark,
    prevQual: value.prevQual ? true : false,
    prevQualification: await prevQualDb.getAllPrevQual(value.id),
    feePaid: await examFeeDb.getFeePaid(value.id),
  };
}

route.get("/:id", auth, async (req, res) => {
  try {
    const id = req.params.id;
    if (!id)
      return res.status(400).json({
        lmsmsg: "Id is not porovided. Please provide Id and try again.",
      });

    const student = await parseStudent(await admissionDb.getAdmission(id));
    if (!student)
      return res.status(404).json({
        lmsmsg: "No record found.",
      });

    // send final response
    return res.status(200).json(student);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      lmsmsg: "Something went wrong. Please try again later.",
    });
  }
});

route.put("/result/:id", auth, async (req, res) => {
  try {
    const id = req.params.id;
    if (!id)
      return res.status(400).json({
        lmsmsg: "Id is not porovided. Please provide Id and try again.",
      });

    req.body.results.forEach(async (result) => {
      let res = [
        result.subject.id,
        result.total_fee,
        result.attempt_date,
        result.fee_deposited,
        result.ispass ? 1 : 0,
        result.score,
        req.user.id,
        id,
        result.id,
        ACTIVE,
      ];
      await stuSubDb.updateStudentSubject(res);
    });

    return res.status(200).json({
      lmsmsg: "Result Saved",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      lmsmsg: "Something went wrong. Please try again later.",
    });
  }
});

function validate(reqData) {
  const schema = Joi.object({
    username: Joi.optional(),
    id: Joi.optional(),
    exId: Joi.optional(),
    academic: Joi.object({
      sessionMonth: Joi.string().required(),
      sessionYear: Joi.number().required(),
      image: Joi.string().required(),
      applDate: Joi.string()
        .pattern(
          /^([0-3]{1}[0-9]{1})-([ADFJMNOS]{1}[a-z]{2})-([12]{1}[0-9]{3})+$/,
          "required"
        )
        .required(),
      courseMedium: Joi.number().required(),
      branchName: Joi.number().required(),
      formType: Joi.number().required(),
      courseFee: Joi.number().required(),
      aiCentre: Joi.string().optional().allow(null).allow(""),
      refBy: Joi.number().required(),
      refTo: Joi.number().required(),
      refNo: Joi.string().required(),
      enrollNo: Joi.string().optional().allow("").allow(null),
    }),
    basic: Joi.object({
      studentName: Joi.string().required(),
      dob: Joi.string()
        .pattern(
          /^([0-3]{1}[0-9]{1})-([ADFJMNOS]{1}[a-z]{2})-([12]{1}[0-9]{3})+$/,
          "required"
        )
        .required(),
      fatherName: Joi.string().required(),
      motherName: Joi.string().required(),
      occupation: Joi.string().allow("").allow(null),
      gender: Joi.string().required(),
      address: Joi.string().required(),
      state: Joi.number().required(),
      district: Joi.number().required(),
      phone: Joi.string().allow("").allow(null),
      mobile: Joi.string()
        .required()
        .min(10)
        .max(10)
        .pattern(/^([6789]{1}[0-9]{9})+$/, "required"),
      uid: Joi.string()
        .required()
        .min(12)
        .max(12)
        .pattern(/^([1-9]{1}[0-9]{11})+$/, "required"),
      email: Joi.string().email().allow("").allow(null),
    }),
    subject: Joi.object({
      std: Joi.string().required(),
      school: Joi.string().required(),
      isNios: Joi.boolean().default(false).optional(),
      toc: Joi.boolean().default(false).required(),
      grpSub: Joi.array().items(Joi.number()),
      mainSub: Joi.array().items(
        Joi.object({
          id: Joi.optional(),
          subject: Joi.number().required(),
          totalFee: Joi.number().required(),
          lastAttempted: Joi.optional(),
          feeDeposited: Joi.optional(),
          isPass: Joi.optional(),
          score: Joi.optional(),
        })
      ),
      tocData: Joi.array()
        .optional()
        .items(
          Joi.object({
            id: Joi.optional(),
            subject: Joi.number().required(),
            theory: Joi.number().min(0).max(99).required(),
            practical: Joi.number().min(0).max(99).required(),
            total: Joi.number().min(0).max(200),
          })
        ),
    }),
    other: Joi.object({
      remark: Joi.string().allow("").allow(null),
      prevQual: Joi.boolean().default(false).required(),
      prevQualification: Joi.array()
        .optional()
        .items(
          Joi.object({
            id: Joi.optional(),
            qualification: Joi.string()
              .required()
              .pattern(/^[\w ]+$/, "required"),
            rollNo: Joi.string()
              .required()
              .pattern(/^[\w ]+$/, "required"),
            board: Joi.string()
              .required()
              .pattern(/^[a-zA-Z ]+$/, "required"),
            year: Joi.string()
              .required()
              .pattern(/^([12]{1}[0-9]{3})+$/, "required"),
          })
        ),
    }),
  });
  return schema.validate(reqData);
}

module.exports = route;
