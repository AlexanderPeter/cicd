import React from 'react';
import { Link } from 'react-router-dom';
import { FaPlusCircle } from "react-icons/fa";
import { FcCalendar } from 'react-icons/fc';
import notFoundImage from '../assets/images/404.png';


export default function Home() {
  return (
    <div class='dashboard'>
      <Link to="/create">
        <div class='panel shadow'>
          <header class='titlebar'>
            <h2>Neue Terminumfrage erstellen</h2>
          </header>
          <div class='entry'>
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <FcCalendar
                size={300}
                style={{ 'margin-top': 50 , 'margin-bottom': 50, 'margin-left': 150 , 'margin-right': 150}}
              />
              <FaPlusCircle
                size={100}
                color="#008000"
                style={{ position: 'absolute', bottom: 70, right: 160 }}
              />
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
