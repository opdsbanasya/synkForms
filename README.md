# SynkForms - No-Code Dynamic Form Builder

A web application for creating, customizing, and managing no-code dynamic forms with an intuitive interface.

## 🔗 Links

- **Live Preview**: [https://synkforms.com](http://40.81.227.70/)
- **GitHub Repository**: [https://github.com/opdsbanasya/synkForms.git](https://github.com/opdsbanasya/synkForms.git)

## 🚀 Tech Stack

### Frontend
- **React.js** - UI Library
- **Redux Toolkit** - State Management
- **React Hook Form** - Form Handling
- **React Router** - Navigation
- **Axios** - HTTP Client
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **Vite** - Build Tool

### Backend
- **Node.js** - Runtime
- **Express.js** - Web Framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcrypt** - Password Hashing
- **CORS** - Cross-Origin Support

## ✨ Features

### 🔨 Form Creation & Customization
- Intuitive drag-and-drop form builder
- Multiple field types: Text, Email, Number, Textarea, Dropdown, Radio, Checkbox
- Form styling customization (colors, fonts)
- Field validation and requirements

### 📋 Form Management
- Create, edit, duplicate, and delete forms
- Form status management (active/inactive)
- Form preview and public sharing
- Responsive form rendering

### 📊 Data Collection & Analysis
- User response collection and storage
- Response viewing and analysis
- CSV export functionality
- Real-time form submissions

### 🔐 User Authentication
- User registration and login
- JWT-based authentication
- Protected admin routes
- Session management

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file with:
# PORT=5000
# MONGODB_URI=mongodb://localhost:27017/synkForms
# JWT_SECRET_KEY=your_secret_key

# Start development server
npm run dev
```

### Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

## 🚀 Commands

### Backend Commands
```bash
npm install          # Install dependencies
npm run dev         # Start development server
npm start           # Start production server
```

### Frontend Commands
```bash
npm install          # Install dependencies
npm run dev         # Start development server
npm run build       # Build for production
npm run preview     # Preview production build
```

## 📱 Usage

1. **Register/Login** - Create account or login
2. **Create Forms** - Use the form builder to create custom forms
3. **Customize** - Style your forms with colors and fonts
4. **Share** - Share public form links with users
5. **Collect Data** - View and export form responses
6. **Manage** - Edit, duplicate, or delete forms as needed
    
## 🔧 Environment Variables

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/synkForms
JWT_SECRET_KEY=your_secret_key
```

### Frontend
```
VITE_API_URL=http://localhost:5000
```