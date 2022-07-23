import { useState } from 'react';
import './App.css';

export default function App() {
  const [items, setItems] = useState([]);
  const getRssFeed = async () => {
  const feedUri = 'https://dev98.de/feed/';

    const res = await fetch(`https://api.allorigins.win/get?url=${feedUri}`);
    const { contents } = await res.json();
    const feed = new window.DOMParser().parseFromString(contents, 'text/xml');
    const items = feed.querySelectorAll('item');
    const feedItems = [...items].map((element) => ({
      link: element.querySelector('link')?.innerHTML,
      title: element.querySelector('title')?.innerHTML,
      description: element.querySelector('description')?.textContent,
    }));
    setItems(feedItems);
  };
  getRssFeed();
  return (

    <div>
      <h1>RSS FEED</h1>
      {items.map((item) => {
        return (
          <div className='article'>
            <header><h1 className='header'>{item.title}</h1></header>
            <p>{item.description.replace(/<[^>]+>/g, '').substr(0, 320) + '...'}</p>
            <a target="_blank" href={item.link}>{item.link}</a>
          </div>
        );
      })}
    </div>
  );
}

