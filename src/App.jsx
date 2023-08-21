import React, { useState, useEffect } from "react";
import { Scheduler } from "@aldabil/react-scheduler";
import es from "date-fns/locale/es";

function App() {
  const [events, setEvents] = useState([]);
  const [forceUpdate, setForceUpdate] = useState(0);
  const [lastAddedEventDate, setLastAddedEventDate] = useState(new Date());

  // Cargar datos del localStorage
  useEffect(() => {
    const storedEvents = localStorage.getItem("events");
    if (storedEvents) {
      const parsedEvents = JSON.parse(storedEvents);
      const eventsWithDateObjects = parsedEvents.map((event) => ({
        ...event,
        start: new Date(event.start),
        end: new Date(event.end),
      }));
      setEvents(eventsWithDateObjects);
      setForceUpdate((prevForceUpdate) => prevForceUpdate + 1);
    }
  }, []);

  //esto guarda en el localStorage
  useEffect(() => {
    if (events.length === 0) return;
    if (events.length > 0) {
      localStorage.setItem("events", JSON.stringify(events));
    }
  }, [events]);

  //eventos de agregar
  const handleConfirm = async (newEvent) => {
    const addedEvent = { ...newEvent, event_id: (Date.now() + Math.random()).toFixed(0) };
    setEvents((prevEvents) => [...prevEvents, addedEvent]);
    setForceUpdate((prevForceUpdate) => prevForceUpdate + 1);
    setLastAddedEventDate(addedEvent.start);

    return addedEvent;
  };

  //eventos de borrar
  const handleDelete = async (deletedEventId) => {
    const deletedEvent = events.find((event) => event.event_id === deletedEventId);
    if (deletedEvent) {
      const { start } = deletedEvent;
      setEvents((prevEvents) => prevEvents.filter((event) => event.event_id !== deletedEventId));
      setForceUpdate((prevForceUpdate) => prevForceUpdate + 1);
      setLastAddedEventDate(start);
    }
  };

  return (
    <div>
      <Scheduler
        selectedDate={lastAddedEventDate}
        editable={false}
        key={forceUpdate}
        events={events}
        onConfirm={handleConfirm}
        onDelete={(eventId, eventStart) => handleDelete(eventId, eventStart)}
        view="month"
        navigation={true}
        locale={es}
        timeZone="GMT"
        translations={{
          navigation: {
            month: "Mes",
            week: "Semana",
            day: "Día",
            today: "Hoy",
          },
          form: {
            addTitle: "Añadir Evento",
            editTitle: "Editar Evento",
            confirm: "Confirmar",
            delete: "Elimnar",
            cancel: "Cancelar",
          },
          event: {
            title: "Descripción",
            start: "Empieza",
            end: "Finaliza",
            allDay: "Todo el día",
          },
          moreEvents: "Más...",
          loading: "Cargando...",
        }}
      />
    </div>
  );
}

export default App;
