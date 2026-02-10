import React from 'react';
import Team from '../sections/Team';
import Footer from '../layout/Footer';

const TeamPage = () => {
    return (
        <>
            <main className="container mx-auto px-6 pt-32 pb-20">
                <Team />
            </main>
            <Footer />
        </>
    );
};

export default TeamPage;
