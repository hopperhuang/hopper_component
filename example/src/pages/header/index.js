import React from 'react';
import ReactDOM from 'react-dom';

/* eslint-disable */
import { Header } from 'dist/index';
import 'dist/header.css';
/* eslint-enable */

class Page extends React.Component {
  render() {
    return (
      <div>
        <Header />
      </div>
    );
  }
}

// eslint-disable-next-line
const root = document.getElementById('root');

ReactDOM.render(
  <Page />,
  root,
);
