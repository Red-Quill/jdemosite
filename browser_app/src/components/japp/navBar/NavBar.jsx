import React,{ useContext } from 'react';
import { AppSizeContext } from '../../Contexts';
import NavBarAction from './NavBarAction';
import NavBarLink from './NavBarLink';
import NavBarCollapsible from './NavBarCollapsible';
import NavBarDropdown from './dropdown/Dropdown';
import "./NavBar.scss";



const NavBar = ({ itemLists }) => {
	const { layoutStyle } = useContext(AppSizeContext);

	return (
		<nav className={`japp-navbar japp-navbar-${layoutStyle}`}>
			{itemLists.map( ({ _id,itemList }) => (
				<ul key={_id}>
					{itemList.map( ({ _id,Type,data }) => <Type key={_id} {...data} /> )}
				</ul>
			) )}
		</nav>
	);
};



export default NavBar;
export { NavBarAction,NavBarCollapsible,NavBarLink,NavBarDropdown };

/*

*/
