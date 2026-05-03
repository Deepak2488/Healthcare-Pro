import { create } from "zustand";
import toast from "react-hot-toast";
import { sendLocalNotification } from "../utils/notifications";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
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
  setAuthLoading: (loading: boolean) => void;
  addPatient: (patient: Patient) => void;
  markNotificationsRead: () => void;
};

// const demoUsers = [
//   {
//     id: "u-admin",
//     name: "Dr. Admin",
//     email: "admin@healthcarepro.com",
//     password: "Admin@123456",
//     role: "Hospital Admin",
//   },
//   {
//     id: "u-staff",
//     name: "Care Coordinator",
//     email: "staff@healthcarepro.com",
//     password: "Care@123456",
//     role: "Clinical Staff",
//   },
// ];

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
    notes: "Monitor blood pressure every 4 hours and review ECG before discharge.",
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
    notes: "HbA1c improved. Continue medication and schedule dietician review.",
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
    notes: "Physiotherapy twice daily. Speech therapy progress is steady.",
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
    notes: "Oxygen support active. Review blood culture results urgently.",
  },
];

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem("healthcare-user") || "null") as AppUser | null;
  } catch {
    return null;
  }
};

export const useStore = create<StoreState>((set, get) => ({
  user: getStoredUser(),
  authLoading: false,
  patients: initialPatients,
  notifications: [
    {
      id: 1,
      title: "ICU review due",
      message: "Isha Kapoor needs a respiratory review today.",
      createdAt: "09:00 AM",
      read: false,
    },
  ],

  login: async (email, password) => {
  if (!auth) throw new Error("Firebase not configured");

  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  set({ authLoading: true });

  try {
    const res = await signInWithEmailAndPassword(auth, email, password);

    const appUser = {
      id: res.user.uid,
      name: res.user.displayName || res.user.email || "User",
      email: res.user.email || "",
      role: "Hospital Staff",
    };

    // ✅ session persistence
    localStorage.setItem("healthcare-user", JSON.stringify(appUser));

    set({ user: appUser });

    return appUser;

  } catch (error: unknown) {
    const errorCode =
      error && typeof error === "object" && "code" in error
        ? String((error as { code: unknown }).code)
        : "";

    if (errorCode === "auth/user-not-found") {
      throw new Error("User not found", { cause: error });
    }
    if (errorCode === "auth/wrong-password") {
      throw new Error("Incorrect password", { cause: error });
    }
    if (errorCode === "auth/invalid-email") {
      throw new Error("Invalid email format", { cause: error });
    }

    throw new Error("Login failed. Please try again.", { cause: error });
  } finally {
    set({ authLoading: false });
  }
},

  logout: async () => {
  if (auth) await signOut(auth);
  localStorage.removeItem("healthcare-user");
  set({ user: null });
},

  setUser: (user) => set({ user }),

  setAuthLoading: (authLoading) => set({ authLoading }),

  addPatient: (patient) =>
    set((state) => {
      const notification = {
        id: Date.now(),
        title: "New patient added",
        message: `${patient.name} was added to ${patient.department}.`,
        createdAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        read: false,
      };

      toast.success(notification.message);
      sendLocalNotification(notification.title, notification.message);

      return {
        patients: [patient, ...state.patients],
        notifications: [notification, ...state.notifications],
      };
    }),

  markNotificationsRead: () =>
    set({
      notifications: get().notifications.map((notification) => ({
        ...notification,
        read: true,
      })),
    }),
}));
