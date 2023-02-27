import React,{ useContext } from 'react';
import { AppSizeContext } from '../../Contexts';
import Dropdown from './dropdown/Dropdown';



const NavBarCollapsible = (props) => {
	const { layoutStyle } = useContext(AppSizeContext);

	return layoutStyle === "large" ?
		<React.Fragment>
			{props.itemList.map( ({ _id,Type,data }) => <Type key={_id} {...data} /> )}
		</React.Fragment>
		:
		<Dropdown {...props} />
	;
}



export default NavBarCollapsible;
