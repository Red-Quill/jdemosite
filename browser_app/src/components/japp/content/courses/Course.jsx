import React,{ useState,useEffect,useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Document,Page,pdfjs } from 'react-pdf';
import { useTranslation } from 'react-i18next';
import _ from "lodash";
import { UserContext } from '../../../Contexts';
import OpenOrDownloadButton from './OpenOrDownloadButton';
import courseService from '../../../../services/courseService';
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

	const renderButton = () => {
		return user._id ?
			courseService.isMine(courseThumbnail) ?
			<OpenOrDownloadButton courseThumbnail={courseThumbnail}/>
			:
			<BuyOrAddButton courseThumbnail={courseThumbnail}/>
			:
			t("Log in or register to get this course for free");
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
