import React from 'react';
import Card from '../card/card';
import '../common.css';
import './list.css';
import deleteIcon from '../assets/delete-icon.png'
import addIcon from '../assets/add-icon.png'
import { uuid } from '../util';
import Modal from '../modal/modal';

export default class List extends React.Component {
    constructor(props) {
        super(props);
        const localStorageCards = localStorage.getItem(this.props.uuid);
        const cards = JSON.parse(localStorageCards);
        this.state = {
            cards: cards? cards : [],
            isAddCardOpen: false,
            newCard: undefined,
        }
        this.onAddCard = this.onAddCard.bind(this);
        this.onCardDelete = this.onCardDelete.bind(this);
        this.allowDrop = this.allowDrop.bind(this);
        this.drop = this.drop.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    componentDidUpdate() {
        // If on update we see a card to be deleted, invoke card delete
        // This happens post the drag and drop, to delete card from source
        if (this.props.deleteUuid) {
            this.onCardDelete(this.props.deleteUuid);
        }
    }

    /**
     * Adds a new card item
     * @param event - react synthetic event.
     * @param card - card item to be added.
     */
    onAddCard(event, card) {
        this.setState(prevState => {
            prevState.cards.push(card);
            prevState.cards.sort((first, second) => new Date(second.createTime) - new Date(first.createTime));
            localStorage.setItem(this.props.uuid, JSON.stringify(prevState.cards));
            return { lists: prevState.cards };
        });
    }

    allowDrop(event) {
        event.preventDefault();
    }

    /**
     * Receives data for the dropped card from src List
     * @param event - react synthetic event.
     */
    drop(event) {
        event.preventDefault();
        const cardString = event.dataTransfer.getData("text");
        const newCard = JSON.parse(cardString);
        if (newCard.listUuid !== this.props.uuid) {
            this.onAddCard(undefined, newCard);
            this.props.deleteCardFromList(newCard.listUuid, newCard.uuid);
        }
    }

    /**
     * Deletes the card with the given uuid
     * @param uuid - uuid of card to be deleted
     */
    onCardDelete(uuid) {
        let indexOfCard = this.state.cards.findIndex(
            (card, index) => card.uuid === uuid);
        if (indexOfCard > -1) {
            this.setState(prevState => {
                prevState.cards.splice(indexOfCard, 1);
                localStorage.setItem(this.props.uuid, JSON.stringify(prevState.cards));
                return { cards: prevState.cards };
            });
        }
    }

    /**
     * Opens the add card Modal
     */
    openModal () { 
        this.setState({open: true});
        document.
        ReactDOM.render(this.modal(), document.getElementById("body"))
    }

    /**
     * toggles the add card modal to open/close
     */
    toggleModal() {
        this.setState(prevState => {
            return { ...prevState, isAddCardOpen: !prevState.isAddCardOpen};
        });
    }

    /**
     * toggles the add card modal to open/close
     *  @param event - react synthetic event.
     *  @param key - property key for which the value needs to be set
     */
    handleChange(event, key) {
        this.setState(prevState => { 
            if (prevState.newCard) {
                prevState.newCard[key] = event.target.value;
            } else {
                prevState.newCard = {
                    [key]: event.target.value,
                }
            }
        });
    }

    /**
     * Commits add Card form values to storage and updates state.
     */
    onSubmit() {
        const card = {
                ...this.state.newCard,
                createTime: new Date().toLocaleString(),
                uuid: uuid()
            };
        this.onAddCard(undefined, card);
        this.toggleModal();
        this.setState(prevState => { return {...prevState, newCard: undefined}});
    }
      

    render() {
        return (
            <div className="card trello-list" onDragOver={this.allowDrop} onDrop={this.drop}>
                <div className="row">
                    <h5 className="col-10 text-center">{this.props.title}</h5>
                    <img className="delete-icon"
                        onClick={() => this.props.onListDelete(this.props.uuid)}
                        src={deleteIcon}/>
                </div>
                <hr className="divider"/>
                <div className="card-list">
                    {this.state.cards
                        .sort((first, second) => first.createTime < second.createTime)
                        .map((card) =>
                        <Card key={card.uuid}
                            listUuid={this.props.uuid}
                            uuid={card.uuid}
                            title={card.title}
                            description={card.description}
                            createTime={card.createTime}
                            onCardDelete={this.onCardDelete}
                        />
                    )}
                </div>
                <img className="add-icon" onClick={this.toggleModal} src={addIcon}/>
                <div>
                    { this.state.isAddCardOpen && 
                        (<Modal onSubmit={this.onSubmit}  toggleModal={this.toggleModal}>
                            <h4>{"Add Card"}</h4>
                            <div className="input-section">
                                <div> {"Title:"}</div>
                                <input required="required" className="title-text" type="text" onChange={(e) => this.handleChange(e, 'title')} />
                                <div> {"Description:"}</div>
                                <textarea className="desc-text" type="text" onChange={(e) => this.handleChange(e, 'description')} />
                            </div>
                        </Modal>)}
                </div>
            </div>
        )
    }
}
