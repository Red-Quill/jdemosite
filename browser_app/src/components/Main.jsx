import React, { useState,useEffect } from 'react';
import { Routes,Route,Navigate } from 'react-router-dom';
import { toast,ToastContainer } from "react-toastify";
import userService from '../services/userService';
import { errorNotificationService } from '../services/notificationService';
import App from "./japp/App";
import AboutWebsite from './japp/content/AboutWebsite';
import AboutCreator from './japp/content/AboutCreator';
import Resume from "./japp/content/resume/Resume";
import AboutTutor from "./japp/content/aboutTutor/AboutTutor"
import Blog from './japp/content/blog/Blog';
import BlogPost from './japp/content/blog/BlogPost';
import Editor from './japp/content/blog/Editor';
import Courses from './japp/content/courses/Courses';
import CourseCatalog from './japp/content/courses/CourseCatalog';
import MyCourses from './japp/content/courses/MyCourses';
import Course from './japp/content/courses/Course';
import Login from './japp/content/courses/Login';
import Logout from './japp/content/courses/Logout';
import Register from './japp/content/courses/Register';
import NotFound from './NotFound';
import { UserContext } from './Contexts';

import "react-toastify/dist/ReactToastify.css"



const Main = () => {
	const [ user,setUser ] = useState(userService.currentUser);
	const { login,logout,registerAndLogin } = userService;
	const showError = (message) => toast.error(message);
	userService.onUserChange(setUser);
	errorNotificationService.registerListener(showError);

	useEffect( () => {
		return () => {
			errorNotificationService.removeListener(showError);
			userService.onUserChangeDeregister(setUser);
		};
	},[]);

	return (
		<UserContext.Provider value={{user,login,logout,registerAndLogin}}>
			<ToastContainer autoClose={20000} position={toast.POSITION.BOTTOM_RIGHT} />
			<Routes>
				<Route path="/" element={<App />}>

					<Route index element={<AboutWebsite />}/>
					<Route path="author" element={<AboutCreator />}/>
					<Route path="resume" element={<Resume />}/>
					<Route path="tutor" element={<AboutTutor />}/>

					<Route path="blog" element={<Blog />}/>
					<Route path="blog/:_id" element={<BlogPost />}/>
					<Route path="blog/editor" element={<Editor />}/>
					<Route path="blog/editor/:_id" element={<Editor />}/>
					

					<Route path="courses" element={<Courses />}>
						<Route index element={<CourseCatalog />}/>
						<Route path="mycourses" element={<MyCourses />}/>
						<Route path="login" element={<Login />}/>
						<Route path="logout" element={<Logout />}/>
						<Route path="register" element={<Register />}/>
						<Route path="course/:_id" element={<Course />}/>
					</Route>

					<Route path="notfound" element={<NotFound />}/>
				</Route>
				<Route path="/resume/xx" element={<Resume />}/>
				<Route path="/*" element={<Navigate to="/notfound" />}/>
			</Routes>
		</UserContext.Provider>
	);
};



export default Main;

/*

*/
