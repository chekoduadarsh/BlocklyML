![](https://github.com/chekoduadarsh/BlocklyML/blob/main/media/blocklyML_Banner.png)
# BlocklyML
![](https://img.shields.io/github/license/chekoduadarsh/BlocklyML)
![](https://img.shields.io/github/issues/chekoduadarsh/BlocklyML)
![](https://img.shields.io/github/last-commit/chekoduadarsh/BlocklyML)


https://blocklyml.herokuapp.com/

### What is BlocklyML?
BlocklyML is a **No Code** training ground for python and ML. This tool is designed to simplify standard machine learning implementation.
This tool can assist anyone who wants to start with ML or python. This is a forked project from [Blockly](https://github.com/google/blockly) and adapted for machine learning and Data analytics use-cases. :brain:

For a sample run go to sampleLayouts folder upload and try it out :smiley:

In the Example given below we will train a random forest for Iris Dataset

Read the ![UserGuide.md]() for further info

<img src="https://github.com/chekoduadarsh/BlocklyML/blob/main/media/IrisRandomForest.png" alt="drawing" width="500"/>

# Table of contents

* ![Project Title](https://github.com/chekoduadarsh/BlocklyML/blob/main/README.md#blocklyml)
* ![Installlation](https://github.com/chekoduadarsh/BlocklyML/blob/main/README.md#installing-as-blocklyml-app)
* ![UI Features](https://github.com/chekoduadarsh/BlocklyML/blob/main/README.md#ui-features)
   * ![Shortcuts](https://github.com/chekoduadarsh/BlocklyML/blob/main/README.md#shortcuts)
   * ![Dataframe Viewer](https://github.com/chekoduadarsh/BlocklyML/blob/main/README.md#dataframe-viewer)
   * ![Download Code](https://github.com/chekoduadarsh/BlocklyML/blob/main/README.md#download-code)
* ![Contribute](https://github.com/chekoduadarsh/BlocklyML/blob/main/README.md#contribute)
* ![License](https://github.com/chekoduadarsh/BlocklyML/blob/main/README.md#license)
# Installing as BlocklyML App
First clone this repo

```
git clone https://github.com/chekoduadarsh/BlocklyML
```
After cloning the repo you can either follow the Docker Method or Flask Method

### Docker Method
BlocklyML can run on Docker with the following command :cd:

```
docker run blocklyml-docker
```
### Flask Method

Install the requirements from requirements.txt with the following command

```
pip install -r requirements.txt 
```

then you can run the application by
```
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

## TBD

 - [x] Classification Algorithms
 - [x] Regression Algorithms
 - [x] Appropriate Color Coding
 - [x] Support for Pycaret
 - [ ] Support for Deep Learning (ANN)
 - [ ] Support for Image Dataset
 - [ ] Support for CNN
 - [ ] Support for Running Code in Heroku
 
# License
![Apache License, Version 2.0](https://www.apache.org/licenses/LICENSE-2.0)

[!["Buy Me A Coffee"](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://www.buymeacoffee.com/chekoduadarsh)
