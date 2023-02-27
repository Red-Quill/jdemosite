import React from 'react';



const Input = ({ name,label,onChange,error,...rest }) => {
	// Are name and label in wrong order ???
	return (
		<div className="form-group">
			<label htmlFor={name}>{label || name}</label>
			<input
				className="form-control"
				name={name}
				onChange={ ({ currentTarget:input }) => onChange(input.value) }
				{...rest}
			/>
			{error && <div className="alert alert-danger">{error}</div>}
		</div>
	);
};



export default Input;
