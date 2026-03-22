import React, { useEffect, useMemo, useState } from 'react';
import jpk from '../jpkelly.jpg';
import {DiReact} from 'react-icons/di';
import { getAboutContent, sanityImageUrl } from '../lib/sanity';

const fallbackContent = {
	heading: 'JP Kelly',
	profileImageUrl: jpk,
	bioParagraphs: [
		{ text: 'I have always loved technology and science. As a kid my first major purchase was a computer with a 6502 processor and 4k of RAM (upgradeable to 8k). Although that computer was only capable of displaying graphics composed of ASCII characters, I dreamed of combining video imagery and computer graphics. Later I had access to an Amiga computer which I used to merge graphics with video.', isList: false },
		{ text: 'I have worked in the live events industry for many years as a video engineer and projectionist. I have a keen sense of what it takes to make imagery look great on screen. I found that I especially love to play video along with music as a VJ. Over the years I have had the opportunity to do live visuals for a number of musicians, events, and parties. I am constantly learning to use new software and equipment to create video art. I am a generalist by nature and am able to merge many disciplines. My background in electronics lends itself to the integration of sensors and other input devices to create interactive installations.', isList: false },
		{ text: 'While at California College of the Arts I learned how to uniquely express my views of social issues through art that engages the viewer. My goal and vision is to provide a way for people to grow and learn by touching their hearts.', isList: false }
	],
	builtByText: 'This site was originally built by hand using React',
	copilotText: 'Complete refactoring done with Copilot.',
	codeLinkText: 'Here is the code.',
	codeLinkUrl: 'https://github.com/jpkelly/jp-kelly.com',
	toolsHeading: 'Here are a few of my favorite tools:',
	toolsList: 'Photoshop, Illustrator, After Effects, Notch, TouchDesigner, MaxMSP, VDMX, Rhino, Blender, Cinema 4D, disguise(d3), Watchout, Pixera, Barco Eventmaster (E2/3), projectors, LED screens, Ableton, Unreal Engine, graphic design & typography, Arduino, Raspberry Pi, ESP32, LiDAR, sensors, electronics theory and tools, 3D printing, GLSL, HTML, CSS, Javascript, JSX, React, PHP, MySQL, bash, Python, GitHub, Copilot, チャッピー',
	showTools: true
};

function renderBlockChildren(block) {
	if (!block || !Array.isArray(block.children)) {
		return null;
	}
	return block.children.map((child, i) => {
		const text = child?.text || '';
		if (!text) return null;
		if (Array.isArray(child.marks) && child.marks.includes('strong')) {
			return <strong key={i}>{text}</strong>;
		}
		return <React.Fragment key={i}>{text}</React.Fragment>;
	});
}

function portableBlockToText(block) {
	if (!block || !Array.isArray(block.children)) {
		return '';
	}
	return block.children.map(child => child?.text || '').join('').trim();
}

function mapSanityAboutDoc(doc) {
	if (!doc) {
		return null;
	}

	const bioParagraphs = Array.isArray(doc.bio)
		? doc.bio
				.filter(block => block?._type === 'block')
				.map(block => ({ nodes: renderBlockChildren(block), text: portableBlockToText(block), isList: !!block.listItem }))
				.filter(item => item.text)
		: [];

	return {
		heading: doc.heading || fallbackContent.heading,
		profileImageUrl: sanityImageUrl(doc.profileImage) || fallbackContent.profileImageUrl,
		bioParagraphs: bioParagraphs.length ? bioParagraphs : fallbackContent.bioParagraphs,
		builtByText: doc.builtByText || fallbackContent.builtByText,
		copilotText: doc.copilotText || fallbackContent.copilotText,
		codeLinkText: doc.codeLinkText || fallbackContent.codeLinkText,
		codeLinkUrl: doc.codeLinkUrl || fallbackContent.codeLinkUrl,
		toolsHeading: doc.toolsHeading || fallbackContent.toolsHeading,
		toolsList: doc.toolsList || fallbackContent.toolsList,
		showTools: doc.showTools !== undefined ? doc.showTools : fallbackContent.showTools,
	};
}

function About(props) {
	const [aboutContent, setAboutContent] = useState(fallbackContent);

	useEffect(() => {
		let mounted = true;

		(async () => {
			try {
				const doc = await getAboutContent();
				if (!mounted || !doc) {
					return;
				}

				const mapped = mapSanityAboutDoc(doc);
				if (mapped) {
					setAboutContent(mapped);
				}
			} catch (_err) {
				// Keep fallback content if CMS fetch fails.
			}
		})();

		return () => {
			mounted = false;
		};
	}, []);

	const toolItems = useMemo(() => {
		const tools = aboutContent.toolsList || '';
		return tools
			.split(',')
			.map(item => item.trim())
			.filter(Boolean)
			.join(', ');
	}, [aboutContent.toolsList]);

	return (
		<div className="content-rail my-5 py-5">
			<div className="grid grid-cols-1 md:grid-cols-8 grid-rows-1 gap-10">
				<div className="col-span-8 md:col-span-8 lg:col-span-3">
					<h2>{aboutContent.heading}</h2>
					<img className="object-cover w-full h-auto" src={aboutContent.profileImageUrl} alt="JP Kelly" />
				</div>
				<div className="about-copy col-span-8 md:col-span-8 lg:col-span-5">
					{(() => {
						const result = [];
						let i = 0;
						while (i < aboutContent.bioParagraphs.length) {
							if (aboutContent.bioParagraphs[i].isList) {
								const listItems = [];
								while (i < aboutContent.bioParagraphs.length && aboutContent.bioParagraphs[i].isList) {
									listItems.push(aboutContent.bioParagraphs[i].nodes || aboutContent.bioParagraphs[i].text);
									i++;
								}
								result.push(
									<ul key={`list-${i}`} style={{listStyle:'none',paddingLeft:'1.5em',marginTop:0,marginBottom:'1em'}} className="text-base xl:text-lg">
										{listItems.map((item, j) => (
											<li key={j} style={{margin:0,padding:0,lineHeight:'1.5'}}>{item}</li>
										))}
									</ul>
								);
							} else {
								const nextIsList = i + 1 < aboutContent.bioParagraphs.length && aboutContent.bioParagraphs[i + 1].isList;
								const item = aboutContent.bioParagraphs[i];
								result.push(<p key={`bio-${i}`} style={nextIsList ? {marginBottom:0} : {}}>{item.nodes || item.text}</p>);
								i++;
							}
						}
						return result;
					})()}
					<button className="bg-transparant w-full md:w-1/3 mt-4 border border-blue-500 hover:bg-blue-900 text-white font-normal py-2 px-4 rounded" onClick={() => window.open('/contactform', '_self')}>
						Contact
					</button>
					<p className="mt-7">
						{aboutContent.builtByText}
						<DiReact className="inline ml-1 text-[1.35rem]" aria-hidden="true" />
						. {aboutContent.copilotText}
						<br />
						<a href={aboutContent.codeLinkUrl} target="_blank" className="no-underline">
							{aboutContent.codeLinkText}
						</a>
					</p>
					{aboutContent.showTools && (
						<>
							<h2 className="mt-7">{aboutContent.toolsHeading}</h2>
							<ul className="list-none pl-6 leading-normal">
								<li className="m-0 p-0">{toolItems}</li>
							</ul>
						</>
					)}
				</div>
			</div>
		</div>
	);
}

export default About;
