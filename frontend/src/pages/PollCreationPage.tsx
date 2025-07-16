import { Calendar, momentLocalizer } from 'react-big-calendar';
import { parseISO } from 'date-fns';
import React, { useState } from 'react';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { format, startOfWeek, getDay } from 'date-fns';
import { dateFnsLocalizer } from 'react-big-calendar';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { CiSearch, TbError404 } from '../icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTriangleExclamation, faClipboard } from '@fortawesome/free-solid-svg-icons';
import styles from './PollCreationPage.module.css';
import Banner from '../components/Banner/Banner';

const locales = {
  'en-US': require('date-fns/locale/en-US'),
};

const localizer = dateFnsLocalizer({
  format,
  parse: parseISO,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

export default function CreatePollPage() {
  const [selectedSlots, setSelectedSlots] = useState([]);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitted },
  } = useForm();
  const [createdPoll, setCreatedPoll] = useState(null);

  const pollTitle = watch('pollTitle');

  const handleSelectSlot = ({ start, end }) => {
    const newSlot = { start, end };
    setSelectedSlots((prev) => [...prev, newSlot]);
  };

  const handleSelectEvent = (eventToRemove) => {
    setSelectedSlots((prev) =>
      prev.filter(
        (event) =>
          event.start.getTime() !== eventToRemove.start.getTime() ||
          event.end.getTime() !== eventToRemove.end.getTime(),
      ),
    );
  };

  const onSubmit = async (data) => {
    console.log(data);
    if (pollTitle.trim() === '') {
      alert('Please enter a poll title.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/polls', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: pollTitle, slots: selectedSlots }),
      });

      if (response.ok) {
        const result = await response.json();
        setCreatedPoll(result.poll);
        console.log('Poll created successfully:');
      } else {
        const errorText = await response.text();
        alert('Failed to create poll:', errorText);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <>
      <Banner title="Terminumfragen" />
      <div className="dashboard">
        {!createdPoll && (
          <div className="panel">
            <div className="titlebar">
              <h2>Terminumfrage erstellen</h2>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="form">
              <div className="inputbar">
                <label>Titel:</label>
                <input
                  type="text"
                  placeholder="Meeting"
                  {...register('pollTitle', { required: 'This field is required' })}
                  className={errors.pollTitle ? 'input error' : 'input'}
                />
                {isSubmitted && errors.pollTitle?.type === 'required' && (
                  <div className="info alert">
                    <FontAwesomeIcon icon={faTriangleExclamation} /> {errors.pollTitle.message}
                  </div>
                )}
              </div>
              <div className="inputbar">
                <Calendar
                  selectable
                  localizer={localizer}
                  events={selectedSlots}
                  defaultView="week"
                  views={['week', 'day']}
                  step={30}
                  timeslots={2}
                  onSelectSlot={handleSelectSlot}
                  onSelectEvent={handleSelectEvent}
                  style={{ height: '400pt', padding: '1rem', width: '100%' }}
                />
              </div>
              <div className="buttonbar">
                <button type="submit" className="button">
                  Erstellen
                </button>
              </div>
            </form>
          </div>
        )}
        {createdPoll && (
          <div className="dashboard">
            <div className="panel">
              <div className="titlebar">
                <h2>Umfrage erstellt</h2>
              </div>
              <div className="entry">
                <div className="inputbar">
                  <label>Link:</label>
                  <input
                    type="text"
                    placeholder="Meeting"
                    className="input"
                    readOnly
                    value={`${window.location.origin}/polls/${createdPoll.code}`}
                    onClick={(e) => e.currentTarget.select()}
                  />
                </div>
                <div className="buttonbar">
                  <button
                    className="button"
                    onClick={() =>
                      navigator.clipboard.writeText(
                        `${window.location.origin}/polls/${createdPoll.code}`,
                      )
                    }
                  >
                    <FontAwesomeIcon icon={faClipboard} style={{ marginRight: '5pt' }} />
                    Link kopieren
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
