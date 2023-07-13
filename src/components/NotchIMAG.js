import React from 'react';
import Vimeo from '@u-wave/react-vimeo';

function NotchIMAG(props) {
	return (
		<div className="container mx-auto flex items-center my-5 py-5 ">
			<div className="container mx-auto">
				<h2>Live IMAG Effect</h2>
				<p>Live IMAG effect using Notch and Nvidia Broadcast background removal.</p>
				<Vimeo className="z-0" video={730181386} width={1280} height={720} autopause="False" responsive="True" controls="true" />
			</div>
		</div>
	);
}

export default NotchIMAG;
