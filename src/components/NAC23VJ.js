import React from 'react';
import Vimeo from '@u-wave/react-vimeo';

function NAC23VJ(props) {
	return (
		<div className="container mx-auto flex items-center my-5 py-5 ">
			<div className="container mx-auto">
				<h2>NAC23 VJ Rig</h2>
				<p>VJ rig built in TouchDesigner. Thank you to Satoriteller and Experience Engineers for inviting me along!</p>
				<Vimeo className="z-0" video={844771292} width={1280} height={720} autopause="False" responsive="True" controls="True" />
			</div>
		</div>
	);
}

export default NAC23VJ;
