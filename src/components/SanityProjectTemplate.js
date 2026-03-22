import React from 'react';
import VimeoEmbed from './mdx/VimeoEmbed';
import { sanityImageUrl } from '../lib/sanity';

function renderSpanWithMarks(span, markDefs = []) {
	const text = span?.text || '';
	const marks = Array.isArray(span?.marks) ? span.marks : [];
	if (!text) {
		return null;
	}

	return marks.reduce((node, mark) => {
		if (mark === 'strong') {
			return <strong key={`strong-${mark}-${text}`}>{node}</strong>;
		}

		if (mark === 'em') {
			return <em key={`em-${mark}-${text}`}>{node}</em>;
		}

		if (mark === 'code') {
			return <code key={`code-${mark}-${text}`}>{node}</code>;
		}

		if (mark === 'underline') {
			return <span key={`underline-${mark}-${text}`} className="underline">{node}</span>;
		}

		if (mark === 'strike-through') {
			return <span key={`strike-${mark}-${text}`} className="line-through">{node}</span>;
		}

		const markDef = markDefs.find(def => def?._key === mark);
		if (markDef?._type === 'link' && markDef.href) {
			const isExternal = /^https?:\/\//i.test(markDef.href);
			return (
				<a
					key={`link-${mark}-${text}`}
					href={markDef.href}
					target={isExternal ? '_blank' : undefined}
					rel={isExternal ? 'noopener noreferrer' : undefined}
					className="underline"
				>
					{node}
				</a>
			);
		}

		return node;
	}, text);
}

function renderPortableTextChildren(block) {
	if (!block || !Array.isArray(block.children)) {
		return null;
	}

	const markDefs = Array.isArray(block.markDefs) ? block.markDefs : [];
	return block.children.map((child, childIndex) => {
		if (child?._type !== 'span') {
			return null;
		}

		return (
			<React.Fragment key={child._key || `span-${childIndex}`}>
				{renderSpanWithMarks(child, markDefs)}
			</React.Fragment>
		);
	});
}

function renderSanityImage(source, key, className = 'my-4 w-full object-cover') {
	const imageRef = source?.asset ? source : source?.image;
	const imageUrl = sanityImageUrl(imageRef);
	if (!imageUrl) {
		return null;
	}

	const caption = typeof source?.caption === 'string' ? source.caption.trim() : '';
	const alt = typeof source?.alt === 'string' && source.alt.trim() ? source.alt.trim() : 'Project media';

	return (
		<figure key={key} className="my-4">
			<img src={imageUrl} alt={alt} className={className} />
			{caption && <figcaption className="mt-2 text-sm text-gray-400">{caption}</figcaption>}
		</figure>
	);
}

function renderImageGallery(block, index) {
	const items = Array.isArray(block?.items) ? block.items : [];
	if (!items.length) {
		return null;
	}

	const columnsClass = items.length >= 3 ? 'md:grid-cols-3' : 'md:grid-cols-2';

	return (
		<div key={block._key || `gallery-${index}`} className={`my-6 grid grid-cols-1 gap-4 ${columnsClass}`}>
			{items.map((item, itemIndex) => renderSanityImage(item, item._key || `gallery-item-${itemIndex}`))}
		</div>
	);
}

function renderContentBlock(block, index) {
	if (!block) {
		return null;
	}

	if (block._type === 'block') {
		const children = renderPortableTextChildren(block);
		if (!children) {
			return null;
		}

		if (block.style === 'h2') {
			return <h2 key={block._key || `h2-${index}`}>{children}</h2>;
		}

		if (block.style === 'h3') {
			return <h3 key={block._key || `h3-${index}`} className="mb-2 text-lg xl:text-xl">{children}</h3>;
		}

		return <p key={block._key || `p-${index}`}>{children}</p>;
	}

	if (block._type === 'image') {
		return renderSanityImage(block, block._key || `img-${index}`);
	}

	if (block._type === 'imageGallery') {
		return renderImageGallery(block, index);
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
							controls={Boolean(video.controls ?? true)}
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
						controls={Boolean(video.controls ?? true)}
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