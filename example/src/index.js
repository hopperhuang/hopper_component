import React from 'react';
import ReactDOM from 'react-dom';


const pages = [
  {
    title: 'Header',
    path: '/header',
  },
  {
    title: 'Footer',
    path: '/footer',
  },
];

class Page extends React.Component {
  render() {
    return (
      <div>
        <h1>
          组件库导航页
        </h1>
        {pages.map(page => (
          <div>
            <a href={page.path}>
              {page.title}
            </a>
          </div>
        ))}
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
