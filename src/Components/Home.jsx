import React, { useEffect, useState } from 'react';
import jwtDecode from 'jwt-decode';
import axios from 'axios';
import Swal from 'sweetalert2';


export default function Home() {
let token = localStorage.getItem('userToken');
let decodedToken= jwtDecode(token);
let userID = decodedToken._id;
const [notes, setNotes] = useState([]);
const [note, setNote] = useState({
    title:'',
    desc:'',
    userID,
    token
})


async function getUserNotes()
{
    let {data} = await axios.get('https://route-egypt-api.herokuapp.com/getUserNotes',{
        headers:{
            Token:token,
            userID
        }
    })
    // console.log(data);
    if(data.message === 'success')
    {
        setNotes(data.Notes)
    }
};
useEffect(()=>{
    getUserNotes()
},[]);
// console.log(notes);

function getNote(e)
{
    let myNote = {...note};
    myNote[e.target.name] = e.target.value;
    setNote(myNote);
    // console.log(note);
};
async function addNote(e)
{
    e.preventDefault();
    let {data} = await axios.post('https://route-egypt-api.herokuapp.com/addNote',note);
    // console.log(data);
    if(data.message === 'success')
    {
        getUserNotes()
    }
};
function deleteNote(NoteID)
{
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.isConfirmed){
            axios.delete('https://route-egypt-api.herokuapp.com/deleteNote',{
            data:{
                NoteID,
                token
            }
            }).then((response)=>{
                // console.log(response);
                if(response.data.message === 'deleted')
                {
                    getUserNotes();
                    Swal.fire(
                        'Deleted!',
                        'Your file has been deleted.',
                        'success'
                      )
                }
            })
        }
      })
};
function getNoteIndex(index)
{
    // console.log(notes[index]);
    document.querySelector('#exampleModal1 input').value = notes[index].title;
    document.querySelector('#exampleModal1 textarea').value = notes[index].desc;
    setNote({
        title:notes[index].title,
        desc:notes[index].desc,
        userID,
        token,
        NoteID:notes[index]._id
    })
};

async function addUpdateNote(e)
{
    e.preventDefault();
    // console.log(note);
    let {data} = await axios.put('https://route-egypt-api.herokuapp.com/updateNote',note);
    // console.log(data);
    if(data.message === 'updated')
    {
        getUserNotes()
    }  
}
  return (
   <>
        <div className="container my-5">
                <div className="col-md-12 text-end">
                    <a className="add p-2 btn" data-bs-toggle="modal" data-bs-target="#exampleModal"><i className="fas fa-plus-circle"></i> Add New</a>
                </div>
            </div>
             {/* <!-- Add Modal --> */}
             <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <form onSubmit={addNote} id="add-form">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <input onChange={getNote} placeholder="Type Title" name="title" className="form-control" type="text" />
                                <textarea onChange={getNote} className="form-control my-2" placeholder="Type your note" name="desc" id="" cols="30" rows="10"></textarea>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                <button data-bs-dismiss="modal" type="submit" className="btn btn-info"><i className="fas fa-plus-circle"></i> Add Note</button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>

             {/* <!-- Edit Modal --> */}
             <div className="modal fade" id="exampleModal1" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <form onSubmit={addUpdateNote} id="edit-form">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button  type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <input onChange={getNote} placeholder="Type Title" name="title" className="form-control" type="text" />
                                <textarea onChange={getNote} className="form-control my-2" placeholder="Type your note" name="desc" id="" cols="30" rows="10"></textarea>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" data-dismiss="modal">Close</button>
                                <button data-bs-dismiss="modal" type="submit" className="btn btn-info">Update Note</button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>

             {/* <!-- ==========================Notes=============================== --> */}
            <div className="container">
                <div className="row">
                    {notes.map((note,index)=>{
                    return(
                        <div key={index} className="col-md-4 my-4">
                            <div className="note p-4">
                            <h3 className="float-start">{note.title}</h3>
                            <a onClick={()=>getNoteIndex(index)} data-bs-toggle="modal" data-bs-target="#exampleModal1" ><i className="fas fa-edit float-end edit"></i></a>
                            <a><i onClick={()=>deleteNote(note._id)} className="fas fa-trash-alt float-end px-3 del"></i></a>
                            <span className="clearfix"></span>
                            <p>{note.desc}</p>
                            </div>
                        </div>)
                    })}
                
                    
                </div>
            </div>

   </>
  )
}
