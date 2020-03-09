import React,{Component} from 'react'

export class HeaderSocialLinks extends React.Component{
    render(){
        return(                
        <div className="social_media_links">
            <a href="#">
                <i className="fa fa-linkedin" />
            </a>
            <a href="#">
                <i className="fa fa-facebook" />
            </a>
            <a href="#">
                <i className="fa fa-google-plus" />
            </a>
        </div>
      );
    }
}