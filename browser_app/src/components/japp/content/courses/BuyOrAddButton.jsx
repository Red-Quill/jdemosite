import React from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from "react-toastify";
import courseService from "../../../../services/courseService";



const BuyOrAddButton = ({ courseThumbnail }) => {
	const { t } = useTranslation();

	const handleCourseAdd = async() => {
		const { error } = await courseService.addCourseToUser(courseThumbnail.course);
		if(error) toast.error(error);
		else toast.success(`${t("Course")} ${courseThumbnail.name} ${t("$ add course message end")}`);
	};

	//later add pricing
	return  <button onClick={handleCourseAdd}>{t("Free")}, {t("add to my courses")}</button>
};



export default BuyOrAddButton;
