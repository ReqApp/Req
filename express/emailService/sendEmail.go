/**
 * @license
 * Copyright Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
// [START gmail_quickstart]
package main

import (
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"strings"

	"golang.org/x/net/context"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
	"google.golang.org/api/gmail/v1"
)

// Retrieve a token, saves the token, then returns the generated client.
func getClient(config *oauth2.Config) *http.Client {
	// The file token.json stores the user's access and refresh tokens, and is
	// created automatically when the authorization flow completes for the first
	// time.
	tokFile := "token.json"
	tok, err := tokenFromFile(tokFile)
	if err != nil {
		tok = getTokenFromWeb(config)
		saveToken(tokFile, tok)
	}
	return config.Client(context.Background(), tok)
}

// Request a token from the web, then returns the retrieved token.
func getTokenFromWeb(config *oauth2.Config) *oauth2.Token {
	authURL := config.AuthCodeURL("state-token", oauth2.AccessTypeOffline)
	fmt.Printf("Go to the following link in your browser then type the "+
		"authorization code: \n%v\n", authURL)

	var authCode string
	if _, err := fmt.Scan(&authCode); err != nil {
		log.Fatalf("Unable to read authorization code: %v", err)
	}

	tok, err := config.Exchange(context.TODO(), authCode)
	if err != nil {
		log.Fatalf("Unable to retrieve token from web: %v", err)
	}
	return tok
}

// Retrieves a token from a local file.
func tokenFromFile(file string) (*oauth2.Token, error) {
	f, err := os.Open(file)
	if err != nil {
		return nil, err
	}
	defer f.Close()
	tok := &oauth2.Token{}
	err = json.NewDecoder(f).Decode(tok)
	return tok, err
}

// Saves a token to a file path.
func saveToken(path string, token *oauth2.Token) {
	fmt.Printf("Saving credential file to: %s\n", path)
	f, err := os.OpenFile(path, os.O_RDWR|os.O_CREATE|os.O_TRUNC, 0600)
	if err != nil {
		log.Fatalf("Unable to cache oauth token: %v", err)
	}
	defer f.Close()
	json.NewEncoder(f).Encode(token)
}

func main() {
	b, err := ioutil.ReadFile("credentials.json")
	if err != nil {
		log.Fatalf("Unable to read client secret file: %v", err)
	}

	// If modifying these scopes, delete your previously saved token.json.
	config, err := google.ConfigFromJSON(b, gmail.MailGoogleComScope)
	if err != nil {
		log.Fatalf("Unable to parse client secret file to config: %v", err)
	}
	client := getClient(config)

	srv, err := gmail.New(client)
	if err != nil {
		log.Fatalf("Unable to retrieve Gmail client: %v", err)
	}

	var message gmail.Message

	temp := []byte("From: 'me'\r\n" +
		"reply-to: reqnuig@gmail.com\r\n" +
		"To: " + os.Args[1] + "\r\n" +
		"Subject:" + os.Args[2] + "\r\n" +
		"Content-Type: text/html; charset=\"utf-8\"\r\n\r\n" +
		`<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
		<html style="width:100%;font-family:roboto, 'helvetica neue', helvetica, arial, sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0;">
		 <head> 
		  <meta charset="UTF-8"> 
		  <meta content="width=device-width, initial-scale=1" name="viewport"> 
		  <meta name="x-apple-disable-message-reformatting"> 
		  <meta http-equiv="X-UA-Compatible" content="IE=edge"> 
		  <meta content="telephone=no" name="format-detection"> 
		  <title>New Template</title> 
		  <!--[if (mso 16)]>
			<style type="text/css">
			a {text-decoration: none;}
			</style>
			<![endif]--> 
		  <!--[if gte mso 9]><style>sup { font-size: 100% !important; }</style><![endif]--> 
		  <!--[if !mso]><!-- --> 
		  <link href="https://fonts.googleapis.com/css?family=Roboto:400,400i,700,700i" rel="stylesheet"> 
		  <!--<![endif]--> 
		  <style type="text/css">
		@media only screen and (max-width:600px) {.st-br { padding-left:10px!important; padding-right:10px!important } p, ul li, ol li, a { font-size:16px!important; line-height:150%!important } h1 { font-size:30px!important; text-align:center; line-height:120%!important } h2 { font-size:26px!important; text-align:center; line-height:120%!important } h3 { font-size:20px!important; text-align:center; line-height:120%!important } h1 a { font-size:30px!important; text-align:center } h2 a { font-size:26px!important; text-align:center } h3 a { font-size:20px!important; text-align:center } .es-menu td a { font-size:14px!important } .es-header-body p, .es-header-body ul li, .es-header-body ol li, .es-header-body a { font-size:16px!important } .es-footer-body p, .es-footer-body ul li, .es-footer-body ol li, .es-footer-body a { font-size:14px!important } .es-infoblock p, .es-infoblock ul li, .es-infoblock ol li, .es-infoblock a { font-size:12px!important } *[class="gmail-fix"] { display:none!important } .es-m-txt-c, .es-m-txt-c h1, .es-m-txt-c h2, .es-m-txt-c h3 { text-align:center!important } .es-m-txt-r, .es-m-txt-r h1, .es-m-txt-r h2, .es-m-txt-r h3 { text-align:right!important } .es-m-txt-l, .es-m-txt-l h1, .es-m-txt-l h2, .es-m-txt-l h3 { text-align:left!important } .es-m-txt-r img, .es-m-txt-c img, .es-m-txt-l img { display:inline!important } .es-button-border { display:block!important } a.es-button { font-size:16px!important; display:block!important; border-left-width:0px!important; border-right-width:0px!important } .es-btn-fw { border-width:10px 0px!important; text-align:center!important } .es-adaptive table, .es-btn-fw, .es-btn-fw-brdr, .es-left, .es-right { width:100%!important } .es-content table, .es-header table, .es-footer table, .es-content, .es-footer, .es-header { width:100%!important; max-width:600px!important } .es-adapt-td { display:block!important; width:100%!important } .adapt-img { width:100%!important; height:auto!important } .es-m-p0 { padding:0px!important } .es-m-p0r { padding-right:0px!important } .es-m-p0l { padding-left:0px!important } .es-m-p0t { padding-top:0px!important } .es-m-p0b { padding-bottom:0!important } .es-m-p20b { padding-bottom:20px!important } .es-mobile-hidden, .es-hidden { display:none!important } .es-desk-hidden { display:table-row!important; width:auto!important; overflow:visible!important; float:none!important; max-height:inherit!important; line-height:inherit!important } .es-desk-menu-hidden { display:table-cell!important } table.es-table-not-adapt, .esd-block-html table { width:auto!important } table.es-social { display:inline-block!important } table.es-social td { display:inline-block!important } }
		.rollover:hover .rollover-first {
			max-height:0px!important;
			display:none!important;
		}
		.rollover:hover .rollover-second {
			max-height:none!important;
			display:block!important;
		}
		#outlook a {
			padding:0;
		}
		.ExternalClass {
			width:100%;
		}
		.ExternalClass,
		.ExternalClass p,
		.ExternalClass span,
		.ExternalClass font,
		.ExternalClass td,
		.ExternalClass div {
			line-height:100%;
		}
		.es-button {
			mso-style-priority:100!important;
			text-decoration:none!important;
		}
		a[x-apple-data-detectors] {
			color:inherit!important;
			text-decoration:none!important;
			font-size:inherit!important;
			font-family:inherit!important;
			font-weight:inherit!important;
			line-height:inherit!important;
		}
		.es-desk-hidden {
			display:none;
			float:left;
			overflow:hidden;
			width:0;
			max-height:0;
			line-height:0;
			mso-hide:all;
		}
		.es-button-border:hover {
			border-style:solid solid solid solid!important;
			background:#d6a700!important;
			border-color:#42d159 #42d159 #42d159 #42d159!important;
		}
		.es-button-border:hover a.es-button {
			background:#d6a700!important;
			border-color:#d6a700!important;
		}
		td .es-button-border:hover a.es-button-1 {
			background:#4540d7!important;
			border-color:#4540d7!important;
		}
		td .es-button-border-2:hover {
			background:#4540d7!important;
		}
		</style> 
		 </head> 
		 <body style="width:100%;font-family:roboto, 'helvetica neue', helvetica, arial, sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0;"> 
		  <div class="es-wrapper-color" style="background-color:#F6F6F6;"> 
		   <!--[if gte mso 9]>
					<v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t">
						<v:fill type="tile" color="#f6f6f6"></v:fill>
					</v:background>
				<![endif]--> 
		   <table class="es-wrapper" width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;padding:0;Margin:0;width:100%;height:100%;background-repeat:repeat;background-position:center top;"> 
			 <tr style="border-collapse:collapse;"> 
			  <td class="st-br" valign="top" style="padding:0;Margin:0;"> 
			   <table cellpadding="0" cellspacing="0" class="es-header" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;background-color:transparent;background-repeat:repeat;background-position:center top;"> 
				 <tr style="border-collapse:collapse;"> 
				  <td align="center" style="padding:0;Margin:0;background-image:url(https://eadorv.stripocdn.email/content/guids/CABINET_3e39c673d3575362a28b176de1250088/images/20841560930387653.jpg);background-color:transparent;background-position:center bottom;background-repeat:no-repeat;" bgcolor="transparent" background="https://eadorv.stripocdn.email/content/guids/CABINET_3e39c673d3575362a28b176de1250088/images/20841560930387653.jpg"> 
				   <!--[if gte mso 9]><v:rect xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false" style="mso-width-percent:1000;height:204px;"><v:fill type="tile" src="https://pics.esputnik.com/repository/home/17278/common/images/1546958148946.jpg" color="#343434" origin="0.5, 0" position="0.5,0" ></v:fill><v:textbox inset="0,0,0,0"><![endif]--> 
				   <div> 
					<table bgcolor="transparent" class="es-header-body" align="center" cellpadding="0" cellspacing="0" width="600" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:transparent;"> 
					  <tr style="border-collapse:collapse;"> 
					   <td align="left" style="padding:0;Margin:0;padding-top:20px;padding-left:20px;padding-right:20px;"> 
						<table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> 
						  <tr style="border-collapse:collapse;"> 
						   <td width="560" align="center" valign="top" style="padding:0;Margin:0;"> 
							<table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:separate;border-spacing:0px;border-radius:5px;" role="presentation"> 
							  <tr style="border-collapse:collapse;"> 
							   <td align="center" style="padding:0;Margin:0;font-size:0px;"><a target="_blank" href="https://stripo.email" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:roboto, 'helvetica neue', helvetica, arial, sans-serif;font-size:14px;text-decoration:underline;color:#1376C8;"><img src="https://eadorv.stripocdn.email/content/guids/CABINET_3e39c673d3575362a28b176de1250088/images/71501583785442180.png" alt style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;width:126px;height:117px;" width="126"></a></td> 
							  </tr> 
							  <tr style="border-collapse:collapse;"> 
							   <td align="center" height="65" style="padding:0;Margin:0;"></td> 
							  </tr> 
							</table></td> 
						  </tr> 
						</table></td> 
					  </tr> 
					</table> 
				   </div> 
				   <!--[if gte mso 9]></v:textbox></v:rect><![endif]--></td> 
				 </tr> 
			   </table> 
			   <table cellpadding="0" cellspacing="0" class="es-content" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;"> 
				 <tr style="border-collapse:collapse;"> 
				  <td align="center" bgcolor="transparent" style="padding:0;Margin:0;background-color:transparent;"> 
				   <table bgcolor="transparent" class="es-content-body" align="center" cellpadding="0" cellspacing="0" width="600" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:transparent;"> 
					 <tr style="border-collapse:collapse;"> 
					  <td align="left" style="Margin:0;padding-bottom:15px;padding-top:30px;padding-left:30px;padding-right:30px;border-radius:10px 10px 0px 0px;background-color:#FFFFFF;background-position:left bottom;" bgcolor="#ffffff"> 
					   <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> 
						 <tr style="border-collapse:collapse;"> 
						  <td width="540" align="center" valign="top" style="padding:0;Margin:0;"> 
						   <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-position:left bottom;" role="presentation"> 
							 <tr style="border-collapse:collapse;"> 
							  <td align="center" style="padding:0;Margin:0;"><h1 style="Margin:0;line-height:36px;mso-line-height-rule:exactly;font-family:roboto, 'helvetica neue', helvetica, arial, sans-serif;font-size:30px;font-style:normal;font-weight:bold;color:#212121;">` + os.Args[2] + `</h1></td> 
							 </tr> 
							 <tr style="border-collapse:collapse;"> 
							  <td align="center" style="padding:0;Margin:0;padding-top:20px;"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:20px;font-family:roboto, 'helvetica neue', helvetica, arial, sans-serif;line-height:30px;color:#131313;">` + os.Args[3] + `</p></td> 
							 </tr> 
						   </table></td> 
						 </tr> 
					   </table></td> 
					 </tr> 
				   </table></td> 
				 </tr> 
			   </table> 
			   <table cellpadding="0" cellspacing="0" class="es-content" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;"> 
				 <tr style="border-collapse:collapse;"> 
				  <td align="center" style="padding:0;Margin:0;"> 
				   <table bgcolor="transparent" class="es-content-body" align="center" cellpadding="0" cellspacing="0" width="600" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:transparent;"> 
					 <tr style="border-collapse:collapse;"> 
					  <td align="left" style="padding:0;Margin:0;padding-left:20px;padding-right:20px;background-position:left bottom;"> 
					   <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> 
						 <tr style="border-collapse:collapse;"> 
						  <td width="560" align="center" valign="top" style="padding:0;Margin:0;"> 
						   <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> 
							 <tr style="border-collapse:collapse;"> 
							  <td align="center" height="40" style="padding:0;Margin:0;"></td> 
							 </tr> 
						   </table></td> 
						 </tr> 
					   </table></td> 
					 </tr> 
					 <tr style="border-collapse:collapse;"> 
					  <td align="left" style="Margin:0;padding-top:5px;padding-bottom:5px;padding-left:30px;padding-right:30px;background-color:#FFFFFF;" bgcolor="#ffffff"> 
					   <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> 
						 <tr style="border-collapse:collapse;"> 
						  <td width="540" align="center" valign="top" style="padding:0;Margin:0;"> 
						   <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> 
							 <tr style="border-collapse:collapse;"> 
							  <td align="left" style="padding:0;Margin:0;"><h2 style="Margin:0;line-height:29px;mso-line-height-rule:exactly;font-family:roboto, 'helvetica neue', helvetica, arial, sans-serif;font-size:24px;font-style:normal;font-weight:bold;color:#212121;text-align:center;">The Team</h2></td> 
							 </tr> 
						   </table></td> 
						 </tr> 
					   </table></td> 
					 </tr> 
					 <tr style="border-collapse:collapse;"> 
					  <td style="padding:0;Margin:0;padding-top:5px;border-radius:0px 0px 6px 6px;background-color:#FFFFFF;" align="left" bgcolor="#ffffff"> 
					   <!--[if mso]><table width="600" cellpadding="0" cellspacing="0"><tr><td width="295" valign="top"><![endif]--> 
					   <table cellpadding="0" cellspacing="0" class="es-left" align="left" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left;"> 
						 <tr style="border-collapse:collapse;"> 
						  <td width="295" align="left" style="padding:0;Margin:0;"> 
						   <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> 
							 <tr style="border-collapse:collapse;"> 
							  <td align="left" class="es-m-txt-c" style="padding:0;Margin:0;padding-right:10px;padding-left:30px;"><h3 style="Margin:0;line-height:29px;mso-line-height-rule:exactly;font-family:roboto, 'helvetica neue', helvetica, arial, sans-serif;font-size:24px;font-style:normal;font-weight:normal;color:#0E0E0E;"><strong>Karl Gordon</strong></h3></td> 
							 </tr> 
							 <tr style="border-collapse:collapse;"> 
							  <td align="left" class="es-m-txt-c" style="padding:0;Margin:0;padding-right:10px;padding-top:15px;padding-left:30px;"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:16px;font-family:roboto, 'helvetica neue', helvetica, arial, sans-serif;line-height:24px;color:#181717;">Front-end UI/UX</p></td> 
							 </tr> 
							 <tr style="border-collapse:collapse;"> 
							  <td align="left" style="Margin:0;padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:30px;"><span class="es-button-border es-button-border-2" style="border-style:solid;border-color:#2CB543;background:#2B27C1;border-width:0px;display:inline-block;border-radius:3px;width:auto;"><a href="https://github.com/filthyhound" class="es-button es-button-1" target="_blank" style="mso-style-priority:100 !important;text-decoration:none;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:roboto, 'helvetica neue', helvetica, arial, sans-serif;font-size:18px;color:#FFFFFF;border-style:solid;border-color:#2B27C1;border-width:10px 20px;display:inline-block;background:#2B27C1;border-radius:3px;font-weight:normal;font-style:normal;line-height:22px;width:auto;text-align:center;">Github</a></span></td> 
							 </tr> 
						   </table></td> 
						 </tr> 
					   </table> 
					   <!--[if mso]></td><td width="10"></td><td width="295" valign="top"><![endif]--> 
					   <table cellpadding="0" cellspacing="0" class="es-right" align="right" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:right;"> 
						 <tr style="border-collapse:collapse;"> 
						  <td width="295" align="left" style="padding:0;Margin:0;"> 
						   <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> 
							 <tr style="border-collapse:collapse;"> 
							  <td align="left" class="es-m-txt-c" style="padding:0;Margin:0;padding-left:10px;padding-right:30px;"><h3 style="Margin:0;line-height:29px;mso-line-height-rule:exactly;font-family:roboto, 'helvetica neue', helvetica, arial, sans-serif;font-size:24px;font-style:normal;font-weight:normal;color:#161414;"><strong>Cathal O'Callaghan</strong></h3></td> 
							 </tr> 
							 <tr style="border-collapse:collapse;"> 
							  <td align="left" class="es-m-txt-c" style="padding:0;Margin:0;padding-left:10px;padding-right:10px;padding-top:15px;"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:16px;font-family:roboto, 'helvetica neue', helvetica, arial, sans-serif;line-height:24px;color:#1B1A1A;">Back-end infrastructure/Front-end UI</p></td> 
							 </tr> 
							 <tr style="border-collapse:collapse;"> 
							  <td align="left" style="padding:10px;Margin:0;"><span class="es-button-border es-button-border-2" style="border-style:solid;border-color:#2CB543;background:#2B27C1;border-width:0px;display:inline-block;border-radius:3px;width:auto;"><a href="https://iamcathal.github.io" class="es-button es-button-1" target="_blank" style="mso-style-priority:100 !important;text-decoration:none;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:roboto, 'helvetica neue', helvetica, arial, sans-serif;font-size:18px;color:#FFFFFF;border-style:solid;border-color:#2B27C1;border-width:10px 20px 10px 20px;display:inline-block;background:#2B27C1;border-radius:3px;font-weight:normal;font-style:normal;line-height:22px;width:auto;text-align:center;">Github</a></span></td> 
							 </tr> 
						   </table></td> 
						 </tr> 
					   </table> 
					   <!--[if mso]></td></tr></table><![endif]--></td> 
					 </tr> 
					 <tr style="border-collapse:collapse;"> 
					  <td align="left" style="padding:0;Margin:0;"> 
					   <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> 
						 <tr style="border-collapse:collapse;"> 
						  <td width="600" align="center" valign="top" style="padding:0;Margin:0;"> 
						   <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> 
							 <tr style="border-collapse:collapse;"> 
							  <td align="center" height="20" bgcolor="#ffffff" style="padding:0;Margin:0;"></td> 
							 </tr> 
						   </table></td> 
						 </tr> 
					   </table></td> 
					 </tr> 
					 <tr style="border-collapse:collapse;"> 
					  <td style="padding:0;Margin:0;border-radius:6px;" align="left" bgcolor="#fafafa"> 
					   <!--[if mso]><table dir="rtl" width="600" cellpadding="0" cellspacing="0"><tr><td dir="ltr" width="290" valign="top"><![endif]--> 
					   <table cellpadding="0" cellspacing="0" class="es-right" align="right" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:right;"> 
						 <tr style="border-collapse:collapse;"> 
						  <td width="290" align="left" style="padding:0;Margin:0;"> 
						   <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> 
							 <tr style="border-collapse:collapse;"> 
							  <td align="left" class="es-m-txt-c" style="padding:0;Margin:0;padding-left:10px;padding-right:30px;"><h3 style="Margin:0;line-height:29px;mso-line-height-rule:exactly;font-family:roboto, 'helvetica neue', helvetica, arial, sans-serif;font-size:24px;font-style:normal;font-weight:normal;color:#161414;"><strong>Eoin Mc Ardle</strong></h3></td> 
							 </tr> 
							 <tr style="border-collapse:collapse;"> 
							  <td align="left" class="es-m-txt-c" style="padding:0;Margin:0;padding-left:10px;padding-right:10px;padding-top:15px;"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:16px;font-family:roboto, 'helvetica neue', helvetica, arial, sans-serif;line-height:24px;color:#1B1A1A;">Back-end infrastructure</p></td> 
							 </tr> 
							 <tr style="border-collapse:collapse;"> 
							  <td align="left" style="padding:10px;Margin:0;"><span class="es-button-border es-button-border-2" style="border-style:solid;border-color:#2CB543;background:#2B27C1;border-width:0px;display:inline-block;border-radius:3px;width:auto;"><a href="https://github.com/EoinMcArdle99" class="es-button es-button-1" target="_blank" style="mso-style-priority:100 !important;text-decoration:none;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:roboto, 'helvetica neue', helvetica, arial, sans-serif;font-size:18px;color:#FFFFFF;border-style:solid;border-color:#2B27C1;border-width:10px 20px 10px 20px;display:inline-block;background:#2B27C1;border-radius:3px;font-weight:normal;font-style:normal;line-height:22px;width:auto;text-align:center;">Github</a></span></td> 
							 </tr> 
						   </table></td> 
						 </tr> 
					   </table> 
					   <!--[if mso]></td><td dir="ltr" width="20"></td><td dir="ltr" width="290" valign="top"><![endif]--> 
					   <table cellpadding="0" cellspacing="0" class="es-left" align="left" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left;"> 
						 <tr style="border-collapse:collapse;"> 
						  <td width="290" align="left" style="padding:0;Margin:0;"> 
						   <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> 
							 <tr style="border-collapse:collapse;"> 
							  <td align="left" class="es-m-txt-c" style="padding:0;Margin:0;padding-right:10px;padding-left:30px;"><h3 style="Margin:0;line-height:29px;mso-line-height-rule:exactly;font-family:roboto, 'helvetica neue', helvetica, arial, sans-serif;font-size:24px;font-style:normal;font-weight:normal;color:#0E0E0E;"><strong>Rory Sweeney</strong></h3></td> 
							 </tr> 
							 <tr style="border-collapse:collapse;"> 
							  <td align="left" class="es-m-txt-c" style="padding:0;Margin:0;padding-right:10px;padding-top:15px;padding-left:30px;"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:16px;font-family:roboto, 'helvetica neue', helvetica, arial, sans-serif;line-height:24px;color:#181717;">Front-end UI/UX</p></td> 
							 </tr> 
							 <tr style="border-collapse:collapse;"> 
							  <td align="left" style="Margin:0;padding-top:10px;padding-bottom:10px;padding-right:10px;padding-left:30px;"><span class="es-button-border es-button-border-1583775047906" style="border-style:solid;border-color:#2CB543;background:#2B27C1;border-width:0px;display:inline-block;border-radius:3px;width:auto;"><a href="https://github.com/Rorysweeney99" class="es-button es-button-1583775047890" target="_blank" style="mso-style-priority:100 !important;text-decoration:none;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:roboto, 'helvetica neue', helvetica, arial, sans-serif;font-size:18px;color:#FFFFFF;border-style:solid;border-color:#2B27C1;border-width:10px 20px;display:inline-block;background:#2B27C1;border-radius:3px;font-weight:normal;font-style:normal;line-height:22px;width:auto;text-align:center;">Github</a></span></td> 
							 </tr> 
						   </table></td> 
						 </tr> 
					   </table> 
					   <!--[if mso]></td></tr></table><![endif]--></td> 
					 </tr> 
				   </table></td> 
				 </tr> 
			   </table> 
			   <table cellpadding="0" cellspacing="0" class="es-content" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;"> 
				 <tr style="border-collapse:collapse;"> 
				  <td style="padding:0;Margin:0;background-color:transparent;" bgcolor="transparent" align="center"> 
				   <table class="es-content-body" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:#F7F7F7;" width="600" cellspacing="0" cellpadding="0" bgcolor="transparent" align="center"> 
					 <tr style="border-collapse:collapse;"> 
					  <td align="left" style="padding:0;Margin:0;padding-left:30px;padding-right:30px;background-color:#FFFFFF;" bgcolor="#ffffff"> 
					   <table cellspacing="0" cellpadding="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> 
						 <tr style="border-collapse:collapse;"> 
						  <td class="es-m-p20b" width="540" align="left" style="padding:0;Margin:0;"> 
						   <table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> 
							 <tr style="border-collapse:collapse;"> 
							  <td align="left" style="padding:0;Margin:0;padding-bottom:10px;"><h2 style="Margin:0;line-height:32px;mso-line-height-rule:exactly;font-family:roboto, 'helvetica neue', helvetica, arial, sans-serif;font-size:27px;font-style:normal;font-weight:bold;color:#212121;text-align:center;">Just can't get enough?</h2></td> 
							 </tr> 
						   </table></td> 
						 </tr> 
					   </table></td> 
					 </tr> 
					 <tr style="border-collapse:collapse;"> 
					  <td style="Margin:0;padding-top:20px;padding-bottom:20px;padding-left:30px;padding-right:30px;background-color:#FFFFFF;" bgcolor="#ffffff" align="left"> 
					   <!--[if mso]><table width="540" cellpadding="0" cellspacing="0"><tr><td width="247" valign="top"><![endif]--> 
					   <table class="es-left" cellspacing="0" cellpadding="0" align="left" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left;"> 
						 <tr style="border-collapse:collapse;"> 
						  <td width="227" valign="top" align="center" style="padding:0;Margin:0;"> 
						   <table style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:transparent;" width="100%" cellspacing="0" cellpadding="0" bgcolor="transparent" role="presentation"> 
							 <tr style="border-collapse:collapse;"> 
							  <td align="center" style="padding:0;Margin:0;padding-bottom:15px;font-size:0;"><a target="_blank" href="http://localhost:9000/bets/buyCoins" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:roboto, 'helvetica neue', helvetica, arial, sans-serif;font-size:16px;text-decoration:underline;color:#2CB543;"><img class="adapt-img" src="https://live.staticflickr.com/8015/7530559220_467224b01e_b.jpg" alt="1,000 coins" title="1,000 coins" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;width:258px;" width="227"></a></td> 
							 </tr> 
							 <tr style="border-collapse:collapse;"> 
							  <td class="es-m-txt-c" align="left" style="padding:0;Margin:0;padding-bottom:10px;"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:20px;font-family:roboto, 'helvetica neue', helvetica, arial, sans-serif;line-height:30px;color:#131313;"><strong>1,000 coins</strong></p></td> 
							 </tr> 
							 <tr style="border-collapse:collapse;"> 
							  <td class="es-m-txt-c" align="left" style="padding:0;Margin:0;"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:16px;font-family:roboto, 'helvetica neue', helvetica, arial, sans-serif;line-height:24px;color:#999999;"><s class="old-price" style="text-decoration:line-through;">€2</s></p></td> 
							 </tr> 
							 <tr style="border-collapse:collapse;"> 
							  <td class="es-m-txt-c" align="left" style="padding:0;Margin:0;padding-top:5px;"><h2 class="price" style="Margin:0;line-height:22px;mso-line-height-rule:exactly;font-family:tahoma, verdana, segoe, sans-serif;font-size:18px;font-style:normal;font-weight:bold;color:#0B5394;">€1</h2></td> 
							 </tr> 
							 <tr style="border-collapse:collapse;"> 
							  <td align="left" style="padding:0;Margin:0;padding-top:15px;"><span class="es-button-border" style="border-style:solid;border-color:#2CB543;background:#FFC80A;border-width:0px;display:inline-block;border-radius:3px;width:auto;"><a href="http://localhost:9000/bets/buyCoins" class="es-button" target="_blank" style="mso-style-priority:100 !important;text-decoration:none;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:roboto, 'helvetica neue', helvetica, arial, sans-serif;font-size:18px;color:#FFFFFF;border-style:solid;border-color:#FFC80A;border-width:10px 20px 10px 20px;display:inline-block;background:#FFC80A;border-radius:3px;font-weight:normal;font-style:normal;line-height:22px;width:auto;text-align:center;">Add to Cart</a></span></td> 
							 </tr> 
						   </table></td> 
						  <td class="es-hidden" width="20" style="padding:0;Margin:0;"></td> 
						 </tr> 
					   </table> 
					   <!--[if mso]></td><td width="237" valign="top"><![endif]--> 
					   <table class="es-left" cellspacing="0" cellpadding="0" align="left" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:left;"> 
						 <tr style="border-collapse:collapse;"> 
						  <td width="237" valign="top" align="center" style="padding:0;Margin:0;"> 
						   <table style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:transparent;" width="100%" cellspacing="0" cellpadding="0" bgcolor="transparent" role="presentation"> 
							 <tr style="border-collapse:collapse;"> 
							  <td align="center" style="padding:0;Margin:0;padding-bottom:15px;font-size:0;"><a target="_blank" href="http://localhost:3000/payment" style="-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:roboto, 'helvetica neue', helvetica, arial, sans-serif;font-size:16px;text-decoration:underline;color:#2CB543;"><img class="adapt-img" src="https://c8.alamy.com/comp/T3MJRJ/realistic-stack-of-golden-money-or-stack-of-coins-T3MJRJ.jpg" alt="10,000 coins" title="10,000 coins" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;width:260px;" width="237"></a></td> 
							 </tr> 
							 <tr style="border-collapse:collapse;"> 
							  <td class="es-m-txt-c" align="left" style="padding:0;Margin:0;padding-bottom:10px;"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:20px;font-family:roboto, 'helvetica neue', helvetica, arial, sans-serif;line-height:30px;color:#131313;"><strong>10,000 coins</strong></p></td> 
							 </tr> 
							 <tr style="border-collapse:collapse;"> 
							  <td class="es-m-txt-c" align="left" style="padding:0;Margin:0;"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-size:16px;font-family:roboto, 'helvetica neue', helvetica, arial, sans-serif;line-height:24px;color:#999999;"><s class="old-price" style="text-decoration:line-through;">€20</s></p></td> 
							 </tr> 
							 <tr style="border-collapse:collapse;"> 
							  <td class="es-m-txt-c" align="left" style="padding:0;Margin:0;padding-top:5px;"><h2 class="price" style="Margin:0;line-height:22px;mso-line-height-rule:exactly;font-family:tahoma, verdana, segoe, sans-serif;font-size:18px;font-style:normal;font-weight:bold;color:#0B5394;">€5</h2></td> 
							 </tr> 
							 <tr style="border-collapse:collapse;"> 
							  <td align="left" style="padding:0;Margin:0;padding-top:15px;"><span class="es-button-border" style="border-style:solid;border-color:#2CB543;background:#FFC80A;border-width:0px;display:inline-block;border-radius:3px;width:auto;"><a href="http://localhost:3000/payment" class="es-button" target="_blank" style="mso-style-priority:100 !important;text-decoration:none;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:roboto, 'helvetica neue', helvetica, arial, sans-serif;font-size:18px;color:#FFFFFF;border-style:solid;border-color:#FFC80A;border-width:10px 20px 10px 20px;display:inline-block;background:#FFC80A;border-radius:3px;font-weight:normal;font-style:normal;line-height:22px;width:auto;text-align:center;">Add to Cart</a></span></td> 
							 </tr> 
						   </table></td> 
						 </tr> 
					   </table> 
					   <!--[if mso]></td><td width="20"></td><td width="36" valign="top"><![endif]--> 
					   <table cellpadding="0" cellspacing="0" class="es-right" align="right" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;float:right;"> 
						 <tr style="border-collapse:collapse;"> 
						  <td width="36" align="left" style="padding:0;Margin:0;"> 
						   <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> 
							 <tr style="border-collapse:collapse;"> 
							  <td align="center" style="padding:0;Margin:0;display:none;"></td> 
							 </tr> 
						   </table></td> 
						 </tr> 
					   </table> 
					   <!--[if mso]></td></tr></table><![endif]--></td> 
					 </tr> 
				   </table></td> 
				 </tr> 
			   </table> 
			   <table cellpadding="0" cellspacing="0" class="es-content" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;"> 
				 <tr style="border-collapse:collapse;"> 
				  <td align="center" style="padding:0;Margin:0;"> 
				   <table bgcolor="transparent" class="es-content-body" align="center" cellpadding="0" cellspacing="0" width="600" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:transparent;"> 
					 <tr style="border-collapse:collapse;"> 
					  <td align="left" style="padding:0;Margin:0;background-position:left top;"> 
					   <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> 
						 <tr style="border-collapse:collapse;"> 
						  <td width="600" align="center" valign="top" style="padding:0;Margin:0;"> 
						   <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> 
							 <tr style="border-collapse:collapse;"> 
							  <td align="center" height="40" bgcolor="transparent" style="padding:0;Margin:0;"></td> 
							 </tr> 
						   </table></td> 
						 </tr> 
					   </table></td> 
					 </tr> 
				   </table></td> 
				 </tr> 
			   </table> 
			   <table cellpadding="0" cellspacing="0" class="es-footer" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;background-color:#F6F6F6;background-repeat:repeat;background-position:center top;"> 
				 <tr style="border-collapse:collapse;"> 
				  <td align="center" style="padding:0;Margin:0;background-image:url(https://eadorv.stripocdn.email/content/guids/CABINET_3e39c673d3575362a28b176de1250088/images/31751560930679125.jpg);background-position:left bottom;background-repeat:no-repeat;" background="https://eadorv.stripocdn.email/content/guids/CABINET_3e39c673d3575362a28b176de1250088/images/31751560930679125.jpg"> 
				   <table bgcolor="#31cb4b" class="es-footer-body" align="center" cellpadding="0" cellspacing="0" width="600" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:transparent;"> 
					 <tr style="border-collapse:collapse;"> 
					  <td align="left" style="padding:0;Margin:0;background-position:left top;"> 
					   <table cellpadding="0" cellspacing="0" width="100%" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> 
						 <tr style="border-collapse:collapse;"> 
						  <td width="600" align="center" valign="top" style="padding:0;Margin:0;"> 
						   <table cellpadding="0" cellspacing="0" width="100%" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;"> 
							 <tr style="border-collapse:collapse;"> 
							  <td align="center" height="40" style="padding:0;Margin:0;"></td> 
							 </tr> 
						   </table></td> 
						 </tr> 
					   </table></td> 
					 </tr> 
				   </table></td> 
				 </tr> 
			   </table></td> 
			 </tr> 
		   </table> 
		  </div>  
		 </body>
		</html>`)

	message.Raw = base64.StdEncoding.EncodeToString(temp)
	message.Raw = strings.Replace(message.Raw, "/", "_", -1)
	message.Raw = strings.Replace(message.Raw, "+", "-", -1)
	message.Raw = strings.Replace(message.Raw, "=", "", -1)

	fmt.Println("")

	_, err = srv.Users.Messages.Send("me", &message).Do()
	if err != nil {
		log.Fatalf("Unable to send. %v", err)
	}
}
