package main

import (
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"net/url"
	"os"
)

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
	_, err := http.PostForm("http://localhost:9000/tasks/sendEmail", url.Values{"secret": {reqSecret}, "subject": {"Error finalising big red button bet"}, "errorMessage": {errMessage}})
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

	// matchPattern := regexp.MustCompile(`("betID":"){1}`)
	// responseSlice := matchPattern.Split(string(body), -1)
	// betIDString := responseSlice[len(responseSlice)-1]
	// betID := betIDString[:len(betIDString)-2]

}

func main() {
	reqSecret := getLoginSecret()

	if len(os.Args) > 1 {
		if os.Args[1] == "end" {
			endBigButtonBet(reqSecret)
		} else if os.Args[1] == "start" {
			startBigButtonBet(reqSecret)
		}
	}
}
