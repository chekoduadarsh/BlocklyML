# BlocklyML

https://blocklyml.herokuapp.com/

Blockly is a simple visual programming language for python and ML. This tool is designed to simplify standard machine learning implementation. This tool can assist anyone who wants to start with ML or python. This is a forked project from [Blockly](https://github.com/google/blockly) and adapted for machine learning and Data analytics use-cases. :brain:

For a sample run go to sampleLayouts folder upload and try it out :smiley:

In the Example given below we will train a random forest for Iris Dataset

<img src="https://github.com/chekoduadarsh/BlocklyML/blob/main/media/IrisRandomForest.png" alt="drawing" width="500"/>

## Installing as BlocklyML App
BlocklyML can run on Docker with the following command :cd:

```
docker run blocklyml-docker
```
Or you can download the complete repo and install the requirements from requirements.txt with the following command

```
pip install -r requirements.txt 
```

then you can run the application by
```
python app.py
```

Simple as that :man_shrugging:

## Shortcuts
You can find these buttons in the top right corner of the application. Their functionality as follows

1. Download xml Layout
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


### This repo welcomes any kind of contributions :pray:

## TBD

 - [x] Classification Algorithms
 - [ ] Regression Algorithms
 - [ ] Appropriate Color Coding
 - [ ] Support for Deep Learning (ANN)
 - [ ] Support for Image Dataset
 - [ ] Support for CNN
 - [ ] Support for Running Code in Heroku
 
