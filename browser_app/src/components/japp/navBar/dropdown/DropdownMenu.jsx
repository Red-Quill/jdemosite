import React from 'react';



const DropdownMenu = ({ itemList,position:[left,top,atTop,atEnd] }) => (
	<ul
		style={{
			left,
			top,
			transform : atEnd ? atTop ? "translate(-100px)" : "translateY(-100%)" : "",
		}}
	>
		{itemList.map(({ _id,Type,data }) => <Type key={_id} {...data} />)}
	</ul>
);



export default DropdownMenu;
