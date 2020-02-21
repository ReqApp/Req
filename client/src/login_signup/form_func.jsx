import React, { Component } from 'react';
import $ from 'jquery';

export default class Form_Func extends Component {
  constructor() {
    super();
    this._handleClick = this._handleClick.bind(this);
  }

  componentDidMount() {
    this._handleClick();
  }

  _handleClick() {
    $('.tab a').on('click', function (e) {
      
      e.preventDefault();
      
      $(this).parent().addClass('active');
      $(this).parent().siblings().removeClass('active');
      
      var target = $(this).attr('href');
    
      $('.tab-content > div').not(target).hide();
      
      $(target).fadeIn(600);
      
    });
  }

  render() {
    return (
      <div 
        ref={a => this._acc = a} 
        onClick={this._handleClick}>
        {this.props.children}
      </div>
    )
  }
}