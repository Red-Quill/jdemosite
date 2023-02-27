import React, { useEffect, useState } from 'react';
import _ from "lodash";
import axios from "axios";
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import "./Resume.scss";



const getYear = (tString) => tString && tString.slice(0,4);
const pickLanguage = (_object,language) => typeof(_object) === "string" ? _object : _object[language];

const Resume = () => {
	const [ rData,setRData ] = useState({});
	const { t,i18n:{ language } } = useTranslation();
	
	const fetchRData = async() => {
		const response = await axios("/media/resume-data.json");
		if(response.status !== 200) toast.error("Couldn't get resume data ...");
		else setRData(response.data);
	}

	useEffect( () => {
		fetchRData();
	},[]);

	if(_.isEmpty(rData)) return null;
	return (
		<div className="jresume">
			<div className="jresume-inner">
			
				<div id="hd">
					<div className="yui-gc">
						<div className="yui-u first">
							<h1>{rData.name}</h1>
							<h2>{rData.title[language]}</h2>
						</div>
						<div className="yui-u">
							<div className="contact-info">
								<p><a id="pdf" className="japp-print-hide" href={`/media/resume-Jarno-Parviainen-${language}.pdf`} download>{t("Download")} PDF</a></p>
								<p><a href={`mailto:${rData.email}`}>{rData.email}</a></p>
								<p><a href={`tel:${rData.phone}`}>{rData.phone}</a></p>
								<p><a href={`https://${rData.website}`}>{rData.website}</a></p>
							</div>
						</div>
					</div>
				</div>

				<div id="bd">
					<div className="yui-b">

						<div className="yui-gf">
							<div className="yui-u first">
								<h2>{t("Skills")}</h2>
							</div>
							<div className="yui-u">
								<div className="talents">
									{rData.skills.map( ({ title,description },index) => (
										<div key={index} className="talent">
											<h3>{pickLanguage(title,language)}</h3>
											<p>{pickLanguage(description,language)}</p>
										</div>
									))}
								</div>
							</div>
						</div>

						<div className="yui-gf">
							<div className="yui-u first">
								<h2>{t("Competencies")}</h2>
							</div>
							<div className="yui-u">
								{rData.competencies.map( ({ title,valid },index) => (
									<div key={index} className="talent">
										<h3>{title}</h3>
										<p>{t("Valid")}: {getYear(valid)}</p>
									</div>
								))}
							</div>
						</div>

						<div className="yui-gf last">
		
							<div className="yui-u first">
								<h2>{t("@resume Experience")}</h2>
							</div>

							<div className="yui-u">

							{rData.experience.map( ({ employer,jobTitle,description,start,end },index,array) => (
								<div key={index} className={`job${index+1 === array.length ? " last" : ""}`}>
									<h3>{employer}</h3>
									<p>{jobTitle[language]}</p>
									<p className='job-dates'>{getYear(start)} - {getYear(end) || <span style={{visibility:"hidden"}}>8888</span>}</p>
									<p className='job-description'>{description[language]}</p>
								</div>
							))}

							</div>
						</div>

					</div>
				</div>
					
				<div id="ft">
						<p>{rData.name} &mdash; <a href={`mailto:${rData.email}`}>{rData.email}</a>{rData.phone && <>&mdash; {rData.phone}</>}</p>
				</div>

			</div>
		</div>
	);
};

export default Resume;



/*

						<div className="yui-gf">
							<div className="yui-u first">
								<h2>{t("@resume Profile")}</h2>
							</div>
							<div className="yui-u">
								<p>{rData.profile[language]}</p>
							</div>
						</div>

*/
