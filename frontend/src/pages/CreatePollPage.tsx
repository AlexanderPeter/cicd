import { Calendar, momentLocalizer } from 'react-big-calendar'
import { parseISO } from 'date-fns'
import React, { useState } from 'react';
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { format, startOfWeek, getDay } from 'date-fns'
import { dateFnsLocalizer } from 'react-big-calendar'
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { CiSearch, TbError404 } from '../icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import styles from './CreatePollPage.module.css';
import Banner from '../components/Banner/Banner';

const locales = {
  'en-US': require('date-fns/locale/en-US'),
}

const localizer = dateFnsLocalizer({
  format,
  parse: parseISO,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
})

export default function CreatePollPage() {
  const [selectedSlots, setSelectedSlots] = useState([])
  const { register, handleSubmit, watch, formState: { errors, isSubmitted } } = useForm();
  const pollTitle = watch('pollTitle');

  const handleSelectSlot = ({ start, end }) => {
    const newSlot = { start, end }
    setSelectedSlots((prev) => [...prev, newSlot])
  }

  const handleSelectEvent = (eventToRemove) => {
    setSelectedSlots((prev) =>
      prev.filter(
        (event) =>
          event.start.getTime() !== eventToRemove.start.getTime() ||
          event.end.getTime() !== eventToRemove.end.getTime()
      )
    );
  };

  const onSubmit = async (data) => {
    console.log(data);
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
    <>
      <Banner title="Terminumfragen" />
      <div className="dashboard">
        <div className="panel">
          <div className="titlebar">
            <h2>Terminumfrage erstellen</h2>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="form">
            <div className={styles.inputbar}>
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
            <div className={styles.inputbar}>
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
            <div className={styles.buttonbar}>
              <button type="submit" className="button">
                Create
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
  //           <p>Share this poll: http://localhost:3000/poll/{poll.code}</p>
}
