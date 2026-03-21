import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { AppShell } from './App';

export function render(url) {
	return ReactDOMServer.renderToString(
		React.createElement(
			StaticRouter,
			{ location: url },
			React.createElement(AppShell)
		)
	);
}