import React from 'react';
import './card.css';
import '../common.css';
import deleteIcon from '../assets/delete-icon.png'

export default class Card extends React.Component {
    constructor(props) {
        super(props);
        this.drag = this.drag.bind(this);
    }

    /**
     * Sends the dropped card to target list
     * @param event - react synthetic event.
     */
    drag(event) {
        const transfer = JSON.stringify(this.props);
        event.dataTransfer.setData("text", transfer);
    }

    render() {
        return (
            <div draggable={"true"} onDragStart={this.drag}
                className="card trello-card">
                <div className="row">
                    <h6 className="col-10 text-center">{this.props.title}</h6>
                    <img className="delete-icon" src={deleteIcon}
                        onClick={() => this.props.onCardDelete(this.props.uuid)}/>
                </div>
                <dl className="card-props">
                    <dt>Description:</dt>
                    <dd>{this.props.description}</dd>
                    <dt>Creation Time:</dt>
                    <dd>{this.props.createTime}</dd>
                </dl>
            </div>
        )
    }
}
