// Mock authentication - in production, this would connect to your auth backend
import { User, Role } from './types';
import { mockUsers } from './mockData';

// Simulate current user session
let currentUser: User | null = null;

// Initialize from localStorage if available (for persistence across page refreshes)
if (typeof window !== 'undefined') {
  const storedUserId = localStorage.getItem('currentUserId');
  if (storedUserId) {
    const user = mockUsers.find((u) => u.id === storedUserId);
    if (user) {
      currentUser = user;
    } else {
      // Invalid stored user ID, clear it
      localStorage.removeItem('currentUserId');
    }
  }
}

export const getCurrentUser = (): User | null => {
  // In production, get from session/cookie/JWT
  return currentUser;
};

export const setCurrentUser = (user: User | null) => {
  currentUser = user;
  // Persist to localStorage
  if (typeof window !== 'undefined') {
    if (user) {
      localStorage.setItem('currentUserId', user.id);
    } else {
      localStorage.removeItem('currentUserId');
    }
  }
};

export const login = (email: string, password: string): User | null => {
  // Find user by email
  const user = mockUsers.find((u) => u.email === email);
  
  if (!user) {
    return null; // User not found
  }
  
  // Check password
  // In production, compare with hashed password using bcrypt or similar
  // For mock system, we check plaintext password
  if (user.password) {
    // User has a password set - must match
    if (user.password !== password) {
      return null; // Invalid password
    }
  } else {
    // User doesn't have password set (backward compatibility)
    // Allow login with any password for migration period
    // In production, all users should have passwords
  }
  
  setCurrentUser(user);
  return user;
};

export const logout = () => {
  setCurrentUser(null);
};

