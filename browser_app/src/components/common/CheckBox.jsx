import React from 'react';



const CheckBox = ({ name,label,onChange,error,...rest }) => {
	// Are name and label in wrong order ???
	return (
		<div className="form-group">
			<label htmlFor={name}>{label || name}</label>
			<input
				type="checkbox"
				className="form-check-input"
				name={name}
				onChange={ ({ currentTarget:{ checked } }) => onChange(checked) }
				{...rest}
			/>
			{error && <div className="alert alert-danger">{error}</div>}
		</div>
	);
};



export default CheckBox;
