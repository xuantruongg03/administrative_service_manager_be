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
    number_of_certificate VARCHAR(12) NOT NULL PRIMARY KEY, --Số giấy tờ
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
-- Công ty
CREATE TABLE IF NOT EXISTS companies (
    id VARCHAR(12) NOT NULL PRIMARY KEY,
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
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (legal_representative) REFERENCES persons(number_of_certificate),
    FOREIGN KEY (type_of_organization) REFERENCES type_of_organizations(id)
);
-- Nhân viên
CREATE TABLE IF NOT EXISTS employees (
    id VARCHAR(12) NOT NULL PRIMARY KEY,
    number_of_certificate VARCHAR(12) NOT NULL,
    position VARCHAR(255) NOT NULL,
    phone VARCHAR(255) NOT NULL,
    start_date DATE NOT NULL,
    company_id VARCHAR(12) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (number_of_certificate) REFERENCES persons(number_of_certificate),
    FOREIGN KEY (company_id) REFERENCES companies(id)
);
-- Tài liệu đính kèm cho công ty
CREATE TABLE IF NOT EXISTS attachments_for_companies (
    id VARCHAR(12) NOT NULL PRIMARY KEY,
    company_id VARCHAR(12) NOT NULL,
    file_path VARCHAR(255) NOT NULL,
    type_of_attachment VARCHAR(255) NOT NULL, --Loại tài liệu
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (company_id) REFERENCES companies(id)
);
