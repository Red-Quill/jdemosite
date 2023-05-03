import React from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from "react-toastify";
import { courseService } from "../../../../services/jdemosite";



const BuyOrAddButton = ({ courseThumbnail:{ name,course } }) => {
	const { t } = useTranslation();

	const handleCourseAdd = async() => {
		const { error } = await courseService.addCourseToUser(course);
		if(error) toast.error(error);
		else toast.success(`${t("Course")} ${name} ${t("$ add course message end")}`);
	};

	//later add pricing
	return  <button onClick={handleCourseAdd}>{t("Free")}, {t("add to my courses")}</button>
};



export default BuyOrAddButton;
