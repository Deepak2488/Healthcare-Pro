import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarPlus, HeartPulse, List, Search, ShieldAlert, UserPlus, UsersRound } from "lucide-react";
import { useStore } from "../store/useStore";
import type { Patient, PatientStatus } from "../store/useStore";
import Toggle from "../components/Toggle";
import type { ViewMode } from "../components/Toggle";
import { requestNotificationPermission } from "../utils/notifications";

const statusClass: Record<PatientStatus, string> = {
  Critical: "status-critical",
  Stable: "status-stable",
  Recovering: "status-recovering",
  Observation: "status-observation",
};

const nextPatient = (count: number): Patient => ({
  id: Date.now(),
  name: `New Patient ${count + 1}`,
  age: 40,
  gender: "Female",
  condition: "General observation",
  department: "General Medicine",
  doctor: "Dr. Priya Menon",
  status: "Observation",
  admissionDate: new Date().toISOString().slice(0, 10),
  room: `OPD-${count + 10}`,
  phone: "+91 98765 12999",
  lastVisit: "Just now",
  riskScore: 42,
  notes: "New patient record created from the patient module.",
});

function PatientCard({ patient }: { patient: Patient }) {
  return (
    <Link className="patient-card" to={`/patients/${patient.id}`}>
      <div className="patient-card-top">
        <div className="avatar">{patient.name.slice(0, 2).toUpperCase()}</div>
        <span className={`status-pill ${statusClass[patient.status]}`}>{patient.status}</span>
      </div>
      <h3>{patient.name}</h3>
      <p>{patient.condition}</p>
      <div className="patient-meta-grid">
        <span>Age {patient.age}</span>
        <span>{patient.department}</span>
        <span>{patient.room}</span>
        <span>Risk {patient.riskScore}</span>
      </div>
    </Link>
  );
}

export default function Patients() {
  const patients = useStore((s) => s.patients);
  const addPatient = useStore((s) => s.addPatient);
  const [view, setView] = useState<ViewMode>("grid");
  const [query, setQuery] = useState("");

  const filteredPatients = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return patients;
    }

    return patients.filter((patient) =>
      [patient.name, patient.condition, patient.department, patient.doctor, patient.status]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery),
    );
  }, [patients, query]);

  const handleAddPatient = async () => {
    await requestNotificationPermission();
    addPatient(nextPatient(patients.length));
  };

  return (
    <div className="patients-page">
      <section className="module-hero patients-hero">
        <div>
          <p>Patient details module</p>
          <h1>Patients</h1>
          <span>View patient records, risk levels, department assignments, and care notes in one polished workspace.</span>
        </div>
        <div className="module-hero-card">
          <HeartPulse />
          <strong>{patients.filter((patient) => patient.status === "Critical").length}</strong>
          <span>Critical cases</span>
        </div>
      </section>

      <section className="patients-toolbar">
        <div className="search-box">
          <Search />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by name, condition, department..."
          />
        </div>
        <Toggle view={view} setView={setView} />
        <button className="primary-action patients-add-button" onClick={handleAddPatient}>
          <UserPlus />
          Add Patient
        </button>
      </section>

      <section className="patients-metrics">
        <div className="patients-metric-card metric-blue">
          <UsersRound />
          <span>Total patients</span>
          <strong>{patients.length}</strong>
        </div>
        <div className="patients-metric-card metric-teal">
          <CalendarPlus />
          <span>Visits today</span>
          <strong>{patients.filter((patient) => patient.lastVisit.includes("Today")).length}</strong>
        </div>
        <div className="patients-metric-card metric-amber">
          <List />
          <span>Matching records</span>
          <strong>{filteredPatients.length}</strong>
        </div>
        <div className="patients-metric-card metric-rose">
          <ShieldAlert />
          <span>Avg risk</span>
          <strong>
            {Math.round(patients.reduce((total, patient) => total + patient.riskScore, 0) / patients.length)}%
          </strong>
        </div>
      </section>

      {view === "grid" ? (
        <section className="patient-grid">
          {filteredPatients.map((patient) => (
            <PatientCard key={patient.id} patient={patient} />
          ))}
        </section>
      ) : (
        <section className="table-shell">
          <table className="data-table">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Department</th>
                <th>Doctor</th>
                <th>Status</th>
                <th>Room</th>
                <th>Risk</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.map((patient) => (
                <tr key={patient.id}>
                  <td>
                    <Link to={`/patients/${patient.id}`}>
                      <strong>{patient.name}</strong>
                      <span>{patient.condition}</span>
                    </Link>
                  </td>
                  <td>{patient.department}</td>
                  <td>{patient.doctor}</td>
                  <td>
                    <span className={`status-pill ${statusClass[patient.status]}`}>{patient.status}</span>
                  </td>
                  <td>{patient.room}</td>
                  <td>{patient.riskScore}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </div>
  );
}
