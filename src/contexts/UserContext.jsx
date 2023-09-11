// UserContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(()=>{
    const storedSelectedRole = localStorage.getItem('selectedRole');
    console.log("storedSelectedRole ",storedSelectedRole)

    return {
      roles: ['Manager', 'Owner', 'Tenant', 'Maintenance'], // Array of roles
      selectedRole: storedSelectedRole || 'Manager', // Default selected role
      userId: '', // User ID
      // Add other user-related information here
    }
  });

  // Update localStorage when the selected role changes
  useEffect(() => {
    localStorage.setItem('selectedRole', user.selectedRole);
  }, [user.selectedRole]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
