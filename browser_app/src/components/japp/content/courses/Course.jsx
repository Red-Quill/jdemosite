import React,{ useState,useEffect,useContext } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import { Document,Page,pdfjs } from 'react-pdf';
import { useTranslation } from 'react-i18next';
import _ from "lodash";
import { UserContext } from '../../../Contexts';
import OpenOrDownloadButton from './OpenOrDownloadButton';
import { courseService } from '../../../../services/jdemosite';
import BuyOrAddButton from './BuyOrAddButton';



// This is temporary fix to a bug in react-pdf
// pdf.worker.js is copied from its original source to public/
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.js';

const Course = () => {
	const { _id } = useParams();
	const { user } = useContext(UserContext);
	const [ courseThumbnail,setCourseThumbnail ] = useState();
	const { t,i18n:{ language } } = useTranslation();

	const fetchContent = async() => {
		const courseThumbnail = await courseService.getCourseThumbnailByCourseId(_id);
		setCourseThumbnail(courseThumbnail);
	}

	useEffect( () => {
		fetchContent();
	},[language]);

	const no_user = {
		en : <span><NavLink to="/courses/login">Log in</NavLink> or <NavLink to="/courses/register">register</NavLink> to get this course for free.</span>,
		fi : <span>Ilmainen kurssi, <NavLink to="/courses/login">kirjaudu sisään</NavLink> tai <NavLink to="/courses/register">rekisteröidy</NavLink> ottaaksesi sen käyttöön.</span>,
	};

	const renderButton = () => {
		return user._id ?
			courseService.isMine(courseThumbnail) ?
			<OpenOrDownloadButton courseThumbnail={courseThumbnail}/>
			:
			<BuyOrAddButton courseThumbnail={courseThumbnail}/>
			:
			no_user[language]
	};

	if(!courseThumbnail) return;
	return (
		<div>
			<Document file={`/media/${courseThumbnail.contentId}.pdf`}>
				<Page pageNumber={1} />
			</Document>
			{renderButton()}
		</div>
	);
};



export default Course;
