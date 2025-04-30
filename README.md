# 📬 J3Mail Frontend

**J3Mail** is a secure, end-to-end encrypted email client built with React and TypeScript. It utilizes RSA for authentication and key exchange, AES for message encryption, and digital signatures for message integrity.

## Application Link

[J3Mail]()

## 🔗 Backend Repository

To run the application locally, you'll need to clone and set up the backend server:

👉 [https://github.com/nizamsalim/j3mail_backend](https://github.com/nizamsalim/j3mail_backend)

## 🚀 Features

- **Secure Authentication**: Client-server RSA key exchange for secure user authentication.
- **End-to-End Encryption**: AES encryption for email content, ensuring privacy.
- **Digital Signatures**: Ensures message integrity and authenticity.
- **User-Friendly Interface**: Intuitive React-based UI for seamless user experience.

## 🛠️ Prerequisites

Ensure you have the following installed on your machine:

- **Node.js** (v14 or higher)
- **npm** (v6 or higher)
- **Python** (3.8 or higher)
- **Git**

## 📦 Installation & Setup

### 1. Clone the Repositories

```bash
git clone https://github.com/nizamsalim/j3mail_backend.git
git clone https://github.com/nizamsalim/j3mail_frontend.git
```

### 2. Setup Backend

```bash
cd j3mail_backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python manage.py runserver
```

The backend server will be running http://localhost:8000

### 3. Setup Frontend

```bash
cd ..\j3mail_frontend
npm install
npm start
```

The frontend will be running at http://localhost:3000

Ensure that you set `REACT_APP_SECRET_PASSWORD` in the .env file. It should be a strong and random password

## 📄 License

This project is licensed under the [MIT License](https://opensource.org/license/mit)
