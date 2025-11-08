import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pendingApprovals, setPendingApprovals] = useState([]);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    
    // Load pending approvals
    const storedApprovals = JSON.parse(localStorage.getItem('pendingApprovals') || '[]');
    setPendingApprovals(storedApprovals);
    
    setLoading(false);
  }, []);

  // Login function
  const login = async (email, password) => {
    setLoading(true);
    try {
      // Check approved users first
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const approvedUser = users.find(u => u.email === email);
      
      if (approvedUser) {
        setUser(approvedUser);
        localStorage.setItem('user', JSON.stringify(approvedUser));
        return { success: true };
      }

      // Check if user is pending approval
      const pendingUsers = JSON.parse(localStorage.getItem('pendingApprovals') || '[]');
      const pendingUser = pendingUsers.find(u => u.email === email);
      
      if (pendingUser) {
        return { 
          success: false, 
          error: 'Your account is pending admin approval. Please wait for activation.' 
        };
      }

      // Demo accounts fallback
      let role = 'student';
      let department = 'Computer Science';
      
      if (email.includes('admin')) role = 'admin';
      if (email.includes('faculty') || email.includes('prof.')) role = 'faculty';
      if (email.includes('cse')) department = 'Computer Science';
      if (email.includes('mech')) department = 'Mechanical Engineering';
      if (email.includes('ece')) department = 'Electronics & Communication';
      if (email.includes('civil')) department = 'Civil Engineering';

      const mockUser = {
        id: Date.now().toString(),
        name: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1).replace('.', ' '),
        email: email,
        role: role,
        department: department,
        batch: '2024',
        status: 'approved',
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(email.split('@')[0])}&background=3b82f6&color=fff`
      };
      
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Login failed' };
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (userData) => {
    setLoading(true);
    try {
      // Store registration data
      const newUser = {
        id: Date.now().toString(),
        ...userData,
        status: userData.role === 'student' ? 'approved' : 'pending',
        registeredAt: new Date().toISOString(),
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=3b82f6&color=fff`
      };

      if (userData.role === 'faculty') {
        // Add to pending approvals for admin
        const pendingUsers = JSON.parse(localStorage.getItem('pendingApprovals') || '[]');
        pendingUsers.push(newUser);
        localStorage.setItem('pendingApprovals', JSON.stringify(pendingUsers));
        setPendingApprovals(pendingUsers);
        
        return { 
          success: true, 
          requiresApproval: true,
          message: 'Registration submitted for admin approval'
        };
      } else {
        // Auto-approve students
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        
        return { 
          success: true, 
          requiresApproval: false,
          message: 'Registration successful'
        };
      }
    } catch (error) {
      return { success: false, error: 'Registration failed' };
    } finally {
      setLoading(false);
    }
  };

  // Logout function - THIS WAS MISSING
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  // Get pending approvals
  const getPendingApprovals = () => {
    return JSON.parse(localStorage.getItem('pendingApprovals') || '[]');
  };

  // Approve user function
  const approveUser = (userId) => {
    const pendingUsers = JSON.parse(localStorage.getItem('pendingApprovals') || '[]');
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    const userToApprove = pendingUsers.find(user => user.id === userId);
    if (userToApprove) {
      userToApprove.status = 'approved';
      users.push(userToApprove);
      
      const updatedPending = pendingUsers.filter(user => user.id !== userId);
      
      localStorage.setItem('pendingApprovals', JSON.stringify(updatedPending));
      localStorage.setItem('users', JSON.stringify(users));
      setPendingApprovals(updatedPending);
      
      return true;
    }
    return false;
  };

  // Reject user function
  const rejectUser = (userId) => {
    const pendingUsers = JSON.parse(localStorage.getItem('pendingApprovals') || '[]');
    const updatedPending = pendingUsers.filter(user => user.id !== userId);
    
    localStorage.setItem('pendingApprovals', JSON.stringify(updatedPending));
    setPendingApprovals(updatedPending);
    
    return true;
  };

  const value = {
    user,
    login,
    register,
    logout, // Now properly defined
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isFaculty: user?.role === 'faculty',
    isStudent: user?.role === 'student',
    pendingApprovals: getPendingApprovals(),
    approveUser,
    rejectUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};