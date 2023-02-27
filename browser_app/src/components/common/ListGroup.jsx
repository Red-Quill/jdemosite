import React from 'react';



const ListGroup = ({ name,label,items,activeItem,onItemSelect,keyProperty="_id",textProperty="name" }) => {
	const getText = textProperty instanceof Function ? textProperty : (item) => item[textProperty] ;
	return (
		<div className="form-group">
			<label htmlFor={name}>{label || name}</label>
			<ul className="list-group">
				{items.map( (item) => (
					<li key={item[keyProperty]} className={`list-group-item${item[keyProperty] === activeItem[keyProperty] ? " active":""}`} onClick={() => onItemSelect(item)}>{getText(item)}</li>
				))}
			</ul>
		</div>
	);
};



export default ListGroup;
