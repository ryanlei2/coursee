import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
    return (
    <footer style={{ backgroundColor: 'skyblue', textAlign: 'center', padding: '20px 0', marginTop: 'auto' }}>
        <Container>
        <Row>
            <Col>
            Designed and Coded by RHS - 2023
            </Col>
        </Row>
        </Container>
    </footer>
    );
};

export default Footer;
