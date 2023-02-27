import React from 'react';
import { NavLink } from 'react-router-dom';
import { renderNavBarItemContent } from "./common.jsx";



const NavBarLink = ({ to,symbol,text }) => (
	<li>
		<NavLink className="nav-link" to={to}>
			{renderNavBarItemContent({symbol,text})}
		</NavLink>
	</li>
);



export default NavBarLink;





/*
 */