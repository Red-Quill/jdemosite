import React,{ useState,useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from "react-toastify";
import { AppSizeContext } from '../../../Contexts';
import blogService from "../../../../services/blogService";
import BlogTopic from './BlogTopic';



const BlogTopics = () => {
	const { layoutStyle } = useContext(AppSizeContext);
	const [ topics,setTopics ] = useState([]);
	const { t,i18n:{ language } } = useTranslation();

	const fetchTopics = async() => {
		const { error,topicThumbnails } = await blogService.getTopicThumbnails();
		if(error) return toast.error(error);
		setTopics(topicThumbnails);
	}

	useEffect( () => {fetchTopics()},[language])

	return (
		<ul className={`list-group jblog-topics jblog-topics-${layoutStyle}`}>
			<BlogTopic to="/blog">{t("All")}</BlogTopic>
			{topics.map( (topic) => (
				<BlogTopic key={topic._id} to={`/blog?topic=${topic._id}`}>{topic.name}</BlogTopic>
			))}
		</ul>
	);
};



export default BlogTopics;



/*
*/
