<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->
<a name="readme-top"></a>
<!--
*** Thanks for checking out the Best-README-Template. If you have a suggestion
*** that would make this better, please fork the repo and create a pull request
*** or simply open an issue with the tag "enhancement".
*** Don't forget to give the project a star!
*** Thanks again! Now go create something AMAZING! :D
-->



<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->



<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/github_username/repo_name">
    <img src="images/logo.png" alt="Logo" width="80" height="80">
  </a>

<h3 align="center">Open AI Chat application</h3>

  <p align="center">
    A open ai based chat application in ReactJs and Javascript in which a user can ask his/her questions from chat input for which he/she will get answer replies
    <br />
    <a href="https://github.com/code-123-sudo/GPT"><strong>Explore the repository »</strong></a>
    <br />
    <br />
    <a href="https://github.com/code-123-sudo/GPT">View Demo</a>
    ·
    <a href="https://github.com/code-123-sudo/GPT/issues">Report Bug</a>
    ·
    <a href="https://github.com/code-123-sudo/GPT/issues">Request Feature</a>
  </p>
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

<p align="right">(<a href="#readme-top">back to top</a>)</p>



### Built With

* [![React][React.js]][React-url]

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- GETTING STARTED -->
## Getting Started

This is an example of how you may give instructions on setting up your project locally.
To get a local copy up and running follow these simple example steps.

### Prerequisites

This is an example of how to list things you need to use the software and how to install them.
* npm
  ```sh
  npm install npm@latest -g
  ```

### Installation

1. Get a free API Key from openai
2. Clone the repo
   ```sh
   git clone https://github.com/code-123-sudo/GPT.git
   ```
3. Install NPM packages
   ```sh
   npm install
   ```
4. In the root directory create a new file constants.js.Enter your API key and API_URL in `constants.js` like below
   ```js
   export const API_KEY = 'ENTER YOUR API';
   export const API_URL = "https://api.openai.com/v1/chat/completions";
   ```
5. start the server by running below command:
   ```sh
   npm start
   ```
6. if face this error -
   ```js
   ERROR in ./node_modules/@mui/system/esm/index.js Module build failed: Error: ENOENT: no such file 
   or  directory, open 'Jain GPT/final/node_modules/@mui/system/esm/index.js'
   ```
   run the following command -
   ```sh
   npm install @mui/system @emotion/react @emotion/styled  
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- USAGE EXAMPLES -->
## Usage
after installation , simply ask your question in input text box

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- ROADMAP -->
## Roadmap

- [ ] a user can ask his/her questions from chat input for which he/she will get answer replies from open ai API
- [ ] replies updating fast in the form of chunks as soon as they are fetched from server
- [ ] There is a set of default questions that user may ask by simply clicking on it, their ans is saved in mock database and is cache implemented
- [ ] A search bar to search from list of chats 
- [ ] A user can save any chat and come back to it later and continue the chat again from where he left it earlier can thus manage multiple chats simultaneously in sidebar
    - [ ] can edit chat heading
    - [ ] delete chat

See the [open issues](https://github.com/code-123-sudo/GPT/issues) for a full list of proposed features (and known issues).

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTACT -->
## Contact

Shishir Jain

Project Link: [https://github.com/code-123-sudo/GPT](https://github.com/github_username/repo_name)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<p align="right">(<a href="#readme-top">back to top</a>)</p>
