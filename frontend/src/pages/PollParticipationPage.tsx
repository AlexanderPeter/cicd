import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faQuestion, faTimes } from '@fortawesome/free-solid-svg-icons';
import Banner from '../components/Banner/Banner';

export default function PollParticipationPage() {
  const { code } = useParams();
  const [poll, setPoll] = useState(null);
  const [error, setError] = useState(null);
  const [selections, setSelections] = useState({});
  const [slots, setSlots] = useState([]);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitted },
  } = useForm();
  const participantName = watch('participantName');

  const options = [
    { value: 'yes', activeColor: 'green', icon: faCheck },
    { value: 'maybe', activeColor: 'goldenrod', icon: faQuestion },
    { value: 'no', activeColor: 'red', icon: faTimes },
  ];

  const handleSelect = (slotId, value) => {
    setSelections((prev) => ({
      ...prev,
      [slotId]: value,
    }));
  };

  const onSubmit = async (data) => {
    const votes = Object.entries(selections).map(([slot_id, choice]) => ({
      slot_id: parseInt(slot_id, 10),
      choice,
    }));

    const payload = {
      participant: participantName,
      votes,
    };

    try {
      const response = await fetch('http://localhost:5000/api/votes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        console.log('Erfolgreich gespeichert');
      } else {
        console.error('Fehler beim Speichern');
      }
    } catch (error) {
      console.error('Netzwerkfehler:', error);
    }
  };

  useEffect(() => {
    fetch(`http://localhost:5000/api/polls/${code}`)
      .then((res) => {
        if (!res.ok) throw new Error('Poll not found');
        return res.json();
      })
      .then((data) => setPoll(data.poll))
      .catch((err) => setError(err.message));
  }, [code]);

  if (error) return <div className="error">❌ {error}</div>;
  if (!poll) return <div>Lade Umfrage...</div>;

  return (
    <>
      <Banner title="Terminumfragen" />
      <div className="dashboard">
        <div className="panel" style={{ maxHeight: '80%', maxWidth: '60%' }}>
          <div className="titlebar">
            <h2>{poll.title}</h2>
          </div>
          <div className="entry" style={{ overflow: 'auto' }}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <table>
                <thead>
                  <tr>
                    <th></th>
                    {poll.slots.map((slot) => (
                      <th key={slot.id} style={{ padding: '0.5rem', textAlign: 'center' }}>
                        {new Date(slot.start).toLocaleString()}
                        <br />–<br />
                        {new Date(slot.end).toLocaleTimeString()}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <input
                        type="text"
                        placeholder="Max Mustermann"
                        {...register('participantName', { required: 'This field is required' })}
                        className={errors.participantName ? 'input error' : 'input'}
                      />
                    </td>
                    {poll.slots.map((slot) => (
                      <td key={slot.id}>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                          {options.map(({ value, activeColor, icon }) => {
                            const isSelected = selections[slot.id] === value;
                            return (
                              <label
                                key={value}
                                style={{
                                  cursor: 'pointer',
                                  borderRadius: '0.5rem',
                                  backgroundColor: isSelected ? activeColor : 'white',
                                  color: isSelected ? 'white' : '#666666',
                                  width: '1rem',
                                  height: '1rem',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  margin: 0,
                                  border: 'thin solid #cccccc',
                                }}
                              >
                                <input
                                  type="radio"
                                  name={selections[slot.id] || ''}
                                  value={value}
                                  checked={isSelected}
                                  onChange={() => handleSelect(slot.id, value)}
                                  style={{ display: 'none' }}
                                />
                                <FontAwesomeIcon icon={icon} />
                              </label>
                            );
                          })}
                        </div>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
              <div className="buttonbar">
                <button type="submit" className="button">
                  Bestätigen
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
