---
layout: page
title: My Projects
permalink: /proj/
---
<style type="text/css">
    #projects {
            max-width: 740px;
            min-height: 300px;
            /* display: table; */
            background-color: red;
            border-radius: 15px 15px;
            transition: all .2s ease-in-out;
            margin: 30px;
        }
        #projects:hover{
            transform: scale(1.1);
            box-shadow: rgba(0, 0, 0, 0.75) 13px 17px 26px -1px;
            border-radius: 40px 40px 40px 40px;
        }
        #name h2{
            text-align: center;
            padding: 10px 10px 10px 10px; 
        }
        #desct {
            display: flex;
            justify-content: center;
            align-items: center;
        }
        h2 {
            margin: 0.8em 0 0.5em 0;
            color: #171414;
            font-weight: bold;
            font-family: 'Ultra', sans-serif;
            font-size: 30px;
            line-height: 40px;
            text-transform: uppercase;
            text-shadow: 0 5px #928d8d, 0 6px #777;
        }
        #link {
            display: flex;
            justify-content: center;
            align-items: center;
        }
        #link img {
            width: 50px;
            height: 50px;
            transition: transform .3s ease-in-out;
            float: left;
        }
        #link img:hover {
            background-color: white;
            border-radius: 50%;
            transform: rotate(360deg);
        }
        #link .code-text {
            visibility: hidden;
            width: 120px;
            background-color: black;
            color: #fff;
            text-align: center;
            border-radius: 6px;
            padding: 5px 0;

            /* Position the tooltip */
            position: absolute;
            top: 170px;
            left: 60%;
        }
        #link:hover .code-text {
              visibility: visible;
        }
        #link2 {
            display: flex;
            justify-content: center;
            align-items: center;
        }
        #link2 img {
            width: 50px;
            float: right;
            height: 50px;
        }
        #desct p {
            font-size: 20px;
            line-height: 20px;
            margin: 20px;
        }
        #link2 .tooltiptext {
            visibility: hidden;
            width: 120px;
            background-color: black;
            color: #fff;
            text-align: center;
            border-radius: 6px;
            padding: 5px 0;

            /* Position the tooltip */
            position: absolute;
            top: 220px;
            left: 60%;
        }
        #link2:hover .tooltiptext {
              visibility: visible;
        }
        .cards {
            display: grid;
            grid-template-columns: auto;
            position: relative; 
            align-items: center;
            justify-content: center;
        }
</style>
<div class="cards">
        <!-- Project 1 -->
        <div id="projects" style="background-color: #1bfb9c;">          
            <div id = "name">
                <h2>Algorithms</h2>
            </div>
            <div id = "desct">
                <p>A real time chat application</p>
            </div>
            <div id = "link">
                <a href="https://github.com/Bhupesh-V/HeckChat">
                    <img src="github.svg" alt="Github">
                </a>
            </div>
            <div id = "link2">
                <a href="https://github.com/Bhupesh-V/HeckChat">
                    <img src="view.png" alt="Github">
                </a>
            </div>  
        </div>
        <div id="projects" style="background-color: #1bfb9c;">          
            <div id = "name">
                <h2>Algorithms</h2>
            </div>
            <div id = "desct">
                <p>A real time chat application</p>
            </div>
            <div id = "link">
                <a href="https://github.com/Bhupesh-V/HeckChat">
                    <img src="github.svg" alt="Github">
                </a>
            </div>
            <div id = "link2">
                <span class="tooltiptext">See Live Demo</span>
                <a href="https://github.com/Bhupesh-V/HeckChat">
                    <img src="view.png" alt="Github">
                </a>
            </div>  
        </div>
        <div id="projects" style="background-color: blue;">         
            <div id = "name">
                <h2>30 Seconds of C++</h2>
            </div>
            <div id = "desct">
                <p>A real time chat application</p>
            </div>
            <div id = "link">
                <span class="code-text">Source Code</span>
                <a href="https://github.com/Bhupesh-V/HeckChat">
                    <img src="github.svg" alt="Github">
                </a>
            </div>
            <div id = "link2">
                <span class="tooltiptext">Live Demo</span>
                <a href="https://github.com/Bhupesh-V/HeckChat">
                    <img src="view.png" alt="Github">
                </a>
            </div>  
        </div>
        <div id="projects" style="background-color: yellow;">           
            <div id = "name">
                <h2>30 Seconds of C++</h2>
            </div>
            <div id = "desct">
                <p>A real time chat application</p>
            </div>
            <div id = "link">
                <span class="code-text">Source Code</span>
                <a href="https://github.com/Bhupesh-V/HeckChat">
                    <img src="github.svg" alt="Github">
                </a>
            </div>
            <div id = "link2">
                <span class="tooltiptext">Live Demo</span>
                <a href="https://github.com/Bhupesh-V/HeckChat">
                    <img src="view.png" alt="Github">
                </a>
            </div>  
        </div>
    </div>