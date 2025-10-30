# 🧿 Mitram - A Social Media Web App

Mitram is a feature-rich full-stack social media web application where users can sign up, create and interact with posts, view profiles, and connect with others in a user-friendly environment.

![Mitram Banner](./screenshots/Mitram.png)

---

# 💻 Tech Stack:
![Django](https://img.shields.io/badge/django-%23092E20.svg?style=for-the-badge&logo=django&logoColor=white) 
![DjangoREST](https://img.shields.io/badge/DJANGO-REST-ff1709?style=for-the-badge&logo=django&logoColor=white&color=ff1709&labelColor=gray) 
![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white) 
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white) 
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)  
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/postgresql-%23336791.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![JWT](https://img.shields.io/badge/jwt-black?style=for-the-badge&logo=json-web-tokens)
![Git](https://img.shields.io/badge/git-%23F05033.svg?style=for-the-badge&logo=git&logoColor=white) 
![GitHub](https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white) 
![Postman](https://img.shields.io/badge/Postman-FF6C37?style=for-the-badge&logo=postman&logoColor=white)

---
## 🔍 Table of Contents

* [Demo](#-demo)
* [Features](#-features)
* [Tech Stack](#-tech-stack)
* [Folder Structure](#-folder-structure)
* [Installation](#-installation)

  * [Frontend](#frontend-setup)
  * [Backend](#backend-setup)
* [Environment Variables](#-environment-variables)
* [Screenshots](#-screenshots)
* [License](#-license)

---

## 🚀 Demo


📽️ **Video Demo:**  
[Watch on Youtube](https://youtu.be/SHvZ9y6XHSw)

🌐 **Live URL:**  
[https://mitram-social-media-platform-v1.vercel.app/](https://mitram-social-media-platform-v1.vercel.app/) </br>

🖼️ **Note:**  
Images are currently not visible due to backend hosting on Render.  
Integration with Cloudinary for image hosting is planned.  
**Cloudinary coming one day — for now, that’s it!**





---

## ✨ Features

* 🔐 User Authentication (JWT based)
* 📝 Post Creation, Edit, and Deletion
* ❤️ Like and 💾 Save Posts
* 👤 View and Edit Profile
* 🧑‍🤝‍🧑 Explore Other Users
* 🏠 Home Feed and 🔎 Explore Page
* 🚪 Secure Logout

---

## 🧑‍💻 Tech Stack

### Frontend (React + Vite + TypeScript)

* React 19
* Vite
* Tailwind CSS + ShadCN
* React Router DOM v7
* React Hook Form + Zod
* Axios for API calls
* Lucide React Icons
* React Query (TanStack)

### Backend (Django REST Framework)

* Django 5.2.2
* Django REST Framework
* PostgreSQL as database
* JWT Authentication (`djangorestframework_simplejwt`)
* CORS Headers, Django Filters, Gunicorn
* Whitenoise for static file handling

---

## 📁 Folder Structure

```
mitram-frontend/
├── public/
├── src/
│   ├── components/
│   ├── pages/
│   ├── hooks/
│   ├── lib/
│   ├── services/
│   ├── App.tsx
│   └── main.tsx
└── tsconfig.json

mitram-backend/
├── MitramBackend/
│   └── settings.py
├── api/  # your Django app for APIs
├── manage.py
└── requirements.txt
```

---

## ⚙️ Installation

### 🔹 Frontend Setup

```bash
# 1. Clone the repository
$ git clone https://github.com/your-username/mitram.git
$ cd mitram-frontend

# 2. Install dependencies
$ npm install

# 3. Start the dev server
$ npm run dev
```

---

### 🔹 Backend Setup

```bash
# 1. Navigate to the backend directory
$ cd mitram-backend

# 2. Create a virtual environment
$ python -m venv env
$ source env/bin/activate  # for Windows: env\Scripts\activate

# 3. Install Python dependencies
$ pip install -r requirements.txt

# 4. Set environment variables (see .env section below)

# 5. Apply migrations
$ python manage.py makemigrations
$ python manage.py migrate

# 6. Run development server
$ python manage.py runserver
```

---

## 🔐 Environment Variables

Create a `.env` file in the root of your Django backend:

```
SECRET_KEY=your_secret_key
DEBUG=True
ALLOWED_HOSTS=*
DATABASE_URL=postgres://user:password@localhost:5432/mitramdb

# JWT
SIMPLE_JWT_ACCESS_TOKEN_LIFETIME=5
SIMPLE_JWT_REFRESH_TOKEN_LIFETIME=30
```

Also configure Vite's `.env` file in the frontend root:

```
VITE_API_BASE_URL=http://localhost:8000/api/
```

---

## 🖼️ Screenshots


### 🔹 Signup Page

![Home](./screenshots/sign-up.png)

### 🔹 Home Feed

![Home](./screenshots/Home.png)

### 🔹 User Profile

![Profile](./screenshots/Profile.png)

### 🔹 Explore Page

![Explore](./screenshots/Explore.png)

### 🔹 Create Post

![Create Post](./screenshots/create-post.png)

---

## 📦 Scripts Reference

### Frontend (`package.json`)

```json
"scripts": {
  "dev": "vite",
  "build": "tsc -b && vite build",
  "lint": "eslint .",
  "preview": "vite preview"
}
```

### Backend (`requirements.txt`)

```
asgiref==3.8.1
dj-database-url==3.0.0
Django==5.2.2
django-cors-headers==4.7.0
django-filter==25.1
djangorestframework==3.16.0
djangorestframework_simplejwt==5.5.0
gunicorn==23.0.0
packaging==25.0
pillow==11.2.1
psycopg2-binary==2.9.10
PyJWT==2.9.0
python-dotenv==1.1.0
sqlparse==0.5.3
typing_extensions==4.14.0
tzdata==2025.2
whitenoise==6.9.0
```

---

## 📜 License

You are free to use, modify, or share this code for personal or educational purposes.  
Just give proper credit, and please note that I am not responsible for any issues that arise from using it.


---

## 👨‍💻 Author

Created with ❤️ by Roxks
🔗 [GitHub](https://github.com/rakxya111) • [LinkedIn](https://linkedin.com/in/rakshya-bhuju13)

---

> 🌟 *Feel free to fork and contribute. Pull requests are always welcome!*
