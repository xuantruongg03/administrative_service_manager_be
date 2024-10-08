CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
-- Người
CREATE TABLE IF NOT EXISTS persons (
    citizen_id VARCHAR(12) NOT NULL PRIMARY KEY, --Số giấy tờ
    name VARCHAR(255) NOT NULL,
    birth_date DATE NOT NULL,
    gender VARCHAR(255) NOT NULL,
    nationality VARCHAR(255) NOT NULL,
    religion VARCHAR(255) NOT NULL, --Dân tộc
    type_of_certificate VARCHAR(255) NOT NULL, --Loại giấy tờ
    issued_by VARCHAR(255) NOT NULL, --Nơi cấp
    issued_date DATE NOT NULL, --Ngày cấp
    hometown VARCHAR(255) NOT NULL, --Quê quán
    current_address VARCHAR(255) NOT NULL, --Chỗ ở hiện tại
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
-- Loại hình doanh nghiệp
CREATE TABLE IF NOT EXISTS type_of_organizations (
    id VARCHAR(12) NOT NULL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
INSERT INTO type_of_organizations (id, name) VALUES
('783901245612', 'Sản xuất con dấu'),
('456789012345', 'Kinh doanh công cụ hỗ trợ'),
('234567890123', 'Kinh doanh các loại pháo'),
('890123456789', 'Kinh doanh dịch vụ cầm đồ'),
('345678901234', 'Kinh doanh dịch vụ xoa bóp'),
('901234567890', 'Kinh doanh thiết bị phát tín hiệu của xe được quyền ưu tiên'),
('567890123456', 'Kinh doanh dịch vụ bảo vệ'),
('123456789012', 'Kinh doanh súng bắn sơn'),
('678901234567', 'Kinh doanh trò chơi điện tử có thưởng dành cho người nước ngoài'),
('234567890124', 'Kinh doanh casino'),
('789012345678', 'Kinh doanh dịch vụ đặt cược'),
('345678901235', 'Kinh doanh khí'),
('901234567891', 'Kinh doanh vật liệu nổ công nghiệp'),
('456789012346', 'Kinh doanh tiền chất thuốc nổ'),
('012345678901', 'Kinh doanh ngành, nghề có sử dụng vật liệu nổ công nghiệp và tiền chất thuốc nổ'),
('567890123457', 'Kinh doanh dịch vụ nổ mìn'),
('123456789013', 'Kinh doanh dịch vụ in'),
('678901234568', 'Kinh doanh các thiết bị gây nhiễu, phá sóng thông tin di động'),
('234567890125', 'Kinh doanh dịch vụ phẫu thuật thẩm mỹ'),
('789012345679', 'Kinh doanh dịch vụ karaoke, vũ trường'),
('345678901236', 'Kinh doanh dịch vụ lưu trú'),
('901234567892', 'Kinh doanh quân trang, quân dụng cho lực lượng vũ trang, vũ khí quân dụng, trang thiết bị kỹ thuật, khí tài, phương tiện chuyên dùng cho quân sự, công an');

-- Công ty
CREATE TABLE IF NOT EXISTS businesses (
    code VARCHAR(12) NOT NULL PRIMARY KEY,
    name_vietnamese VARCHAR(255) NOT NULL,
    name_english VARCHAR(255) NULL,
    name_acronym VARCHAR(255) NOT NULL, --Tên viết tắt
    address VARCHAR(255) NOT NULL,
    email VARCHAR(255) NULL,
    phone VARCHAR(255) NOT NULL,
    fax VARCHAR(255) NULL,
    website VARCHAR(255) NULL,
    chartered_capital VARCHAR(255) NOT NULL, --Vốn điều lệ
    type_of_organization VARCHAR(12) NOT NULL, --Loại hình doanh nghiệp
    legal_representative VARCHAR(12) NOT NULL, --Người đại diện pháp luật
    latitude VARCHAR(255) NOT NULL, --Vĩ độ
    longitude VARCHAR(255) NOT NULL, --Kinh độ
    status VARCHAR(255) NOT NULL, --Trạng thái
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (legal_representative) REFERENCES persons(citizen_id),
    FOREIGN KEY (type_of_organization) REFERENCES type_of_organizations(id)
);
-- Nhân viên
CREATE TABLE IF NOT EXISTS employees (
    id VARCHAR(12) NOT NULL PRIMARY KEY,
    citizen_id VARCHAR(12) NOT NULL,
    position VARCHAR(255) NOT NULL,
    phone VARCHAR(255) NOT NULL,
    start_date DATE NOT NULL,
    business_code VARCHAR(12) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (citizen_id) REFERENCES persons(citizen_id),
    FOREIGN KEY (business_code) REFERENCES businesses(code)
);

-- Loại giấy phép
CREATE TABLE IF NOT EXISTS license_types (
    id VARCHAR(12) NOT NULL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    is_mandatory BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Giấy phép của doanh nghiệp
CREATE TABLE IF NOT EXISTS business_licenses (
    id VARCHAR(12) NOT NULL PRIMARY KEY,
    business_code VARCHAR(12) NOT NULL,
    license_type_id VARCHAR(12) NOT NULL,
    license_number VARCHAR(255) NULL,
    file_path VARCHAR(255) NOT NULL,
    issued_date DATE NULL,
    expiry_date DATE NULL,
    status VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (business_code) REFERENCES businesses(code),
    FOREIGN KEY (license_type_id) REFERENCES license_types(id)
);
