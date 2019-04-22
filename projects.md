---
layout: page
title: My Projects
permalink: /projects/
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
        <div id="projects" style="background-color: #3172CA;">          
            <div id = "name">
                <h2>30 Seconds of C++</h2>
            </div>
            <div id = "desct">
                <p>A collection of STL (Standard Template Library) features of C++ which can be learned in 30 seconds or less.</p>
            </div>
            <div id = "link">
                <span class="code-text">Source Code</span>
                <a href="https://github.com/Bhupesh-V/30-seconds-of-cpp">
                    <i class="svg-icon github"></i>
                </a>
            </div>
            <div id = "link2">
                <span class="tooltiptext">Live Demo</span>
                <a href="http://bhupeshv.me/30-seconds-of-cpp/">
                    <img src="https://raw.githubusercontent.com/Bhupesh-V/Bhupesh-V.github.io/master/images/view.png" alt="Github">
                </a>
            </div>  
        </div>
        <div id="projects" style="background-color: #dcd62c;">          
            <div id = "name">
                <h2>HeckChat</h2>
            </div>
            <div id = "desct">
                <p>Real Tme Chat App, perfect for small talks</p>
            </div>
            <div id = "link">
                <span class="code-text">Source Code</span>
                <a href="https://github.com/Bhupesh-V/HeckChat">
                    <i class="svg-icon github"></i>
                </a>
            </div>
            <div id = "link2">
                <span class="tooltiptext">Live Demo</span>
                <a href="https://heckchat.herokuapp.com/">
                    <img src="https://raw.githubusercontent.com/Bhupesh-V/Bhupesh-V.github.io/master/images/view.png" alt="Github">
                </a>
            </div>  
        </div>
        <div id="projects" style="background-color: #38dc2c;">          
            <div id = "name">
                <h2>CoderBot</h2>
            </div>
            <div id = "desct">
                <p>A Telegram Bot for Beginners to learn Programming</p>
            </div>
            <div id = "link">
                <span class="code-text">Source Code</span>
                <a href="https://github.com/Bhupesh-V/CoderBot">
                    <i class="svg-icon github"></i>
                </a>
            </div>
            <div id = "link2">
                <span class="tooltiptext">Live Demo</span>
                <a href="https://telegram.me/bhupesh_bot">
                    <img src="https://raw.githubusercontent.com/Bhupesh-V/Bhupesh-V.github.io/master/images/view.png" alt="Github">
                </a>
            </div>  
        </div>
        <div id="projects" style="background-color: orange;">           
            <div id = "name">
                <h2>Algorithms</h2>
            </div>
            <div id = "desct">
                <p>A Telegram Bot for Beginners to learn Programming</p>
            </div>
            <div id = "link">
                <span class="code-text">Source Code</span>
                <a href="https://github.com/Bhupesh-V/Algorithms">
                    <i class="svg-icon github"></i>
                </a>
            </div>
            <div id = "link2">
                <span class="tooltiptext">Live Demo</span>
                <a href="https://github.com/Bhupesh-V/Algorithms">
                    <img src="https://raw.githubusercontent.com/Bhupesh-V/Bhupesh-V.github.io/master/images/view.png" alt="Github">
                </a>
            </div>  
        </div>
    </div>