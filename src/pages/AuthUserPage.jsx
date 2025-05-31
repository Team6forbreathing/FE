import React, { useState } from 'react';
import '../styles/FindAccount.css';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import { useAuth } from '../context/AuthContext';


function AuthUserPage() {

    return (
        <>
            <Header />
            <main className="auth-user-page">
                <section className="auth-user-section">
                    <h1>인증된 사용자 페이지</h1>
                    <p>이 페이지는 인증된 사용자만 접근할 수 있습니다.</p>
                </section>
            </main>
        </>
    );
}

export default AuthUserPage;

