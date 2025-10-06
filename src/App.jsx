import { useState } from 'react'
import './App.css'


// function to swap card
function App() {
  const [count, setCount] = useState(0);
  const [seeMastery,setSeeMastery] = useState(0);
  const [useGuess,setUseGuess] = useState(0);
  const [flip,setFlip] = useState(0);
  const [currDir,setCurrDir] = useState([]);
  const [error,setError] = useState(0);

  const textDirectory = {
    // 0 is reserved as the "start" card ONLY
    0:{"FrontText": "Start", "BackText": " "},
    1:{"FrontText": "What is RPO?", "BackText": "Recovery Point Objective (RPO) measures maximum tolerable data loss, defining how often data must be backed up.", "a":"recovery point objective"},
    2:{"FrontText": "What is a symbolic link?", "BackText": "A symbolic link is a file that refers to a file system item by storing the path to it. Think of a shortcut in Windows 10/11, its the same concept. The file merely holds the path to the actual file.", "a":"stores path to file"},
    3:{"FrontText": "What is RTO?", "BackText": "Recovery Time Objective (RTO) refers to the MAXIMUM time a system or service can be offline without unacceptable consequences.", "a":"recovery time objective"},
    4:{"FrontText": "What is FISMA?", "BackText": "The Federal Information Security Modernization Act(FISMA) mandates federal agencies and contractors to maintain adequate cybersecurity protections for sensitive systems","a":"federal information security modernization act"},
    5:{"FrontText": "What is cryptography?", "BackText": "Crytography (or cryptology) is the science of protecting data by transforming it into a format that cannot be understood by unauthorized users. The data, though translated, needs to still be accurate, unaltered, and verifiable.","a":"science of protecting data"},
    6:{"FrontText": "What is PCI DSS?", "BackText": "Payment Card Industry Data Security Standard(PCI DSS) mandates secure handling of credit card data for merchants and processors","a":"payment card industry data security standard"},
    7:{"FrontText": "What is SOAR?", "BackText": "Security Orchestration, Automation, and Response (SOAR) automates responses to alerts from SIEM and other sources. Administrators use runbooks and playbooks to define how to handle incidents. SOAR connects with ticketing systems, firewalls, EDRs, and more.","a":"security orchestration automation and response"},
    8:{"FrontText": "What is MPLS?", "BackText": "Multiprotocol Label Switching (MPLS) is a layer 2.5 technology combining Layer 2 (Data-Link) and Layer 3 (Transportation). Assigns labels for fast packet routing without full IP lookups. Optimizes traffic flow, supports quality of service (QoS). Replaced most older WAN technologies (e.g. Frame Relay, ATM)","a":"multi protocol label switching"},
    9:{"FrontText": "What is a linux daemon?", "BackText": "Daemons are Linux services that: Start during system boot, run in the background, and are critical for the OS to function", "a":"critical os services"},
    10:{"FrontText": "What is a hash function?", "BackText": "A hash function transforms data into a fixed-length output using a one-way mathematical operation (includes bitwise operations, modular arithmetic, permutation and mixing, and more). The operation is irreversible, so the original input cannot be discerned from the output.", "a":"irreversible encryption"}
  }
  const txtDirLen = Object.keys(textDirectory).length;



  // Check Guess Function
  function CheckGuess(){
    const input = formData.get("aBox");
    const txtDirAns = textDirectory[currMem]["a"];
    // If true, allow mastery, apply class
    if(input == txtDirAns){
      setSeeMastery(1);
      return 1;
    }else{
      return 0;
    }
    
  }

  // Foward function
  function moveFoward(){

    // If increasing count results in an "out of bounds":
    //  then, reset currDir and currMem count.
    if((count+1) > txtDirLen){
      let array = Shuffle();
      setCurrDir(array);
      setCount(1);
    }else{
      setCount(count+1);
    }

  }

  function moveBack(){
    // if decreasing count results in index "1":
    //  then, do not allow anymore backwards movement. 
    
    if((count-1) <= 1){
      // Do nothing
      // or maybe notify user
      setError(1);
    }else{
      setCount(count-1);
    }
  }

  // Shuffle cards Function
  function Shuffle(){
    // Generate random list of numbers
    let array = [];
    let arrayLength = (Object.keys(textDirectory).length) - 1;
    let tempNum; 

    for(let i=0;i<arrayLength;i++){
      do{
        tempNum = Math.floor((Math.random()*arrayLength))+1;
      }while(array.includes(tempNum))

      array.push(tempNum);
    }

    return array;
  }

  // Function to swap card
  function FlipCard(){
    if(flip == 1){
      //unflips
      setFlip(flip-1);      
    }else{
      //flips
      setFlip(flip+1);
      setUseGuess(0);
    }

    // For start card, flip back around.
    if(count == 0){
      setFlip(0);
      SwapCard(1);
    }

  }

  function CheckAnswer(formData){
    const input = formData.get("aBox");
    alert("You submitted: "+ input);
  }

  // Card component
  function FlashCard(){
    // Needs front and back text
    return(
        <p className = {`cardText ${flip ? "flip" : ""}`}>
          {flip==0 ? textDirectory[count]["FrontText"] : textDirectory[count]["BackText"]}
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
          Number of cards in set: 10
        </h4>
      </div>

      {/* Mastery Prompt on conditional */}
      
      {/* {(seeMastery) ? <div className="masteryDiv"> <p>Mastered?</p> <button className="formButton"><span>Remove from deck</span></button> </div> : <div></div>} */}
      
      <div className="extraDiv fadeIn"> 
        {(seeMastery) ? <div className="masteryDiv"><p>Mastered?</p> <button className="formButton"><span>Remove from deck</span></button></div> : <><div></div></>} 
        
        {/* Error Message on conditional */}
        {(error) ? <><p>You cannot go further!</p></> :<></>}
      </div>
      

      {/* Card itself */}
      <div className={`cardContainer ${flip ? "flip" : ""}`} onClick={FlipCard}>
        <FlashCard/>
      </div>
      
      <div className="formContainer">
        <form id="form" action={CheckAnswer}>
          <label htmlFor="aBox">Guess the answer here:</label>
          <input type="text" id="aBox" name="aBox"></input>
          <button className="formButton" type="submit" form="form" disabled={useGuess==1 ? false : true}> <span>submit</span></button>
        </form>
      </div>

      {/* Buttons */}
      <div className='buttonContainer'>
        <button className='backButton fadeInOut' onClick={()=>{SwapCard(0)}}>
          <span>Back</span>
        </button>
        <button className='fowardButton' onClick={()=>{SwapCard(1)}}>
          <span>Foward</span>
        </button>
        <button className ="shuffleButton"> 
          <span>Shuffle</span>
        </button>
        {/* ADD ONCLICK FUNCTION TO SHUFFLE BUTTON */}
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

