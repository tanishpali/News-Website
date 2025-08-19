import React,{useEffect, useState} from 'react'  //rafce-->react arrow function component export
import Card from './Card'

const Newsapp = () => {

  const[search,setSearch] = useState("india") 
const[newsData,setNewsData] = useState(null)
  const API_KEY = "486ba8fb6dd54c2bb4862220c6c4886d";

  const getData = async() =>{                //promise will happen data-- 1.data mileg 2.data pending 3.data nhi milenga to resolve it we will use async await
        const response = await fetch(`https://newsapi.org/v2/everything?q=${search}&apiKey=${API_KEY}`)    //APi_Key==>template literal  //Js fetch method to fetch data from api
        const jsonData = await response.json(); 
        console.log(jsonData.articles);
        setNewsData(jsonData.articles);
  }                                  
  

  useEffect(()=>{                          
       
      getData()   
  },[])



  const handleInput = (e) => {
    console.log(e.target.value);
    setSearch(e.target.value); 
  }


  const userInput =(event)=>{
    setSearch(event.target.value)

  }
  return (
    <div>



      <nav>
        <div>
          <h1>Trendy News</h1>
        </div>
        <ul>

          <a>All News</a>
          <a>Trending</a>

        </ul>

        <div className='searchBar'>
          <input type="text" placeholder='Search News' value ={search} onChange={handleInput} /> 
          <button onClick={getData}>Search</button>
        </div>
      </nav>

      <div>
        <p className='head'>Stay Updated with TrendyNews</p>
      </div>
    
<div className='categoryBtn'>
  <button onClick={userInput} value="sports">Sports</button>
  <button onClick={userInput} value="politics"> Politics</button>
  <button onClick={userInput} value="entertainment">Entertainment</button>
  <button onClick={userInput} value="health">Health</button>
  <button onClick={userInput} value="fitness">Fitness</button>
</div>


<div>
  {newsData? <Card data ={newsData}/>:null}

</div>



            
    </div>
  )
}

export default Newsapp