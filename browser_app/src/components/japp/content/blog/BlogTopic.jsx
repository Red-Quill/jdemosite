import React,{ useState,useEffect } from 'react';
import { NavLink } from 'react-router-dom';



const BlogTopic = ({ to,children }) => (
	<li className="list-group-item py-1">
		<NavLink className="text-reset" to={to} style={{display:"block"}}>{children}</NavLink>
	</li>
);



export default BlogTopic;


/*

*/