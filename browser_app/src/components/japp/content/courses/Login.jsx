import React, { useContext,useEffect,useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../../Contexts';
import { useTranslation } from 'react-i18next';
import Input from '../../../common/Input';



const Login = () => {
	const { user } = useContext(UserContext);
	const navigate = useNavigate();

	useEffect(() => {user._id && navigate("/courses",{replace:true})},[user]);

	return user._id ? <p>User is already logged in :D</p> : <LoginForm />;
};

const LoginForm = () => {
	const { login } = useContext(UserContext);
	const { t } = useTranslation();
	const [ email,setEmail ] = useState("");
	const [ password,setPassword ] = useState("");
	const [ emailError,setEmailError ] = useState("");
	const [ passwordError,setPasswordError ] = useState("");
	const [ loginError,setLoginError ] = useState("");

	const handleSubmit = async(event) => {
		event.preventDefault();
	
		setEmailError(!email ? t("Email is required"):"");
		setPasswordError(!password ? t("Password is required"):"");
		setLoginError("");
		if(!email || !password) return;

		try {
			await login({ email,password });
		} catch(error) {
			console.log(error);
			if(error.response)
				setLoginError(t(error.response.data));
		}
		// Parent component will redirect to /courses automatically when user logs in succesfully
	};

	return (
		<React.Fragment>
			<p>{t("Test user")}</p>
			<ul>
				<li>{t("Email")}: demouser@demomail.com</li>
				<li>{t("Password")}: demouser </li>
			</ul>
			<form onSubmit={handleSubmit}>
				<Input label={t("Email")} name="email" content={email} error={emailError} onChange={setEmail} />
				<Input label={t("Password")} name="password" content={password} error={passwordError} type="password" onChange={setPassword} />
				{loginError && <div className="alert alert-danger mt-3 mb-3">{loginError}</div>}
				<button>{t("Sign in")}</button>
			</form>
		</React.Fragment>
	);
};



export default Login;
