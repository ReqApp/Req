package main

import (
	"io/ioutil"
	"log"
	"net/http"
	"net/url"
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
	_, err := http.PostForm("http://localhost:9000/tasks/sendEmail", url.Values{"secret": {reqSecret}, "errorMessage": {errMessage}})
	if err != nil {
		log.Fatal(err)
	}

}

func main() {
	reqSecret := getLoginSecret()
	res, err := http.PostForm("http://localhost:9000/bets/endBigButtonBet", url.Values{"secret": {reqSecret}})
	if err != nil || res.StatusCode != 200 {
		sendErrorEmail("Error reaching API endpoint /bets/endBigButtonBet")
		return
	}

}
