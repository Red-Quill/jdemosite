import mongoose from "mongoose";
import { Course } from "jblog";
import FileManager from "../files/fileManager.js";



class CourseManager {
	dataBaseManager;
	courseFilesPath;
	#fileManager;
	courses;
	userManager;

	courseContentSchema = new mongoose.Schema({
		_id : false,
		name : { type:String,required:true },
		courseFileName : { type:String,required:true },
	});

	courseSchema = new mongoose.Schema({
		iconFileName : { type:String,required:true },
		content : new mongoose.Schema({
			_id : false,
			fi : this.courseContentSchema,
			en : this.courseContentSchema,
		}),
	});

	userCourseListSchema = new mongoose.Schema({
		userId : { type:mongoose.Schema.Types.ObjectId,required:true,unique:true },
		courseIds : [ mongoose.Schema.Types.ObjectId ],
	});

	constructor({ courseFilesPath }) {
		this.courses = {};
		this.courseFilesPath = courseFilesPath;
		this.#fileManager = new FileManager(courseFilesPath);
	}

	init = async(dataBaseManager,userManager) => {
		this.dataBaseManager = dataBaseManager;
		this.userManager = userManager;
		await this.dataBaseManager.newTable("course", this.courseSchema);
		await this.dataBaseManager.newTable("userCourseList", this.userCourseListSchema);
		await this.updateCourses();
	};

	updateCourses = async() => {
		const courses_ = await this.dataBaseManager.getTableObjects("course");
		for(const course_ of courses_) {
			const course = new Course(course_);
			this.courses[course._id] = course;
		}
	};

	getCourses = async() => {
		return Object.values(this.courses);
	};

	getCourse = async(courseId) => {
		const course = this.courses[courseId];
		// if !course throw error
		return course;
	}

	// gives pdf file name for now
	getCourseContent = async(courseId,language,user) => {
		const userCourseList = await this.dataBaseManager.findOneObject("userCourseList",{ userId:user._id });
		if(!userCourseList.courseIds.includes(courseId)) return { error:"You don't have access to that course" };
		const contentId = this.courses[courseId].getThumbnailLang(language).contentId;
		const contentFilePath = this.#fileManager.fullPath(`${contentId}.pdf`);
		return { contentFilePath };
	};

	addCourseToUser = async(course,user) => {
		const { error } = await this.dataBaseManager.updateOne("userCourseList",{ userId:user._id },
			{ $addToSet : { courseIds:course._id } },
			{ userId:user._id,courseIds:[] }
		);
		if(error) return { error };
		return { success:true };
	};

	getUserCourseList = async(user) => {
		const result = await this.dataBaseManager.findOneObject("userCourseList",{ userId:user._id });
		const courseList = result ? result.courseIds : [];
		return courseList;
	};
};



export default CourseManager;



/*

*/
