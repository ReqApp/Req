import React from 'react';

export class ContactList extends React.Component{
    render(){
        return(
            <div className="short_contact_list">
                <ul>
                    <li><a href="#"> <i className="fa fa-envelope" /> reqnuig@gmail.com</a></li>
                    <li><a href="#"> <i className="fa fa-phone" /> 087-123-4560</a></li>
                </ul>
            </div>
        );
    }
}