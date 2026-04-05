import React from 'react';
import Card from './Card';
import { useSiteProjects } from '../lib/siteProjects';

function SkeletonCard() {
	return (
		<div className="break-inside">
			<div className="pb-8">
				<div className="overflow-hidden border border-gray-800 rounded-lg">
					<div className="p-2 md:p-4">
						<div className="shimmer rounded h-6 w-2/3 mb-2" />
						<div className="shimmer rounded h-4 w-full mb-1" />
						<div className="shimmer rounded h-4 w-4/5" />
					</div>
					<div className="shimmer w-full" style={{ aspectRatio: '16/9' }} />
				</div>
			</div>
		</div>
	);
}

function Gallery(props) {
	const { projects, loading } = useSiteProjects();

	return (
		<div className="content-rail my-5 py-5 ">
			<h2>Here are a few projects I have worked on.</h2>
			<div className="w-full">
				<div className="gallery-masonry box-border before:box-inherit after:box-inherit">
					{loading
						? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
						: projects.map(project => (
							<Card
								key={`${project.id}-${project.path}`}
								title={project.cardTitle}
								text={project.cardText}
								imgsrc={project.thumbnails}
								link={project.path}
							/>
						))
					}
				</div>
			</div>
		</div>
	);
}

export default Gallery;
