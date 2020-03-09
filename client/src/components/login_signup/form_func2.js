import React, { Component } from 'react';
import $ from 'jquery';

export default class Form_Func2 extends Component {
  constructor() {
    super();
    this._handleClick2 = this._handleClick2.bind(this);
  }

  componentDidMount() {
    this._handleClick2();
  }

  _handleClick2() {
    $('.form').find('input, textarea').on('keyup blur focus', function (e) {
  
      var $this = $(this),
          label = $this.prev('label');
    
        if (e.type === 'keyup') {
          if ($this.val() === '') {
              label.removeClass('active highlight');
            } else {
              label.addClass('active highlight');
            }
        } else if (e.type === 'blur') {
          if( $this.val() === '' ) {
            label.removeClass('active highlight'); 
          } else {
            label.removeClass('highlight');   
          }   
        } else if (e.type === 'focus') {
          
          if( $this.val() === '' ) {
            label.removeClass('highlight'); 
          } 
          else if( $this.val() !== '' ) {
            label.addClass('highlight');
          }
        }
    
    });
    
  }

  render() {
    return (
      <div 
        ref={a => this._acc = a} 
        onClick={this._handleClick2}>
        {this.props.children}
      </div>
    )
  }
}