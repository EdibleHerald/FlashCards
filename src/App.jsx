import { useState } from 'react'
import './App.css'


// function to swap card
function App() {
  const [count, setCount] = useState(0);
  const [seeMastery,setSeeMastery] = useState(0);
  const [useGuess,setUseGuess] = useState(0);
  const [ans,setAns] = useState(0);
  const [flip,setFlip] = useState(0);
  const [currDir,setCurrDir] = useState([0]);
  const [ansDir,setAnsDir] = useState([]);
  const [error,setError] = useState(0);
  const [dir,setDir] = useState(0);

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
    9:{"FrontText": "What is a linux daemon?", "BackText": "Daemons are Linux services that: Start during system boot, run in the background, and are critical for the OS to function", "a":"critical os service"},
    10:{"FrontText": "What is a hash function?", "BackText": "A hash function transforms data into a fixed-length output using a one-way mathematical operation (includes bitwise operations, modular arithmetic, permutation and mixing, and more). The operation is irreversible, so the original input cannot be discerned from the output.", "a":"irreversible encryption"}
  }
  const txtDirLen = Object.keys(textDirectory).length;



  // Check Guess Function
  function CheckGuess(formData){
    const input = formData.get("aBox");
    const txtDirAns = textDirectory[currDir[count]]["a"];
    console.log(txtDirAns);
    // If true, allow mastery, apply class
    if(input.includes(txtDirAns)){
      setSeeMastery(1);
      setAns(1);
      let array = ansDir;
      array.push(1);
      setAnsDir(array);
      return 1;
    }else{
      setAns(0);
      return 0;
    }
    
  }

  // Foward function
  function moveFoward(){
    let currDirLength = Object.keys(currDir).length;

    // If increasing count results in an "out of bounds":
    //  then, reset currDir and currMem count.
    if((count+1) >= (txtDirLen-1)){
      // Should just NOTIFY player
      setDir(1);
      setError(1);
    }else if(currDirLength > 1){
      // Needs to avoid case where currDir.length == 1
      setError(0);
      setUseGuess(1);
      setCount(count+1);
      setSeeMastery(0);
    }else{
      let array = Shuffle();
      setCurrDir(array["currDirArr"]);
      setUseGuess(1);
      setError(0);
      setCount(0);
      setFlip(0);
    }

  }

  function moveBack(){
    // if decreasing count results in index "1":
    //  then, do not allow anymore backwards movement. 
    
    if((count-1) < 0){
      // Do nothing
      // or maybe notify user
      setDir(0);
      setError(1);
    }else{
      setError(0);
      setUseGuess(0);
      setCount(count-1);
    }
  }

  // Shuffle cards Function
  function Shuffle(){
    // Generate random list of numbers
    let arr1 = [];
    let arr2 = [];
    
    let arrayLength = (Object.keys(textDirectory).length) - 1;
    let tempNum; 

    for(let i=0;i<arrayLength;i++){
      do{
        tempNum = Math.floor((Math.random()*arrayLength))+1;
      }while(arr1.includes(tempNum))

      arr1.push(tempNum);
    }

    for(let i=0;i<arrayLength;i++){
      arr2.push(0);
    }

    let array = {
      "currDirArr":arr1,
      "ansArr":arr2
    };

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

    let len = Object.keys(currDir).length;
    if(len == 1){
      setFlip(0);
      moveFoward();
    }

  }

  // Card component
  function FlashCard(){
    // Needs front and back text
    return(
        <p className = {`cardText ${flip ? "flip" : ""}`}>
          {flip==0 ? textDirectory[currDir[count]]["FrontText"] : textDirectory[currDir[count]]["BackText"]}
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
        {(error) ? <><p>You cannot go further {(dir) ? "foward! You can shuffle to get a new set of cards!" : "back!" }</p></> :<></>}
      </div>
      

      {/* Card itself */}
      <div className={`cardContainer ${flip ? "flip" : ""}`} onClick={()=>{FlipCard()}}>
        <FlashCard/>
      </div>
      
      <div className={`formContainer ${ans ? "rightAnswer" : "wrongAnswer"}`}>
        <form id="form" action={CheckGuess}>
          <label htmlFor="aBox">Guess the answer here:</label>
          <input type="text" id="aBox" name="aBox"></input>
          <button className="formButton" type="submit" form="form" disabled={useGuess==0 ? true : false}> <span>submit</span></button>
        </form>
      </div>

      {/* Buttons */}
      <div className='buttonContainer'>
        <button className='backButton fadeInOut' onClick={()=>{moveBack()}}>
          <span>Back</span>
        </button>
        <button className='fowardButton' onClick={()=>{moveFoward()}}>
          <span>Foward</span>
        </button>
        <button className ="shuffleButton" onClick={()=>{
          let array = Shuffle();
          console.log(array["currDirArr"]);
          setCurrDir(array["currDirArr"]);
          setCount(0);
          setFlip(0);
        }}> 
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

