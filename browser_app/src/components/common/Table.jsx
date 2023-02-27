import React from 'react';


// headers: [{name,*label,*sortable}]
// data: [{},{},...]
const Table = ({headers,data}) => (
	<table>
		<thead>
			<tr>
				{ headers.map( (header) => <th key={header.label}>{header.name}</th>) }
			</tr>
		</thead>
		<tbody>
		{ data.map( (item) => (
			<tr key={item._id}>
				{ headers.map( (header) => (
					<td key={item._id + header.label}>{item[header.label]}</td>
				))}
			</tr>
		))}
		</tbody>
	</table>
);



export default Table;
