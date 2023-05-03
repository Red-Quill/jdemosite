import React from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { courseService } from '../../../../services/jdemosite';



const OpenOrDownloadButton = ({ courseThumbnail }) => {
	const { t } = useTranslation();

	const handleOpenCourse = async() => {
		const { pdfFile,error } = await courseService.getCourseContent(courseThumbnail);
		if(error) return toast.error(error);
		const pdfURL = URL.createObjectURL(pdfFile);
		const pdfWindow = window.open();
		pdfWindow.location.href = pdfURL;
		URL.revokeObjectURL(pdfURL);
	};

	return <button onClick={handleOpenCourse}>{t("Open")}/{t("Download")} PDF</button>;
};



export default OpenOrDownloadButton;
