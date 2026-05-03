import { Link, useParams } from "react-router-dom";
import { ArrowLeft, CalendarDays, HeartPulse, Phone, ShieldAlert, Stethoscope } from "lucide-react";
import { useStore } from "../store/useStore";

export default function PatientDetails() {
  const { patientId } = useParams();
  const patient = useStore((s) => s.patients.find((item) => String(item.id) === patientId));

  if (!patient) {
    return (
      <div className="page-stack">
        <Link className="back-link" to="/patients">
          <ArrowLeft />
          Back to patients
        </Link>
        <section className="empty-state">
          <h1>Patient not found</h1>
          <p>The patient record may have been removed or the link is incorrect.</p>
        </section>
      </div>
    );
  }

  return (
    <div className="page-stack">
      <Link className="back-link" to="/patients">
        <ArrowLeft />
        Back to patients
      </Link>

      <section className="details-hero">
        <div className="avatar avatar-large">{patient.name.slice(0, 2).toUpperCase()}</div>
        <div>
          <p>Patient ID #{patient.id}</p>
          <h1>{patient.name}</h1>
          <span>{patient.condition}</span>
        </div>
        <div className="risk-badge">
          <ShieldAlert />
          Risk {patient.riskScore}
        </div>
      </section>

      <section className="details-grid">
        <div className="details-card">
          <HeartPulse />
          <span>Status</span>
          <strong>{patient.status}</strong>
        </div>
        <div className="details-card">
          <Stethoscope />
          <span>Department</span>
          <strong>{patient.department}</strong>
        </div>
        <div className="details-card">
          <CalendarDays />
          <span>Last visit</span>
          <strong>{patient.lastVisit}</strong>
        </div>
        <div className="details-card">
          <Phone />
          <span>Phone</span>
          <strong>{patient.phone}</strong>
        </div>
      </section>

      <section className="details-layout">
        <div className="panel">
          <h2>Clinical Summary</h2>
          <dl className="info-list">
            <div>
              <dt>Age / Gender</dt>
              <dd>
                {patient.age} / {patient.gender}
              </dd>
            </div>
            <div>
              <dt>Doctor</dt>
              <dd>{patient.doctor}</dd>
            </div>
            <div>
              <dt>Admission date</dt>
              <dd>{patient.admissionDate}</dd>
            </div>
            <div>
              <dt>Room</dt>
              <dd>{patient.room}</dd>
            </div>
          </dl>
        </div>

        <div className="panel">
          <h2>Care Notes</h2>
          <p className="notes">{patient.notes}</p>
          <div className="progress-track">
            <span style={{ width: `${patient.riskScore}%` }} />
          </div>
        </div>
      </section>
    </div>
  );
}
