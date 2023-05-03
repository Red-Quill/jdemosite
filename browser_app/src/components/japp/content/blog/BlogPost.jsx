import React, { useEffect,useState,useContext } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { UserContext } from '../../../Contexts';
import { blogService } from "../../../../services/jdemosite";



const BlogPost = () => {
	const { t, i18n:{ language } } = useTranslation();
	const { user } = useContext(UserContext);
	const { _id } = useParams();
	const [ content,setContent ] = useState({ postHtmlString:"",date:0,title:"" });
	
	const fetchContent = async() => {
		try {
			const postThumbnail = await blogService.getPostThumbnail(_id);
			const postHtmlString = await blogService.getPostContent(postThumbnail);
			setContent({ title:postThumbnail.title,date:postThumbnail.date.toString(),postHtmlString });
		} catch(error) {
			setContent({ title:"Sorry",date:Date.now().toString(),postHtmlString:"<p>Couldn't get requested blog post</p>" })
		}
	};

	useEffect(() => {fetchContent()},[language]);

	return (
		<div className='jblog-post'>
			<BackLink />
			{user.admin && <NavLink to={`/blog/editor/${_id}`}> Edit</NavLink>}
			<h1>{content.title}</h1>
			<p>{content.date}</p>
			<div dangerouslySetInnerHTML={{__html:content.postHtmlString}} />
			<BackLink />
		</div>
	);
};

const BackLink = () => {
	const { t } = useTranslation();

	return <NavLink to="/blog">&lt;-- {t("back")}</NavLink>;
};



export default BlogPost;
