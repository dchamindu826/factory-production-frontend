// src/services/authService.js (FRONTEND PROJECT එකේ)

const API_BASE_URL = 'http://localhost:5001/api'; // Backend එකේ URL එක

export const login = async (username, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }
    return data;

  } catch (error) {
    console.error('Login service error:', error);
    throw error;
  }
};