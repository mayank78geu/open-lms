import { create } from 'zustand';
import { authStorage } from '../lib/auth';
import { MOCK_USERS } from '../mocks/mockData';

// Initial user defaults to student (Maya Chen) for immediate exploration
const savedUser = authStorage.getUser() || MOCK_USERS.student;

export const useAuthStore = create((set, get) => ({
  user: savedUser,
  isAuthenticated: true,
  role: savedUser?.role || 'STUDENT',

  login: (email, password, role = 'STUDENT') => {
    const userToSet = role === 'PROFESSOR' ? MOCK_USERS.professor : MOCK_USERS.student;
    authStorage.setToken('mock-jwt-token-' + Date.now());
    authStorage.setUser(userToSet);
    set({ user: userToSet, isAuthenticated: true, role: userToSet.role });
    return userToSet;
  },

  switchRole: (newRole) => {
    const newUser = newRole === 'PROFESSOR' ? MOCK_USERS.professor : MOCK_USERS.student;
    authStorage.setUser(newUser);
    set({ user: newUser, role: newRole });
  },

  logout: () => {
    authStorage.clear();
    set({ user: null, isAuthenticated: false, role: null });
  },
}));
