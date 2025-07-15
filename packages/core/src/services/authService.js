// Role-based Authentication Service - extends Firebase auth
class AuthService {
  constructor() {
    this.currentUser = null;
    this.userRoles = new Map();
    this.listeners = [];
  }

  // Initialize Firebase Auth
  async initialize() {
    // TODO: Initialize Firebase Auth
    console.log('Initializing Firebase Auth...');
  }

  // Authentication methods
  async signIn(email, password) {
    try {
      // TODO: Implement Firebase sign in
      console.log(`Signing in user: ${email}`);
      
      // Mock response for now
      const user = {
        uid: 'mock-user-id',
        email,
        displayName: 'Mock User',
      };
      
      this.currentUser = user;
      await this.loadUserRoles(user.uid);
      this.notifyListeners();
      
      return user;
    } catch (error) {
      console.error('Sign in failed:', error);
      throw error;
    }
  }

  async signUp(email, password, userData = {}) {
    try {
      // TODO: Implement Firebase sign up
      console.log(`Signing up user: ${email}`);
      
      // Mock response for now
      const user = {
        uid: 'mock-new-user-id',
        email,
        displayName: userData.displayName || 'New User',
      };
      
      this.currentUser = user;
      await this.createUserProfile(user.uid, userData);
      this.notifyListeners();
      
      return user;
    } catch (error) {
      console.error('Sign up failed:', error);
      throw error;
    }
  }

  async signOut() {
    try {
      // TODO: Implement Firebase sign out
      console.log('Signing out user');
      
      this.currentUser = null;
      this.userRoles.clear();
      this.notifyListeners();
    } catch (error) {
      console.error('Sign out failed:', error);
      throw error;
    }
  }

  // User profile management
  async createUserProfile(uid, userData) {
    // TODO: Create user profile in database
    const profile = {
      uid,
      email: userData.email,
      displayName: userData.displayName,
      role: userData.role || 'student',
      createdAt: new Date().toISOString(),
      ...userData,
    };
    
    // Store in local cache
    this.userRoles.set(uid, profile.role);
    
    return profile;
  }

  async loadUserRoles(uid) {
    // TODO: Load user roles from database
    // For now, mock different roles based on user ID
    const roles = {
      'mock-user-id': 'coach',
      'mock-new-user-id': 'student',
      'manager-id': 'manager',
      'parent-id': 'parent',
    };
    
    this.userRoles.set(uid, roles[uid] || 'student');
  }

  // Role-based access control
  hasRole(role) {
    if (!this.currentUser) return false;
    const userRole = this.userRoles.get(this.currentUser.uid);
    return userRole === role;
  }

  hasAnyRole(roles) {
    if (!this.currentUser) return false;
    const userRole = this.userRoles.get(this.currentUser.uid);
    return roles.includes(userRole);
  }

  // Persona-specific role checks
  isCoach() {
    return this.hasRole('coach');
  }

  isStudent() {
    return this.hasRole('student');
  }

  isParent() {
    return this.hasRole('parent');
  }

  isManager() {
    return this.hasRole('manager');
  }

  // Get current user
  getCurrentUser() {
    return this.currentUser;
  }

  getUserRole() {
    if (!this.currentUser) return null;
    return this.userRoles.get(this.currentUser.uid);
  }

  // Auth state listeners
  onAuthStateChanged(callback) {
    this.listeners.push(callback);
    
    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(callback);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  notifyListeners() {
    this.listeners.forEach(callback => {
      callback(this.currentUser);
    });
  }

  // Route protection helpers
  requireAuth(Component) {
    return (props) => {
      if (!this.currentUser) {
        // Redirect to login
        return <div>Please log in to access this page.</div>;
      }
      return <Component {...props} />;
    };
  }

  requireRole(role, Component) {
    return (props) => {
      if (!this.currentUser) {
        return <div>Please log in to access this page.</div>;
      }
      
      if (!this.hasRole(role)) {
        return <div>You don't have permission to access this page.</div>;
      }
      
      return <Component {...props} />;
    };
  }

  // Password reset
  async resetPassword(email) {
    try {
      // TODO: Implement Firebase password reset
      console.log(`Resetting password for: ${email}`);
      return true;
    } catch (error) {
      console.error('Password reset failed:', error);
      throw error;
    }
  }

  // Email verification
  async sendEmailVerification() {
    try {
      // TODO: Implement Firebase email verification
      console.log('Sending email verification');
      return true;
    } catch (error) {
      console.error('Email verification failed:', error);
      throw error;
    }
  }
}

export default AuthService; 