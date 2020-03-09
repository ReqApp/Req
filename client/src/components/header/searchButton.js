import React,{Component} from 'react';

export class SearchButton extends React.Component{
    render(){
        return(
            <div className="search_button">
                <a href="#">
                    <i className="ti-search" />
                </a>
            </div>
        );
    }
}