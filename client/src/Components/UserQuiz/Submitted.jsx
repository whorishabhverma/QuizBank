import React from 'react'
import { useNavigate } from 'react-router-dom'

const Submitted = () => {
  const navigate = useNavigate();
  return (
    <div style={{ background: "linear-gradient(rgba(0,0,50,0.7),rgba(0,0,50,0.7))", color: "#fff", minHeight: "89vh", textAlign: "center" }}>
      <div style={{ marginTop: "8%", color: "#fff" }}>  <h1> Your quiz has been successfully submitted! </h1>
        <br />
        <button style={{ backgroundColor: "#8472c4", color: "#fff", marginTop: "8%" }} onClick={() => navigate('/user')}>Go Back</button>
      </div>
    </div>
  )
}
export default Submitted