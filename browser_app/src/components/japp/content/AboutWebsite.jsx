import React from 'react';
import { useTranslation } from 'react-i18next';



const AboutWebsite = () => {
	const { i18n:{ language } } = useTranslation();

	return aboutWebsiteLangs[language];
};

const AboutWebsiteEn = () => (
	<React.Fragment>
		<h1>About Website</h1>
		<p>
			Welcome to my developer portfolio. Frontend (this site) is created with react. It is made responsive and multilingual. My main focus as a developer, however, is in the backend so the site isn't as fancy and glossy as I would like it to be. Backend is created with NodeJS using MongoDB as database and built on top of AWS using CloudFront, VPC, EC2, EFS, Application Load Balancer, S3, Docker, Route53, CodeCommit and CodeArtifact.
		</p>
		<div>
			<h2>Projects</h2>
			<div>
				<h3>Blog</h3>
				<p>A simple blog page to publish my personal thoughts. Not much content at the moment but that will change. I have a lot to say. It has an online editor for site admins. Posts can be published in multiple languages and the UI prioritizes version of viewers language if it is available otherwise it shows the post in English.</p>
			</div>
			<div>
				<h3>Courses</h3>
				<p>Work in progress project for publishing course content. Currently it has one sample course that has a downloadable 300 page pdf file that I have made for Finnish high school math student. It has 250 exercises with solutions and accompanying theory sections. It is created using a modular library of LaTeX files hosted in private git repository. It cand be used to make other publications, and I have used it to publish materials for my previous employers' courses.</p>
			</div>
			<div>
				<h3>tScript</h3>
				<p>A scripting language similar to Donald Knuth's TeX language but with modern data structures and upgraded syntax. It can be used for creating interface similar to LaTeX or ConTeXt and typesetting engine similar to TeX. I'm going to use it for creating HTML+CSS documents from LaTeX-like markup. tScript is created with Python, but it is supposed to be a standard that can be implemented in other programming languages.</p>
				<p>In the demo page you can write your own code or try and edit some samples. You can run code on server side and interact with it via a "terminal simulator" that I created for this purpose. It uses websocket to connect to the backend.</p>
			</div>
		</div>
	</React.Fragment>
);

const AboutWebsiteFi = () => (
	<React.Fragment>
		<h1>Portfolioni</h1>
		<p>
			Tervetuloa. Tässä tietoa tekemästäni sivustosta. Frontend on tehty reactilla. Tärkeimpinä prioriteetteina ovat olleet responsiivisuus ja monikielisyys. Päätavoitteeni ohjelmistokehittäjänä on kuintekin backend, joten sivun ulkoasu ei ehkä ole niin kiiltävä kuin haluaisin sen olevan. Backend-puoli on tehty Nodella, tietokantana on MondoDB ja kokonaisuus on rakennettu AWS:n päälle käyttäen teknologioita CloudFront, VPC, EC2, EFS, Application Load Balancer, S3, Docker, Route53, CodeCommit ja CodeArtifact.
		</p>
		<div>
			<h2>Projektit</h2>
			<div>
				<h3>Blogi</h3>
				<p>Yksinkertainen blogisivu omien ajatusteni jakamiseen. Sisältöä ei vielä juurikaan ole, mutta se muuttuu; minulla on paljon sanottavaa. Siinä on online-editori admin-käyttäjille. Kirjoitukset voi julkaista useammalla kielellä ja UI näyttää käyttäjille oman kielen mukaisen version tai jos sitä ei ole saatavilla, englanninkielisen.</p>
			</div>
			<div>
				<h3>Kurssit</h3>
				<p>Työn alla oleva projekti kurssimaterialien ja muun sisällön julkaisemiseen. Tällä hetkellä siinä on yksi ladattava 300-sivuinen pdf-tiedosto, jonka olen tehnyt lukiomatematiikasta. Siinä on 250 harjoitusta ja niihin liittyvät teoriat. Olen rakentanut LaTeX järjestelmällä modulaarisen kirjaston tehtäviä ja teorioita, jotka ovat yksityisessä git-repositoriossa. Siitä pystyy rakentamaan julkaisuja ja olen sitä käyttänyt aiempien työnantajien kurssien materiaalien tuottamiseen.</p>
			</div>
			<div>
				<h3>tScript</h3>
				<p>Donald Knuthin TeX-kielen kaltainen skriptikieli, jossa on kuitenkin modernit tietorakenteet ja parannettu syntaksi. Sitä voi käyttää mm. rakentamaan LaTeX- ConTeXt-järjestelmiä vastaavia rajapintoja ja vaikka kokonainen ladontajärjestelmä. Aion käyttää sitä HTML-dokumenttien luomiseen LaTeX-tyylisen markupin avulla. tScript on toteutetu Pythonilla, mutta sen on tarkoitus olla standardi, jonka voi implementoida myös muille ohjelmointikielille.</p>
				<p>Demosivulla voit kokeilla tScript-koodia ja kirjoittaa sitä joko itse tai kokeilla muutamia näytekoodeja. Koodi ajetaan palvelimella ja sen kanssa voi vuorovaikuttaa "terminaalisimulaattorin" kautta. Yhteys palvelimeen koodin suorituksen aikana hoituu websocketin avulla.</p>
			</div>
		</div>
	</React.Fragment>
);

const aboutWebsiteLangs = {
	"en" : <AboutWebsiteEn />,
	"fi" : <AboutWebsiteFi />,
};



export default AboutWebsite;
