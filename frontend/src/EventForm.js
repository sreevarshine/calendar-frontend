import React, { useState, useEffect } from 'react';

const EventForm = ({ onAddEvent, editEvent, setError, loading }) => {
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    startTime: '',
    endTime: '',
    color: '#2563EB'
  });

  // Set form data when editing
  useEffect(() => {
    if (editEvent) {
      setFormData({
        title: editEvent.title,
        date: editEvent.date.split('T')[0], // Format date for input
        startTime: editEvent.startTime,
        endTime: editEvent.endTime,
        color: editEvent.color || '#2563EB'
      });
    } else {
      setFormData({
        title: '',
        date: '',
        startTime: '',
        endTime: '',
        color: '#2563EB'
      });
    }
  }, [editEvent]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.title || !formData.date || !formData.startTime || !formData.endTime) {
      setError('Please fill all required fields');
      return;
    }

    if (formData.startTime >= formData.endTime) {
      setError('End time must be after start time');
      return;
    }

    onAddEvent(formData);
  };

  return (
    <form onSubmit={handleSubmit} style={{
      padding: '20px',
      marginBottom: '20px',
      backgroundColor: '#f8f9fa',
      borderRadius: '5px'
    }}>
      <h2 style={{ marginBottom: '15px' }}>
        {editEvent ? 'Edit Event' : 'Add New Event'}
      </h2>
      
      <div style={{ marginBottom: '10px' }}>
        <input
          type="text"
          name="title"
          placeholder="Event Title"
          value={formData.title}
          onChange={handleChange}
          required
          style={{
            width: '100%',
            padding: '8px',
            borderRadius: '4px',
            border: '1px solid #ddd'
          }}
        />
      </div>
      
      <div style={{ marginBottom: '10px' }}>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
          style={{
            padding: '8px',
            borderRadius: '4px',
            border: '1px solid #ddd'
          }}
        />
      </div>
      
      <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
        <div style={{ flex: 1 }}>
          <label>Start Time</label>
          <input
            type="time"
            name="startTime"
            value={formData.startTime}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ddd'
            }}
          />
        </div>
        
        <div style={{ flex: 1 }}>
          <label>End Time</label>
          <input
            type="time"
            name="endTime"
            value={formData.endTime}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ddd'
            }}
          />
        </div>
      </div>
      
      <div style={{ marginBottom: '15px' }}>
        <label>Color: </label>
        <input
          type="color"
          name="color"
          value={formData.color}
          onChange={handleChange}
          style={{
            marginLeft: '10px',
            width: '50px',
            height: '30px'
          }}
        />
      </div>
      
      <button 
        type="submit" 
        disabled={loading}
        style={{
          padding: '10px 15px',
          backgroundColor: '#2563EB',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        {loading ? 'Processing...' : (editEvent ? 'Update Event' : 'Add Event')}
      </button>
      
      {editEvent && (
        <button 
          type="button"
          onClick={() => onAddEvent(null)} // Cancel edit
          style={{
            padding: '10px 15px',
            marginLeft: '10px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Cancel
        </button>
      )}
    </form>
  );
};

export default EventForm;