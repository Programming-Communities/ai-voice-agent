"use client";

import { api } from '@/convex/_generated/api';
import { useUser } from '@stackframe/stack';
import { useMutation } from 'convex/react';
import React, { useEffect, useState, createContext } from 'react';

// Define UserContext
export const UserContext = createContext(null);

function AuthProvider({ children }) {
  const user = useUser();
  const CreateUser = useMutation(api.users.CreateUser);
  const [userData, setUserData] = useState();

  useEffect(() => {
    console.log(user);
    user && CreateNewUser();
    
  }, [user]);

  const CreateNewUser = async () => {
    const result = await CreateUser({
      name: user?.displayName,
      email: user?.primaryEmail
    });
    console.log(result);
    setUserData(result);
  };

  return (
    <UserContext.Provider value={{ userData, setUserData }}>
      {children}
    </UserContext.Provider>
  );
}

export default AuthProvider;


// "use client";

// import { api } from '@/convex/_generated/api';
// import { useUser } from '@stackframe/stack';
// import { useMutation } from 'convex/react';
// import React, { useEffect, useState } from 'react';

// function AuthProvider({ children }) {


//   const user = useUser();
//   const CreateUser = useMutation(api.users.CreateUser);
//   const [userDate,setUserData]=useState();
//   useEffect(() => {
//     console.log(user)
//     user && CreateNewUser();
    
//   }, [user])

//   const CreateNewUser = async () => {
//     const result = await CreateUser({
//       name: user?.displayName,
//       email:user.primaryEmail
//     });
//     console.log(result);
//     setUserData(result);
  
//   }

//   return (
//     <div>
//       <UserContext.Provider value={{setUserData,setUserData}}>
//       {children}
//       </UserContext.Provider >
//     </div>
//   )
// }

// export default AuthProvider;
