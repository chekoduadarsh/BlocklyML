# Blockly User Guide

## What is BlocklyML?
BlocklyML is a **No Code** training ground for python and ML. This tool is designed to simplify standard machine learning implementation.
This tool can assist anyone who wants to start with ML or python. This is a forked project from [Blockly](https://github.com/google/blockly) and adapted for machine learning and Data analytics use-cases:brain:. 

Currently BlocklyML is moving from Alpha -> Beta. Please try the tool and raise ![issue](https://github.com/chekoduadarsh/BlocklyML/issues)

## How to use BlocklyML?

Want to Use BlocklyML? Its very simple.

### Using Webtool

goto : ![blocklyml.herokuapp.com](blocklyml.herokuapp.com)

### Using Locally

pre-requisits

```bash
    python3
    docker
    pip
```

It is recommended to use conda/pip virtual environment before installing

1. **Clone this repo**

```bash
git clone https://github.com/chekoduadarsh/BlocklyML
```

After cloning the repo you can either follow the Docker Method or Flask Method

2. **Install**

    1. **Docker Method**

    BlocklyML can run on Docker with the following command :cd:

    ```bash
    docker run blocklyml-docker
    ```

    2. **Flask Method**

    Install the requirements from requirements.txt with the following command

    ```bash
    pip install -r requirements.txt 
    ```

    then you can run the application by

    ```bash
    python app.py
    ```

Simple as that :man_shrugging:

## How to download layouts? 

## How to upload layouts?