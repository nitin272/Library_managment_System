# 📚 Library Management System

## 🚀 Overview
The **Library Management System** is a full-stack web application designed to manage library operations efficiently. It allows users to **add, update, delete, and search for books**, manage users, and handle borrowing records.

## 🛠 Features
- 📖 **Book Management**: Add, update, delete, and search books
- 👥 **User Authentication**: Secure login and signup using JWT authentication
- 🔍 **Search Functionality**: Search for books by title, author, or genre
- 📚 **Borrow & Return System**: Track book loans and returns
- 📊 **Admin Dashboard**: Role-based access control for managing users and books
- 📡 **Database Integration**: Hosted on **Supabase** for scalable data storage

## 🏗 Tech Stack
### 🌐 Frontend
- React.js
- Tailwind CSS / Chakra UI
- Axios for API calls

### 🔙 Backend
- Node.js & Express.js
- MongoDB / Supabase (SQL Database)
- JWT for authentication

## 🔧 Installation & Setup
### Prerequisites:
- Node.js installed
- MongoDB or Supabase account

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/nitin272/Library_managment_System.git
cd Library_managment_System
```

### 2️⃣ Install Dependencies
```bash
npm install
```

### 3️⃣ Set Up Environment Variables
Create a `.env` file in the root directory and add:
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_api_key
```

### 4️⃣ Start the Server
```bash
npm start
```

### 5️⃣ Run the Frontend (If applicable)
```bash
cd client
npm start
```

## 🔗 API Endpoints
### 📚 Books
| Method | Endpoint | Description |
|--------|---------|-------------|
| GET | `/api/books` | Get all books |
| POST | `/api/books` | Add a new book |
| PUT | `/api/books/:id` | Update book details |
| DELETE | `/api/books/:id` | Remove a book |

### 👤 Users
| Method | Endpoint | Description |
|--------|---------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get logged-in user details |

## 🚀 Deployment
- Hosted on **Vercel / Netlify** (Frontend)
- Backend deployed on **Render / Heroku**

## 🤝 Contributing
1. **Fork** the repository
2. **Clone** the repo: `git clone <repo_url>`
3. **Create a branch**: `git checkout -b feature-name`
4. **Commit changes**: `git commit -m "Added new feature"`
5. **Push** to branch: `git push origin feature-name`
6. **Create Pull Request**

## 📩 Contact
🔗 GitHub: [github.com/nitin272](https://github.com/nitin272)
📧 Email: [nitinsoni95092@gmail.com]

🚀 **Happy Coding!**

