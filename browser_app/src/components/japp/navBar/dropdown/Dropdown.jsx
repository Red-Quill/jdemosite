import React, { useRef,useState,useEffect,useLayoutEffect,useContext } from 'react';
import { AppSizeContext } from '../../../Contexts';
import DropdownButton from './DropdownButton';
import DropdownMenu from './DropdownMenu';
import "./Dropdown.scss";



const useContainerPosition = (ref) => {
	const [ position,setPosition ] = useState({ left:[0,0],top:[0,0],width:0,height:0 });
  
	useLayoutEffect(() => {
		const handleResize = () => {
			const { left,right,top,bottom } = ref.current.getBoundingClientRect();
			const { offsetWidth,offsetHeight } = ref.current;
			const newDimensions = {
				left         : [ left           , (top+bottom)/2 ],
				top          : [ (left+right)/2 , top            ],
				width        : offsetWidth,
				height       : offsetHeight,
			};
			//console.log(newDimensions);
			setPosition(newDimensions);
		}
		if (ref.current) handleResize();
		window.addEventListener("resize", handleResize)
		return () => { window.removeEventListener("resize", handleResize) }
	},[ref])
  
	return position;
};

const Dropdown = ({ itemList,symbol,text }) => {
	const self = useRef();
	const [ showMenu,setShowMenu ] = useState(false);
	const { layoutStyle,width:layoutWidth,height:layoutHeight } = useContext(AppSizeContext);
	const { left:[ leftX,leftY ], top:[ topX,topY ],width,height } = useContainerPosition(self);
	
	// --> Close menu when click outside
	const handleMouseClickOutside = (event) => {
		if(self.current && !self.current.contains(event.target))
			setShowMenu(false);
	};
	
	useEffect( () => {
		document.addEventListener("mousedown", handleMouseClickOutside);
		return () => {document.removeEventListener("mousedown", handleMouseClickOutside);};
	},[self]);
	// <-- Close menu when click outside

	return (
		<li>
			<div ref={self} className="japp-dropdown">
				<DropdownButton symbol={symbol} text={text} onClick={ () => setShowMenu(!showMenu) } arrowDown={ layoutStyle !== "short" }/>
				{showMenu && <DropdownMenu itemList={itemList} position={ layoutStyle === "short" ? [150,leftY*2>layoutHeight ? height : 0,false,leftY*2>layoutHeight] : [topX*2>layoutWidth ? width : 0,50,true,topX*2>layoutWidth] }/>}
			</div>
		</li>
	);
};



export default Dropdown;

/*
// okay so get position,width,height of DropdonwButton
// if position+0.5width > 0.5layoutwidth use bottom right corner, else bottom left
// if position+0.5height > 0.5layoutheight use left bottom corner, else left top
*/
