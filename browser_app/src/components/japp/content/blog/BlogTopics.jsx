import React,{ useState,useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { AppSizeContext } from '../../../Contexts';
import { blogService } from "../../../../services/jdemosite";
import BlogTopic from './BlogTopic';



const BlogTopics = () => {
	const { layoutStyle } = useContext(AppSizeContext);
	const [ topics,setTopics ] = useState([]);
	const { t,i18n:{ language } } = useTranslation();

	const fetchTopics = async() => {
		const { topicThumbnails } = await blogService.getTopicThumbnails();
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
