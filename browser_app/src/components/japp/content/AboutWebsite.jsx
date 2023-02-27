import React from 'react';



const AboutWebsite = () => {
	return (
		<React.Fragment>
			<h1>About website</h1>
			<p>Available only in English at the moment</p>
			<p>Check out the course section. Find PDF that I have created for my math students as a part of my tutoring work.</p>
			<p>This is just a quick description of how this website is implemented. It has introduction pages and demos of two projects – a blog and a course platform – that I'm working on when I have free time. Codebase available in <a href="https://github.com/Red-Quill/jdemosite.link" target="_blank">GitHub</a>.</p>
			<ul>
				<li>
					Application
					<ul>
						<li>
							written in JavaScript
							<ul>
								<li>frontend in React</li>
								<li>backend in Node.js</li>
							</ul>
						</li>
						<li>public version uses https only (redirect http to https)</li>
						<li>distributed via CloudFront</li>
						<li>passwords are stored using bcrypt (will implement SRP in the future)</li>
					</ul>
				</li>
				<li>
					Domain
					<ul>
						<li>domain name registered with Route 53</li>
						<li>DNSSEC enabled</li>
					</ul>
				</li>
				<li>
					CloudFront distribution - tls only (redirect http to https)
				</li>
				<li>
					AWS & VPC configuration for development and demo site
					<ul>
						<li>multi-account environment using AWS Organizations</li>
						<li>ipv4 range 172.16.0.0/12 used for development and demo implementations</li>
						<li>ipv4 range 10.0.0.0/8 reserved for production use</li>
						<li>ipv4 range 192.168.0.0/16 reserved for home & office use</li>
						<li>use ipv6 whenever possible</li>
						<li>
							Separate private and public subnets across at least two availability zones
							<ul>
								<li>MongoDB installed in EC2 in private subnet (could also use MongoDB Atlas)</li>
								<li>API EC2 server in public subnet (could also use Docker/AWS Fargate)</li>
								<li>EFS for storing session data so that it can be restored after server malfunction/reboot</li>
								<li>
									bastion host for maintenance
									<ul>
										<li>forward ssh from higher ports to backend instances</li>
										<li>
											forward MongoDB connection from higher port to database for maintenance
											<ul>
												<li>use password protection and tls (self signed certificate authority for added security)</li>
											</ul>
										</li>
									</ul>
								</li>
							</ul>
						</li>
						<li>S3 buckets for delivering the application frontend and media files</li>
					</ul>
				</li>
				<li>
					Todo list
					<ul>
						<li>use vpn to integrate home office with VPC</li>
						<li>automate with CloudFormation</li>
					</ul>
				</li>
			</ul>
		</React.Fragment>
	);
};

const AboutWebsite_fi = () => {
	return (
		<React.Fragment>
			<h1>Tietoa sivustosta</h1>
			<p>Katso myös kurssit-osio. Siellä on pdf-muotoinen opetusmateriaali, jonka olen tehnyt oppilailleni.</p>
			<p>Tässä on pikainen kuvaus tämän sivuston toteutuksesta. Sivustolla on esittelysivuja ja kaksi demoa – blogi ja kurssit – joita työstän, kun minulla on aikaa. Lähdekoodia voi katsoa <a href="#">GitHubissa</a>.</p>
			<ul>
				<li>
					Sovellus
					<ul>
						<li>
							toteutettu JavaScriptillä
							<ul>
								<li>frontend Reactilla</li>
								<li>backend Node.js:llä</li>
							</ul>
						</li>
						<li>julkaistu versio käyttää ainoastaan https-yhteyttä (http uudelleenohjattu https:ään)</li>
						<li>jakelu CloudFrontin kautta</li>
						<li>salasanat talletetaan bcrypt-kirjaston avulla (SRP-implementaatio tulevaisuudessa)</li>
					</ul>
				</li>
				<li>
					Domain
					<ul>
						<li>domain-nimi rekisteröity Route 53:een</li>
						<li>DNSSEC käytössä</li>
					</ul>
				</li>
				<li>
					AWS & VPC konfiguraatio kehitystyötä ja demosivustoa varten
					<ul>
						<li>useampi tili liitettynä AWS Organisaatioihin</li>
						<li>ipv4 avaruus 172.16.0.0/12 (class B) käytössä kehitystyöhön ja demosivuston toteutukseen</li>
						<li>ipv4 avaruus 10.0.0.0/8 (class A) varattu tuotantokäyttöön</li>
						<li>ipv4 avaruus 192.168.0.0/16 (class C) varattu koti- ja toimistokäyttöön</li>
						<li>ipv6 käytössä aina kun mahdollista</li>
						<li>
							Erilliset suljetut ja avoimet aliverkot vähintään kahdella "availability zone":lla
							<ul>
								<li>MongoDB asennettuna EC2:een suljetussa aliverkossa (MongoDB Atlas voisi olla vaihtoehto)</li>
								<li>API EC2 palvelin in avoimessa aliverkossa (Docker/AWS Fargate toimisi myös)</li>
								<li>Käyttäjäsessioita varten EFS, jolloin ne voidaan helposti palauttaa palvelimen virhetilan tai uudelleenkäynnistyksen jälkeen</li>
								<li>
									bastion host ylläpitoa varten
									<ul>
										<li>forward ssh from higher ports to backend instances</li>
										<li>
											forward MongoDB connection from higher port to database for maintenance
											<ul>
												<li>use password protection and tls (self signed certificate authority for added security)</li>
											</ul>
										</li>
									</ul>
								</li>
							</ul>
						</li>
						<li>Selainsovellus ja mediatiedostot jaetaan S3:sta</li>
					</ul>
				</li>
				<li>
					Tehtävää
					<ul>
						<li>kotitoimiston ja VPC:n yhdistäminen vpn:llä</li>
						<li>automatisointi CloudFormationilla</li>
					</ul>
				</li>
			</ul>
		</React.Fragment>
	);
};



export default AboutWebsite;




/*
What has been done so far --

Application
 - Written in JavaScript
   - Frontend using React
   - Backend using NodeJS
 - Public version uses https only (redirect http to https)
 - passwords hashed on server side using ...
   - could use ... for increased security

Domain
 - domain name registered via route 53
 - dnssec enabled

CloudFront distribution
 - tls only (redirect http to https)

VPC for demo and development use
 - Ip range ... (use ... for production and 192.168 for home, office etc)
 - S3 buckets for
   - application frontend
   - media
 - Private subnet
   - MongoDB installed on EC2
     - could use MongoDB Atlas
 - Public subnet
   - API installed on EC2
     - Could use Docker/Fargate
   - EFS for storing
     - blog posts
	   - could also use S3
	 - course data (PDFs for now)
	 - session data
	   - can easily be restored if server application crashes
	   - could be used for multiple concurrent server instances (eliminating the need for sticky sessions)
   - bastion host
     - Elastic IP
     - redirect ssh to db and api instances via higher ports (implemented using iptables)
	 - redirect mongoDB via higher port for maintenance purposes
	   - use tls with self-signed certificate authority
     - TODO: use vpn to integrate with home office network

General TODO:
 - Automation so that parts of the system can be replicated and restored easily

*/

