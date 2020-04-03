import React from 'react';

export default class QRCode extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            requestDone: false,
            shortenedLink: ''
        }
    }

    componentDidMount() {
        const { url } = this.props;
        let requestUrl = '';
        if (url.includes("localhost")) {
            requestUrl = 'https://iamcathal.github.io';
            console.log("does incude")
        } else {
            console.log("doesnt include")
            requestUrl = url;
        }
        // requestUrl = 'https://iamcathal.github.io'
        console.log(requestUrl)
        fetch('http://localhost:9000/shortenLink', {
            method: 'POST',
            crossDomain: true,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
              },
            body: JSON.stringify({
                url: requestUrl
            })
        }).then((res) => res.json())
        .then((res) => {
            console.log(res);
            if (res.status === 'success') {
                this.setState({requestDone: true, shortenedLink: unescape(res.body)})
            }
        })
    }

    render(){
        const {url} = this.props
        const {shortenedLink, requestDone } = this.state;
        let requestUrl = `https://api.qrserver.com/v1/create-qr-code/?size=2000x200&qzone=0&margin=0&data=${url}`;
        if (requestDone) {
            return(
                <div styles={{borderRadius:'8px'}}>
                    <img src={requestUrl} style={styles.image} alt='Profile'></img>
                    <p styles={{fontWeight:'bold'}}>{ shortenedLink } </p>
                </div>            
            );
        } else {
            // render liquid loader
            return(
                <div>
                    liquid loader here
                </div>
            )
        }
    }
}

const styles = {
    image: {
        padding: '8px',
        width: '220px',
        height: '220px'
    }
}