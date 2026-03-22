import React from 'react';
import Card from './Card';
import projects from '../content/projects.json';

function Gallery(props) {
	return (
		<div className="w-full my-5 py-5 ">
			<h2>Here are a few of my projects.</h2>
			{/* wrapper */}
			<div className="w-full">
				{/* <div className="flex flex-wrap -mx-1 lg:-mx-4"> */}
				<div className="gallery-masonry box-border before:box-inherit after:box-inherit">
					{projects.map(project => (
						<Card
							key={project.id}
							title={project.cardTitle}
							text={project.cardText}
							imgsrc={project.thumbnails}
							link={project.path}
						/>
					))}
					{/* <Card title="title" text="text" imgsrc="thumbnails/huds.png" link="/huds" alttext="" /> */}
				</div>
			</div>
		</div>
	);
}

export default Gallery;
