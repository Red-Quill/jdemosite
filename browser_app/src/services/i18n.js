import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguaDetector from 'i18next-browser-languagedetector';

// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
const resources = {
	en: {
		translation: {
			"$ add course message end" : "has been added to your courses",
			"$ blog posts availability" : "Some (most) blog posts are only available in Finnish",
			"$ terms" : "This website stores only cookies and site data that are strictly necessary for the operation of this website",
			"@nav Home" : "Home",
			"@nav Site Creator" : "Site Creator",
			"@resume Experience" : "Experience",
			"@resume Profile" : "Profile",
			"add to my courses" : "add to my courses",
			"All" : "All",
			"Blog" : "Blog",
			"back" : "back",
			"Buy" : "Buy",
			"Competencies" : "Competencies",
			"Course" : "Course",
			"Courses" : "Courses",
			"Download" : "Download",
			"Education" : "Education",
			"Email" : "Email",
			"Email is required" : "Email is required",
			"Free" : "Free",
			"Incorrect email or password" : "Incorrect email or password",
			"Invalid email or password" : "Invalid email or password",
			"Log in or register to get this course for free" : "Log in or register to get this course for free",
			"My courses" : "My courses",
			"Name" : "Name",
			"Name is required" : "Name is required",
			"Open" : "Open",
			"Password" : "Password",
			"Password is required" : "Password is required",
			"Register" : "Register",
			"Resume" : "Resume",
			"Sign in" : "Sign in",
			"Sign out" : "Sign out",
			"Sign up" : "Sign up",
			"Skills" : "Skills",
			"Study materials" : "Study materials",
			"Tutor" : "Tutor",
			"Valid" : "Valid",
		}
	},
	fi: {
		translation: {
			"$ add course message end" : "on lisätty omiin kursseihin",
			"$ blog posts availability" : "",
			"$ terms" : "Tämä sivusto käyttää vain toiminnallisia evästeitä, jotka ovat välttämättömiä sivuston toiminnalle.",
			"@nav Home" : "Etusivu",
			"@nav Site Creator" : "Tekijä",
			"@resume Experience" : "Työkokemus",
			"@resume Profile" : "Esittely",
			"add to my courses" : "lisää omiin kursseihin",
			"All" : "Kaikki",
			"back" : "takaisin",
			"Blog" : "Blogi",
			"Buy" : "Osta",
			"Course" : "Kurssi",
			"Courses" : "Kurssit",
			"Download" : "Lataa",
			"Education" : "Koulutus",
			"Email" : "Sähköposti",
			"Email is required" : "Sähköpostiosoite pitää olla",
			"Free" : "Ilmainen",
			"Incorrect email or password" : "Väärä sähköpostiosoite tai salasana",
			"Invalid email or password" : "Väärä sähköpostiosoite tai salasana",
			"Log in or register to get this course for free" : "Ilmainen kurssi, ota se käyttöön kirjautumalla sisään tai rekisteröitymällä",
			"My courses" : "Omat kurssini",
			"Name" : "Nimi",
			"Name is required" : "Nimi täytyy olla",
			"Open" : "Avaa",
			"Password" : "Salasana",
			"Password is required" : "Salasana täytyy olla",
			"Register" : "Rekisteröidy",
			"Resume" : "CV",
			"Sign in" : "Kirjaudu sisään",
			"Sign out" : "Kirjaudu ulos",
			"Sign up" : "Rekisteröidy",
			"Skills" : "Taidot",
			"Competencies" : "Pätevyydet",
			"Study materials" : "Oppimateriaalit",
			"Tutor" : "Tuutori",
			"Valid" : "Voimassa",
		}
	}
};

i18n
	.use(initReactI18next) // passes i18n down to react-i18next
	.use(LanguaDetector)
	.init({
		resources,
		//lng: "fi", // language to use, more information here: https://www.i18next.com/overview/configuration-options#languages-namespaces-resources
		// you can use the i18n.changeLanguage function to change the language manually: https://www.i18next.com/overview/api#changelanguage
		// if you're using a language detector, do not define the lng option
		fallbackLng : [ "fi","en","dev" ],
		supportedLngs : [ "fi","en" ],
		detection : { order:[ "localStorage","htmlTag" ] },

		interpolation: {
			escapeValue: false // react already safes from xss
		}
	});

class LocalizationService {

	getLanguage = () => i18n.language;
	getLanguages = () => i18n.languages;
}

// TMP
const localizationService = new LocalizationService()



export default LocalizationService;
export { LocalizationService,localizationService,i18n };
