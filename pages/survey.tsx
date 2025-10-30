import Link from 'next/link'
import React from 'react'
import { Container } from 'react-bootstrap'
import SurveyComp from '../components/SurveyCompRefactored'


export default function Survey() {
  return (
    <Container className="mx-auto" style={{
      marginBottom:'480px',
      marginTop: '200px'
    }}>
      <SurveyComp />
      {/* link to results template to paste into survey complete in SurveyJS */}
      {/* once complete add completed course creation list to dropdown menu with name, basically a history of courses per user id */}
      {/* once selected current courses list, add some further identification/specification/help/information/clarification about each course to the dashbaord */}
    </Container>
  )
}

// (onSurveyComplete do this return button and send results)


