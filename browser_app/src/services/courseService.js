import _ from "lodash";
import { httpService } from "./httpService";
import userService from "./userService";
import { localizationService } from "./i18n";
import { Course } from "jblog";



class CourseService {
	#courses;
	#httpService;
	#localizationService;
	#userService;
	#userCourses;

	constructor() {
		this.#courses = {};
		this.#userCourses = {};
	}

	init = (httpService,localizationService,userService) => {
		this.#httpService = httpService;
		this.#localizationService = localizationService;
		this.#userService = userService;
		this.#userService.onUserChange( (user) => this.updateUserCourses() )
	};

	updateCourses = async() => {
		const { data,error } = await this.#httpService.get("/api/courses/catalog");
		if(error) return { error };
		for(const course of data)
			this.#courses[course._id] = new Course(course);
		return {};
	};

	updateUserCourses = async() => {
		if(_.isEmpty(this.#courses)) await this.updateCourses();
		const sessionToken = this.#userService.sessionToken;
		if(!sessionToken) {
			this.clearUserCourses();
			return { error:"No user logged in" };
		};
		const { data,error } = await this.#httpService.get("/api/courses/my",{ headers:{ "x-auth-token":sessionToken } });
		if(error) return { error };
		this.clearUserCourses();
		for(const courseId of data)
				this.#userCourses[courseId] = this.#courses[courseId];
		return {};
	}

	clearUserCourses = () => this.#userCourses = {};

	getCourseCatalog = async() => {
		if(_.isEmpty(this.#courses)) await this.updateCourses();
		const courses = Object.values(this.#courses);
		const languages = this.#localizationService.getLanguages();
		const courseData = courses.map( (course) => this.#findThumbnailByLanguages(course,languages) );
		return { courseData };
	};
	
	getCourseThumbnailByCourseId = async(courseId) => {
		if(_.isEmpty(this.#courses)) await this.updateCourses();
		const course = this.#courses[courseId];
		const languages = this.#localizationService.getLanguages();
		const courseThumbnail = this.#findThumbnailByLanguages(course,languages);
		return courseThumbnail;
	}

	#findThumbnailByLanguages = (course,languages) => {
		for(const language of languages) {
			const thumbnail = course.getThumbnailLang(language);
			if(thumbnail) return thumbnail;
		}
	};

	// TODO: check if users courses are cached and if not save to cache
	getUserCourseThumbnails = async() => {
		if(_.isEmpty(this.#userCourses)) await this.updateUserCourses();
		const languages = this.#localizationService.getLanguages();
		const userCourses = Object.values(this.#userCourses);
		const userCourseThumbnails = userCourses.map( (course) => this.#findThumbnailByLanguages(course,languages) );
		return { courseData:userCourseThumbnails };
	};
	
	getCourseContent = async(thumbnail) => {
		const sessionToken = this.#userService.sessionToken;
		if(!sessionToken) return { error:"No user logged in" };
		const { data,error } = await this.#httpService.get(`/api/courses/content/${thumbnail._id}/${thumbnail.language}`,{ responseType:"blob",headers:{ "x-auth-token":sessionToken },returnError:true });
		if(error) return { error };
		const pdfFile = new Blob([data], { type: "application/pdf" });
		return { pdfFile };
	};
	
	// now course = course._id
	// communicate with userService or something that caches user specific stuff
	addCourseToUser = async(course) => {
		const sessionToken = this.#userService.sessionToken;
		const { error } = await this.#httpService.put("/api/courses/my/add",{ courseId:course._id },{ headers:{ "x-auth-token":sessionToken } });
		if(error) return { error };
		await this.updateUserCourses();
		return {};
	};

	isMine = (thumbnail) => Object.keys(this.#userCourses).includes(thumbnail._id);
};

// --> TMP
const courseService = new CourseService();
courseService.init(httpService,localizationService,userService);
// <-- TMP
export default courseService;
