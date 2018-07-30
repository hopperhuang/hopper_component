import React from 'react';
import ReactDOM from 'react-dom';

// import from /dist
import Footer from '../../dist/index';
import '../../dist/index.css';

class Page extends React.Component {
  render() {
    return (
      <div>
        <div>
          i like here ...
        </div>
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
