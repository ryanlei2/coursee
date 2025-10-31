const Footer = () => {
    return (
        <footer style={{ 
            backgroundColor: '#EFF3FE', 
            textAlign: 'center', 
            padding: '2rem 0 0 0', 
            marginTop: 'auto',
            marginBottom: '-10px',
            width: '100vw',
            marginLeft: 'calc(-50vw + 50%)',
            marginRight: 'calc(-50vw + 50%)',
            borderTop: '1px solid #e0e0e0',
            paddingBottom: '10px'
        }}>
            <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 1rem' }}>
                <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
                    © 2025 Coursee. All rights reserved.
                </p>
            </div>
        </footer>
    );
};

export default Footer;
