import React from 'react';
import { NavLink } from 'react-router-dom';
import { renderNavBarItemContent } from "./common.jsx";



const NavBarAction = ({ onClick,symbol,text }) => (
	<li>
		<NavLink className="nav-link" to="#" onClick={onClick}>
			{renderNavBarItemContent({symbol,text})}
		</NavLink>
	</li>
);



export default NavBarAction;
