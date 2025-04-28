CREATE DATABASE MeetingRoomBooking;

-- sau khi tạo database thì chạy Backend

USE MeetingRoomBooking;

-- Insert quyền
INSERT INTO permissions (permission_name, description) VALUES
('CREATE_DATA', 'Permission to create data'),
('READ_DATA', 'Permission to read data'),
('UPDATE_DATA', 'Permission to update data'),
('DELETE_DATA', 'Permission to delete data');

-- Insert vai trò
INSERT INTO roles (role_name, description)
VALUES ('USER', 'User role with basic access');

-- Gán quyền cho vai trò USER
INSERT INTO role_permissions (role_name, permission_name) VALUES
('USER', 'CREATE_DATA'),  -- USER có READ_DATA
('USER','READ_DATA'),  -- USER có CREATE_DATA
('USER','UPDATE_DATA');  -- USER có UPDATE_DATA

-- Gán quyền cho vai trò ADMIN
INSERT INTO role_permissions (role_name, permission_name) VALUES
('ADMIN', 'READ_DATA'),
('ADMIN', 'CREATE_DATA'),
('ADMIN', 'UPDATE_DATA'),
('ADMIN', 'DELETE_DATA');

-- Chèn dữ liệu vào bảng equipment
INSERT INTO equipments (equipment_name, description) VALUES
('Projector', 'Projector for meeting rooms and presentations'),
('Monitor', 'Display monitor for conferences and training'),
('HDMI', 'HDMI cable to connect devices to monitors'),
('Whiteboard', 'Whiteboard for brainstorming and teaching'),
('Microphone', 'Microphone for online meetings and presentations'),
('Speaker', 'Speaker for conference audio and events');


-- Chèn dữ liệu vào bảng `groups`
INSERT INTO `groups` (group_name, division, location) VALUES
('DXC', 'IT', 'Hanoi'),
('DJ2', 'IT', 'Hanoi'),
('DU1.3', 'IT', 'Hanoi'),
('DU3.11', 'IT', 'Hanoi'),
('DKR1', 'HR', 'Ho Chi Minh City');

-- Chèn dữ liệu vào bảng position
INSERT INTO positions (position_name, description) VALUES
('Intern', 'Internship position'),
('C&B', 'Compensation & Benefits Department'),
('Software Engineer', 'Software development engineer'),
('System Admin', 'System administrator'),
('DevOps Engineer', 'DevOps engineer'),
('QA Engineer', 'Quality assurance engineer'),
('HR Manager', 'Human resources manager'),
('HR Executive', 'Human resources executive'),
('Recruiter', 'Recruitment specialist'),
('Accountant', 'Accountant'),
('Finance Manager', 'Finance manager'),
('Marketing Specialist', 'Marketing specialist'),
('Content Writer', 'Content creator and writer'),
('Sales Executive', 'Sales executive'),
('Sales Manager', 'Sales manager');

-- Chèn dữ liệu vào bảng rooms
INSERT INTO rooms (room_name, available, capacity, location, note) VALUES
('Meeting Room A1', true, 6, '789 Tower', 'Small meeting room'),
('Conference Room B2', true, 8, '789 Tower', 'Medium meeting room'),
('Training Room C3', true, 8, '789 Tower', 'Training room'),
('Interview Room D1', true, 8, 'Thanh Cong Building', 'Interview room'),
('Brainstorming Room D2', true, 6, 'Thanh Cong Building', 'Group meeting room'),
('Executive Room D3', true, 10, 'Thanh Cong Building', 'Large conference room'),
('Team Meeting Room E1', true, 6, 'The West Tower', 'Group work room'),
('Training Room E2', true, 8, 'The West Tower', 'Training room'),
('Conference Hall E3', true, 12, 'The West Tower', 'Conference room'),
('Discussion Room F1', true, 6, '789 Tower', 'Small meeting room'),
('Board Room F2', true, 6, '789 Tower', 'Phòng họp trung'),
('Executive Meeting Room F3', true, 10, '789 Tower', 'Conference room'),
('Client Meeting Room G1', true, 12, '789 Tower', 'Customer meeting room'),
('Presentation Room G2', true, 8, 'Thanh Cong Building', 'Presentation room'),
('Grand Conference Room G3', true, 12, 'The West Tower', 'Large conference room'),
('Training Hall H1', true, 6, 'Thanh Cong Building', 'Training room'),
('Project Room H2', true, 8, 'Thanh Cong Building', 'Group meeting room'),
('Strategy Room H3', true, 10, 'The West Tower', 'Strategic meeting room'),
('Summit Hall H4', true, 12, 'Thanh Cong Building', 'Large conference room'),
('Small Team Room H5', true, 8, '789 Tower', 'Small group meeting room'),
('Meeting Room A2', true, 6, '789 Tower', 'Small meeting room'),
('Conference Room B3', true, 8, '789 Tower', 'Medium meeting room'),
('Training Room C4', true, 8, '789 Tower', 'Training room'),
('Interview Room D2', true, 8, 'Thanh Cong Building', 'Interview room'),
('Brainstorming Room D3', true, 6, 'Thanh Cong Building', 'Group meeting room'),
('Executive Room D4', true, 10, 'Thanh Cong Building', 'Large conference room'),
('Team Meeting Room E2', true, 6, 'The West Tower', 'Group work room'),
('Training Room E3', true, 8, 'The West Tower', 'Training room'),
('Conference Hall E4', true, 12, 'The West Tower', 'Conference room'),
('Discussion Room F2', true, 6, '789 Tower', 'Small meeting room'),
('Board Room F3', true, 6, '789 Tower', 'Phòng họp trung'),
('Executive Meeting Room F4', true, 10, '789 Tower', 'Conference room'),
('Client Meeting Room G2', true, 12, '789 Tower', 'Customer meeting room');


INSERT INTO room_equipment (room_id, equipment_name) VALUES
(1, 'Projector'), (1, 'Whiteboard'),
(2, 'Monitor'), (2, 'HDMI'),
(3, 'Projector'), (3, 'HDMI'), (3, 'Whiteboard'),
(4, 'Microphone'), (4, 'Speaker'),
(5, 'Projector'), (5, 'Whiteboard'),
(6, 'Microphone'), (6, 'Speaker'), (6, 'Monitor'),
(7, 'Monitor'), (7, 'HDMI'),
(8, 'Projector'), (8, 'Whiteboard'), (8, 'Speaker'),
(9, 'Monitor'), (9, 'HDMI'),
(10, 'Projector'), (10, 'Whiteboard'),
(11, 'Monitor'), (11, 'Speaker'),
(12, 'Projector'), (12, 'HDMI'), (12, 'Whiteboard'),
(13, 'Microphone'), (13, 'Speaker'),
(14, 'Projector'), (14, 'Whiteboard'),
(15, 'Microphone'), (15, 'Speaker'), (15, 'Monitor'),
(16, 'Projector'), (16, 'Whiteboard'),
(17, 'Monitor'), (17, 'HDMI'),
(18, 'Projector'), (18, 'Whiteboard'),
(19, 'Microphone'), (19, 'Speaker'),
(20, 'Monitor'), (20, 'HDMI'),
(21, 'Projector'), (21, 'Whiteboard'), (21, 'Speaker'),
(22, 'Monitor'), (22, 'HDMI'),
(23, 'Projector'), (23, 'Whiteboard'),
(24, 'Monitor'), (24, 'Speaker'),
(25, 'HDMI'), (25, 'Speaker'),
(26, 'Projector'), (26, 'Whiteboard'), (26, 'Microphone'),
(27, 'Monitor'), (27, 'Speaker'),
(28, 'Microphone'), (28, 'Speaker'),
(29, 'Projector'), (29, 'HDMI'),
(30, 'Whiteboard'), (30, 'Speaker'),
(31, 'Projector'), (31, 'Whiteboard'),
(32, 'HDMI'), (32, 'Speaker'),
(33, 'Projector'), (33, 'Whiteboard'), (33, 'Monitor');

-- import user vào trước từ file excel 

DROP PROCEDURE IF EXISTS generate_bookings;
DELIMITER //
CREATE PROCEDURE generate_bookings()
BEGIN
    DECLARE i INT DEFAULT 1;
    DECLARE created_at DATETIME;
    DECLARE start_time DATETIME;
    DECLARE end_time DATETIME;
    DECLARE purpose_list VARCHAR(100);
    DECLARE status_list VARCHAR(100);
    WHILE i <= 100 DO
        -- Random created_at từ 2025-01-01 đến hiện tại
        SET created_at = DATE_ADD('2025-01-01', INTERVAL FLOOR(RAND() * TIMESTAMPDIFF(SECOND, '2025-01-01', NOW())) SECOND);
        -- Random start_time cách created_at từ 0h - 7 ngày
        SET start_time = DATE_ADD(created_at, INTERVAL FLOOR(RAND() * (7 * 24)) HOUR);
        -- Random end_time từ start_time: 30p -> 8 tiếng sau
        SET end_time = DATE_ADD(start_time, INTERVAL (30 + FLOOR(RAND() * 450)) MINUTE);
		-- Random purpose (MEETING, TRAINING, INTERVIEW)
		SET purpose_list = ELT(FLOOR(1 + RAND() * 4), 'MEETING', 'TRAINING', 'INTERVIEW', 'CLIENT_MEETING');
		-- Random status (PENDING, CONFIRMED, CANCELLED)
		SET status_list = ELT(FLOOR(1 + RAND() * 2), 'CONFIRMED', 'CANCELLED');
        INSERT INTO room_bookings (room_id, booked_by, start_time, end_time, purpose, status, description, created_at)
        VALUES (
            FLOOR(1 + RAND() * 30),             -- Random room_id từ 1->5
            FLOOR(2 + RAND() * 30),            -- Random booked_by user id 1->20
            start_time,
            end_time,
            purpose_list,
            status_list,
            CONCAT('Booking description ', i), -- mô tả
            created_at
        );
        SET i = i + 1;
    END WHILE;
END //

DELIMITER ;
CALL generate_bookings();




