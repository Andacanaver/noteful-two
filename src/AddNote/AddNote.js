import React, { Component } from "react";
import ApiContext from "../ApiContext";
import config from "../config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CircleButton from "../CircleButton/CircleButton";
import ValidationError from "../ValidationError";
import NotefulForm from "../NotefulForm/NotefulForm";
import ErrorBoundry from '../ErrorBoundry';

export default class AddNote extends Component {
    static contextType = ApiContext;

    constructor() {
        super();
        this.state = {
            noteName: {
                note_name: '',
                touched: false
            },
            noteFolder: {
                folder: '',
                touched: false
            },
            content: '',
            date_modified: new Date()
        }
    }
    
    
    handleSumbit = e => {
        e.preventDefault();
        this.handleAddNote();
    }
    
    handleAddNote = () => {
        const note = {
            note_name: this.state.noteName.note_name,
            folderId: this.state.noteFolder.folder,
            content: this.state.content,
            date_modified: this.state.date_modified
        }
       
        fetch(`${config.API_ENDPOINT}/notes`, {
          method: "POST",
          body: JSON.stringify(note),
          headers: {
            "Content-type": "application/json",
            'Accept': 'application/json'
          }
        })
        .then(res => {
            if(!res.ok) {
                throw new Error('Something went wrong');
            }
            return res
        })
        .then(res => res.json())
        .then(data => {
            this.context.addNote(data);
            console.log(data)
            console.log(this.props.history)
            this.props.history.push("/");
        })
        .catch(error => {
            this.setState({
                error: error.message
            });
            console.error(error)
        });
    }
    
    nameChange = name => {
        this.setState({noteName: {note_name: name, touched: true}});
    }
    folderChange = folder => {
        this.setState({noteFolder: {folder: folder, touched: true}});
    }
    contentChange = content => {
        this.setState({content: content})
    } 
    validateName = () => {
        const name = this.state.noteName.note_name.trim();
        if (name.length === 0) {
            return 'Name is required';
        } else if (name.length < 3) {
            return 'Name must be at least 3 characters long';
        }
    }
    
    validateFolder = () => {
        const folder = this.state.noteFolder.folder;
        if(folder === '' || folder === 0) {
            return 'Please select a folder to put the note in';
        } 
    }
    render() {
        const {folders = []} = this.context
        const folderError = this.validateFolder();
        const nameError = this.validateName();
        return(
            <div>
                <NotefulForm className='add__note__form' onSubmit={e => this.handleSumbit(e)}>
                    <ErrorBoundry>
                        <h2>Add Note</h2>
                        <div className='form-group'>
                            <label htmlFor='name'>Enter Note Name</label>
                            <input type='text' id='name' name='name' onChange={e => this.nameChange(e.target.value)}/>
                            {this.state.noteName.touched && (<ValidationError message={nameError}/>)}
                            <select id='folder-select' onChange={e => this.folderChange(e.target.value)}>
                                <option value='0'>Select a folder</option>
                                {folders.map(folder => (
                                    <option value={folder.folderId} key={folder.folderId}>{folder.folder_name}</option>
                                ))}
                            </select>
                            {this.state.noteFolder.touched && (<ValidationError message={folderError}/>)}
                            <label htmlFor='content'>
                                Enter Note Content
                            </label>
                            <input type='text' id='content' name='content' onChange={e => this.contentChange(e.target.value)}/>
                            <button 
                                type='submit'
                                disabled={
                                    this.validateFolder() ||
                                    this.validateName()
                                }
                            >Save</button>
                        </div>
                    </ErrorBoundry>
                </NotefulForm>
                <CircleButton
                    tag="button"
                    role="link"
                    onClick={() => this.props.history.goBack()}
                    className="NotePageNav__back-button">
                    <FontAwesomeIcon icon="chevron-left" />
                    <br />
                    Back
                </CircleButton>
            </div>
        )
    }
}

