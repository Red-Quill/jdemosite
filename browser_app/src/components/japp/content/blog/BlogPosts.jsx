import React, { useEffect,useState,useContext } from 'react';
import { NavLink,useLocation,useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { AppSizeContext } from '../../../Contexts';
import blogService from '../../../../services/blogService';



const BlogPosts = () => {
	const { layoutStyle } = useContext(AppSizeContext);
	const { search } = useLocation();
	const [ searchParams,setSearchParams ] = useSearchParams();
	const { t,i18n:{ language,languages } } = useTranslation();
	const [ posts,setPosts ] = useState([]);

	const fetchPosts = async() => {
		const topicId = searchParams.get("topic");
		const { postThumbnails,error } = await blogService.getPostThumbnails({ topicId });
		if(error) return toast.error(error);
		setPosts(postThumbnails);
	}

	useEffect( () => {fetchPosts()},[search,language])

	return (
		<div className={`jblog-posts jblog-posts-${layoutStyle}`}>
			<p>{t("$ blog posts availability")}</p>
			<ul>
				{posts.map( (post) => (
					<li key={post._id}>
						<NavLink to={post._id}>
							{post.title} {post.date.toLocaleDateString()}
						</NavLink>
					</li>
				))}
			</ul>
		</div>
	);
};



export default BlogPosts;
