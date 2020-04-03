import React from 'react';

export default class ProfilePicture extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            loadingProfile: true,
            profile: ''
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
                this.setState({profile: 'https://t4.ftcdn.net/jpg/00/64/67/63/240_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg'});
            }
            else {
                this.setState({loadingProfile: false, profile: 'https://t4.ftcdn.net/jpg/00/64/67/63/240_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg'});
            }
        })
        .catch(() => {
            this.setState({loadingProfile: false, profile: 'https://t4.ftcdn.net/jpg/00/64/67/63/240_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg' });
        });
    }
    render(){
        const {loadingProfile, profile} = this.state;
        if(!loadingProfile){
            return(
                <img src={profile} style={styles.image} alt='Profile'></img>
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