import React, { useContext, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { NavBarContext,UserContext } from '../../../Contexts';
import { NavBarLink,NavBarCollapsible } from "../../navBar/NavBar";
import { useTranslation } from 'react-i18next';
import userIcon from "../../../../static/profile.svg";



const Courses = () => {
	const { setNavBarCustomItems } = useContext(NavBarContext);
	const { user } = useContext(UserContext);
	const { t,i18n:{ language } } = useTranslation();

	const navBarUserItems = [
		{
			_id : 210,
			Type : NavBarCollapsible,
			data: {
				itemList : [
					{ _id:220,Type:NavBarLink,data:{ to:"/courses/mycourses",text:t("My courses") } },
					{ _id:230,Type:NavBarLink,data:{ to:"/courses/logout",text:t("Sign out") } },
				],
				symbol : { src:userIcon,alt:"User menu"},
			},
		}
	];

	const navBarNoUserItems = [
		{
			_id : 240,
			Type : NavBarCollapsible,
			data: {
				itemList : [
					{ _id:250,Type:NavBarLink,data:{ to:"/courses/register",text:t("Sign up") } },
					{ _id:260,Type:NavBarLink,data:{ to:"/courses/login",text:t("Sign in") } },
				],
				symbol : { src:userIcon,alt:"User menu"},
			},
		}
	];

	useEffect( () => {
		setNavBarCustomItems(user._id ? navBarUserItems : navBarNoUserItems);
		return () => setNavBarCustomItems([]);
	},[user,language])

	return <Outlet />;
};



export default Courses;
