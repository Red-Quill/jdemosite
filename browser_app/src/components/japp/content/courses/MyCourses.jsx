import React, { useEffect, useState,useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import { useTranslation } from 'react-i18next';
import { UserContext } from '../../../Contexts';
import Table from "../../../common/Table";
import courseService from "../../../../services/courseService";
import OpenOrDownloadButton from './OpenOrDownloadButton';



const MyCourses = () => {
	const navigate = useNavigate()
	const [ headers,setHeaders ] = useState([]);
	const [ courses,setCourses ] = useState([]);
	const { user } = useContext(UserContext);
	const { t,i18n:{ language } } = useTranslation();
	
	const fetchCourses = async() => {
		setHeaders([{name:"",label:"icon"},{name:t("Course"),label:"name"},{name:"",label:"open"}]);
		const { courseData,error } = await courseService.getUserCourseThumbnails();
		if(error) return toast.error(error);
		const courseItems = courseData.map( (courseThumbnail) => ({
			_id : courseThumbnail._id,
			name : <NavLink to={`/courses/course/${courseThumbnail._id}`}>{courseThumbnail.name}</NavLink>,
			icon : <img src={`/media/${courseThumbnail.iconFileName}`} height="50" width="50" alt="course icon"/>,
			open : <OpenOrDownloadButton courseThumbnail={courseThumbnail}/>,
		}));
		setCourses(courseItems);
	};

	useEffect( () => {
		if(user._id) fetchCourses();
		else navigate("/",{replace:true});
	},[user,language]);


	return (
		<div>
			<h1>{t("My courses")}</h1>
			<Table headers={headers} data={courses} />
		</div>
	);
};



export default MyCourses;
