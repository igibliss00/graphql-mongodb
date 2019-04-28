import React from 'react';

import './Events.css';
import Modal from '../components/Modal/Modal';
import Backdrop from '../components/Backdrop/Backdrop';

class EventsPage extends React.Component {
    state = {
        creating: false
    };

    titleElRef = React.createRef();
    priceElRef = React.createRef();
    dateElRef = React.createRef();
    descriptionElRef = React.createRef();

    startCreateEventHandler = () => {
        this.setState({
            creating: true
        });
    };

    modalConfirmHandler = () => {
        this.setState({
            creating: false
        });
        const title = this.titleElRef.current.value;
        const price = this.priceElRef.current.value;
        const date = this.dateElRef.current.value;
        const description = this.descriptionElRef.current.value;
        const event = {title, price, date, description};
        if (title.trim().length === 0 || price.trim().length === 0 || date.trim().length === 0 || description.trim().length === 0) {
            return ;
        };
    
        const requestBody = {
            query: `
            mutation {
                createEvent(userInput: {title: "${title}", price: "${price}", description: "${description}", date:"${date}"}) {
                title
                price
                description
                date
                }
            }
            `
        };
          
        fetch('http://localhost:8000/graphql', {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
            'Content-Type': 'application/json'
        }
        }).then(res => {
        if(res.status !== 200 && res.status !== 201) {
            throw new Error("Failed!");
        }
        return res.json();
        }).then(resData => {
        console.log(resData);
        if(resData.data.login.token) {
            this.context.login(
            resData.data.login.token,
            resData.data.login.userId,
            resData.data.login.tokenExpiration
            );
        }
        }).catch(err => {
        console.log(err);
        });
    }

    modalCancelHandler = () => {
        this.setState({
            creating: false
        });
    };

    render() {
        return (
            <React.Fragment>
                {this.state.creating && <Backdrop />}
                {this.state.creating && (
                    <Modal 
                        title="Add Event" 
                        canCancel 
                        canConfirm 
                        onConfirm={this.modalConfirmHandler} 
                        onCancel={this.modalCancelHandler}>
                    <form>
                        <div className="form-control">
                            <label htmlFor="title">Title</label>
                            <input type="text" id="title" ref={this.titleElRef} />
                        </div>
                        <div className="form-control">
                            <label htmlFor="price">Price</label>
                            <input type="number" id="price" ref={this.priceElRef} />
                        </div>
                        <div className="form-control">
                            <label htmlFor="date">Date</label>
                            <input type="date" id="date" ref={this.dateElRef} />
                        </div>
                        <div className="form-control">
                            <label htmlFor="description">Description</label>
                            <textarea
                            id="description"
                            rows="4"
                            ref={this.descriptionElRef}
                            />
                        </div>
                    </form>
                </Modal>)}
                <div className="events-control">
                    <p>Share your own events!</p>
                    <button className="btn" onClick={this.startCreateEventHandler}>
                        Create Event
                    </button>
                </div>
            </React.Fragment>
        )
    }
}

export default EventsPage;