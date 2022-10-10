// import {
//   useState,
//   createContext,
//   useContext,
//   useEffect,
//   useLayoutEffect,
// } from "react";

// import { jsonify } from "utils";
// import { withSessionSsr } from "lib/withSession";
// import useFetch from "hooks/useFetch";
// export const AuthContext = createContext();

// export default function AuthProvider({ children, user }) {
//   useEffect(async () => {}, []);
//   const [_user, setUser] = useState(undefined);
//   const [loading, setLoading] = useState(true);

//   async function requestCode({ phonenumber }) {
//     const result = await fetch("/api/auth/send-verification-code", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ phonenumber }),
//     });
//     const data = await result.json();
//     return data;
//   }
//   async function login({ phonenumber, verificationCode }) {
//     const result = await fetch("/api/auth/login", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ phonenumber, verificationCode }),
//     });
//     const data = await result.json();
//     if (!result.error) {
//       setUser(data);
//     }
//     return data;
//   }

//   async function logout() {
//     await fetch("/api/auth/logout", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//     });
//     setUser(undefined);
//   }

//   return (
//     <AuthContext.Provider
//       value={{ user: _user, loading, useSession, login, logout, requestCode }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export function useSession() {
//   const { loading, error, value } = useFetch(`/api/auth/session`, {
//     method: "POST",
//   });

//   return { loading, error, value };
// }

// export const getSession = withSessionSsr(async (context) => {
//   return context.req.session;
// });

// export function useAuth() {
//   return useContext(AuthContext);
// }
