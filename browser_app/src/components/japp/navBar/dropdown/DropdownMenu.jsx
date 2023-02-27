import React from 'react';



// atEnd: false if located before halfway of the bar
const DropdownMenu = ({ itemList,position:[left,top,atTop,atEnd] }) => {
	const styles = {
		left,
		top,
		transform : atEnd ? atTop ? "translate(-100px)" : "translateY(-100%)" : "",
	};

	return (
		<ul style={styles}>
			{itemList.map( ({ _id,Type,data }) => <Type key={_id} {...data} /> )}
		</ul>
	);
};



export default DropdownMenu;

/*
{itemList.map( ({ _id,type,Type,data }) => <React.Fragment key={_id}>{renderTypes[type](data)}</React.Fragment> )}
*/
