import React,{ useContext,useEffect } from 'react';
import BlogTopics from './BlogTopics';
import BlogPosts from "./BlogPosts";
import { NavBarContext,UserContext } from '../../../Contexts';
import { NavBarLink,NavBarCollapsible } from "../../navBar/NavBar";
import { useTranslation } from 'react-i18next';
import "./Blog.scss";
import userIcon from "../../../../static/profile.svg";



const Blog = () => {
	const { setNavBarCustomItems } = useContext(NavBarContext);
	const { user } = useContext(UserContext);
	const { t,i18n:{ language } } = useTranslation();

	const navBarUserItems = [
		{
			_id : 310,
			Type : NavBarCollapsible,
			data: {
				itemList : [
					...(user && user.admin ? [{ _id:320,Type:NavBarLink,data:{ to:"/blog/editor",text:t("New Post") } }] : []),
					{ _id:330,Type:NavBarLink,data:{ to:"/courses/logout",text:t("Sign out") } },
				],
				symbol : { src:userIcon,alt:"User menu"},
			},
		},
	];

	const navBarNoUserItems = [
		{
			_id : 340,
			Type : NavBarCollapsible,
			data: {
				itemList : [
					{ _id:350,Type:NavBarLink,data:{ to:"/courses/register",text:t("Sign up") } },
					{ _id:360,Type:NavBarLink,data:{ to:"/courses/login",text:t("Sign in") } },
				],
				symbol : { src:userIcon,alt:"User menu"},
			},
		},
	];

	useEffect( () => {
		setNavBarCustomItems(user._id ? navBarUserItems : navBarNoUserItems);
		return () => setNavBarCustomItems([]);
	},[user,language])

	return (
		<div className="jblog">
			<BlogTopics />
			<BlogPosts />
		</div>
	);
};



export default Blog;

/*

*/
