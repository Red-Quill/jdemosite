import BlogService from "./blogService";
import BlogEditorService from "./blogEditorService";
import CourseService from "./courseService";
import HttpService from "./httpService";
import LocalizationService from "./i18n";
import NotificationService from "./notificationService";
import UserService from "./userService";



const config = process.env.NODE_ENV === "production" ? {} : { url:"http://localhost",port:"3002" };
const httpService = new HttpService(config);

const blogEditorService = new BlogEditorService();
const blogService = new BlogService();
const courseService = new CourseService();
const errorNotificationService = new NotificationService();
const localizationService = new LocalizationService()
const userService = new UserService();

httpService.init(errorNotificationService);
userService.init(httpService);
blogService.init(localizationService,httpService,userService);
blogEditorService.init(blogService);
courseService.init(httpService,localizationService,userService);



export { blogService,blogEditorService,courseService,httpService,localizationService,errorNotificationService,userService };
