import React, { useState ,useEffect} from "react"
import LoadNames from "./components/LoadNames"
import contactService from "./services/contacts"
import Notification from "./components/Notification"

const App = () => {
	const [persons, setPersons] = useState([
	])
	const [ newName, setNewName ] = useState("")
	const [ newNumber, setNewNumber ] = useState("")
	const [ filter, setNewFilter ] = useState("")
	const [notification, setNewNotification] = useState(null) 

	const handleNameChange= (event)=>{setNewName(event.target.value)
	}
	const handleNumberChange= (event)=>{setNewNumber(event.target.value)
	}
	const handleFilterChange= (event)=>{setNewFilter(event.target.value)
	}

	const HandleAddName= (event)=>{
		event.preventDefault()
		const found = persons.find(person=> person.name === newName )
		console.log("found person" , found)
		const addedName = {
			name: newName,
			number: newNumber
		}
		//change if add/update contact.
		if(found!== null && found !== undefined){
			const confirmation = window.confirm(`${newName} is already added to phonebook \n Would you like to replace the old number with a new one?`)
			if(confirmation){
				contactService.update(found.id, addedName)
					.then(returnedContact=>{
						console.log("updated contacts", returnedContact)
						setPersons(persons.map(person=> person.id !== found.id? person: returnedContact))
						setNewNotification(`Changed number of ${found.name}`)
					})
				setNewName("")
				setNewNumber("")
			}
			return
		}
		contactService.create(addedName)
			.then(returnedName=>{
				setPersons(persons.concat(returnedName))
				setNewNotification(`Added ${addedName.name}`)
			})
			.catch(error=>{
				//console.log('error printed here', error.response.data.error);
				setNewNotification(error.response.data.error)
			})
        
		setNewName("")
		setNewNumber("")
	}

	const handleDeleteOf= (name)=>{
		const result = window.confirm(`Delete ${name.name}?`)
		if(result){
			contactService.deleteContact(name.id)
			setPersons(persons.filter(p => p.id !==name.id)) 
			setNewNotification(`Delete ${name.name}`) 
		}
	}


	const hook= () =>{
		contactService.getAll()
			.then(returnedContacts=>{
				setPersons(returnedContacts)
			})
	}

	useEffect(hook,[])
    
	const ContactsToShow = (filter === "")? persons
		: persons.filter((person)=>{ 
			return person.name.toLowerCase().indexOf(filter.toLowerCase()) !==-1
		})
	return (
		<div>
			<h2>Phonebook</h2>
			<Notification message={notification}/>
			<div>
				<p>filter shown with
					<input 
						value={filter}
						onChange={handleFilterChange}/>
				</p>
			</div>

			<h2>Add a new</h2>
			<form onSubmit={HandleAddName}>
				<div>
                    name: <input value={newName}
						onChange={handleNameChange}/>
					<br/>
                    number: <input value= {newNumber}
						onChange={handleNumberChange}/>
				</div>
				<div>
					<button type="submit" >add</button>
				</div>
			</form>
			<h2>Numbers</h2>
			{ContactsToShow.map((person)=>{
				return <LoadNames key={person.name+person.number} 
					person={person} 
					handleDelete={()=>{
						handleDeleteOf(person)}}
				/>
			})}
		</div>
	)
}

export default App
