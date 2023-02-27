import React, { useEffect,useState,useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import { toast } from "react-toastify";
import { UserContext } from '../../../Contexts';
import Table from "../../../common/Table";
import BuyOrAddButton from './BuyOrAddButton';
import OpenOrDownloadButton from './OpenOrDownloadButton';
import courseService from "../../../../services/courseService";



const Courses = () => {
	const { user } = useContext(UserContext);
	const [ courses,setCourses ] = useState([]);
	const [ headers,setHeaders ] = useState([]);
	const { t,i18n:{ language } } = useTranslation();

	const fetchCourses = async() => {
		const headers = [{name:"",label:"icon"},{name:t("Course"),label:"name"}];
		if(user._id) headers.push({name:"",label:"buyOrOpen"});
		setHeaders(headers);
		const { courseData } = await courseService.getCourseCatalog();
		const courseItems = courseData.map( (courseThumbnail) => {
			const courseItem = {
				_id : courseThumbnail._id,
				name : <NavLink to={`/courses/course/${courseThumbnail._id}`}>{courseThumbnail.name}</NavLink>,
				icon : <img src={`/media/${courseThumbnail.iconFileName}`} height="50" width="50" alt="course icon"/>,
			};
			if(user._id) {
				courseItem.buyOrOpen = courseService.isMine(courseThumbnail) ?
					<OpenOrDownloadButton courseThumbnail={courseThumbnail} />
					:
					<BuyOrAddButton courseThumbnail={courseThumbnail} />;
			};
			return courseItem;
		});
		setCourses(courseItems);
	};

	useEffect( () => {
		fetchCourses();
	},[language,user])

	return (
		<div>
			<h1>{t("Courses")}</h1>
			<Table headers={headers} data={courses} />
		</div>
	);
};



export default Courses;

/*

*/
