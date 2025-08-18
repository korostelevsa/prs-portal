import React from 'react';

const GeneticsSection = () => {
    return (
        <div className="genetics-section">
            <h2>Генетика</h2>
            <p>Описание секции генетики...</p>
            <button onClick={() => window.location.href = '/risks-table'}>Все риски</button>
        </div>
    );
};

export default GeneticsSection;