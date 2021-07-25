-- Application Default data for Form Type
INSERT INTO `lms_form_type` (`form_type`, `form_fee`, `created`)
VALUES ('Form and Coaching', 7001.00, 1),
       ('Form', 5005.00, 1),
       ('Outside', 1000.00, 1);

-- Admin default data, password = Admin@1234
INSERT INTO `lms_users` (`username`, `name`, `email`, `mobile`, `password`, `admin`, `teacher`, `student`, `created`)
VALUES ('admin', 'Admin', 'admin@lms.com', '1234567890', '$2b$10$WzQZb.KhqHiysmeXEIgfzurHUrq94Ub61kfh7R9bqZfVGEFtG2JGi', 1, 0, 0, 1);

-- Country default to india
INSERT INTO `lms_country` (`country`, `created`)
VALUES ('India', 1);

INSERT INTO `lms_route` (`created`, `module`, `icon`, `url`, `url_name`) 
VALUES ('1', 'nios', 'arrow_back_rounded', '/dashboard', 'Dashboard'), 
('1', 'nios', 'speed_rounded', './', 'NIOS Dashboard'), 
('1', 'nios', 'insert_drive_file_rounded', 'formtype', 'Form Type'), 
('1', 'nios', 'group_work_rounded', 'niosGroup', 'NIOS Group'), 
('1', 'nios', 'subject_rounded', 'subjectFee', 'Subject Group'),
('1', 'nios', 'people_alt_rounded', 'enquireList', 'Enquire'),
('1', 'nios', 'people_alt_rounded', 'admission', 'Student'),
('1', 'nios', NULL, 'readmission', 'Re-Admission'),
('1', 'dashboard', 'settings_rounded', '/setup', 'Setup'),
('1', 'dashboard', 'school_rounded', '/nios', 'NIOS'),
('1', 'setup', 'arrow_back_rounded', '/dashboard', 'Dashboard'),
('1', 'setup', 'speed_rounded', './', 'Setup Dashboard'),
('1', 'setup', 'apartment_rounded', 'branch', 'Branch'),
('1', 'setup', 'group_work_rounded', 'reference', 'Working Partner'),
('1', 'setup', NULL, 'medium', 'Course Medium'),
('1', 'setup', NULL, 'state', 'State'),
('1', 'setup', NULL, 'district', 'District');