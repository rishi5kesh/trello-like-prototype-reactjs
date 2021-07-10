import React from 'react';
import List from '../list/list';
import '../common.css';
import { uuid, genericDelete } from '../util';
import Modal from '../modal/modal';
import ReactDOM from 'react-dom';


export default class Board extends React.Component {
    constructor(props) {
        super(props);
        const localStorageList = localStorage.getItem('trelloList');
        const lists = JSON.parse(localStorageList);
        this.state = {
            lists: lists? lists : [],
            delete: {
                listUuid: undefined,
                cardUuid: undefined
            },
            isAddListOpen: false,
            newListName: undefined,             
        }
        this.onAddList = this.onAddList.bind(this);
        this.onListDelete = this.onListDelete.bind(this);
        this.deleteCardFromList = this.deleteCardFromList.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    /**
     * Adds a new list item
     * @param event - react synthetic event.
     */
    onAddList(event) {
        this.setState(prevState => {
            let title;
            if (this.state.newListName) {
                title = this.state.newListName;
            } else {
                title = 'List ' + (prevState.lists.length + 1);
            }
            prevState.lists.push({
                title: title,
                uuid: uuid(),
            })
            localStorage.setItem('trelloList', JSON.stringify(prevState.lists));
            return { ...prevState, lists: prevState.lists };
        });
    }

    /**
     * Deletes a list item
     * @param uuid - uuid of the list to delete.
     */
    onListDelete(uuid) {
        let indexOfList = this.state.lists.findIndex(
            (list, index) => list.uuid === uuid);
        if (indexOfList > -1) {
            this.setState(prevState => {
                prevState.lists.splice(indexOfList, 1);
                localStorage.setItem('trelloList', JSON.stringify(prevState.lists));
                return { ...prevState, lists: prevState.lists };
            });
        }
    }

    /**
     * Invokes delete card on child list of matching listUUid
     * @param listUuid - uuid of the list containing card.
     * @param uuid - uuid of the card to delete.
     */
    deleteCardFromList(listUuid, uuid) {
        this.setState(prevState => {
            prevState.delete = {
                listUuid: listUuid,
                cardUuid: uuid
            }
            return { ...prevState, delete: prevState.delete };
        });
    }

    /**
     * Toggles open or close of Add list modal
     */
    toggleModal() {
        this.setState(prevState => {
            return { ...prevState, isAddListOpen: !prevState.isAddListOpen};
        });
    }

    /**
     * Sets the form values to state
     * @param event - react synthetic event.
     */
    handleChange(event) {
        this.setState(prevState => { return { ...prevState, newListName: event.target.value }});
    }

    /**
     * Commits add list form values to storage and updates state.
     */
    onSubmit() {
        this.onAddList();
        this.toggleModal();
        this.setState(prevState => { return {...prevState, newListName: undefined}});
    }
    

    render() {
        return (
            <div>
                <h4 className="col-10 text-center">Trello Board</h4>
                <hr className="divider"/>
                <button className="icon-action" onClick={this.toggleModal}>{'Add List'}</button>
                <div className="d-flex lists">
                    {this.state.lists.map((list) =>
                        <List key={list.uuid}
                            uuid={list.uuid}
                            title={list.title}
                            onListDelete={this.onListDelete}
                            deleteUuid=
                                {(list.uuid === this.state.delete.listUuid)?
                                    this.state.delete.cardUuid : undefined}
                            deleteCardFromList={this.deleteCardFromList}
                        />
                    )}
                </div>
                <div>
                    { this.state.isAddListOpen && 
                        (<Modal onSubmit={this.onSubmit}  toggleModal={this.toggleModal}>   
                            <h4>{"Add List"}</h4>
                            <div className="input-section">
                                <div> {"Title:"}</div>
                                <input required="required" type="text" value={this.state.newListName} onChange={this.handleChange} />
                            </div>
                        </Modal>)}
                </div>
            </div>
        )
    }
}
