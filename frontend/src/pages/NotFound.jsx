import React from 'react';
import { Link } from 'react-router-dom';
import { CiSearch } from 'react-icons/ci';
import { TbError404 } from 'react-icons/tb';

export default function NotFound() {
  return (
    <div class='dashboard'>
      <Link to='/'>
        <div class='panel shadow'>
          <header class='titlebar'>
            <h2>Zurück zur Hauptseite</h2>
          </header>
          <div class='entry'>
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <CiSearch
                size={400}
                style={{ 'margin-top': 0 , 'margin-bottom': 0, 'margin-left': 100 , 'margin-right': 100}}
              />
              <TbError404
                size={200}
                style={{ position: 'absolute', bottom: 120, right: 220 }}
              />
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
