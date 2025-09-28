import { useState } from 'react'
import './App.css'


// function to swap card
function App() {
  const [count, setCount] = useState(0);
  const [flip,setFlip] = useState(0);


  // Function to swap card
  function SwapCard(){
    if(flip == 1){
      setFlip(flip-1);      
    }else{
      setFlip(flip+1);
    }

  }

  // Card component
  function FlashCard({frontText,backText}){
    // Needs front and back text
    return(
        <p className = {`cardText ${flip ? "flip" : ""}`}>
          {count==0 ? frontText : backText}
        </p>
    )
  }
  
  return (
    <>
      {/* Title */}
      <div className="headerContainer">
        <div className="innerHeaderContainer">
          <h1>Cybersecurity Quiz!</h1>
          <h3>Test your elementary CS knowledge here!</h3>
        </div>
      </div>

      {/* Number of cards */}
      <div>
        <h4>
          Number of cards in set: 15
        </h4>
      </div>

      {/* Card itself */}
      <div className={`cardContainer ${flip ? "flip" : ""}`} onClick={SwapCard}>
        <FlashCard frontText={"Hello"} backText={"Also hello"}/>
      </div>
    </>
  )
}

export default App

// Criteria
// Create a new Component
// Share a small piece of data from one component to the next
// Utilize useState() to create state variables to help control component behavior
// use the onClick() event to call a method
// create multiple div sections to keep track of different chunks of information
// use those div sections as the basis for CSS styling

// Thoughts:
//
// What data would be shared between components?
//    - Perhaps the position its in?  (i.e. how many cards are left)
//  
//     
// Create multiple div sections to keep track of different chunks of information
//    - Could include: Card itself, number of cards left, index of current card
//
//

