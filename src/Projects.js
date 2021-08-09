import React from 'react';
import Thumbnail from './Thumbnail.js';
import { Box, Button, Text, Distribution, Grommet } from 'grommet';
import Vimeo from '@u-wave/react-vimeo';
import { Home } from 'grommet-icons';
import './App.css';

function Projects(props) {
  return (
    <Grommet plain>
      <Box align="center" background="black">
        <Box
          align="start"
          justify="between"
          pad="medium"
          flex
          fill="vertical"
          background={{ color: '#000' }}
        >
          <Text size="xxlarge" />
          {/* <Video
            controls="below"
            src="https://assets.mixkit.co/videos/preview/mixkit-a-man-paddling-on-a-board-near-the-seashore-1578-small.mp4"
            loop
          /> */}
          {/* <Vimeo video="https://player.vimeo.com/video/340782519" autoplay /> */}
          <Vimeo video={340782519} width={1280} height={720} autoplay loop autopause="False" />
          &nbsp;
          <Vimeo video={340248961} width={1280} height={720} autoplay loop autopause="False" />
        </Box>
        <Distribution
          values={[
            { value: 50, color: 'light-3' },
            { value: 30, color: 'brand' },
            { value: 20, color: 'graph-0' },
            { value: 10, color: 'light-3' },
            { value: 5, color: 'brand' }
          ]}
        >
          {value => (
            <Box pad="small" background={value.color} fill>
              <Text size="large">{value.value}</Text>
            </Box>
          )}
        </Distribution>
      </Box>
      <Button label="hello world" primary onClick={() => alert('hello, world')} />
    </Grommet>
  );
}

export default Projects;
