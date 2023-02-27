import React from 'react';



const UserContext = React.createContext();
UserContext.displayName = "UserContext";

const NavBarContext = React.createContext();
NavBarContext.displayName = "NavBarContext";

const AppSizeContext = React.createContext();
AppSizeContext.displayName = "AppSizeContext";



export { NavBarContext,UserContext,AppSizeContext };
