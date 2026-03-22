import React from 'react';
import VimeoEmbed from './mdx/VimeoEmbed';
import { sanityImageUrl } from '../lib/sanity';

function portableTextToString(block) {
	if (!block || !Array.isArray(block.children)) {
		return '';
	}

	return block.children
		.map(child => child?.text || '')
		.join('')
		.trim();
}

function renderContentBlock(block, index) {
	if (!block) {
		return null;
	}

	if (block._type === 'block') {
		const text = portableTextToString(block);
		if (!text) {
			return null;
		}

		if (block.style === 'h2') {
			return <h2 key={block._key || `h2-${index}`}>{text}</h2>;
		}

		if (block.style === 'h3') {
			return <h3 key={block._key || `h3-${index}`} className="mb-2 text-lg xl:text-xl">{text}</h3>;
		}

		return <p key={block._key || `p-${index}`}>{text}</p>;
	}

	if (block._type === 'image') {
		const imageUrl = sanityImageUrl(block);
		if (!imageUrl) {
			return null;
		}

		return (
			<img
				key={block._key || `img-${index}`}
				src={imageUrl}
				alt="Project media"
				className="my-4 w-full object-cover"
			/>
		);
	}

	return null;
}

function renderVideos(videos) {
	if (!videos.length) {
		return null;
	}

	const twoPortrait = videos.length === 2 && videos.every(video => Boolean(video?.portrait));

	if (twoPortrait) {
		return (
			<div className="flex flex-wrap w-full mx-auto mt-4">
				{videos.map((video, index) => (
					<div key={video._key || `video-${index}`} className="my-1 w-full md:w-full lg:my-4 lg:w-1/2 lg:pr-5 xl:pr-10">
						<VimeoEmbed
							video={video.vimeoId}
							autoplay={Boolean(video.autoplay)}
							loop={Boolean(video.loop)}
							portrait={Boolean(video.portrait)}
						/>
					</div>
				))}
			</div>
		);
	}

	return (
		<div className="mt-4 space-y-5">
			{videos.map((video, index) => (
				<div key={video._key || `video-${index}`} className="w-full">
					<VimeoEmbed
						video={video.vimeoId}
						autoplay={Boolean(video.autoplay)}
						loop={Boolean(video.loop)}
						portrait={Boolean(video.portrait)}
					/>
				</div>
			))}
		</div>
	);
}

function SanityProjectTemplate({ project }) {
	const contentBlocks = Array.isArray(project?.content) ? project.content : [];
	const videos = Array.isArray(project?.videos)
		? project.videos.filter(video => Number.isFinite(Number(video?.vimeoId)))
		: [];

	return (
		<div className="w-full">
			{contentBlocks.map((block, index) => renderContentBlock(block, index))}
			{renderVideos(videos)}
		</div>
	);
}

export default SanityProjectTemplate;