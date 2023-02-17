import type { NextPage } from 'next'
import { Button, Card, Container, Row, Col, ButtonGroup } from 'react-bootstrap'
import styles from '../styles/home.module.css'
import banner from '../assets/banner.png'
import Link from 'next/link'
import { IBM_Plex_Sans } from '@next/font/google'
import { useAuth } from '../context/AuthContext'
import { useRouter } from 'next/router'
import Image from 'next/image'

const Home: NextPage = () => {
  function handleClick() {
    console.log('increment like count');
  }
  const { user, logout } = useAuth()
  const router = useRouter()

  try {
    // Your code to display the image
  } catch (error) {
    console.error(error);
  }
  return (
    <div className='text-center'>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "300px", width:'100vw', marginBottom:'29em' }}>
        <Container fluid style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "200%" }}>
          <div style={{ position: "relative", height: "100%", width: "100vw" }}>
            <Image src={banner} alt='banner' style={{ height: "100%", width: "100vw", objectFit:'cover'}} />
            <div style={{ position: "absolute", top: 70, left: 0, height: "100%", width: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <h1 style={{ fontSize: "0.7em" }}>
                <b style={{ fontSize: "5.5em" }}>Let&apos;s Plan Together</b>
                <p style={{ fontSize: "3.5em" }}>We&apos;re on a mission to help every student choose the right path.</p>
                <Link href={"/survey"}
                legacyBehavior>
                  <a style={{ fontSize: "3em" }}
                    onClick={() => {
                      {user ? (
                        router.push('/survey')
                      ) : (
                        router.push('/signup')
                      )}
                        
                      }} 
                  >Get Started</a>
                </Link>
              </h1>
            </div>
          </div>
        </Container>
      </div>
      <div
      style={{
        width: '100%',
        margin: 'auto',
        paddingBottom: '150px'
      }}> 
        <h2 className="display-1 text-center"
        style={{
          marginBottom:'90px'
        }}
        >Unsure about your class selection?</h2>
        <Row style={{
          justifyContent:'center'
        }}>
          <Card style={{ width: '30rem' }}>
            <Card.Img variant="top" src="#" />
            <Card.Body>
              <Card.Title className='display-6'
              style={{
                fontWeight:'bold'
              }}
              >FAQ</Card.Title>
              <Card.Text style={{
                fontSize:'1.7rem'
              }}>
                Have a question you need answered?
              </Card.Text>
                <Link href="/faq">
                  <Button variant="primary">Click Here</Button>
                </Link>
            </Card.Body>
          </Card>
          <Card style={{ width: '30rem', marginLeft:'30px' }}>
            <Card.Img variant="top" src="holder.js/100px180" />
            <Card.Body>
              <Card.Title className='display-6'
              style={{
                fontWeight:'bold'
              }}
              >Catalog</Card.Title>
              <Card.Text style={{
                fontSize:'1.7rem'
              }}>
                Take a look at our course catalog!
              </Card.Text>
              <Link href="/catalog">
                  <Button variant="primary">Click Here</Button>
                </Link>
            </Card.Body>
          </Card>
        </Row>
      </div>
      <div>
        <Container className='display-5'>
          <hr
          style={{
            marginBottom:'120px'
          }}
          ></hr>
          <h1 className='display-1'
          style={{
            marginBottom:'30px'
          }}
          >Why Coursee</h1>
          <div
          style={{
            marginBottom: '100px'
          }}>
            Coursee is a streamlined and free way of choosing your courses without any external guidance.
            <br></br>
            <Link className='display-4 my-4' href={'/about'}
          >About</Link>
          </div>
        </Container>
      </div>
    </div>
      
  );
}

export default Home
