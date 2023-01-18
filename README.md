<p align="center">
  <a href="https://blocklyml.herokuapp.com/">
<img src="https://raw.githubusercontent.com/chekoduadarsh/BlocklyML/main/media/blocklyML_Banner.png" height="80" />
    </a>
    </p>
<p align="center">
<a href="https://blocklyml.herokuapp.com/ ">Blockly ML</a>
</p>
<p align="center">
<img src="https://img.shields.io/github/license/chekoduadarsh/BlocklyML">
<img src="https://img.shields.io/github/issues/chekoduadarsh/BlocklyML">
<img src="https://img.shields.io/github/last-commit/chekoduadarsh/BlocklyML">
 <img src="https://github.com/chekoduadarsh/BlocklyML/actions/workflows/codeql.yml/badge.svg">
   </p>

BlocklyML is a visual programming tool that allows users to create machine learning models by dragging and dropping blocks. It is based on Google's Blockly library and is designed to make machine learning more accessible to non-technical users. BlocklyML provides a set of blocks for common machine learning tasks such as data preprocessing, model selection, and evaluation.  With BlocklyML, users can quickly build and train machine learning models without needing to write code. This can be useful for tasks such as prototyping, data exploration, and education. BlocklyML is an open source project and can be easily integrated into other applications. It can be used in the browser, or embedded in a mobile or desktop application. It can be a great tool for teachers, students, and novices who want to experiment with machine learning without needing to know how to code



For a sample run go to sampleLayouts folder upload and try it out :smiley:


Read the ![UserGuide.md](https://github.com/chekoduadarsh/BlocklyML/blob/main/UserGuide.md) for further info


In the Example given below we will train a random forest for Iris Dataset


https://user-images.githubusercontent.com/26855534/174473003-488f675f-50a0-48f1-9ef0-81987bd21166.mp4

# Table of contents

- [Table of contents](#table-of-contents)
- [Installing as BlocklyML App](#installing-as-blocklyml-app)
    - [Flask Method](#flask-method)
- [UI Features](#ui-features)
  - [Shortcuts](#shortcuts)
  - [Dataframe Viewer](#dataframe-viewer)
  - [Download Code](#download-code)
- [Contribute](#contribute)
    - [This repo welcomes any kind of contributions :pray:](#this-repo-welcomes-any-kind-of-contributions-pray)
- [License](#license)
- [Thanks to](#thanks-to)
# Installing as BlocklyML App
First clone this repo

```shell
git clone https://github.com/chekoduadarsh/BlocklyML
```
After cloning the repo you can either follow the Flask Method


### Flask Method

Install the requirements from `requirements.txt` with the following command

```shell
pip install -r requirements.txt 
```

then you can run the application by
```shell
python app.py
```

Simple as that :man_shrugging:

# UI Features

## Shortcuts
You can find these buttons in the top right corner of the application. Their functionality as follows

1. Download XML Layout
2. Upload XML layout
3. Copy Code
4. Launch Google Colab
5. Delete
6. Run (Not Supported Yet!!)

<img src="https://github.com/chekoduadarsh/BlocklyML/blob/main/media/butttons.png" alt="drawing" width="500"/>

## Dataframe Viewer
Blockly support complete html view of the DataFrame. This can be accessed by view option in the navigation bar

<img src="https://github.com/chekoduadarsh/BlocklyML/blob/main/media/DatasetView.png" alt="drawing" width="500"/>


## Download Code
Blockly support both .py and .ipynb formats. You can download the code from the download option in the navigation bar

<img src="https://github.com/chekoduadarsh/BlocklyML/blob/main/media/DownloadView.png" alt="drawing" width="200"/>

# Contribute

If you find any error or need support please raise a issue. If you think you can add a feature, or help solve a bug please raise a PR

### This repo welcomes any kind of contributions :pray: 

Feel free to adapt it criticize it and support it the way you like!!

Read : [CONTRIBUTING.md](./CONTRIBUTING.md)


# License
[Apache License, Version 2.0](https://www.apache.org/licenses/LICENSE-2.0)


# Thanks to
[![Stargazers repo roster for @chekoduadarsh/BlocklyML](https://reporoster.com/stars/chekoduadarsh/BlocklyML)](https://github.com/chekoduadarsh/BlocklyML/stargazers)
[![Forkers repo roster for @chekoduadarsh/BlocklyML](https://reporoster.com/forks/chekoduadarsh/BlocklyML)](https://github.com/chekoduadarsh/BlocklyML/network/members)


[!["Buy Me A Coffee"](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://www.buymeacoffee.com/chekoduadarsh)
