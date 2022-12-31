import { createContext, useState } from 'react';

export const UserContext = createContext(null);

const UserContextProvider = ({ children }) => {
  const [user, updateUser] = useState({
    email: '',
    firstName: '',
    lastName: '',
    picture: '',
  });

  return (
    <UserContext.Provider value={{ user, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
