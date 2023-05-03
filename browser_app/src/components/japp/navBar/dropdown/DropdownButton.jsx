import React from 'react';
import { NavLink } from 'react-router-dom';
import { renderNavBarItemContent } from "../common";
import arrowDownSymbol from "../../../../static/arrow-down-solid.svg";
import arrowRightSymbol from "../../../../static/arrow-right-solid.svg";



const DropdownButton = ({ onClick,symbol,text,arrowDown }) => (
	<NavLink className="nav-link" to="#" onClick={onClick}>
		{renderNavBarItemContent({symbol,text})}
		<img src={arrowDown ? arrowDownSymbol : arrowRightSymbol} alt="Dropdown arrow" style={{ height:30 }}/>
	</NavLink>
);



export default DropdownButton;
