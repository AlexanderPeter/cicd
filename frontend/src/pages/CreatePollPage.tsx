import React, { useState }  from 'react';
import { Link } from 'react-router-dom';
import { CiSearch, TbError404 } from '../icons';

export default function CreatePollPage() {
  const [pollTitle, setPollTitle] = useState('');

  const handleCreatePoll = async () => {
    if (pollTitle.trim() === '') {
      alert('Please enter a poll title.');
      return;
    }

    console.log('Creating poll with title:', pollTitle);

    try {
      const response = await fetch('http://localhost:5000/api/polls', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: pollTitle }),
      });

      if (response.ok) {
        const json = await response.json();
        console.log('Poll created successfully:', JSON.stringify(json, null, 2));
      } else {
        const errorText = await response.text();
        console.error('Failed to create poll:', errorText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };


  return (
    <div className='dashboard'>
      <div className='panel shadow'>
        <header className='titlebar'>
          <h2>Terminumfrage erstellen</h2>
        </header>
        <div className='entry'>
          <div className='inputbar'>
            <p className="label">Titel: </p>
            <input
              type="text"
              className="input"
              placeholder="Meeting"
              value={pollTitle}
              onChange={(e) => setPollTitle(e.target.value)}
            />
          </div>
          <button
            className="input"
            onClick={handleCreatePoll}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
//           <p>Share this poll: http://localhost:3000/poll/{poll.code}</p>
}
