// React
import React from 'react';
// Material
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import {Button} from '@material-ui/core';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import SearchIcon from '@material-ui/icons/Search';
import IconButton from '@material-ui/core/IconButton';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
// Bootstrap
import {Row, Col} from 'react-bootstrap';
// Components
import BetCard from './betCard';
// Other
import matchSorter from 'match-sorter';

export default class FindBets extends React.Component{
    constructor(props){
        super(props);
        this.state = {
          loadingBets : true,
          bets: [],
          sortedBets: [],
          errorMsg: 'Loading Bets',
          sortBy: 'popular',
          searchFlag: false
        }
    }
    componentDidMount() {
        fetch('http://localhost:9000/findNewBets', {
            method: 'POST',
            credentials: 'include',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json'
            }
          })
          .then((res) => res.json())
          .then((res) => {
            if(res.status === "success"){
                let bets = res.body;
                let sortedBets = res.body.sort((a,b) => {return (b.numberOfBettors - a.numberOfBettors)});
                this.setState({loadingBets : false, sortedBets : sortedBets, bets : bets});
            }
            else if(res.status === 'error' && res.body === 'User not signed in'){
              console.log(res.body);
              this.setState({errorMsg : 'User not signed in'});
            }
            else{
                console.log(res.body);
                this.setState({errorMsg : 'Could not retrieve bets and error occured'});
            }
          })
          .catch(err => {
            console.log(err);
            this.setState({errorMsg : 'Could not retrieve bets and error occured'});
          });
    }

    closeDialog = () => {
      this.props.closeDialog();
    }

    handleSortByChange = (evt) => {
      const {searchFlag} = this.state;
      this.sort(evt.target.value, searchFlag);
    }

    sort = (value, flag) => {
      const {bets} = this.state;
      let sortedBets = bets;
      if(!flag){
        if(value === 'popular'){
          sortedBets.sort((a, b) => {return (b.numberOfBettors - a.numberOfBettors)});
        }else{
          console.log("deadline");
          sortedBets.sort((a,b) => {return (a.deadline - b.deadline)});
        }
        this.setState({sortedBets : sortedBets, sortBy : value});
      }else{
        this.setState({sortBy : value});
      }
    }

    handleSearch = (evt) => {
      // Return bets only that match new input
      const {bets, sortBy} = this.state;
      let search = evt.target.value;
      let sortedBets = bets;
      if(search !== ''){
        sortedBets = matchSorter(sortedBets, search, { keys: ['title']});
        this.setState({searchFlag : true, sortedBets : sortedBets});
      }
      else{
        this.sort(sortBy, false);
        this.setState({searchFlag : false});
      }
    }

    render(){
      const {loadingBets, sortedBets, sortBy} = this.state;
      const {openPane} = this.props;

      if(!loadingBets){
        return (
          <Dialog open={openPane} onClose={this.closeDialog}>
            <DialogTitle>Find Bets</DialogTitle>
            <DialogContent>
            <div>
              <Row>
                <Col>
                <InputLabel id="demo-simple-select-filled-label">Sort By</InputLabel>
                  <Select
                    onChange={this.handleSortByChange}
                    value={sortBy}
                    labelId="demo-simple-select-filled-label"
                    id="demo-simple-select-filled"
                  >
                  <MenuItem value='popular'>Popularity</MenuItem>
                  <MenuItem value='deadline'>Deadline</MenuItem>
                  </Select>
                </Col>
                <Col>
                <Autocomplete
                    freeSolo
                    id="free-solo-2-demo"
                    disableClearable
                    options={sortedBets.map(bet => bet.title)}
                    onInputChange={this.handleSearch}
                    renderInput={params => (
                    <TextField
                        {...params}
                        label="Search..."
                        margin="normal"
                        variant="standard"
                        fullWidth
                        InputProps={{ ...params.InputProps, type: 'search' }}
                    />
                    )}
                />
                </Col>
              </Row>
              <Row>
                <Col>
                  {sortedBets.map((bet, index) => <Row key={index}><Col><BetCard data={bet} index={index}/></Col></Row>)}
                </Col>
              </Row>
            </div>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.closeDialog} color="primary">
                Close
              </Button>
            </DialogActions>
          </Dialog> 
        )
      }
      return null;
    }
}

const styles = {
  dialog: {
    width: '500px'
  }
}