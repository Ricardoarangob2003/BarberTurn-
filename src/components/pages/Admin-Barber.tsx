import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../axiosConfig';

interface Barber {
  id: string;
  name: string;
  speciality: string;
}

interface Appointment {
  id: string;
  clientName: string;
  date: string;
  status: 'completed' | 'pending' | 'canceled';
}

interface AdminData {
  id: string;
  name: string;
  barbershop: string;
}

const AdminBarberDashboard: React.FC = () => {
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [adminData, setAdminData] = useState<AdminData | null>(null);

  useEffect(() => {
    // Retrieve admin data from localStorage
    const storedAdminData = localStorage.getItem('adminData');
    if (storedAdminData) {
      setAdminData(JSON.parse(storedAdminData));
    }

    // Fetch barbers and appointments data
    const fetchData = async () => {
      try {
        const barbersResponse = await axiosInstance.get(`/barbers?barbershop=${adminData?.barbershop}`);
        setBarbers(barbersResponse.data);

        const appointmentsResponse = await axiosInstance.get(`/appointments?barbershop=${adminData?.barbershop}`);
        setAppointments(appointmentsResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    if (adminData) {
      fetchData();
    }
  }, [adminData]);

  const filteredAppointments = (status: 'completed' | 'pending' | 'canceled') => {
    return appointments.filter(appointment => appointment.status === status);
  };

  if (!adminData) {
    return <div>Loading...</div>;
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        <h1 style={styles.title}>Admin Dashboard - {adminData.barbershop}</h1>
        
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Registered Barbers</h2>
          <ul style={styles.list}>
            {barbers.map(barber => (
              <li key={barber.id} style={styles.listItem}>
                {barber.name} - {barber.speciality}
              </li>
            ))}
          </ul>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Appointments</h2>
          <div style={styles.appointmentsContainer}>
            <div style={styles.appointmentColumn}>
              <h3 style={styles.columnTitle}>Completed</h3>
              <ul style={styles.list}>
                {filteredAppointments('completed').map(appointment => (
                  <li key={appointment.id} style={styles.listItem}>
                    {appointment.clientName} - {appointment.date}
                  </li>
                ))}
              </ul>
            </div>
            <div style={styles.appointmentColumn}>
              <h3 style={styles.columnTitle}>Pending</h3>
              <ul style={styles.list}>
                {filteredAppointments('pending').map(appointment => (
                  <li key={appointment.id} style={styles.listItem}>
                    {appointment.clientName} - {appointment.date}
                  </li>
                ))}
              </ul>
            </div>
            <div style={styles.appointmentColumn}>
              <h3 style={styles.columnTitle}>Canceled</h3>
              <ul style={styles.list}>
                {filteredAppointments('canceled').map(appointment => (
                  <li key={appointment.id} style={styles.listItem}>
                    {appointment.clientName} - {appointment.date}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Ticket-Turns</h2>
          <Link to="/ticket-turns" style={styles.link}>Go to Ticket-Turns</Link>
        </section>
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    backgroundImage: 'url("/assets/imgs/background-gallery.jpg")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
  },
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: '8px',
    padding: '20px',
    width: '100%',
    maxWidth: '1200px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold' as const,
    marginBottom: '20px',
    textAlign: 'center' as const,
    color: '#333',
  },
  section: {
    marginBottom: '30px',
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: 'bold' as const,
    marginBottom: '10px',
    color: '#444',
  },
  list: {
    listStyleType: 'none',
    padding: 0,
  },
  listItem: {
    padding: '8px 0',
    borderBottom: '1px solid #eee',
  },
  appointmentsContainer: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  appointmentColumn: {
    flex: 1,
    margin: '0 10px',
  },
  columnTitle: {
    fontSize: '18px',
    fontWeight: 'bold' as const,
    marginBottom: '10px',
    color: '#555',
  },
  link: {
    display: 'inline-block',
    padding: '10px 20px',
    backgroundColor: '#4CAF50',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '4px',
    fontWeight: 'bold' as const,
    transition: 'background-color 0.3s',
  },
};

export default AdminBarberDashboard;