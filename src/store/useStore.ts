import { create } from "zustand";
import toast from "react-hot-toast";
import { sendLocalNotification } from "../utils/notifications";
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";

export type AppUser = {
  id: string;
  name: string;
  email: string;
  role: string;
};

export type PatientStatus = "Critical" | "Stable" | "Recovering" | "Observation";

export type Patient = {
  id: number;
  name: string;
  age: number;
  gender: string;
  condition: string;
  department: string;
  doctor: string;
  status: PatientStatus;
  admissionDate: string;
  room: string;
  phone: string;
  lastVisit: string;
  riskScore: number;
  notes: string;
};

export type AppNotification = {
  id: number;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
};

type StoreState = {
  user: AppUser | null;
  authLoading: boolean;
  patients: Patient[];
  notifications: AppNotification[];

  login: (email: string, password: string) => Promise<AppUser>;
  logout: () => Promise<void>;
  setUser: (user: AppUser | null) => void;
  initAuthListener: () => void;

  addPatient: (patient: Patient) => void;
  markNotificationsRead: () => void;
};

const initialPatients: Patient[] = [
  {
    id: 1001,
    name: "Aarav Mehta",
    age: 48,
    gender: "Male",
    condition: "Post-op cardiac review",
    department: "Cardiology",
    doctor: "Dr. Nisha Rao",
    status: "Observation",
    admissionDate: "2026-04-24",
    room: "C-214",
    phone: "+91 98765 12001",
    lastVisit: "Today, 10:30 AM",
    riskScore: 72,
    notes: "Monitor BP every 4 hours and review ECG before discharge.",
  },
  {
    id: 1002,
    name: "Neha Sharma",
    age: 36,
    gender: "Female",
    condition: "Diabetes follow-up",
    department: "Endocrinology",
    doctor: "Dr. Kabir Sethi",
    status: "Stable",
    admissionDate: "2026-04-22",
    room: "OPD-08",
    phone: "+91 98765 12002",
    lastVisit: "Today, 11:15 AM",
    riskScore: 31,
    notes: "Continue medication and diet plan.",
  },
  {
    id: 1003,
    name: "Kabir Rao",
    age: 62,
    gender: "Male",
    condition: "Stroke recovery therapy",
    department: "Neurology",
    doctor: "Dr. Meera Nair",
    status: "Recovering",
    admissionDate: "2026-04-18",
    room: "N-109",
    phone: "+91 98765 12003",
    lastVisit: "Yesterday, 04:00 PM",
    riskScore: 58,
    notes: "Physiotherapy twice daily.",
  },
  {
    id: 1004,
    name: "Isha Kapoor",
    age: 29,
    gender: "Female",
    condition: "Respiratory infection",
    department: "Pulmonology",
    doctor: "Dr. Rohan Das",
    status: "Critical",
    admissionDate: "2026-04-28",
    room: "ICU-03",
    phone: "+91 98765 12004",
    lastVisit: "Today, 09:10 AM",
    riskScore: 89,
    notes: "Oxygen support active.",
  },
  {
    id: 1005,
    name: "Rohan Gupta",
    age: 52,
    gender: "Male",
    condition: "Hypertension",
    department: "Cardiology",
    doctor: "Dr. Nisha Rao",
    status: "Stable",
    admissionDate: "2026-04-20",
    room: "C-102",
    phone: "+91 98765 12005",
    lastVisit: "Today, 01:30 PM",
    riskScore: 44,
    notes: "Regular BP monitoring required.",
  },
  {
    id: 1006,
    name: "Priya Singh",
    age: 41,
    gender: "Female",
    condition: "Thyroid disorder",
    department: "Endocrinology",
    doctor: "Dr. Kabir Sethi",
    status: "Observation",
    admissionDate: "2026-04-21",
    room: "OPD-05",
    phone: "+91 98765 12006",
    lastVisit: "Today, 12:00 PM",
    riskScore: 39,
    notes: "Follow-up in 2 weeks.",
  },
  {
    id: 1007,
    name: "Ankit Verma",
    age: 34,
    gender: "Male",
    condition: "Fracture recovery",
    department: "Orthopedics",
    doctor: "Dr. Rahul Jain",
    status: "Recovering",
    admissionDate: "2026-04-15",
    room: "O-210",
    phone: "+91 98765 12007",
    lastVisit: "Yesterday, 06:00 PM",
    riskScore: 27,
    notes: "Physiotherapy ongoing.",
  },
  {
    id: 1008,
    name: "Sneha Iyer",
    age: 55,
    gender: "Female",
    condition: "Heart surgery recovery",
    department: "Cardiology",
    doctor: "Dr. Nisha Rao",
    status: "Critical",
    admissionDate: "2026-04-27",
    room: "ICU-07",
    phone: "+91 98765 12008",
    lastVisit: "Today, 08:30 AM",
    riskScore: 91,
    notes: "Post-surgery monitoring required.",
  },
];

export const useStore = create<StoreState>((set, get) => ({
  user: null,
  authLoading: true,
  patients: initialPatients,
  notifications: [],

  // 🔥 INIT AUTH (AUTO LOGIN AFTER REFRESH)
  initAuthListener: () => {
    if (!auth) return;

    onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const user: AppUser = {
          id: firebaseUser.uid,
          name: firebaseUser.displayName || firebaseUser.email || "User",
          email: firebaseUser.email || "",
          role: "Hospital Staff",
        };

        localStorage.setItem("healthcare-user", JSON.stringify(user));
        set({ user, authLoading: false });
      } else {
        localStorage.removeItem("healthcare-user");
        set({ user: null, authLoading: false });
      }
    });
  },

  // 🔐 LOGIN
  login: async (email, password) => {
    if (!auth) throw new Error("Firebase not configured");

    if (!email || !password) {
      throw new Error("Email and password are required");
    }

    set({ authLoading: true });

    try {
      const res = await signInWithEmailAndPassword(auth, email, password);

      const user: AppUser = {
        id: res.user.uid,
        name: res.user.displayName || res.user.email || "User",
        email: res.user.email || "",
        role: "Hospital Staff",
      };

      localStorage.setItem("healthcare-user", JSON.stringify(user));
      set({ user });

      return user;

    } catch (error: any) {
      const code = error.code;

      if (code === "auth/user-not-found") throw new Error("User not found");
      if (code === "auth/wrong-password") throw new Error("Incorrect password");
      if (code === "auth/invalid-email") throw new Error("Invalid email");
      if (code === "auth/too-many-requests") throw new Error("Too many attempts. Try later");

      throw new Error("Login failed. Please try again.");

    } finally {
      set({ authLoading: false });
    }
  },

  // 🔓 LOGOUT
  logout: async () => {
    if (auth) await signOut(auth);
    localStorage.removeItem("healthcare-user");
    set({ user: null });
  },

  setUser: (user) => set({ user }),

  // ➕ ADD PATIENT
  addPatient: (patient) =>
    set((state) => {
      const notification: AppNotification = {
        id: Date.now(),
        title: "New patient added",
        message: `${patient.name} added to ${patient.department}`,
        createdAt: new Date().toLocaleTimeString(),
        read: false,
      };

      toast.success(notification.message);
      sendLocalNotification(notification.title, notification.message);

      return {
        patients: [patient, ...state.patients],
        notifications: [notification, ...state.notifications],
      };
    }),

  // 🔔 MARK READ
  markNotificationsRead: () =>
    set({
      notifications: get().notifications.map((n) => ({
        ...n,
        read: true,
      })),
    }),
}));