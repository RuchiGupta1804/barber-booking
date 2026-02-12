import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// 🔐 Automatically attach token to every request
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// ---------- AUTH ----------
export const loginUser = async (data) => {
  const res = await API.post("/auth/login", data);
  return res.data;
};

// ---------- SERVICES ----------
// ✅ User side → only active
export const getActiveServices = async () => {
  const res = await API.get("/services", { params: { user: "true" } });
  return res.data;
};

// ✅ Admin side → all services
export const getServices = async () => {
  const res = await API.get("/services");
  return res.data;
};

// ---------- APPOINTMENTS ----------
export const getAppointments = async () => {
  const res = await API.get("/appointments");
  return res.data;
};

// ---------- SLOTS ----------
export const getAvailableSlots = async (date, serviceIds) => {
  const res = await API.get("/appointments/slots", {
    params: { date, serviceIds },
  });
  return res.data;
};

// ---------- BOOK ----------
export const bookAppointment = async (data) => {
  const res = await API.post("/appointments/book", data);
  return res.data;
};

// ---------- DASHBOARD ----------
export const getDashboardSummary = async () => {
  const res = await API.get("/appointments/dashboard/summary");
  return res.data;
};

// ---------- LEAVES ----------
export const getBarberLeaves = async () => {
  const res = await API.get("/leaves");
  return res.data;
};

export const saveBarberLeave = async (data) => {
  const res = await API.post("/leaves", data);
  return res.data;
};

export const deleteBarberLeave = async (id) => {
  const res = await API.delete(`/leaves/${id}`);
  return res.data;
};

// ---------- AFFECTED APPOINTMENTS ----------
export const getLeaveAffectedAppointments = async (date) => {
  const res = await API.get("/appointments/leave-affected", {
    params: { date },
  });
  return res.data;
};

// ---------- CANCEL ----------
export const cancelAppointmentByBarber = async (id) => {
  const res = await API.patch(`/appointments/${id}/cancel`);
  return res.data;
};

// ---------- COMPLETE ----------
export const markAppointmentCompleted = async (id) => {
  const res = await API.patch(`/appointments/${id}/complete`);
  return res.data;
};

// ---------- BARBER ----------
export const getBarberAppointments = async () => {
  const res = await API.get("/appointments/barber");
  return res.data;
};

export default API;
