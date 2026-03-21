import React from 'react';
import NotchIMAGContent from '../content/projects/notchimag.mdx';

function NotchIMAG(props) {
	return (
		<div className="container mx-auto flex items-center my-5 py-5 ">
			<div className="container mx-auto">
				<NotchIMAGContent />
			</div>
		</div>
	);
}

export default NotchIMAG;
