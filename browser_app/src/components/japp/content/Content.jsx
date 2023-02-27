import React, { useContext } from 'react';
import { Outlet } from 'react-router-dom';
import { AppSizeContext } from '../../Contexts';
import "./Content.scss";



const Content = () => {
	const { layoutStyle } = useContext(AppSizeContext);

	return (
		<div className={`japp-content japp-content-${layoutStyle}`}>
			<Outlet />
		</div>
	);
};



export default Content;
