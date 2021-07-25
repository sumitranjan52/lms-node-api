-- Form Type table for holding form/student type and fee for same
CREATE TABLE IF NOT EXISTS lms_form_type (
`id` BIGINT(20) PRIMARY KEY AUTO_INCREMENT,
`form_type` VARCHAR(255) NOT NULL,
`form_fee` DECIMAL(10, 2) NOT NULL,
`created` BIGINT(20) NOT NULL,
`created_on` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
`modified` BIGINT(20) NULL,
`modified_on` TIMESTAMP NULL,
`active` INT(10) NOT NULL DEFAULT 1
);

-- User table for holding admin or teacher or student auth details
CREATE TABLE IF NOT EXISTS lms_users (
`id` BIGINT(20) PRIMARY KEY AUTO_INCREMENT,
`username` VARCHAR(255) NOT NULL,
`name` VARCHAR(255) NOT NULL,
`email` VARCHAR(255) NULL UNIQUE,
`mobile` VARCHAR(10) NULL UNIQUE,
`password` TEXT NOT NULL,
`admin` INT(1) NOT NULL DEFAULT 0,
`teacher` INT(1) NOT NULL DEFAULT 0,
`student` INT(1) NOT NULL DEFAULT 0,
`created` BIGINT(20) NOT NULL,
`created_on` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
`modified` BIGINT(20) NULL,
`modified_on` TIMESTAMP NULL,
`active` INT(10) NOT NULL DEFAULT 1
);

-- Class table for holding class and fee for same
CREATE TABLE IF NOT EXISTS lms_class (
`id` BIGINT(20) PRIMARY KEY AUTO_INCREMENT,
`class_name` VARCHAR(255) NOT NULL,
`quaterly_fee` DECIMAL(10, 2) NULL,
`monthly_fee` DECIMAL(10, 2) NULL,
`created` BIGINT(20) NOT NULL,
`created_on` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
`modified` BIGINT(20) NULL,
`modified_on` TIMESTAMP NULL,
`active` INT(10) NOT NULL DEFAULT 1
);

-- medium table for holding medium information like Hindi, English
CREATE TABLE IF NOT EXISTS lms_medium (
`id` BIGINT(20) PRIMARY KEY AUTO_INCREMENT,
`medium` VARCHAR(255) NOT NULL,
`created` BIGINT(20) NOT NULL,
`created_on` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
`modified` BIGINT(20) NULL,
`modified_on` TIMESTAMP NULL,
`active` INT(10) NOT NULL DEFAULT 1
);

-- branch table for holding branch information like Tonk, BKJ
CREATE TABLE IF NOT EXISTS lms_branch (
`id` BIGINT(20) PRIMARY KEY AUTO_INCREMENT,
`branch` VARCHAR(255) NOT NULL,
`address` VARCHAR(500) NOT NULL,
`created` BIGINT(20) NOT NULL,
`created_on` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
`modified` BIGINT(20) NULL,
`modified_on` TIMESTAMP NULL,
`active` INT(10) NOT NULL DEFAULT 1
);

-- gender table for holding gender information like Male, Female
CREATE TABLE IF NOT EXISTS lms_gender (
`id` BIGINT(20) PRIMARY KEY AUTO_INCREMENT,
`gender` VARCHAR(255) NOT NULL,
`created` BIGINT(20) NOT NULL,
`created_on` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
`modified` BIGINT(20) NULL,
`modified_on` TIMESTAMP NULL,
`active` INT(10) NOT NULL DEFAULT 1
);

-- state table for holding state information like Bihar, Rajasthan
CREATE TABLE IF NOT EXISTS lms_state (
`id` BIGINT(20) PRIMARY KEY AUTO_INCREMENT,
`country` BIGINT(20) NULL DEFAULT 1,
`state` VARCHAR(255) NOT NULL,
`created` BIGINT(20) NOT NULL,
`created_on` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
`modified` BIGINT(20) NULL,
`modified_on` TIMESTAMP NULL,
`active` INT(10) NOT NULL DEFAULT 1
);

-- class group name table for holding class grp name and limit information like 10th, group AA, max(10)
CREATE TABLE IF NOT EXISTS lms_grplist (
`id` BIGINT(20) PRIMARY KEY AUTO_INCREMENT,
`class` VARCHAR(255) NOT NULL,
`group_name` VARCHAR(255) NOT NULL,
`sub_limit` BIGINT(20) NOT NULL,
`created` BIGINT(20) NOT NULL,
`created_on` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
`modified` BIGINT(20) NULL,
`modified_on` TIMESTAMP NULL,
`active` INT(10) NOT NULL DEFAULT 1
);

--  this table will hold subjects and groupid from lms_grplist table and fee of each subject
CREATE TABLE IF NOT EXISTS lms_subject_fee (
`id` BIGINT(20) PRIMARY KEY AUTO_INCREMENT,
`subject_name` VARCHAR(255) NOT NULL,
`group_id` BIGINT(255) NOT NULL,
`class_id` VARCHAR(255) NOT NULL,
`theory_fee` DECIMAL(10, 2) NULL,
`practical_fee` DECIMAL(10, 2) NULL,
`created` BIGINT(20) NOT NULL,
`created_on` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
`modified` BIGINT(20) NULL,
`modified_on` TIMESTAMP NULL,
`active` INT(10) NOT NULL DEFAULT 1
);

-- reference table for holding reference information like XYZ, ABC
CREATE TABLE IF NOT EXISTS lms_reference (
`id` BIGINT(20) PRIMARY KEY AUTO_INCREMENT,
`reference` VARCHAR(255) NOT NULL,
`created` BIGINT(20) NOT NULL,
`created_on` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
`modified` BIGINT(20) NULL,
`modified_on` TIMESTAMP NULL,
`active` INT(10) NOT NULL DEFAULT 1
);

-- district table for holding district information like Muzaffarpur, Jodhpur
CREATE TABLE IF NOT EXISTS lms_district (
`id` BIGINT(20) PRIMARY KEY AUTO_INCREMENT,
`country` BIGINT(20) NULL DEFAULT 1,
`state` BIGINT(20) NOT NULL,
`district` VARCHAR(255) NOT NULL,
`created` BIGINT(20) NOT NULL,
`created_on` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
`modified` BIGINT(20) NULL,
`modified_on` TIMESTAMP NULL,
`active` INT(10) NOT NULL DEFAULT 1
);

-- country table for holding country information like India, USA
CREATE TABLE IF NOT EXISTS lms_country (
`id` BIGINT(20) PRIMARY KEY AUTO_INCREMENT,
`country` VARCHAR(255) NOT NULL,
`created` BIGINT(20) NOT NULL,
`created_on` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
`modified` BIGINT(20) NULL,
`modified_on` TIMESTAMP NULL,
`active` INT(10) NOT NULL DEFAULT 1
);

-- student table for holding student information
CREATE TABLE IF NOT EXISTS lms_student (
`id` BIGINT(20) PRIMARY KEY AUTO_INCREMENT,
`ex_id` BIGINT(20) NULL DEFAULT NULL,
`session_month` VARCHAR(10) NOT NULL,
`session_year` VARCHAR(4) NOT NULL,
`student_username` VARCHAR(255) NOT NULL,
`name` VARCHAR(255) NOT NULL,
`dob` VARCHAR(11) NOT NULL,
`father` VARCHAR(255) NOT NULL,
`mother` VARCHAR(255) NOT NULL,
`fmoccupation` VARCHAR(500) NULL,
`sex` VARCHAR(1) NOT NULL,
`address` VARCHAR(500) NOT NULL,
`district` BIGINT(20) NOT NULL,
`state` BIGINT(20) NOT NULL,
`mobile` VARCHAR(10) NOT NULL,
`uid` VARCHAR(12) NOT NULL,
`phone` VARCHAR(12) NULL,
`email` VARCHAR(255) NULL,
`app_date` VARCHAR(11) NOT NULL,
`form_type` BIGINT(20) NOT NULL,
`course_fee` BIGINT(10) NOT NULL,
`branch` BIGINT(20) NOT NULL,
`course_medium` BIGINT(20) NOT NULL,
`ref_by` BIGINT(20) NOT NULL,
`ref_to` BIGINT(20) NOT NULL,
`ai_centre` VARCHAR(255) NULL,
`ref_no` VARCHAR(255) NOT NULL,
`enroll_no` VARCHAR(255) NULL,
`std` VARCHAR(10) NOT NULL,
`school` VARCHAR(255) NOT NULL,
`isnios` INT(1) NOT NULL DEFAULT 0,
`toc` INT(1) NOT NULL DEFAULT 0,
`grp_subject` VARCHAR(255) NOT NULL,
`remark` VARCHAR(1000) NULL,
`prevQual` INT(1) NOT NULL DEFAULT 0,
`left` INT(1) NOT NULL DEFAULT 0,
`created` BIGINT(20) NOT NULL,
`created_on` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
`modified` BIGINT(20) NULL,
`modified_on` TIMESTAMP NULL,
`active` INT(10) NOT NULL DEFAULT 1
);

-- toc data table for holding toc data information
CREATE TABLE IF NOT EXISTS lms_toc_data (
`id` BIGINT(20) PRIMARY KEY AUTO_INCREMENT,
`subject` BIGINT(20) NOT NULL,
`theory` INT(2) NOT NULL,
`practical` INT(2) NOT NULL,
`for_student` BIGINT(20) NOT NULL,
`created` BIGINT(20) NOT NULL,
`created_on` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
`modified` BIGINT(20) NULL,
`modified_on` TIMESTAMP NULL,
`active` INT(10) NOT NULL DEFAULT 1
);

-- prev qual table for holding prev qual information
CREATE TABLE IF NOT EXISTS lms_prev_qual (
`id` BIGINT(20) PRIMARY KEY AUTO_INCREMENT,
`qualification` VARCHAR(255) NOT NULL,
`board` VARCHAR(255) NOT NULL,
`rollNo` VARCHAR(255) NOT NULL,
`year` VARCHAR(4) NOT NULL,
`for_student` BIGINT(20) NOT NULL,
`created` BIGINT(20) NOT NULL,
`created_on` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
`modified` BIGINT(20) NULL,
`modified_on` TIMESTAMP NULL,
`active` INT(10) NOT NULL DEFAULT 1
);
-- table for exam fee submission
CREATE TABLE IF NOT EXISTS lms_exam_fee (
`id` BIGINT(20) PRIMARY KEY AUTO_INCREMENT,
`student_id` BIGINT(20) NOT NULL,
`payment_type` VARCHAR(255) NOT NULL,
`fee_deposited` BIGINT(20) NOT NULL,
`penalty` BIGINT(20) NOT NULL,
`bank_name` VARCHAR(255) NULL,
`cheque_number` VARCHAR(255) NULL,
`cheque_name` VARCHAR(255) NULL,
`transaction_number` VARCHAR(255) NULL,
`deposit_date` VARCHAR(11) NOT NULL,
`month` VARCHAR(255) NOT NULL,
`remarks` VARCHAR(255) NULL,
`modified` BIGINT(20) NULL,
`modified_on` TIMESTAMP NULL,
`active` INT(10) NOT NULL DEFAULT 1
);

-- route table for holding route information
CREATE TABLE IF NOT EXISTS lms_route (
`id` BIGINT(20) PRIMARY KEY AUTO_INCREMENT,
`created` BIGINT(20) NOT NULL,
`created_on` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
`modified` BIGINT(20) NULL,
`modified_on` TIMESTAMP NULL,
`active` INT(10) NOT NULL DEFAULT 1,
`module` VARCHAR(255) NOT NULL,
`icon` VARCHAR(255) NULL,
`url` VARCHAR(255) NOT NULL,
`url_name` VARCHAR(255) NOT NULL,
`permission` VARCHAR(1) NOT NULL DEFAULT 'A', -- A, T, S
);

-- table for enquire form
CREATE TABLE IF NOT EXISTS lms_enquire (
`id` BIGINT(20) PRIMARY KEY AUTO_INCREMENT,
`name` VARCHAR(20) NOT NULL,
`contact` BIGINT(20) NOT NULL,
`courseType` VARCHAR(20) NOT NULL,
`remark` VARCHAR(255) NOT NULL,
`modified` BIGINT(20) NULL,
`modified_on` TIMESTAMP NULL,
`active` INT(10) NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS lms_subjectFeePayment (
`id` BIGINT(20) PRIMARY KEY AUTO_INCREMENT,
`studentId` BIGINT(20) NOT NULL,
`subjectsId` VARCHAR(50) NOT NULL,
`paidAmount` BIGINT(20) NOT NULL,
`status` VARCHAR(20) NOT NULL,
`modified` BIGINT(20) NULL,
`modified_on` TIMESTAMP NULL,
`active` INT(10) NOT NULL DEFAULT 1
);

-- student subject table for holding student subject information
CREATE TABLE IF NOT EXISTS lms_stu_sub (
`id` BIGINT(20) PRIMARY KEY AUTO_INCREMENT,
`for_student` BIGINT(20) NOT NULL,
`subject` BIGINT(20) NOT NULL,
`total_fee` BIGINT(20) NOT NULL,
`attempt_date` VARCHAR(11) NULL,
`fee_deposited` BIGINT(20) NULL,
`ispass` INT(1) NULL,
`score` INT(3) NULL,
`created` BIGINT(20) NOT NULL,
`created_on` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
`modified` BIGINT(20) NULL,
`modified_on` TIMESTAMP NULL,
`active` INT(10) NOT NULL DEFAULT 1
);
