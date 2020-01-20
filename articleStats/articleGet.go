package main

import (
	"encoding/csv"
	"encoding/xml"
	"fmt"
	"io"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"regexp"
	"strings"
	"sync"
	"time"
)

// This struct holds a string of
// chardata (all text data within an
// xml tag)
type GuardianItem struct {
	Data string `xml:",chardata"`
}

// Two arrays, each holds either all the titles
// or all the keywords. Each article having a Title is
// guarenteed whereas keywords are not.
type GuardianItems struct {
	Titles   []GuardianItem `xml:"url>news>title"`
	Keywords []GuardianItem `xml:"url>news>keywords"`
}

type RTItems struct {
	XMLName xml.Name `xml:"rss"`
	RTItems []RTItem `xml:"channel>item"`
}
type RTItem struct {
	Title string `xml:"title"`
}

// For CNN and BBC
type Items struct {
	XMLName xml.Name `xml:"rss"`
	Items   []Item   `xml:"channel>item"`
}
type Item struct {
	XMLName     xml.Name `xml:"item"`
	Title       string   `xml:"title"`
	Description string   `xml:"description"`
}

var CNNList = []string{"edition", "edition_world", "edition_africa", "edition_americas",
	"edition_asia", "edition_europe", "edition_meast", "edition_us", "money_news_international",
	"edition_technology", "edition_space", "edition_entertainment", "edition_sport",
	"edition_football", "edition_golf", "edition_motorsport", "edition_tennis"}
var BBCList = []string{"world", "uk", "business", "politics", "health",
	"education", "science_and_environment", "technology", "entertainment_and_arts",
	"world/africa", "world/asia", "world/europe", "world/latin_america", "world/middle_east",
	"world/us_and_canada", "england", "northern_ireland", "scotland", "wales"}
var RTList = []string{"news", "usa", "uk", "sport", "russia", "business"}

func getPage(feedUrl string, section string, siteName string, successCount *int, linesWritten *int) {
	// First see if the response header isn't a 404
	res, err := http.Head(feedUrl)
	if res.StatusCode != 200 || err != nil {
		writeErrorLog(section, siteName, feedUrl, "get")
		// fmt.Printf("[%s - %s] %d\n", siteName, section, res.StatusCode)
		return
	}
	res, err = http.Get(feedUrl)
	if err != nil {
		writeErrorLog(section, siteName, feedUrl, "get")
		log.Fatal(err)
	}
	wholeXML, err := ioutil.ReadAll(res.Body)
	if err != nil {
		log.Fatal("Error putting file into buffer\n")
	}

	if siteName == "BBC" {
		var BBCItemsStruct Items
		xml.Unmarshal(wholeXML, &BBCItemsStruct)
		lines := writeCSV("BBC", section, BBCItemsStruct)
		*linesWritten += lines
		*successCount++
		fmt.Printf("[BBC][%d/19]\t%s\n", *successCount, section)

	} else if siteName == "CNN" {
		var CNNItemsStruct Items
		xml.Unmarshal(wholeXML, &CNNItemsStruct)
		lines := writeCSV("CNN", section, CNNItemsStruct)
		*linesWritten += lines
		*successCount++
		fmt.Printf("[CNN][%d/17]\t%s\n", *successCount, section)

	} else if siteName == "RT" {
		var RTItemsStruct RTItems
		xml.Unmarshal(wholeXML, &RTItemsStruct)
		lines := writeRTCSV("RT", section, RTItemsStruct)
		*linesWritten += lines
		*successCount++
		fmt.Printf("[RT][%d/6]\t%s\n", *successCount, section)

	} else if siteName == "GUARDIAN" {
		GuardianItemsStruct := new(GuardianItems)
		xml.Unmarshal(wholeXML, GuardianItemsStruct)
		lines := writeGuardianCSV("guardian", GuardianItemsStruct)
		*linesWritten = lines
		fmt.Printf("[Guardian]\t%s\n", section)

	}
}

func writeGuardianCSV(siteName string, correctStruct *GuardianItems) int {
	// Writes the Guardian CSV file, different to the others
	// so a single function cannot be shared
	writeTo := fmt.Sprintf("%s.csv", siteName)
	currTime := time.Now()
	timeString := fmt.Sprintf("%d/%d/%d", currTime.Day(), currTime.Month(), currTime.Year())

	csvFile, err := os.OpenFile(writeTo, os.O_APPEND|os.O_CREATE|os.O_WRONLY, os.ModeAppend)
	defer csvFile.Close()
	if err != nil {
		log.Fatal(err)
	}
	csvWriter := csv.NewWriter(csvFile)
	defer csvWriter.Flush()
	fmt.Printf("[Guardian]\t%d articles scraped\n", len(correctStruct.Titles))

	for i := 0; i < len(correctStruct.Titles); i++ {
		if len(correctStruct.Keywords[i].Data) < 1 {
			correctStruct.Keywords[i].Data = "nothing"
		}
		res := []string{timeString, "guardian", strings.Trim(correctStruct.Titles[i].Data, "{}\n"), strings.Trim(correctStruct.Keywords[i].Data, "{}\n")}
		err := csvWriter.Write(res)
		if err != nil {
			log.Fatal(err)
		}
	}
	linesWritten := len(correctStruct.Titles)
	return linesWritten
}

func writeRTCSV(siteName string, section string, correctStruct RTItems) int {
	// Writes the RT CSV file, again it's not the same as the others
	// so it must have it's own function
	dontWrite := false
	writeTo := fmt.Sprintf("%s.csv", siteName)
	currTime := time.Now()
	timeString := fmt.Sprintf("%d/%d/%d", currTime.Day(), currTime.Month(), currTime.Year())

	csvFile, err := os.OpenFile(writeTo, os.O_APPEND|os.O_CREATE|os.O_WRONLY, os.ModeAppend)
	defer csvFile.Close()
	if err != nil {
		log.Fatal(err)
	}
	csvWriter := csv.NewWriter(csvFile)
	defer csvWriter.Flush()

	for i := 0; i < len(correctStruct.RTItems); i++ {
		if len(correctStruct.RTItems[i].Title) < 1 {
			dontWrite = true
		}
		if !dontWrite {
			res := []string{timeString, section, correctStruct.RTItems[i].Title}
			err := csvWriter.Write(res)
			if err != nil {
				log.Fatal("Can't write to file", err)
			}
		}
	}
	linesWritten := len(correctStruct.RTItems)
	return linesWritten
}

func writeCSV(siteName string, section string, correctStruct Items) int {
	// Writes the CSV files for both CNN and BBC
	dontWrite := false
	writeTo := fmt.Sprintf("%s.csv", siteName)
	currTime := time.Now()
	timeString := fmt.Sprintf("%d/%d/%d", currTime.Day(), currTime.Month(), currTime.Year())

	csvFile, err := os.OpenFile(writeTo, os.O_APPEND|os.O_CREATE|os.O_WRONLY, os.ModeAppend)
	defer csvFile.Close()
	if err != nil {
		log.Fatal(err)
	}
	csvWriter := csv.NewWriter(csvFile)
	defer csvWriter.Flush()

	for i := 0; i < len(correctStruct.Items); i++ {
		if len(correctStruct.Items[i].Title) < 1 {
			dontWrite = true
		}

		if !dontWrite {
			// Cleans descriptions of all html tags and attributes
			// Isn't the best way to go about doing this
			regexMatch := regexp.MustCompile(`[<](.)+[>]`)
			descString := regexMatch.ReplaceAllString(correctStruct.Items[i].Description, "")
			if len(descString) < 1 {
				res := []string{timeString, section, correctStruct.Items[i].Title, "nothing"}
				err := csvWriter.Write(res)
				if err != nil {
					log.Fatal("Can't write to file", err)
				}
			} else {
				res := []string{timeString, section, correctStruct.Items[i].Title, descString}
				err := csvWriter.Write(res)
				if err != nil {
					log.Fatal("Can't write to file", err)
				}
			}
		}
	}
	linesWritten := len(correctStruct.Items)
	return linesWritten
}

func writeErrorLog(section string, siteName string, feedUrl string, failMessage string) {
	currTime := time.Now()
	timeString := fmt.Sprintf("%d/%d/%d", currTime.Day(), currTime.Month(), currTime.Year())
	errorMessage := ""
	fmt.Printf("%s/%s/%s\n", section, siteName, failMessage)

	csvFile, err := os.OpenFile("errorLog.csv", os.O_APPEND|os.O_CREATE|os.O_WRONLY, os.ModeAppend)
	defer csvFile.Close()
	if err != nil {
		log.Fatal(err)
	}
	csvWriter := csv.NewWriter(csvFile)
	defer csvWriter.Flush()
	if failMessage == "get" {
		errorMessage = fmt.Sprintf("Failed to get RSS feed")
	} else {
		errorMessage = fmt.Sprintf("Failed to write to csv")
	}

	res := []string{timeString, siteName, section, feedUrl, errorMessage}
	err = csvWriter.Write(res)
	if err != nil {
		log.Fatal("Error writing to errorLog.csv. This is very bad")
	}
}

func scrapeBBC(id int, waitG *sync.WaitGroup, linesWritten *int) {
	var successfulScrapes int = 0
	// BBCList := []string{"world", "uk", "business", "politics", "health",
	// 	"education", "science_and_environment", "technology", "entertainment_and_arts",
	// 	"world/africa", "world/asia", "world/europe", "world/latin_america", "world/middle_east",
	// 	"world/us_and_canada", "england", "northern_ireland", "scotland", "wales"}

	for _, dir := range BBCList {
		currUrl := fmt.Sprintf("http://feeds.bbci.co.uk/news/%s/rss.xml", dir)
		getPage(currUrl, dir, "BBC", &successfulScrapes, linesWritten)
	}
	if successfulScrapes < 19 && successfulScrapes > 17 {
		log.Fatal("Failed to scrape one BBC section")
	} else if successfulScrapes < 18 {
		log.Fatal("Failed to scrape more than one BBC section")
	}
	waitG.Done()
}

func scrapeCNN(id int, waitG *sync.WaitGroup, linesWritten *int) {
	var successfulScrapes int = 0
	// CNNList := []string{"edition", "edition_world", "edition_africa", "edition_americas",
	// 	"edition_asia", "edition_europe", "edition_meast", "edition_us", "money_news_international",
	// 	"edition_technology", "edition_space", "edition_entertainment", "edition_sport",
	// 	"edition_football", "edition_golf", "edition_motorsport", "edition_tennis"}

	for _, dir := range CNNList {
		currUrl := fmt.Sprintf("http://rss.cnn.com/rss/%s.rss", dir)
		getPage(currUrl, dir, "CNN", &successfulScrapes, linesWritten)
	}
	if successfulScrapes < 17 && successfulScrapes > 15 {
		log.Fatal("Failed to scrape one CNN section")
	} else if successfulScrapes < 16 {
		log.Fatal("Failed to scrape more than one CNN section")
	}
	waitG.Done()
}

func scrapeGuardian(id int, waitG *sync.WaitGroup, linesWritten *int) {
	var successfulScrapes int = 0
	currUrl := "https://www.theguardian.com/sitemaps/news.xml"
	getPage(currUrl, "guardian", "GUARDIAN", &successfulScrapes, linesWritten)

	waitG.Done()
}

func scrapeRT(id int, waitG *sync.WaitGroup, linesWritten *int) {
	var successfulScrapes int = 0
	// RTList := []string{"news", "usa", "uk", "sport", "russia", "business"}

	for _, dir := range RTList {
		currUrl := fmt.Sprintf("https://www.rt.com/rss/%s", dir)
		getPage(currUrl, dir, "RT", &successfulScrapes, linesWritten)
	}
	if successfulScrapes < 6 && successfulScrapes > 4 {
		log.Fatal("Failed to scrape one RT section")
	} else if successfulScrapes < 5 {
		log.Fatal("Failed to scrape more than one RT section")
	}
	waitG.Done()
}

func contains(s []string, e string) bool {
	for _, a := range s {
		if a == e {
			return true
		}
	}
	return false
}

func getFrequency(sitename, directory, word string) {
	run := false
	// fmt.Printf("[%s %s %s]\n", sitename, directory, word)
	sitename = strings.ToLower(sitename)
	directory = strings.ToLower(directory)

	switch sitename {
	case "bbc":
		exists := contains(BBCList, directory)
		if exists || directory == "all" {
			run = true
		} else {
			log.Fatal("Directory does not exist")
		}
	case "CNN":
		exists := contains(CNNList, directory)
		if exists || directory == "all" {
			run = true
		} else {
			log.Fatal("Directory does not exist")
		}
	case "RT":
		exists := contains(RTList, directory)
		if exists || directory == "all" {
			run = true
		} else {
			log.Fatal("Directory does not exist")
		}
	case "GUARDIAN":
		run = true
	default:
		log.Fatal("Invalid sitename")
	}

	if run {
		count := 0
		matchPattern := regexp.MustCompile(word)

		csvFileName := fmt.Sprintf("%s.csv", strings.ToUpper(sitename))
		csvFile, err := os.Open(csvFileName)
		if err != nil {
			log.Fatal(err)
		}

		reader := csv.NewReader(csvFile)
		for {
			record, err := reader.Read()
			if err == io.EOF {
				break
			}
			if err != nil {
				log.Fatal(err)
			}
			if directory == "all" {
				match := matchPattern.FindAllStringIndex(record[2], -1)
				count += len(match)
			} else {
				if record[1] == directory {
					match := matchPattern.FindAllStringIndex(record[2], -1)
					count += len(match)
				}
			}
		}
		fmt.Printf("%d\n", count)
	}

}

func main() {
	// Uses go routines to achieve
	// faster scraping times overall

	if len(os.Args) > 1 {
		if os.Args[1] == "-s" && len(os.Args) > 3 {
			getFrequency(os.Args[2], os.Args[3], os.Args[4])
		} else {
			fmt.Printf("./articleGet -s siteName directory searchTerm")
		}
	} else {
		var waitG sync.WaitGroup
		waitG.Add(1)
		BBCLines := 0
		go scrapeBBC(1, &waitG, &BBCLines)
		waitG.Add(1)
		CNNLines := 0
		go scrapeCNN(1, &waitG, &CNNLines)
		waitG.Add(1)
		GuardianLines := 0
		scrapeGuardian(1, &waitG, &GuardianLines)
		waitG.Add(1)
		RTLines := 0
		scrapeRT(1, &waitG, &RTLines)

		// Once all go routines are completed, continue
		waitG.Wait()
		totalLines := BBCLines + CNNLines + RTLines + GuardianLines
		fmt.Printf("=======================================\nLines scraped:\n")
		fmt.Printf("BBC\t\t%d\nCNN\t\t%d\nRT\t\t%d\nGuardian\t%d\nTotal\t\t%d\n=======================================\n", BBCLines, CNNLines, RTLines, GuardianLines, totalLines)
	}

}
