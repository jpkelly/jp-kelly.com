import React from 'react';
// import { Video } from './Video';
import { Box, Button, Video, Text, Distribution, Grommet } from 'grommet';
import { Home } from 'grommet-icons';

function About(props) {
  return (
    <Grommet plain>
      <Box align="center" background="dark-3">
        <Button label="hello world" primary onClick={() => alert('hello, world')} />
        <Box
          align="start"
          justify="between"
          pad="medium"
          flex
          fill="vertical"
          background={{ color: 'accent-4' }}
        >
          <Text size="xxlarge" />
          <Video
            controls="below"
            src="https://assets.mixkit.co/videos/preview/mixkit-a-man-paddling-on-a-board-near-the-seashore-1578-small.mp4"
            loop
          />
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
    </Grommet>
  );
}

export default About;
