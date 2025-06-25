import React, { useState } from 'react';

const AddEvent = ({ token, onEventAdded }) => {
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    startTime: '',
    endTime: '',
    color: '#2563EB'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Basic validation
    if (!formData.title || !formData.date || !formData.startTime || !formData.endTime) {
      setError('Please fill all required fields');
      return;
    }

    if (formData.startTime >= formData.endTime) {
      setError('End time must be after start time');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('https://calendar-backend-six-phi.vercel.app/api/events/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          completed: false
        })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Failed to add event');
      }

      const data = await res.json();
      onEventAdded(data);
      
      // Reset form
      setFormData({
        title: '',
        date: '',
        startTime: '',
        endTime: '',
        color: '#2563EB'
      });
      
    } catch (err) {
      console.error('Error adding event:', err);
      setError(err.message || 'Error saving event');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="event-form">
      {error && <div className="error-message">{error}</div>}
      
      <input
        type="text"
        name="title"
        placeholder="Event Title"
        value={formData.title}
        onChange={handleChange}
        required
      />
      
      <input
        type="date"
        name="date"
        value={formData.date}
        onChange={handleChange}
        required
      />
      
      <input
        type="time"
        name="startTime"
        value={formData.startTime}
        onChange={handleChange}
        required
      />
      
      <input
        type="time"
        name="endTime"
        value={formData.endTime}
        onChange={handleChange}
        required
      />
      
      <input
        type="color"
        name="color"
        value={formData.color}
        onChange={handleChange}
      />
      
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Saving...' : 'Add Event'}
      </button>
    </form>
  );
};

export default AddEvent;