import React from 'react';



const renderNavBarItemContent = ({ symbol,text }) => (
	<React.Fragment>
		{symbol && <img src={symbol.src} alt={symbol.alt} height={30}/>}
		{text ? text : null}
	</React.Fragment>
)



export { renderNavBarItemContent };

/*

*/
