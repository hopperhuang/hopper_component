import React from 'react';
import ReactDOM from 'react-dom';

/* eslint-disable */
import { Footer } from 'dist/index';

import 'dist/footer.css';
/* eslint-enable */


class Page extends React.Component {
  render() {
    return (
      <div>
        <Footer />
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
