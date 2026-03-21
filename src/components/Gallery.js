import React from 'react';
import Card from './Card';
import projects from '../content/projects';

function Gallery(props) {
	return (
		<div className="container mx-auto my-5 py-5 ">
			<h2>Here are a few of my projects.</h2>
			{/* wrapper */}
			<div className="container w-full mx-auto ">
				{/* <div className="flex flex-wrap -mx-1 lg:-mx-4"> */}
				<div className="gallery-masonry box-border mx-auto before:box-inherit after:box-inherit">
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
