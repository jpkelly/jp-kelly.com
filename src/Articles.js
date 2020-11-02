import React from 'react';
import { Box, Button, Grommet } from 'grommet';
import { Home } from 'grommet-icons';

function Articles(props) {
  return (
    <Grommet plain>
      <Box align="center" background="dark-1">
        <Button label="hello world" primary onClick={() => alert('hello, world')} />
        <div>
          <h1>Articles</h1>
        </div>
      </Box>
    </Grommet>
  );
}

export default Articles;
