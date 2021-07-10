import React from 'react';
import './modal.css';

class Modal extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="overlay">
        <div className="content">
            <form onSubmit={this.props.onSubmit}>
              {this.props.children}
              <div  className="modal-buttons">
                <button className="modal-button" type="submit">{"Submit"}</button>
                <button className="modal-button" onClick={this.props.toggleModal}>{"Close"}</button>
              </div>
            </form>
        </div>
      </div>
    );
  };
}

export default Modal;
