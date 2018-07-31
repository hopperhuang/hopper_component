import React from 'react';
import ReactDOM from 'react-dom';

// import from /dist
import { Footer, Header } from '../../dist/index';
import '../../dist/footer.css';
import '../../dist/header.css';


class Page extends React.Component {
  render() {
    return (
      <div>
        <Header />
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
