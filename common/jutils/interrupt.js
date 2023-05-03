const interrupt = () => {
	let tmp = null;
	const interrupt = new Promise( (resolve,reject) => {tmp = resolve} );
	interrupt.release = tmp;
	return interrupt;
};

export default interrupt;
