# Administrative Service Manager Backend

A NestJS-based backend service for managing administrative services, businesses, licenses, and employees.

## 🚀 Features

- Business Management
  - CRUD operations for businesses
  - Excel import/export functionality
  - Business license management
  - Employee management
  - Geocoding integration for business locations

- License Management
  - Multiple license types support
  - Mandatory and optional license tracking
  - File upload support for license documents
  - License status monitoring

- Employee Management
  - Employee records management
  - Excel-based bulk employee import
  - Employee-business relationship tracking

- Statistics and Analytics
  - Business growth trends
  - License compliance statistics
  - Business type distribution analysis
  - Quarterly and yearly reports

## 🛠️ Tech Stack

- **Framework**: NestJS
- **Database**: MySQL with TypeORM
- **File Processing**: xlsx
- **File Storage**: Local storage with custom service
- **Geocoding**: External geocoding service integration
- **API Rate Limiting**: Bottleneck
- **File Upload**: Multer
- **Data Validation**: Class Validator

## 📋 Prerequisites

- Node.js (ES2021 or later)
- MySQL Database
- Environment variables configured

## 🔧 Installation

1. Clone the repository:

```bash
git clone [repository-url]

```

2. Install dependencies:

```bash
npm install
```

3. Configure environment variables:
Create a `.env` file with the following variables:

```env
URL_GEOCODING=[your-geocoding-url]
GEOCODING_API_KEY=[your-api-key]
DB_HOST=[host]
DB_PORT=[port]
DB_USERNAME=[username]
DB_PASSWORD=[password]
DB_NAME=[database-name]
LENGHT_ID=12
NODE_ENV=[environment]
```

4. Set up the database:

```sql
# Run the SQL script from struct_db.sql to create necessary tables
```

5. Start the development server:

```bash
npm run start:dev
```

## 🔑 Key Components

### Business Module
- Business registration and management
- Location tracking with geocoding
- Excel import/export functionality
- License compliance monitoring

### License Management
- Support for multiple license types
- Mandatory license enforcement
- File upload and storage
- License status tracking

### Employee Management
- Employee record keeping
- Bulk import via Excel
- Business-employee relationship tracking

## 📊 API Endpoints

### Businesses
- `POST /api/v1/businesses` - Create new business
- `POST /api/v1/businesses/create-business-by-excel` - Bulk create businesses
- `GET /api/v1/businesses/export-excel` - Export businesses data

### Employees
- `GET /api/v1/employees` - Get employees by business
- `POST /api/v1/employees/create-by-excel` - Bulk create employees
- `GET /api/v1/employees/employee-info/no-pagination/:businessId` - Get all employees for a business

## 🔒 License Types

The system supports various mandatory and optional license types:
- Business License (Mandatory)
- Security License (Mandatory)
- Fire Safety License (Mandatory)
- Food Safety License
- Digital Service License
- Transportation License
- Tourism License

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the [UNLICENSED License](LICENSE).
