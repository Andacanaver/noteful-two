import React, {Component} from 'react'
import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import './Note.css'
import ApiContext from '../ApiContext';
import config from '../config'
import PropTypes from 'prop-types'
export default class Note extends Component {
  static contextType = ApiContext;
  static defaultProps = {
    onDeleteNote: () => {}
  }

  handleDelete = (e) => {
    e.preventDefault();
    const noteId = this.props.id

    fetch(`${config.API_ENDPOINT}/notes/${noteId}`, {
      method: 'DELETE',
      headers: {
        'content-type': 'application/json'
      }
    })
    .then(res => {
      if (!res.ok)
        //todo why isn't this working? what could i do different for it
        //return res.json().then(e => Promise.reject(e))
      return res.json()
    })
    .then(() => {
      this.context.deleteNote(noteId)
    })
    .catch(err => {
      console.log({err})
    })
  }
  

  render() {
    const {note_name, id, modified} = this.props
    return (
		<div className="Note">
			<h2 className="Note__title">
				<Link to={`/note/${id}`}>{note_name}</Link>
			</h2>
			<button
				className="Note__delete"
				type="button"
				onClick={this.handleDelete}>
				<FontAwesomeIcon icon="trash-alt" /> remove
			</button>
			<div className="Note__dates">
				<div className="Note__dates-modified">
					Modified{" "}
					<span className="Date">
						{format(modified, "DD MMM YYYY", {
							awareOfUnicodeTokens: true
						})}
					</span>
				</div>
			</div>
		</div>
	);
  }
}

Note.propTypes = {
  note_name: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
  modified: PropTypes.string.isRequired,
  onDeleteNote: PropTypes.func.isRequired
}