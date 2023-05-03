import React, { useEffect,useState,useContext } from 'react';
import { NavLink,useLocation,useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AppSizeContext } from '../../../Contexts';
import { blogService } from '../../../../services/jdemosite';



const BlogPosts = () => {
	const { layoutStyle } = useContext(AppSizeContext);
	const { search } = useLocation();
	const [ searchParams,setSearchParams ] = useSearchParams();
	const { t,i18n:{ language } } = useTranslation();
	const [ posts,setPosts ] = useState([]);

	const fetchPosts = async() => {
		const topicId = searchParams.get("topic");
		const { postThumbnails } = await blogService.getPostThumbnails({ topicId });
		setPosts(postThumbnails);
	}

	useEffect( () => {fetchPosts()},[search,language])

	return (
		<div className={`jblog-posts jblog-posts-${layoutStyle}`}>
			<p>{t("$ blog posts availability")}</p>
			<ul>
				{posts.map( ({ _id,title,date }) => (
					<li key={_id}>
						<NavLink to={_id}>
							{title} {date.toLocaleDateString()}
						</NavLink>
					</li>
				))}
			</ul>
		</div>
	);
};



export default BlogPosts;
