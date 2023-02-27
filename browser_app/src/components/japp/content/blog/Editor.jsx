import React, { useContext,useEffect,useState } from 'react';
import { useNavigate,useParams } from 'react-router-dom';
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';
import { UserContext } from '../../../Contexts';
import Input from "../../../common/Input";
import CheckBox from "../../../common/CheckBox";
import ListGroup from '../../../common/ListGroup';
import blogEditorService from '../../../../services/blogEditorService';



const Editor = () => {
	const { user } = useContext(UserContext);
	const { _id:blogPostId="" } = useParams();
	const navigate = useNavigate();
	const [ editorSession,setEditorSession ] = useState(null);

	const initEditorSession = async() => {
		console.log("opening editor, id is",blogPostId)
		const editorSession = await blogEditorService.openSessionById(blogPostId);
		setEditorSession(editorSession);
	};

	useEffect( () => {
		if(!user.admin) navigate("/notfound",{replace:true});
		else initEditorSession();
	},[]);

	return user.admin ? editorSession ? <EditorWindow editorSession={editorSession} /> : <div> </div> : <div> </div>;
};



const EditorWindow = ({ editorSession }) => {
	//bit hacky for ListGroup
	const languagesObjsByLanguage = {};
	const languageObjs = editorSession.languages.map( (language) => ({ language }) );
	for(const languageObj of languageObjs) languagesObjsByLanguage[languageObj.language] = languageObj;
	//
	const topics = Object.values(editorSession.topics);
	//
	const [ viewLanguage,setViewLanguage ] = useState(languageObjs[0]);
	const [ viewTopic,setViewTopic ] = useState(editorSession.getTopic());
	const [ viewTitle,setViewTitle ] = useState(editorSession.getTitle(viewLanguage.language));
	const [ initViewContent,setInitViewContent ] = useState(editorSession.getHtmlContent(viewLanguage.language));
	const [ hackUId,setHackUId ] = useState(uid());
	const [ published,setPublished ] = useState(editorSession.getPublished(viewLanguage.language));
	const [ _id,setId ] = useState(editorSession._id);

	const updateTitle = (_title) => {
		editorSession.setTitle(viewLanguage.language,_title);
		setViewTitle(_title);
	};

	const updateContent = (_htmlContent) => {
		editorSession.setHtmlContent(viewLanguage.language,_htmlContent);
	};

	const switchLanguage = (_language) => {
		const _title = editorSession.getTitle(_language.language); 
		const _htmlContent = editorSession.getHtmlContent(_language.language);
		const _published = editorSession.getPublished(_language.language)
		setViewLanguage(_language);
		setViewTitle(_title);
		setInitViewContent(_htmlContent);
		setPublished(_published);
		setHackUId(uid()); //always increments every time
	};

	const changeTopic = (_topic) => {
		setViewTopic(_topic);
		editorSession.setTopic(_topic)
	};

	const togglePublished = (_published) => {
		editorSession.setPublished(viewLanguage.language,_published);
		setPublished(_published);
	};

	const handleClick = async() => {
		console.log("click");
		try {
			await editorSession.savePost();
			console.log("editorSession._id",editorSession._id);
			_id || setId(editorSession._id);
		} catch(error) {
			console.log(error);
		}
	};

	return (
		<div>
			<p>Editing post {_id || "new"}</p>
			<Input name="Title" label="title" value={viewTitle} onChange={updateTitle} />
			<ListGroup
				name="Language"
				label="language"
				items={languageObjs}
				activeItem={viewLanguage}
				keyProperty="language"
				textProperty="language"
				onItemSelect={switchLanguage}
			/>
			<ListGroup
				name="Topic"
				label="topic"
				items={topics}
				activeItem={viewTopic}
				keyProperty="_id"
				textProperty={ (item) => item.getThumbnailLang("en").name}
				onItemSelect={changeTopic}
			/>
			<EditorWindowQuill _key={hackUId} initViewContent={initViewContent} onChange={updateContent} />
			<CheckBox name="Published" label="published" checked={published} onChange={togglePublished}/>
			<button onClick={handleClick}>Save to server</button>
		</div>
	);
};



// _key is a hack
const EditorWindowQuill = ({ _key,initViewContent,onChange }) => (
	<div key={_key}>
		<ReactQuill theme="snow" defaultValue={initViewContent} onChange={onChange} />
	</div>
);



let _uid = 1;
const uid = () => _uid++;



export default Editor;


/*
*/
