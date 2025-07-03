import React from 'react';
import { Link } from 'react-router-dom';
import { FcCalendar, FaPlusCircle } from '../icons';
import Banner from '../components/Banner/Banner';

export default function HomePAge() {
  return (
    <>
      <Banner title="Terminumfragen" />
      <div className='dashboard'>
        <Link to="/create">
          <div className='panel shadow'>
            <header className='titlebar'>
              <h2>Neue Terminumfrage erstellen</h2>
            </header>
            <div className='entry'>
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <FcCalendar
                  size={300}
                  style={{ marginTop: 50, marginBottom: 50, marginLeft: 150, marginRight: 150 }}
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
    </>
  );
}
