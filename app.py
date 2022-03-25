
from flask import Flask, render_template, request, redirect, url_for, abort
from libs.DataFrameGenerator import DataFrameGenerator, DataFramevisualizer
from libs.DataFrameGenerator import DataFrameReportGenerator

import dash_bootstrap_components as dbc
import dash
from dash import html


app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH'] = 1024 * 1024
app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
app.config['DEBUG'] = True



dash_app = dash.Dash(
    routes_pathname_prefix='/visualizer/',
    server=app,
    external_scripts=[
        'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.52.2/codemirror.min.js',
        'custom-script.js'
    ],
    external_stylesheets=[
        'https://fonts.googleapis.com/css?family=Lato',
        'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css',
        'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.52.2/theme/monokai.min.css',
        'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.52.2/codemirror.min.css',
        'styles.css',
        dbc.themes.BOOTSTRAP
    ],
    name='CSV Visualizer',
    title='CSV Visualizer'
)


dash_app.config.suppress_callback_exceptions = True

dash_app.validation_layout = html.Div()

dash_app.layout = html.Div()

@app.route('/DataViewer', methods=['POST','GET'])
def DFreturn():
    listDF = DataFrameGenerator(request.form)
    return str(listDF)




@app.route('/DataReport', methods=['POST','GET'])
def DFRreturn():
    global dash_app
    listDF, dash_app = DataFramevisualizer(request.form, dash_app)
    return str(listDF)


@app.route('/DataVisualizer', methods=['POST','GET'])
def DFRreturn():
    global dash_app
    listDF, dash_app = DataFramevisualizer(request.form, dash_app)
    return str(listDF)



@app.route('/')
def root():
    """Video streaming home page."""
    return render_template('index.html')


@app.route('/', methods=['POST','GET'])
def my_form_post():
    return render_template('index.html')




if __name__ == '__main__':
    app.run(host='0.0.0.0')

