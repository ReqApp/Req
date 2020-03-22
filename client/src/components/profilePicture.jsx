import React from 'react';

export default class ProfilePicture extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            loadingProfile: true,
            profile: '',
            errorMsg: 'Loading profile'
        }
    }
    componentDidMount(){
        const {user} = this.props;
        fetch("http://localhost:9000/users/getProfilePicture", {
            method: 'POST',
            crossDomain: true,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                "username" : user
            })
        })
        .then((res) => res.json())
        .then((res) => {
            if (res.status === "success") {
                this.setState({loadingProfile : false, profile : res.body});
            }
            else if(res.body === 'No profile picture'){
                this.setState({errorMsg : 'No profile picture'});
            }
            else {
                console.log(res);
                this.setState({errorMsg : 'Could not retrieve profile picture'});
            }
        })
        .catch((err) => {
            console.log(err);
            this.setState({errorMsg : 'Could not retrieve profile picture'});
        });
    }
    render(){
        const {loadingProfile, profile, errorMsg} = this.state;
        if(!loadingProfile){
            return(
                <img src={profile} style={styles.image}></img>
            );
        }
        // TODO add placeholder image
        return null;
    }
}

const styles = {
    image: {
        width: '200px',
        height: '200px'
    }
}