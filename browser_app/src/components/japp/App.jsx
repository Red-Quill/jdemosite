import React, { useState,useRef,useLayoutEffect, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import userService from '../../services/userService';
import { NavBarContext,AppSizeContext } from '../Contexts';
import NavBar,{ NavBarLink,NavBarAction,NavBarCollapsible,NavBarDropdown } from "./navBar/NavBar";
import Content from './content/Content';
import "./App.scss";
import englishFlag from "../../static/en.svg";
import finnishFlag from "../../static/fi.svg";
import menuIcon from "../../static/menu.svg";



const appGlobalState = {
	dimensions : [0,0,null],
	
	setDimensions(dimensions) {
		this.dimensions = dimensions;
	},

	getLayoutStyle() {
		return this.dimensions[2]
	},
}

const useContainerDimensions = (ref) => {
	const [ dimensions,setDimensions ] = useState([0,0,"narrow"])
  
	useLayoutEffect(() => {
		const handleResize = () => {
			const { clientWidth,clientHeight } = ref.current;
			const newDimensions = [clientWidth,clientHeight,calculateLayoutStyle(clientWidth,clientHeight)];
			appGlobalState.setDimensions(newDimensions);
			setDimensions(newDimensions);
		}
		if (ref.current) handleResize();
		window.addEventListener("resize", handleResize)
		return () => { window.removeEventListener("resize", handleResize) }
	},[ref])
  
	return dimensions;
};

const calculateLayoutStyle = (width,height) => {
	return (
		height < 650 ?
			width < 850 ? ( width/height < 1 ? "narrow" : "short" ) : "short"
			:
			width < 850 ? "narrow"                                  : "large"
	)
};

const App = () => {
	const me = useRef();
	const [ width,height,layoutStyle ] = useContainerDimensions(me)
	const [ navBarItems,setNavBarItems ] = useState([]);
	const [ navBarCustomItems,setNavBarCustomItems ] = useState([]);
	const { t,i18n:{ language,changeLanguage } } = useTranslation();

	useEffect( () => {
		setNavBarItems(
			[
				{
					_id : 110,
					Type : NavBarDropdown,
					data : {
						itemList : [
							{ _id:111,Type:NavBarLink,data:{ to:"/",text:t("@nav Home") } },
							{ _id:112,Type:NavBarLink,data:{ to:"/author",text:t("@nav Site Creator") } },
							{ _id:113,Type:NavBarLink,data:{ to:"/tutor",text:t("Tutor") } },
							{ _id:114,Type:NavBarLink,data:{ to:"/resume",text:t("Resume") } },
						],
						text : "jdemosite.link",
					},
				},
				{
					_id : 120,
					Type : NavBarCollapsible,
					data : {
						itemList : [
							{ _id:130,Type:NavBarLink,data:{ to:"/blog",text:t("Blog") } },
							{ _id:140,Type:NavBarLink,data:{ to:"/courses",text:t("Courses") } },
							{ _id:150,Type:NavBarAction,data:{ onClick:() => changeLanguage("fi"),symbol:{ src:finnishFlag,alt:"Suomeksi/Finnish"} } },
							{ _id:160,Type:NavBarAction,data:{ onClick:() => changeLanguage("en"),symbol:{ src:englishFlag,alt:"English/Englanniksi"} } },
						],
						symbol : { src:menuIcon,alt:"Menu"},
					},
				},
			]
		);
	},[language]);

	// Todo: if language changes update text inside toast
	// --> for example close previous toast and open new one
	useEffect( () => {
		if(!userService.termsAccepted()) {
			const CloseButton = () => <button onClick={ () => closeAcceptTerms() }>OK</button>
			const toastId = toast.info(t("$ terms"),{
				autoClose : false,
				closeOnClick : false,
				closeButton : CloseButton,
			});
			const closeAcceptTerms = () => {
				userService.setTermsAccepted();
				toast.dismiss(toastId);
			};
		}
	},[language]);

	return (
		<div ref={me} className="japp">
			<AppSizeContext.Provider value={{ layoutStyle,width,height }}>
				<NavBar itemLists={[{ _id:100,itemList:navBarItems },{ _id:200,itemList:navBarCustomItems }]} />
				<NavBarContext.Provider value={{ setNavBarCustomItems }}>
					<Content />
				</NavBarContext.Provider>
			</AppSizeContext.Provider>
		</div>
	);
};



export default App;

/**
style={{position:"relative", maxWidth:1200,height:"100vh",margin:"0 auto"}}
 */