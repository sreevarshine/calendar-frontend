import React, { useState } from "react";
import dayjs from "dayjs";
import TimeGridView from "./TimeGridView";

const Calendar = ({ events, setEditEvent, deleteEvent, markCompleted, view }) => {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [selectedDay, setSelectedDay] = useState(null); // For drill-down

  const getCalendarRange = () => {
    let start, end;
    if (view === "month") {
      start = currentDate.startOf("month").startOf("week");
      end = currentDate.endOf("month").endOf("week");
    } else if (view === "week") {
      start = currentDate.startOf("week");
      end = currentDate.endOf("week");
    } else {
      start = currentDate.startOf("day");
      end = currentDate.endOf("day");
    }

    const days = [];
    let date = start.clone();
    while (date.isBefore(end, "day") || date.isSame(end, "day")) {
      days.push(date.clone());
      date = date.add(1, "day");
    }
    return days;
  };

  const calendar = getCalendarRange();
  const today = dayjs().format("YYYY-MM-DD");

  const groupedEvents = events.reduce((acc, ev) => {
    (acc[ev.date] = acc[ev.date] || []).push(ev);
    return acc;
  }, {});

  const handleDateChange = (offset) => {
    setCurrentDate(currentDate.add(offset, view));
  };

  const handleDayClick = (date) => {
    setSelectedDay(date); // Show full detail for clicked day
  };

  const handleBackToMonth = () => {
    setSelectedDay(null);
  };

  return (
    <div className="calendar-container">
      <div className="calendar-nav">
        <button onClick={() => handleDateChange(-1)}>⬅️</button>
        <h2>
          {currentDate.format(
            view === "day"
              ? "DD MMM YYYY"
              : view === "week"
              ? "'Week of' MMM D"
              : "MMMM YYYY"
          )}
        </h2>
        <button onClick={() => handleDateChange(1)}>➡️</button>
      </div>

      {/* TimeGridView for day/week */}
      {(view === "day" || view === "week") ? (
        <TimeGridView
          view={view}
          currentDate={currentDate}
          events={events}
        />
      ) : selectedDay ? (
        <>
          <button onClick={handleBackToMonth}>🔙 Back</button>
          <h3>Events on {selectedDay}</h3>
          <div className="event-list">
            {groupedEvents[selectedDay]?.map((e, idx) => {
              const isMissed = dayjs().isAfter(dayjs(`${e.date} ${e.endTime}`)) && !e.completed;
              return (
                <div
                  key={e.idx}
                  className="event"
                  style={{
                    backgroundColor: isMissed ? "#f44336" : e.color,
                    textDecoration: e.completed ? "line-through" : "none"
                  }}
                >
                  <div><strong>{e.title}</strong></div>
                  <small>{e.startTime} - {e.endTime}</small>
                  <div className="event-actions">
                    <button
  onClick={(ev) => {
    ev.stopPropagation(); // prevents click from bubbling to day-cell
    setEditEvent(e);      // loads event into EventForm
  }}
>✏️</button>

                    <button onClick={() => deleteEvent(e._id)}>🗑️</button>
                    <button onClick={() => markCompleted(e._id)}>✅</button>
                  </div>
                </div>
              );
            })}
            {!groupedEvents[selectedDay]?.length && <p>No events for this day.</p>}
          </div>
        </>
      ) : (
        <div className="calendar-grid">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div key={d} className="day-name">{d}</div>
          ))}

          {calendar.map((day) => {
            const formatted = day.format("YYYY-MM-DD");
            const isToday = formatted === today;

            return (
              <div
                key={formatted}
                className={`day-cell ${isToday ? "today" : ""}`}
                onClick={() => handleDayClick(formatted)}
              >
                <div className="date-number">{day.date()}</div>
                {groupedEvents[formatted]?.map((e, idx) => {
                  const isMissed = dayjs().isAfter(dayjs(`${e.date} ${e.endTime}`)) && !e.completed;

                  return (
                    <div
                      key={idx}
                      className="event"
                      style={{
                        backgroundColor: isMissed ? "#f44336" : e.color,
                        textDecoration: e.completed ? "line-through" : "none"
                      }}
                    >
                      <div>{e.title}</div>
                      <small>{e.startTime} - {e.endTime}</small>
                      <div className="event-actions">
                        <button onClick={() => setEditEvent(e)}>✏️</button>
                        <button onClick={() => deleteEvent(e.id)}>🗑️</button>
                        <button onClick={() => markCompleted(e.id)}>✅</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Calendar;
