package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"net/url"
	"os"
	"strconv"
	"time"
)

type responseStruct []struct {
	Side           string `json:"side"`
	FirstPlaceCut  int    `json:"firstPlaceCut"`
	SecondPlaceCut int    `json:"secondPlaceCut"`
	ThirdPlaceCut  int    `json:"thirdPlaceCut"`
	ID             string `json:"_id"`
	ForUsers       []struct {
		ID        string `json:"_id"`
		UserName  string `json:"user_name"`
		BetAmount int    `json:"betAmount"`
	} `json:"forUsers"`
	AgainstUsers []struct {
		ID        string `json:"_id"`
		UserName  string `json:"user_name"`
		BetAmount int    `json:"betAmount"`
	} `json:"againstUsers"`
	CommonBets []struct {
		ID        string `json:"_id"`
		UserName  string `json:"user_name"`
		BetAmount int    `json:"betAmount"`
		Bet       int    `json:"bet"`
	} `json:"commonBets"`
	Title    string `json:"title"`
	Deadline string `json:"deadline"`
	UserName string `json:"user_name"`
	Type     string `json:"type"`
	V        int    `json:"__v"`
}

func getLoginSecret() string {
	content, err := ioutil.ReadFile("../.env")
	if err != nil {
		sendErrorEmail("Error getting ReqSecret from env file")
		log.Fatal(err)
	}
	text := string(content)
	return text[11:60]
}

func sendErrorEmail(errMessage string) {
	reqSecret := getLoginSecret()
	_, err := http.PostForm("http://localhost:9000/tasks/sendEmail", url.Values{"secret": {reqSecret}, "subject": {"Error in goFuncs"}, "errorMessage": {errMessage}})
	if err != nil {
		log.Fatal(err)
	}
}

func getBigButtonPresses() string {
	content, err := ioutil.ReadFile("../bigButton.txt")
	if err != nil {
		sendErrorEmail("Error getting big Button.txt")
		return ""
	}
	return string(content)
}

func endBigButtonBet(secret string) {
	buttonPresses := getBigButtonPresses()
	if len(buttonPresses) > 0 {
		res, err := http.PostForm("http://localhost:9000/bets/bigButtonBet", url.Values{"secret": {secret}, "action": {"end"}, "result": {buttonPresses}})
		if err != nil || res.StatusCode != 200 {
			body, _ := ioutil.ReadAll(res.Body)
			fmt.Println(string(body))
			sendErrorEmail("Error reaching API endpoint /bets/bigButtonBet")
			return
		}
	}
}

func startBigButtonBet(secret string) {
	res, err := http.PostForm("http://localhost:9000/bets/bigButtonbet", url.Values{"secret": {secret}, "action": {"start"}})
	if err != nil || res.StatusCode != 200 {
		// sendErrorEmail("Error reaching API endpoint /bets/bigButtonBet")
		body, _ := ioutil.ReadAll(res.Body)
		fmt.Println(string(body))
		return
	}
	body, err := ioutil.ReadAll(res.Body)
	fmt.Println(string(body))
}

func checkForOutOfDateBets(secret string) {
	currTime := time.Now().UnixNano()
	res, err := http.PostForm("http://localhost:9000/bets/getAllBetsDev", url.Values{"secret": {secret}})
	body, _ := ioutil.ReadAll(res.Body)
	if err != nil || res.StatusCode != 200 {
		sendErrorEmail("Error reaching API endpoint /bets/bigButtonBet")
		log.Fatal(err)
	} else {

		var responseJSON responseStruct
		json.Unmarshal(body, &responseJSON)
		for _, val := range responseJSON {
			deadlineVal, err := strconv.ParseInt(val.Deadline, 10, 64)
			if err != nil {
				log.Fatal(err)
			}

			// If it's 24 hours past the deadline and it's not been concluded
			// punish the person who made the bet and pay back winnings
			if deadlineVal+86400000 < currTime {
				fmt.Println(val.ID)
				res, err := http.PostForm("http://localhost:9000/bets/betExpired", url.Values{"secret": {secret}, "username": {val.UserName}, "betID": {val.ID}})
				if err != nil || res.StatusCode != 200 {
					sendErrorEmail("Error trying to punish " + val.UserName + " for expired bet:" + val.ID)
				} else {
					fmt.Println("Punished user " + val.UserName + " for expired bet: " + val.ID)
				}
			}
		}
	}
}

func main() {
	reqSecret := getLoginSecret()

	if len(os.Args) > 1 {
		if os.Args[1] == "redButton" {
			if os.Args[2] == "end" {
				endBigButtonBet(reqSecret)
			} else if os.Args[2] == "start" {
				startBigButtonBet(reqSecret)
			}
		} else if os.Args[1] == "checkBets" {
			checkForOutOfDateBets(reqSecret)
		}

	}
}
