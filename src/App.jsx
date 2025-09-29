import { useState } from 'react'
import './App.css'


// function to swap card
function App() {
  const [count, setCount] = useState(0);
  const [flip,setFlip] = useState(0);
  const [histDir,setHistDir] = useState([]);
  const [currMem,setCurrMem] = useState(0);
  const [currDir,setCurrDir] = useState([]);
  

  const textDirectory = {
    // 0 is reserved as the "start" card ONLY
    0:{"FrontText": "Start", "BackText": " "},
    1:{"FrontText": "What is RPO?", "BackText": "Recovery Point Objective (RPO) measures maximum tolerable data loss, defining how often data must be backed up."},
    2:{"FrontText": "What is a symbolic link?", "BackText": "A symbolic link is a file that refers to a file system item by storing the path to it. Think of a shortcut in Windows 10/11, its the same concept. The file merely holds the path to the actual file."},
    3:{"FrontText": "What is RTO?", "BackText": "Recovery Time Objective (RTO) refers to the MAXIMUM time a system or service can be offline without unacceptable consequences."},
    4:{"FrontText": "What is FISMA?", "BackText": "Mandates federal agencies and contractors to maintain adequate cybersecurity protections for sensitive systems"},
    5:{"FrontText": "What is cryptography?", "BackText": "Crytography (or cryptology) is the science of protecting data by transforming it into a format that cannot be understood by unauthorized users. The data, though translated, needs to still be accurate, unaltered, and verifiable. "},
    6:{"FrontText": "What is PCI DSS?", "BackText": "Payment Card Industry Data Security Standard(PCI DSS) mandates secure handling of credit card data for merchants and processors"},
    7:{"FrontText": "What is SOAR?", "BackText": "Security Orchestration, Automation, and Response (SOAR) automates responses to alerts from SIEM and other sources. Administrators use runbooks and playbooks to define how to handle incidents. SOAR connects with ticketing systems, firewalls, EDRs, and more. "},
    8:{"FrontText": "What is MPLS?", "BackText": "Multiprotocol Label Switching (MPLS) is a layer 2.5 technology combining Layer 2 (Data-Link) and Layer 3 (Transportation). Assigns labels for fast packet routing without full IP lookups. Optimizes traffic flow, supports quality of service (QoS). Replaced most older WAN technologies (e.g. Frame Relay, ATM)"},
    9:{"FrontText": "What is a linux daemon?", "BackText": "Daemons are Linux services that: Start during system boot, run in the background, and are critical for the OS to function"},
    10:{"FrontText": "What is a hash function?", "BackText": "A hash function transforms data into a fixed-length output using a one-way mathematical operation (includes bitwise operations, modular arithmetic, permutation and mixing, and more). The operation is irreversible, so the original input cannot be discerned from the output."}
  }

  // The plan:
  // histDir will hold every previous card seen by the user
  //    - Once user presses "foward" button, the flashcard index (the number that points to it in textDirectory), is saved to histDir
  // currMem will be used to keep track of where the user is within histDir
  //    - If user only presses foward, currMem will stay 0
  //    - When user presses back, currMem will increase and follow the array back to front
  // e.g.
  //          Oldest                     Newest
  //         Flashcard                  Flashcard   
  //            ^                          ^
  //            |                          |
  // histDir = [1,5,2,7,3,8,0,6,3,6,8,0,10,9] , histDir length = 14 , index range: 0-13
  //            ^                          ^
  //            |                          |
  //         CurrMem = 1               CurrMem = 14
  // 
  // I keep CurrMem = 0 to indicate that no histDir searching needs to be done
  // "count" will be used to select text within textDirectory

  // Few things to ask:
  // 
  // What should happen when user presses "foward"?
  //    - Randomly chosen card appears, preferably, shouldn't be an exact copy of the previous one.
  //      To not make this too difficult, I'll only worry about not having duplicates one after the other. 
  //      Duplicates after that are fine.
  //    - Previous card index gets added to histDir. Appended to the end of histDir. 
  //      Will be done by creating a temporary variable that holds the new array before
  //      running setHistDir(newArray)
  //    - Previous card index also gets added to currDir. Before function run ends, we want to reset
  //      currDir = [] so that we can restart the randomized list. We can use histDir to avoid back-to-back duplicates
  //      
  // What should happen when user presses "back"?
  //    - First: Check to see if theres any items in histDir. We do this like checking the length of histDir. 
  //             We need histDir.length > 0 to continue. Otherwise, the "back" prompt should be ignored entirely.
  //             Since the function doesn't return any data, I will do a "return ' ' " to end the function immediately.
  //    - Next: setCurrMem(currMem+1) to establish that function should look in histDir
  //    - Next: We use setCount(CurrMem - 1)
  //   
  // How do we randomize text selection?
  //    - We can create an array as big as the amount of cards in textDirectory.
  //      We have to subtract 1 to account for the placeholder "start" flashcard. e.g. newArray.length = (textDirectory.length - 1)
  //    - We can then use the Fisher-Yates Shuffle to shuffle that array. 
  //    - We can use an additional const array "currDir" to keep track of used flashcards
  //
  // How do we ensure the illusion of infinite scrolling?
  //    - We can use currDir to keep track of used flashcards. I want to show each card once before
  //      repeating the list again but also randomized. 
  //  
  //
  //
  //

  // Function to handle card
  function SwapCard(d){ 
    // "d" for "direction", given by the buttons to indicate....well, direction.
    // 0 for "back" and 1 for "foward"

    // I'll need the length of textDirectory multiple times so I'll initalize it here.
    let textDirLength = Object.keys(textDirectory).length;
    
    // Lets start basic: seperate actions based on dir

    if(d == 0){ // "back"
      // Things we need to keep track of:
      // - currMem
      // - count
      // NO NEED TO MANIPULATE currDir or histDir in ANY way. We're only reading from histDir
      
      // A little difficult to figure out the prolem here
      // Basically the issue (before) was that I did:
      // setCurrMem(currMem+1)
      // setCount(histDir(currMem))
      //
      // Which was COMPLETELY incorrect because as explained before, histDir is to be read right to left
      // Anyways, I fixed it by accounting for that. 

      // currMem NEEDs to stay at 1 or above
      // BUT we subtract 2 to avoid newest addition to cards, just ONCE though
      // This works fine from an odd number, but NOT from an even number
      // If currMem = 0, then we subtract 2 only that once

      let histDirLength = Object.keys(histDir).length;
      let tempVar = currMem;
      
      // We need to ensure that currMem STAYs above 0 though. 
      // assume:
      //
      // length: 5;
      // currMem: 3;
      //
      //   Current
      //   position
      //      ^
      //      |
      // [1,4,5,2,6]
      //  ^
      //  |
      //  Should be able to access with currMem=5, currMem !> histDirLength. 
      //

      // Check for inital failure 
      // e.g. pressing back after one flash card
      //
      //  - currMem = 0 --> 2
      //  - histDirLength = 2 --> 0 - 1 index
      //

      // I could write paragraphs about how long it took me to figure this out....
      // But I wont:
      //
      //  - created tempVar to use for testing immediately 
      //  - checked for special case in first if-statement 
      //    (its for the first time you enter histDir, which adds the card you JUST saw, 
      //    so it warrants -2 to see the actual previous card instead of the same one again.)
      //      - Also needed to have it work ONLY once. 
      //  - Else, it acts normally UNLESS:
      //      - tempVar + 1 > histDirLength
      //      - tempVar == histDirLength
      //        ^ I probably could've combined the two, but I've had enough debugging for one small project
      //


      // I need this special case to run whenever we leave histDir again
      if(histDirLength > 2 && currMem == 0 && !((tempVar +2) > histDirLength)){
        tempVar+=2;
        setCurrMem(prev => prev + 2);
        setCount(histDir[histDirLength - (tempVar)]);
      }else{
        if(((tempVar + 1) > histDirLength)){
          // Does nothing
          console.log("ran");
        }else{
          tempVar+=1;
          if(!(tempVar == histDirLength)){
            setCurrMem(currMem + 1);
            console.log("added one");
            console.log(currMem);
            console.log(tempVar);
          }
          setCount(histDir[histDirLength-tempVar]);
        }
      }


    }else if (d == 1){ // "foward"
      // Few things to keep track of here:
      // - histDir
      // - currDir
      // - count
      // IMPORTANT: We need to consider currMem, how will the function know if we're in histDir or not?
      // We need to assume that currMem would have already been >0 by now
      if(currMem > 0){ // We'd now be looking in histDir
        // Assumes we're we're backed up and need to progress to currMem = 0
        // CRITICALLY: We SHOULD NOT update histDir OR currDir 
        // This should only help to navigate histDir, not change it in any way
        let histDirLength = Object.keys(histDir).length;
        let tempVar = currMem;

        console.log("x");
        console.log(histDir);
        console.log(currDir);
        console.log(currMem);
        console.log("x");

        // Ex. currMem = 2 --> currMem = 1 , card stays the same
        // Tempvar = 1 --> tempVar = 0
        // setCount(histDir[histDirLength - tempVar])
        // HOWEVER, the else-if condition DOESN't change the card in any way.
        
        // We're counting DOWN currMem
        tempVar-=1;

        
        if(tempVar > 0){
          setCount(histDir[histDirLength - tempVar]);
          setCurrMem(currMem - 1);
        }else if(tempVar == 0){
          setCurrMem(0);
          GetNextCard(textDirLength);
        }
      }else if(currMem == 0){
        GetNextCard(textDirLength);
      }
    }else{
      // May write more verbose logging if needed
      console.log("ERROR");
    }


  }

  //TEST
  function GetNextCard(textDirLength){
  // All variables here are declared but not initalized just for easy tracking purposes.
    let randNum;
    let tempVar;
    let tempArray;
    let tempArray2;
    // This is the NORMAL course of action. 
    // We want "count" to be a unique number each time from 1-10

    randNum = genNum(textDirLength);
    
    // e.g. randNum = 7 

    // add randNum to currDir
      // But ONLY if it isn't already in currDir
      // We will also use currDir to influence the creation of randNum
      // Will make a new function for it to reduce clutter
    tempVar = CheckCurrDir(randNum);
    if(tempVar == 1){
      let newNum;
      // number already exists within currDir. 
      // Given our structure and randNum not calculating previously chosen numbers,
      // this must mean that currDir is full. 
      // We'll use tempArray = [] as a temporary currDir
      // Then generate a new number!
      tempArray = [];
      
      newNum = genNum(textDirLength);

      tempArray.push(newNum);
      setCurrDir(tempArray);

      // We also have histDir here so it can get the new number.
      // This is less strict than for currDict as histDir will hold EVERY flash card indiscriminately
      tempArray2 = histDir;
      tempArray2.push(newNum);
      setHistDir(tempArray2);
      setCount(newNum);
    }else{
      // randNum DOESN'T conflict with currDir
      // No checks needed here
      tempArray = currDir;
      tempArray.push(randNum);
      setCurrDir(tempArray);

      tempArray2 = histDir;
      tempArray2.push(randNum);
      setHistDir(tempArray2);

      setCount(randNum);
    }
    console.log("x");
    console.log(histDir);
    console.log(currDir);
    console.log(currMem);
    console.log("x");
  }
  //TEST

  // Function to check currDir using randNum
  function CheckCurrDir(randNum){
    // Will use a counter here for checking matching amounts
    // We set to 0 with the assumption that it will only ever return 0 or 1. (there shouldn't be copies within currDir anyways)
    // If it returns anything else, then I'll flag it. Is practical and acts as a bit of debugging.
    let counter = 0;
    let currDirLength = Object.keys(currDir).length;

    // IMPORTANT DISTINCTION:
    // for...in - gets Array elements as STRINGS
    // for...of - gets array elements as the ACTUAL VALUE of the variable

                // for(let e = 0;e<(currDirLength-1);e++){
                //   if(currDir[e] == randNum){
                //     counter+=1;
                //   }
                // }
    for(let e of currDir){
      if(e == randNum){
        counter+=1;
      }
    }
  
    if(counter == 0 || counter == 1){
      return counter;
    }else{
      console.log("ERROR: currDir HOLDS COPIES OF INDEXES");
      console.log("VIEW currDir OBJECT HERE:");
      console.log(currDir);
    }
  }

  // Function to generate pseudorandom number
  function genNum(textDirLength){
    let randNum;
    let currDirLength = Object.keys(currDir).length;
    // Generate "random" (technically pseudorandom) number for "count"
    // Math.random produces # between 0 - 0.99
    // Subtract 1 from textDirLength to avoid textDirectory[0] e.g. textDirectory.length = 11, Math.floor(0.99*10) means output is between 0-9
    // Add one to the end result to avoid getting 0. Range is now 1 - (textDirectory.length-1)

    // Problem: We need to return a number in case currDir is full
    // Solution: Check to see if currDir length is same as textDirectory length - 1

    if(currDirLength == (textDirLength-1)){
      // We're under the assumption that every index is included in currDir (from 1 - textDirectory.length - 1)
      // Therefore, by returning 1, we're guaranteeing that checkCurrDir() returns 1. So we could return really any number in range. 
      // Probably a better way to do it, but I'm getting tired :(
      return 1;
    }else{
      // Problem:
      // randNum needs to NOT be a number currently in currDir

      do{
        randNum = Math.floor(Math.random()*(textDirLength-1)) + 1;
      }while(randNum == count || randNum == 0 || currDir.includes(randNum)); // Ensure randNum != previous index OR 0.

      return randNum;
    }
  }

  // Function to swap card
  function FlipCard(){
    if(flip == 1){
      setFlip(flip-1);      
    }else{
      setFlip(flip+1);
    }

    // For start card, flip back around.
    if(count == 0){
      setFlip(1);
      SwapCard(1);
    }

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
          Number of cards in set: 15
        </h4>
      </div>

      {/* Card itself */}
      <div className={`cardContainer ${flip ? "flip" : ""}`} onClick={FlipCard}>
        <FlashCard/>
      </div>

      {/* Buttons */}
      <div className='buttonContainer'>
        <button className='backButton' onClick={()=>{SwapCard(0)}}>
          <span>Back</span>
        </button>
        <button className='fowardButton' onClick={()=>{SwapCard(1)}}>
          <span>Foward</span>
        </button>
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

