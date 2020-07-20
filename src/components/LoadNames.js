import React from "react"


const LoadNames= ({person,handleDelete})=>{
	return(
		<>
			<p>{person.name}  {person.number}
				<button onClick={handleDelete}>delete</button></p>
		</>)
}

export default LoadNames