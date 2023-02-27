import React, { useContext,useEffect,useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../../Contexts';
import { useTranslation } from 'react-i18next';
import Input from '../../../common/Input';



const Register = () => {
	const { user } = useContext(UserContext);
	const navigate = useNavigate();

	useEffect( () => {
		if(user._id) navigate("/courses",{replace:true})
	},[user]);

	return user._id ? <p>User is already logged in :D</p> : <RegisterForm />;
};

const RegisterForm = () => {
	const { registerAndLogin } = useContext(UserContext)
	const [ email,setEmail ] = useState("");
	const [ name,setName ] = useState("");
	const [ password,setPassword ] = useState("");	
	const [ registerError,setRegisterError ] = useState();
	const [ emailError,setEmailError ] = useState("");
	const [ nameError,setNameError ] = useState("");
	const [ passwordError,setPasswordError ] = useState("");
	const { t } = useTranslation();

	const handleSubmit = async(event) => {
		event.preventDefault();

		setEmailError(!email ? t("Email is required"):"");
		setNameError(!name ? t("Name is required"):"");
		setPasswordError(!password ? t("Password is required"):"");
		setRegisterError("");
		if(!email || !name || !password) return;

		try {
			await registerAndLogin({ email,name,password });
		} catch(error) {
			console.log(error);
			if(error.response)
				setRegisterError(t(error.response.data));
		}
		// Parent component will redirect to /courses automatically when user logs in succesfully
	};

	return (
		<form onSubmit={handleSubmit}>
			<Input label={t("Email")} name="email" content={email} error={emailError} onChange={setEmail} />
			<Input label={t("Name")} name="name" content={name} error={nameError} onChange={setName} />
			<Input label={t("Password")} name="password" content={password} error={passwordError} type="password" onChange={setPassword} />
			{registerError && <div className="alert alert-danger mt-3 mb-3">{registerError}</div>}
			<button>{t("Register")}</button>
		</form>
	);
};



export default Register;
