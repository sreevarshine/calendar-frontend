import React from "react";
import dayjs from "dayjs";

const TimeGridView = ({ view, currentDate, events }) => {
  const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`);
  const days = view === "week"
    ? Array.from({ length: 7 }, (_, i) => currentDate.startOf("week").add(i, "day"))
    : [currentDate];

  return (
    <div className="time-grid">
      <div className="time-column">
        {hours.map((h) => (
          <div key={h} className="time-slot time-label">{h}</div>
        ))}
      </div>

      {days.map((day, dayIdx) => {
        const dateStr = day.format("YYYY-MM-DD");
        const dayEvents = events.filter(e => e.date === dateStr);

        return (
          <div key={dayIdx} className="time-column">
            <div className="day-label">{day.format("ddd, DD")}</div>
            {hours.map((h, hrIdx) => {
              const event = dayEvents.find(ev => parseInt(ev.startTime.split(":")[0]) === hrIdx);
              return (
                <div key={hrIdx} className="time-slot">
                  {event && (
                    <div
                      className="time-event"
                      style={{ backgroundColor: event.color }}
                      title={`${event.title} (${event.startTime} - ${event.endTime})`}
                    >
                      {event.title}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default TimeGridView;
