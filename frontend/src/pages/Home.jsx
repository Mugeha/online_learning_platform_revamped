// src/pages/Home.jsx
import React, { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import "../styles/global.css";

export default function Home() {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="container">
      <header className="site-header">
        <h1>Online Learning Platform</h1>
        <div>
          {user ? (
            <>
              <span className="muted">Hi, {user.name}</span>
              <button className="btn ghost" onClick={logout}>Logout</button>
            </>
          ) : (
            <>
             <div className="space">
                 <a className="btn" href="/login">Login</a>
              
              <a className="btn ghost" href="/register">Sign up</a>
             </div>
            </>
          )}
        </div>
      </header>

      <main>
        <section className="hero card">
          <h2>Learn skills to level up your career</h2>
          <p className="muted">This demo focuses on auth. Next we'll add courses, instructors and enrollment flows.</p>
        </section>
      </main>
    </div>
  );
}
