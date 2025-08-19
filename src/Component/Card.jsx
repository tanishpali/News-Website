import React from 'react'

const Card = ({data}) => {
  console.log(data);

  const readMore =(url) =>{
    window.open(url)
  }
  return (
    <div className='cardContainer'>

      {data && data.map((curItem,index)=>{ //null check krne ke liye data && fir data map
        if(!curItem.urlToImage){
          return null
        }else{
return(
             <div className='card'>
              <img src = {curItem.urlToImage} />

              <div className='content'>
                <a className='title' onClick={() =>window.open(curItem)}>{curItem.title}</a>    
                <p>{curItem.description}</p>
                <button onClick={() =>window.open(curItem)}>Read More</button>
              </div>


              </div>
        )
        }
        
   })}

    </div>
  )
}

export default Card