import { auth, db } from './firebase-config.js';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  onAuthStateChanged 
} from "firebase/auth";
import { ref, set } from "firebase/database";

// Функция для записи данных в базу
async function writeUserData(userId, name, email, imageUrl) {
  try {
    await set(ref(db, 'users/' + userId), {
      username: name,
      email: email,
      profile_picture: imageUrl,
      lastUpdated: new Date().toISOString()
    });
    console.log('Данные успешно записаны!');
  } catch (error) {
    console.error('Ошибка записи данных:', error);
    throw error; 
  }
}

// Получаем ссылки на элементы DOM
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');
const userProfile = document.getElementById('user-profile');
const authStatus = document.getElementById('auth-status');
const userEmail = document.getElementById('user-email');

// Переключение между формами
document.getElementById('show-signup').addEventListener('click', (e) => {
  e.preventDefault();
  loginForm.style.display = 'none';
  signupForm.style.display = 'block';
});

document.getElementById('show-login').addEventListener('click', (e) => {
  e.preventDefault();
  signupForm.style.display = 'none';
  loginForm.style.display = 'block';
});

// РЕГИСТРАЦИЯ - обновленный код с сохранением в БД
document.getElementById('signup-button').addEventListener('click', async () => {
  const email = document.getElementById('signup-email').value;
  const password = document.getElementById('signup-password').value;
  const username = document.getElementById('signup-username').value;

  // Валидация
  if (!username || !email || !password) {
    alert('Пожалуйста, заполните все поля');
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Записываем данные пользователя в базу
    await writeUserData(user.uid, username, email, null);
    
    alert('Регистрация успешна!');
  } catch (error) {
    alert(`Ошибка регистрации: ${error.message}`);
  }
});

// Вход пользователя
document.getElementById('login-button').addEventListener('click', async () => {
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    alert(`Ошибка входа: ${error.message}`);
  }
});

// Выход пользователя
document.getElementById('logout-button').addEventListener('click', async () => {
  try {
    await signOut(auth);
  } catch (error) {
    alert(`Ошибка выхода: ${error.message}`);
  }
});

