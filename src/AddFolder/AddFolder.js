import React, {Component} from 'react';
import ApiContext from '../ApiContext';
import config from '../config';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CircleButton from "../CircleButton/CircleButton";
import ValidationError from '../ValidationError';
import NotefulForm from '../NotefulForm/NotefulForm';
import ErrorBoundry from '../ErrorBoundry';

export default class AddFolder extends Component {
    static contextType = ApiContext;
    constructor() {
        super();
        this.state = {
            error: null,
            name: '',
            validName: false,
            message: ''
        };
    }

    validateName = e => {
        e.preventDefault();
        if (!this.state.name) {
            this.setState({
                message: 'Folder name can not be blank',
                validName: false
            });
        } else {
            this.setState({
                message: '',
                validName: true
            }, 
            this.handleAddfolder()
        );}
    }

    handleAddfolder = () => {
        fetch(`${config.API_ENDPOINT}/folders`, {
          method: "POST",
          body: JSON.stringify({name: this.state.name}),
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
            this.context.addFolder(data);
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
        this.setState({name: name});
    }
 render() {
        return (
          <div className="add-folder">
            <NotefulForm
              className="add__folder__form"
              onSubmit={e => this.validateName(e)}>
              <ErrorBoundry>
                <h2>Add Folder</h2>
                <div className="form-group">
                  <label htmlFor="name">Enter Folder Name</label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    className="name__field"
                    onChange={e => this.nameChange(e.target.value)}
                  />
                  {this.state.validName && (
                    <div>
                      <p>{this.state.message}</p>
                    </div>
                  )}

                  <button type="submit">Save</button>
                </div>
                <CircleButton
                  tag="button"
                  role="link"
                  onClick={() => this.props.history.goBack()}
                  className="NotePageNav__back-button">
                  <FontAwesomeIcon icon="chevron-left" />
                  <br />
                  Back
                </CircleButton>
              </ErrorBoundry>
            </NotefulForm>
            {this.state.error && (
              <div>
                <p>{this.state.error}</p>
              </div>
            )}
          </div>
        );
    }
}
