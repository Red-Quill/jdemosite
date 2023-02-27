import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../../Contexts';



const Logout = () => {
	const { logout } = useContext(UserContext);
	const navigate = useNavigate();

	const handleLogout = async() => {
		await logout();
		navigate("/courses",{replace:true});
	};

	useEffect( () => { handleLogout() },[]);

	return <p>Logging out</p>;
};



export default Logout;
